"""Tests for the plugin-backed auth routes (T7).

Covers the dynamic-form login flow, /auth/cluster selection, status shape,
error code mapping (invalid_credentials / mfa_required / bad_otp /
unavailable), rate limiting, and `require_auth` policy.
"""
from __future__ import annotations

from pathlib import Path
from typing import Mapping

import pytest
from starlette.requests import Request

from app.infrastructure.auth.plugins import REGISTRY
from app.infrastructure.auth.plugins.base import AuthError, FormField, Identity, Kubeconfig
from app.infrastructure.config.settings import get_settings


# ── helpers ───────────────────────────────────────────────────────────────
def _fake_request(
    headers: list[tuple[bytes, bytes]] | None = None,
    cookies: dict[str, str] | None = None,
) -> Request:
    raw = list(headers or [])
    if cookies:
        raw.append((b"cookie", "; ".join(f"{k}={v}" for k, v in cookies.items()).encode()))
    scope = {
        "type": "http", "method": "GET", "path": "/api/v1/auth/status",
        "query_string": b"", "headers": raw, "scheme": "http",
        "server": ("127.0.0.1", 80), "client": ("127.0.0.1", 1),
    }
    return Request(scope)


class FakeTokenPlugin:
    """Minimal plugin the test suite can drive without `tsh` or real auth."""

    id = "token"
    label = "访问令牌"

    def __init__(self, fields: list[FormField] | None = None, *, raise_on_login: Exception | None = None, raise_on_acquire: Exception | None = None) -> None:
        self._fields = fields or [FormField(name="token", label="访问令牌", type="password")]
        self._raise = raise_on_login
        self._raise_on_acquire = raise_on_acquire
        self.acquired: list[str] = []

    def form_fields(self) -> list[FormField]:
        return self._fields

    async def login(self, username: str, fields: Mapping[str, str], session_dir: Path) -> Identity:
        if self._raise is not None:
            raise self._raise
        return Identity(username=username)

    async def list_clusters(self, identity: Identity, session_dir: Path) -> list[str]:
        return ["ctx-a", "ctx-b"]

    async def acquire(self, identity: Identity, cluster: str, session_dir: Path) -> Kubeconfig:
        self.acquired.append(cluster)
        if self._raise_on_acquire is not None:
            raise self._raise_on_acquire
        # The kubeconfig's context name is NOT the cluster name — with
        # Teleport it is "<proxy>-<cluster>". Returning a different name here
        # is what lets the test prove the route reports the kubeconfig's
        # context and not the name the client asked for.
        return Kubeconfig(
            yaml=f"fake:{cluster}\n".encode(), context=f"{cluster}-kubeconfig-context"
        )

    async def logout(self, identity: Identity, session_dir: Path) -> None:
        return None


@pytest.fixture
def fake_plugin(monkeypatch):
    """Install a FakeTokenPlugin as the active plugin for this test.

    We monkeypatch the `active_plugin` symbol where the routes import it,
    not REGISTRY (REGISTRY only holds classes; `create_plugin()` would
    instantiate them fresh each call, dropping any per-instance test
    state like `raise_on_login`).
    """
    plugin = FakeTokenPlugin()
    monkeypatch.setattr(
        "app.interface.api.v1.routes.auth.active_plugin",
        lambda: plugin,
    )
    yield plugin


@pytest.fixture
def fake_plugin_failing_acquire(monkeypatch):
    """A plugin that authenticates but cannot reach the cluster."""
    plugin = FakeTokenPlugin(
        raise_on_acquire=AuthError("unavailable", "not authorized to access cluster"),
    )
    monkeypatch.setattr(
        "app.interface.api.v1.routes.auth.active_plugin",
        lambda: plugin,
    )
    yield plugin


