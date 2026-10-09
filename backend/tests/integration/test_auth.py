"""Tests for the auth routes (Teleport tsh)."""
from __future__ import annotations

import pytest
from starlette.requests import Request

from app.infrastructure.config.settings import get_settings
from app.interface.api.v1.routes.auth import status as auth_status


def _fake_request(headers: list[tuple[bytes, bytes]] | None = None) -> Request:
    scope = {
        "type": "http",
        "method": "GET",
        "path": "/api/v1/auth/status",
        "query_string": b"",
        "headers": headers or [],
        "scheme": "http",
        "server": ("127.0.0.1", 80),
        "client": ("127.0.0.1", 1),
    }
    return Request(scope)


def test_status_unconfigured(monkeypatch):
    # conftest forces TELEPORT_* / API_TOKEN to empty — Settings' .env file
    # must not leak through.
    get_settings.cache_clear()
    out = auth_status(_fake_request())
    assert out.configured is False
    assert out.proxy == ""
    assert out.user == ""
    assert out.auth_required is False
    assert out.client_session is False


def test_status_configured(monkeypatch):
    monkeypatch.setenv("TELEPORT_PROXY", "proxy.example:443")
    monkeypatch.setenv("TELEPORT_USER", "alice")
    monkeypatch.setenv("TELEPORT_CLUSTER", "pvg1")
    get_settings.cache_clear()
    out = auth_status(_fake_request())
    assert out.configured is True
    assert out.proxy == "proxy.example:443"
    assert out.user == "alice"
    assert out.cluster == "pvg1"
    assert out.auth_required is True


def test_status_api_token_makes_auth_required(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    out = auth_status(_fake_request())
    assert out.configured is False
    assert out.auth_required is True
    # bearer token counts as a client session
    out2 = auth_status(_fake_request([(b"authorization", b"Bearer s3cret")]))
    assert out2.client_session is True


def test_login_route_unconfigured_returns_503(monkeypatch):
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    r = client.post("/api/v1/auth/login", json={"password": "hunter2"})
    assert r.status_code == 503
    assert "not configured" in r.json()["detail"].lower()


# ── require_auth ─────────────────────────────────────────────────────────
from fastapi import HTTPException  # noqa: E402

from app.infrastructure.auth import session as session_store  # noqa: E402
from app.interface.api.v1.dependencies import require_auth  # noqa: E402


def test_require_auth_dev_open(monkeypatch):
    get_settings.cache_clear()
    require_auth(_fake_request())  # no teleport, no token → must not raise


def test_require_auth_rejects_when_token_configured(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
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
    token = session_store.issue(60)
    require_auth(_fake_request([(b"cookie", f"spotlight_session={token}".encode())]))


def test_require_auth_rejects_garbage_session(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    with pytest.raises(HTTPException):
        require_auth(_fake_request([(b"cookie", b"spotlight_session=nope")]))


def test_token_login_issues_session(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    r = client.post("/api/v1/auth/login", json={"password": "s3cret"})
    assert r.status_code == 200, r.text
    assert r.json()["ok"] is True
    assert "spotlight_session" in client.cookies
    st = client.get("/api/v1/auth/status").json()
    assert st["client_session"] is True
    assert st["auth_required"] is True


def test_protected_route_401_without_session(monkeypatch):
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    assert client.get("/api/v1/clusters").status_code == 401


def test_login_rate_limited(monkeypatch):
    from app.interface.api.v1.routes import auth as auth_routes

    auth_routes._attempts.clear()
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    codes = [
        client.post("/api/v1/auth/login", json={"password": "wrong"}).status_code
        for _ in range(11)
    ]
    assert 429 in codes
    auth_routes._attempts.clear()
