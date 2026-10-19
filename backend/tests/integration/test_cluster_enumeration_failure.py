"""「枚举失败」不等于「没有集群」。

旧行为：list_clusters 抛错 → 后端只 log warning → 返回 `kube_clusters: []`，
前端看到空数组直接放行 → 但会话 kubeconfig 从没写过 → k8s_repo 回落到服务端
宿主 kubeconfig。结果一个 Teleport 用户看到的是**服务端的管理员集群**，而他
以为自己看的是自己的，全程没有任何提示。

这里锁住两端：后端必须在响应里说出失败，前端必须因此停在登录页。
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.application.dto import LoginOut
from app.interface.api.v1.routes import auth as auth_route
from app.infrastructure.auth.plugins.base import AuthError, Identity


class _FailingClustersPlugin:
    """Logs in fine, then cannot enumerate clusters — the `tsh kube ls` hiccup."""

    id = "teleport"
    label = "Teleport"

    def form_fields(self):
        return []

    async def login(self, username, fields, session_dir):
        return Identity(username=username)

    async def list_clusters(self, identity, session_dir):
        raise AuthError("unavailable", "tsh kube ls 失败")

    async def acquire(self, identity, cluster, session_dir):
        raise AuthError("invalid_credentials", "nope")

    async def logout(self, identity, session_dir):
        return None


class _EmptyClustersPlugin(_FailingClustersPlugin):
    """Genuinely zero clusters — the legitimate empty list."""

    async def list_clusters(self, identity, session_dir):
        return []


class _TwoClustersPlugin(_FailingClustersPlugin):
    async def list_clusters(self, identity, session_dir):
        return ["prod-east", "staging-eu"]


def _client(monkeypatch, plugin, api_token: str = "tok") -> TestClient:
    from app.infrastructure.config import settings as settings_mod
    from app.main import create_app

    s = settings_mod.Settings(api_token=api_token)
    for mod in ("app.main", "app.interface.api.v1.dependencies",
                "app.interface.api.v1.routes.auth"):
        monkeypatch.setattr(f"{mod}.get_settings", lambda: s, raising=False)
    monkeypatch.setattr(auth_route, "active_plugin", lambda: plugin)
    auth_route._attempts.clear()
    return TestClient(create_app())


def _login(c: TestClient) -> dict:
    r = c.post("/api/v1/auth/login",
               json={"username": "alice", "fields": {"password": "pw"}},
               headers={"Authorization": "Bearer tok"})
    assert r.status_code == 200, r.text
    return r.json()


def test_enumeration_failure_is_reported_not_flattened_to_empty(monkeypatch):
    body = _login(_client(monkeypatch, _FailingClustersPlugin()))
    assert body["kube_clusters"] == []
    assert body["clusters_error"], "an empty list with no error reads as 'no clusters'"
    assert "kube ls" in body["clusters_error"]


def test_genuinely_zero_clusters_is_not_an_error(monkeypatch):
    """The distinction only exists if the empty-and-ok case stays clean."""
    body = _login(_client(monkeypatch, _EmptyClustersPlugin()))
    assert body["kube_clusters"] == []
    assert body["clusters_error"] is None


def test_successful_enumeration_reports_no_error(monkeypatch):
    body = _login(_client(monkeypatch, _TwoClustersPlugin()))
    assert body["kube_clusters"] == ["prod-east", "staging-eu"]
    assert body["clusters_error"] is None


def test_failed_enumeration_does_not_write_a_session_kubeconfig(monkeypatch):
    """This is the load-bearing side effect. If a kubeconfig existed anyway,
    `k8s_repo` would use it — but it must not, or the error would be cosmetic."""
    from app.infrastructure.auth import session as store

    store._sessions.clear()
    c = _client(monkeypatch, _FailingClustersPlugin())
    _login(c)
    live = list(store._sessions.values())
    assert live, "expected the session to survive login"
    for sess in live:
        if sess.provider_id == "dev":
            continue
        assert not sess.kubeconfig_path.exists(), (
            "a session kubeconfig was written despite enumeration failing — "
            "the UI error would be masking a real fallback"
        )
    store._sessions.clear()


def test_dto_defaults_to_no_error():
    assert LoginOut(ok=True).clusters_error is None


def test_retry_endpoint_propagates_the_failure_as_a_status(monkeypatch):
    """`/auth/kube-clusters` must raise a real HTTP error, unlike /auth/login
    which reports it in the body — a retry needs the hard signal."""
    c = _client(monkeypatch, _FailingClustersPlugin())
    _login(c)
    r = c.get("/api/v1/auth/kube-clusters")
    assert r.status_code >= 400, f"expected an error status, got {r.status_code}"
