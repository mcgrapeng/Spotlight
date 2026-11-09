"""The model calls have to be rate limited.

Every `/ai/analyze`, `/ai/ask` and `/ai/ask/stream` sends cluster content to
an external model and costs the operator money. The login route has had a
limiter for ages; the model routes had none, so one script could call them
in a loop and spend the key.
"""
from __future__ import annotations

import pytest
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
