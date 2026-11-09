"""The model calls have to be rate limited.

Every `/ai/analyze`, `/ai/ask` and `/ai/ask/stream` sends cluster content to
an external model and costs the operator money. The login route has had a
limiter for ages; the model routes had none, so one script could call them
in a loop and spend the key.
"""
from __future__ import annotations

import time

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.interface.api.v1.dependencies import ai_repo
from app.interface.api.v1.routes import ai as ai_routes
from app.main import app


class _NoProviderRepo:
    """Every provider lookup misses — the limiter runs before the handler,
    so the calls still count."""

    async def list_providers(self):
        return []

    async def get_provider(self, pid):
        return None

    async def add_provider(self, cfg):
        return cfg

    async def update_provider(self, cfg):
        raise LookupError(f"ai provider {cfg.id} not found")

    async def remove_provider(self, pid):
        return False

    async def set_default(self, pid):
        raise LookupError(f"ai provider {pid} not found")

    async def analyze(self, cfg, req):
        raise NotImplementedError

    async def stream_analyze(self, cfg, req):
        raise NotImplementedError
        yield  # pragma: no cover


@pytest.fixture
def client():
    app.dependency_overrides[ai_repo] = lambda: _NoProviderRepo()
    yield TestClient(app)
    app.dependency_overrides.clear()


BODY = {"provider_id": 1, "log_lines": ["boom"]}


def test_the_model_calls_stop_after_the_limit(client):
    for _ in range(ai_routes._AI_MAX_PER_MINUTE):
        r = client.post("/api/v1/ai/analyze/default/p1", json=BODY)
        assert r.status_code != 429, r.text

    r = client.post("/api/v1/ai/analyze/default/p1", json=BODY)
    assert r.status_code == 429, r.text


def test_the_limit_does_not_touch_the_other_routes(client):
    for _ in range(ai_routes._AI_MAX_PER_MINUTE):
        client.post("/api/v1/ai/analyze/default/p1", json=BODY)

    r = client.get("/api/v1/ai/providers")
    assert r.status_code == 200, r.text


def test_the_budget_is_keyed_on_the_session_not_the_username():
    """The username is chosen by whoever logs in — the shared-token plugin
    accepts any name — so a budget keyed on it can be minted afresh by
    logging in again. The session token is the server's own.
    """
    ai_routes._ai_calls.clear()
    for _ in range(ai_routes._AI_MAX_PER_MINUTE):
        assert ai_routes._ai_rate_limited("session-a") is False
    assert ai_routes._ai_rate_limited("session-a") is True
    # A different session has its own budget.
    assert ai_routes._ai_rate_limited("session-b") is False


def test_two_sessions_of_the_same_user_get_their_own_budget(tmp_path, monkeypatch):
    """The name is the same; the session is not.

    Keyed on the username, one user's second login resets their budget —
    and in the token plugin any name at all can be typed.
    """
    from starlette.requests import Request

    from app.infrastructure.auth import session as session_store
    from app.infrastructure.auth.plugins.base import Identity

    monkeypatch.setattr(session_store, "SESSIONS_ROOT", tmp_path / "sessions")
    session_store._sessions.clear()
    ai_routes._ai_calls.clear()
    a = session_store.create_session("token", Identity(username="alice"), 60)
    b = session_store.create_session("token", Identity(username="alice"), 60)

    def request_for(token: str) -> Request:
        return Request({
            "type": "http", "method": "POST", "path": "/api/v1/ai/ask",
            "query_string": b"",
            "headers": [(b"cookie",
                         f"{session_store.COOKIE_NAME}={token}".encode())],
            "scheme": "http", "server": ("127.0.0.1", 80),
            "client": ("127.0.0.1", 1),
        })

    for _ in range(ai_routes._AI_MAX_PER_MINUTE):
        ai_routes._limit_model_calls(request_for(a.token))
    with pytest.raises(HTTPException) as e:
        ai_routes._limit_model_calls(request_for(a.token))
    assert e.value.status_code == 429

    # The second session of the SAME user still has its own budget.
    ai_routes._limit_model_calls(request_for(b.token))
    session_store._sessions.clear()


def test_an_idle_bucket_is_dropped():
    """Otherwise every session that ever called the model leaves an entry
    behind for the life of the process."""
    ai_routes._ai_calls.clear()
    ai_routes._ai_calls["session-x"] = [time.monotonic() - 3600]

    ai_routes._ai_rate_limited("session-x")

    kept = ai_routes._ai_calls["session-x"]
    assert len(kept) == 1
    assert kept[0] > time.monotonic() - 60
