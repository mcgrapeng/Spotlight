"""Tests for the auth routes (Teleport tsh)."""
from __future__ import annotations

import pytest

from app.interface.api.v1.routes.auth import status as auth_status
from app.infrastructure.config.settings import get_settings


@pytest.fixture(autouse=True)
def _reset_settings_cache():
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


def test_status_unconfigured(monkeypatch):
    # No env vars set — TELEPORT_* defaults are empty.
    for var in ("TELEPORT_PROXY", "TELEPORT_USER", "TELEPORT_CLUSTER"):
        monkeypatch.delenv(var, raising=False)
    get_settings.cache_clear()
    out = auth_status()
    assert out.configured is False
    assert out.proxy == ""
    assert out.user == ""


def test_status_configured(monkeypatch):
    monkeypatch.setenv("TELEPORT_PROXY", "proxy.example:443")
    monkeypatch.setenv("TELEPORT_USER", "alice")
    monkeypatch.setenv("TELEPORT_CLUSTER", "pvg1")
    get_settings.cache_clear()
    out = auth_status()
    assert out.configured is True
    assert out.proxy == "proxy.example:443"
    assert out.user == "alice"
    assert out.cluster == "pvg1"


def test_login_route_unconfigured_returns_503(monkeypatch):
    for var in ("TELEPORT_PROXY", "TELEPORT_USER"):
        monkeypatch.delenv(var, raising=False)
    get_settings.cache_clear()

    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    r = client.post("/api/v1/auth/login", json={"password": "hunter2"})
    assert r.status_code == 503
    assert "not configured" in r.json()["detail"].lower()