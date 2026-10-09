"""Tests for Teleport tsh integration — module surface only.

We avoid actually shelling out to `tsh` in tests (CI might not have it
installed, and the network call would flake). Instead we cover the pure
guard conditions: presence of binary, missing configuration.

After Task 4 the helpers moved to `app.infrastructure.auth.plugins.teleport`;
this file keeps the PTY + MFA detection regression tests under their new
import path so the behaviour pins survive the move.

`_run_with_pty` is exercised against a benign `/bin/sh` invocation that just
echoes what it reads back, so we can prove the PTY path works without
needing a real Teleport proxy.
"""
from __future__ import annotations

import pytest

from app.infrastructure.auth.plugins.teleport import (
    _is_mfa_prompt,
    _run_with_pty,
    tsh_available,
)
from app.infrastructure.config.settings import Settings


def test_settings_exposes_teleport_configured():
    # `teleport_user` is gone (per-session field now); proxy alone is
    # enough to flip `teleport_configured` to True.
    s = Settings(
        teleport_proxy="proxy.example:443",
        teleport_cluster="pvg1", teleport_insecure=False,
    )
    assert s.teleport_configured is True
    s2 = Settings()
    assert s2.teleport_configured is False


def test_settings_drops_teleport_user_field():
    s = Settings()
    assert "teleport_user" not in s.model_fields


def test_tsh_available_uses_path():
    """tsh_available() must not raise even when `tsh` isn't installed."""
    # We just assert the function is callable; the binary may or may not exist
    # on the test host. Both outcomes are acceptable.
    result = tsh_available("definitely-not-on-path-xyz")
    assert result is False


@pytest.mark.asyncio
async def test_run_with_pty_feeds_stdin_through_a_real_terminal():
    """`sh` reads one line and echoes it; if we see it back, the PTY plumbing works.

    This is the regression guard for the tsh "cannot perform password login
    without a terminal" error: `_run_with_pty` must give the child a tty so
    isatty(0) is true and any password prompt gets answered.

    We use `read; echo` (one line) instead of `cat` because the helper
    intentionally leaves the PTY master open until the child exits — `cat`
    would block on EOF forever.
    """
    rc, out, _err = await _run_with_pty(
        ["/bin/sh", "-c", "read line; echo \"GOT:$line\""],
        [b"hello-from-pty"],  # contract: one bytes item per stdin line
        timeout=5.0,
    )
    assert rc == 0
    assert "GOT:hello-from-pty" in out

def test_is_mfa_prompt_detects_totp_stall():
    assert _is_mfa_prompt("Enter an OTP code from a device:\n") is True
    assert _is_mfa_prompt("please enter your MFA token") is True
    assert _is_mfa_prompt("Enter password for Teleport user bob:") is False
    assert _is_mfa_prompt("access denied") is False
