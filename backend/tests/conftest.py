"""Shared test fixtures.

The app's Settings read `backend/.env` (env_file). Real deployment values
there leak into tests that assert "unconfigured" behaviour — and one of
them even spawned a real `tsh login` against the production proxy. Force
the auth-related settings to empty for every test; individual tests may
re-set env vars as needed (monkeypatch.setenv wins over env_file).

Also clears the in-memory session store between tests: T6 wires
`current_session()` into the dependency tree, so any HTTP integration test
that hits an auth-guarded route ends up registering the dev session in the
global `_sessions` dict. `test_auth_session` then sees leftover state and
its eviction assertions fail.
"""
from __future__ import annotations

import pytest

from app.infrastructure.auth import session as sess
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
    sess._sessions.clear()
    yield
    get_settings.cache_clear()
    sess._sessions.clear()
