"""Shared test fixtures.

The app's Settings read `backend/.env` (env_file). Real deployment values
there leak into tests that assert "unconfigured" behaviour — and one of
them even spawned a real `tsh login` against the production proxy. Force
the auth-related settings to empty for every test; individual tests may
re-set env vars as needed (monkeypatch.setenv wins over env_file).
"""
from __future__ import annotations

import pytest

from app.infrastructure.config.settings import get_settings

_ENV_LEAK_VARS = (
    "TELEPORT_PROXY",
    "TELEPORT_USER",
    "TELEPORT_CLUSTER",
    "TELEPORT_AUTH",
    "TELEPORT_AUTOLOGIN_PASSWORD",
    "API_TOKEN",
)


@pytest.fixture(autouse=True)
def _isolate_env(monkeypatch):
    for var in _ENV_LEAK_VARS:
        monkeypatch.setenv(var, "")
    monkeypatch.delenv("TELEPORT_AUTOLOGIN_PASSWORD", raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()