# ── /auth/status shape ─────────────────────────────────────────────────────
def test_status_shape(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    out = _status_via_dependency()
    assert out["configured"] is True
    assert out["provider"]["id"] == "token"
    field_names = [f["name"] for f in out["provider"]["fields"]]
    assert "token" in field_names
    assert out["auth_required"] is True
    assert out["client_session"] is False
    assert out["session"] is None


def test_status_no_provider(monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "")
    monkeypatch.setenv("API_TOKEN", "")
    get_settings.cache_clear()
    out = _status_via_dependency()
    assert out["configured"] is False
    assert out["provider"] is None
    assert out["auth_required"] is False


def test_status_reports_the_open_mode_permissions(monkeypatch):
    """开放模式下，这个列表必须说门禁实际会放行的事。

    没有鉴权插件时，权限门禁把每个请求都当成共享的 `dev` 身份
    （admin）。这里若返回空列表，前端就会以为「什么权限都没有」——
    而任何开始信任这个列表的界面，都会在这个产品最主打的自托管
    无鉴权部署上把功能藏起来。
    """
    monkeypatch.setenv("AUTH_PROVIDER", "")
    monkeypatch.setenv("API_TOKEN", "")
    get_settings.cache_clear()
    out = _status_via_dependency()
    assert out["configured"] is False
    assert out["auth_required"] is False
    # 门禁放行一切，列表也得说放行一切。
    assert "pods.read" in out["permissions"]
    assert "ai.use" in out["permissions"]


def test_status_client_session_bearer(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.get("/api/v1/auth/status", headers={"authorization": "Bearer s3cret"})
    assert r.status_code == 200
    assert r.json()["client_session"] is True


def _status_via_dependency() -> dict:
    """Call /auth/status through FastAPI (not the raw handler) so deps resolve."""
    from fastapi.testclient import TestClient
    from app.main import app
    return TestClient(app).get("/api/v1/auth/status").json()


# ── Happy path: status → login → cookie → /auth/cluster → logout ─────────
def test_login_and_cluster_flow(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)

    # pre-login: status shows provider, no client_session
    s0 = client.get("/api/v1/auth/status").json()
    assert s0["provider"]["id"] == "token"
    assert s0["client_session"] is False

    # login
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "any"}},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["ok"] is True
    assert "ctx-a" in body["kube_clusters"]
    assert "spotlight_session" in client.cookies

    # post-login status shows session
    s1 = client.get("/api/v1/auth/status").json()
    assert s1["client_session"] is True
    assert s1["session"] == {"username": "alice"}

    # /auth/cluster without cookie → 401 (we wipe cookies on a fresh client)
    bare = TestClient(app)
    r = bare.post("/api/v1/auth/cluster", json={"cluster": "ctx-a"})
    assert r.status_code == 401

    # /auth/cluster with cookie → 200, plugin.acquire called
    r = client.post("/api/v1/auth/cluster", json={"cluster": "ctx-a"})
    assert r.status_code == 200, r.text
    assert fake_plugin.acquired == ["ctx-a"]

    # The response carries BOTH names, and they mean different things:
    #   cluster — the Teleport Kubernetes cluster the user picked
    #   context — the context name in the session kubeconfig, which is what
    #             the API's ?context= expects
    # The UI once used `cluster` for the request parameter and every call
    # answered 409, so the contract is pinned here.
    body = r.json()
    assert body["ok"] is True
    assert body["cluster"] == "ctx-a"
    assert body["context"] == "ctx-a-kubeconfig-context"

    # /auth/kube-clusters reuses list_clusters
    r = client.get("/api/v1/auth/kube-clusters")
    assert r.status_code == 200
    assert r.json() == ["ctx-a", "ctx-b"]

    # logout clears session + cookie
    r = client.post("/api/v1/auth/logout")
    assert r.status_code == 200
    assert r.json() == {"ok": True}

    # post-logout status has no session
    s2 = client.get("/api/v1/auth/status").json()
    assert s2["client_session"] is False
    assert s2["session"] is None


# ── AuthError mapping ─────────────────────────────────────────────────────
def test_auth_error_mfa_required(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    fake_plugin._raise = AuthError("mfa_required", "需要 MFA")

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "x"}},
    )
    assert r.status_code == 401
    body = r.json()["detail"]
    assert body["code"] == "mfa_required"
    assert "MFA" in body["message"]


def test_auth_error_invalid_credentials(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    fake_plugin._raise = AuthError("invalid_credentials", "用户名或密码错误")

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "wrong"}},
    )
    assert r.status_code == 401
    body = r.json()["detail"]
    assert body["code"] == "invalid_credentials"
    assert body["message"] == "用户名或密码错误"


def test_auth_error_bad_otp(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    fake_plugin._raise = AuthError("bad_otp", "一次性码错误")

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "x"}},
    )
    assert r.status_code == 401
    assert r.json()["detail"]["code"] == "bad_otp"


def test_auth_error_unavailable(fake_plugin, monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    fake_plugin._raise = AuthError("unavailable", "服务端不可用")

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "x"}},
    )
    assert r.status_code == 503


def test_login_no_provider_returns_503(monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "")
    monkeypatch.setenv("API_TOKEN", "")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    r = client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {}},
    )
    assert r.status_code == 503


def test_cluster_name_whitelist(fake_plugin, monkeypatch):
    """Bad cluster names are rejected at the DTO layer."""
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    # log in first to get a session cookie
    client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "x"}},
    )
    r = client.post("/api/v1/auth/cluster", json={"cluster": "evil; rm -rf /"})
    assert r.status_code == 422


# ── Rate limit (preserved 10/5min/IP) ─────────────────────────────────────
def test_login_rate_limited(fake_plugin, monkeypatch):
    from app.interface.api.v1.routes import auth as auth_routes
    auth_routes._attempts.clear()
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()
    fake_plugin._raise = AuthError("invalid_credentials", "用户名或密码错误")

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    codes = [
        client.post(
            "/api/v1/auth/login",
            json={"username": "alice", "fields": {"token": "wrong"}},
        ).status_code
        for _ in range(11)
    ]
    assert 429 in codes
    auth_routes._attempts.clear()


# ── require_auth ──────────────────────────────────────────────────────────
from fastapi import HTTPException  # noqa: E402

from app.infrastructure.auth import session as session_store  # noqa: E402
from app.interface.api.v1.dependencies import require_auth  # noqa: E402


