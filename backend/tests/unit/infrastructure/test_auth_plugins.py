"""AuthPlugin 契约与注册表。"""
from __future__ import annotations

import pytest

from app.infrastructure.auth.plugins import active_plugin, create_plugin
from app.infrastructure.auth.plugins.base import AuthError, FormField, Identity


def test_create_plugin_by_id():
    p = create_plugin("token")
    assert p.id == "token"
    assert isinstance(p.form_fields()[0], FormField)


def test_create_plugin_unknown_id_raises():
    with pytest.raises(ValueError):
        create_plugin("nope")


def test_active_plugin_follows_settings(monkeypatch):
    from app.infrastructure.config.settings import get_settings
    monkeypatch.setenv("AUTH_PROVIDER", "token")
    monkeypatch.setenv("API_TOKEN", "s3cret")
    get_settings.cache_clear()
    try:
        assert active_plugin() is not None
        assert active_plugin().id == "token"
    finally:
        get_settings.cache_clear()


def test_active_plugin_none_in_open_mode():
    assert active_plugin() is None


def test_auth_error_fields():
    e = AuthError("mfa_required", "需要一次性码")
    assert e.code == "mfa_required" and e.message == "需要一次性码"
    assert isinstance(e, Exception)
    assert Identity(username="alice").extra == {}
