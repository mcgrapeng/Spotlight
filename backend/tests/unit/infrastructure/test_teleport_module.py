"""Tests for Teleport tsh integration — module surface only.

We avoid actually shelling out to `tsh` in tests (CI might not have it
installed, and the network call would flake). Instead we cover the pure
guard conditions: presence of binary, missing configuration.
"""
from __future__ import annotations

import pytest

from app.infrastructure.auth.teleport import tsh_available
from app.infrastructure.config.settings import Settings


def test_settings_exposes_teleport_configured():
    s = Settings(
        teleport_proxy="proxy.example:443", teleport_user="alice",
        teleport_cluster="pvg1", teleport_insecure=False,
    )
    assert s.teleport_configured is True
    s2 = Settings()
    assert s2.teleport_configured is False


def test_tsh_available_uses_path():
    """tsh_available() must not raise even when `tsh` isn't installed."""
    # We just assert the function is callable; the binary may or may not exist
    # on the test host. Both outcomes are acceptable.
    result = tsh_available("definitely-not-on-path-xyz")
    assert result is False