def test_require_auth_dev_open(monkeypatch):
    monkeypatch.setenv("AUTH_PROVIDER", "")
    monkeypatch.setenv("API_TOKEN", "")
    get_settings.cache_clear()
    require_auth(_fake_request())  # no provider + no token → pass


def test_require_auth_rejects_when_token_configured(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    monkeypatch.setenv("AUTH_PROVIDER", "")
    get_settings.cache_clear()
    with pytest.raises(HTTPException) as ei:
        require_auth(_fake_request())
    assert ei.value.status_code == 401


def test_require_auth_accepts_bearer(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    require_auth(_fake_request([(b"authorization", b"Bearer s3cret")]))


def test_require_auth_accepts_session_cookie(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    s = session_store.create_session("token", Identity(username="alice"), 60)
    require_auth(_fake_request(cookies={"spotlight_session": s.token}))


def test_require_auth_rejects_garbage_session(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    with pytest.raises(HTTPException):
        require_auth(_fake_request(cookies={"spotlight_session": "nope"}))


# ── /api/v1/clusters (a real protected route) ─────────────────────────────
def test_protected_route_401_without_session(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    monkeypatch.setenv("AUTH_PROVIDER", "")
    get_settings.cache_clear()
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    assert client.get("/api/v1/clusters").status_code == 401


# ── A session with no cluster of its own ──────────────────────────────────
def test_session_without_a_cluster_does_not_read_the_host_kubeconfig(
    fake_plugin, monkeypatch, tmp_path,
):
    """The host kubeconfig is the OPERATOR's cluster.

    A session that has logged in but not yet picked a cluster has no
    kubeconfig of its own. Falling back to the host's would hand that user
    the operator's clusters — the exact failure the four-names contract in
    docs/design/teleport-names.md exists to prevent.
    """
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()

    # A synthetic "host" kubeconfig, so the assertion does not depend on
    # whatever kubeconfig the machine running the tests happens to carry.
    host = tmp_path / "host-kubeconfig.yaml"
    host.write_text(
        "apiVersion: v1\nkind: Config\ncurrent-context: operator-cluster\n"
        "clusters:\n- name: operator-cluster\n  cluster:\n"
        "    server: https://operator.example\n"
        "contexts:\n- name: operator-cluster\n"
        "  context: {cluster: operator-cluster, user: operator-cluster}\n"
        "users:\n- name: operator-cluster\n  user: {token: operator-token}\n"
    )
    monkeypatch.setenv("KUBECONFIG", str(host))

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "any"}},
    )

    r = client.get("/api/v1/clusters")
    assert r.status_code == 409, r.text
    assert "operator-cluster" not in r.text


def test_failed_cluster_acquisition_revokes_the_session(
    fake_plugin_failing_acquire, monkeypatch,
):
    """A session that could not reach a cluster must not stay alive for 12
    hours looking logged in — it has no kubeconfig, so every data route
    would fail on it anyway."""
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
    client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "any"}},
    )

    r = client.post("/api/v1/auth/cluster", json={"cluster": "ctx-a"})
    assert r.status_code in (401, 403, 503), r.text

    # The session is gone: the cookie no longer authenticates anything.
    r = client.get("/api/v1/clusters")
    assert r.status_code == 401, r.text


def test_a_failed_cluster_selection_does_not_tear_down_the_shared_dev_session(
    fake_plugin_failing_acquire, monkeypatch,
):
    """The dev session backs every Bearer/open-mode caller.

    Revoking it because ONE of them picked a cluster that failed would log
    all of them out at once — and would close the shared ApiClient out from
    under their in-flight requests.
    """
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.infrastructure.auth import session as session_store
    from app.main import app
    client = TestClient(app)
    # A cookie session, so the route's cookie guard lets the request in …
    client.post(
        "/api/v1/auth/login",
        json={"username": "alice", "fields": {"token": "any"}},
    )
    # … and the Bearer header, which is what makes the route resolve the
    # SHARED dev session instead of the cookie's own.
    dev = session_store.dev_session()

    r = client.post(
        "/api/v1/auth/cluster",
        json={"cluster": "ctx-a"},
        headers={"authorization": "Bearer s3cret"},
    )
    assert r.status_code in (401, 403, 503), r.text

    # The same object: not revoked, not recreated.
    assert session_store.dev_session() is dev


def test_a_cookie_naming_the_dev_session_does_not_authenticate(
    fake_plugin, monkeypatch,
):
    """`spotlight_session=dev` must not be a way in.

    The dev session has no kubeconfig of its own, so the K8s adapter falls
    back to the HOST kubeconfig for it — a cookie naming it would hand the
    host's cluster to anyone who typed the name.
    """
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.infrastructure.auth import session as session_store
    from app.main import app
    client = TestClient(app)

    # The shared session exists (some Bearer caller made it).
    session_store.dev_session()
    client.cookies.set(session_store.COOKIE_NAME, session_store.DEV_TOKEN)

    r = client.get("/api/v1/clusters")
    assert r.status_code == 401, r.text
