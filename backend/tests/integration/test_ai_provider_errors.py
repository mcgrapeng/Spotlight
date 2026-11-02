"""Regression tests for the AI provider routes' error mapping.

Found by API fuzzing (schemathesis): the domain's validation ValueError and
the repository's LookupError used to escape the handlers and surface as 500s.
Bad input must be a 400 and a missing provider a 404 — the same contract the
ask endpoints and delete_provider already honour.
"""
from __future__ import annotations

from dataclasses import replace

import pytest
from fastapi.testclient import TestClient

from app.infrastructure.auth.session import DEV_TOKEN
from app.infrastructure.cache.ttl_cache import invalidate_scope
from app.interface.api.v1.dependencies import ai_repo
from app.main import app


class _LookupErrorRepo:
    """Mirrors SQLAIProviderRepository's error contract without a DB."""

    async def list_providers(self):
        return []

    async def get_provider(self, pid):
        return None

    async def add_provider(self, cfg):
        return replace(cfg, id=1)

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


@pytest.fixture(autouse=True)
def _clear_caches():
    invalidate_scope(DEV_TOKEN)
    yield
    invalidate_scope(DEV_TOKEN)


@pytest.fixture
def client():
    app.dependency_overrides[ai_repo] = lambda: _LookupErrorRepo()
    yield TestClient(app)
    app.dependency_overrides.clear()


VALID = {"name": "OpenAI", "provider": "openai", "model": "gpt-4o-mini", "api_key": "k"}


def test_add_provider_without_api_key_is_a_400_not_a_500(client):
    r = client.post("/api/v1/ai/providers", json={**VALID, "api_key": ""})
    assert r.status_code == 400
    assert "api_key" in r.json()["detail"]


def test_add_provider_without_provider_name_is_a_400(client):
    r = client.post("/api/v1/ai/providers", json={**VALID, "provider": ""})
    assert r.status_code == 400


def test_update_of_a_missing_provider_is_a_404_not_a_500(client):
    r = client.put("/api/v1/ai/providers/999", json=VALID)
    assert r.status_code == 404


def test_set_default_of_a_missing_provider_is_a_404_not_a_500(client):
    r = client.post("/api/v1/ai/providers/999/default")
    assert r.status_code == 404


def test_an_int64_overflow_id_is_a_422_not_a_500(client):
    # Found by fuzzing: DELETE with 2**64 + 1 overflowed sqlite's INTEGER
    # and surfaced as a 500.
    r = client.delete("/api/v1/ai/providers/18446744073709551617")
    assert r.status_code == 422
