"""Tests for time-range short-form parsing (5m / 1h / 7d / ISO)."""
from __future__ import annotations

from app.infrastructure.k8s.adapter import _since_to_seconds


def test_short_units():
    assert _since_to_seconds("5s") == 5
    assert _since_to_seconds("15m") == 15 * 60
    assert _since_to_seconds("3h") == 3 * 3600
    assert _since_to_seconds("7d") == 7 * 86400
    assert _since_to_seconds(" 1d ") == 60 * 60 * 24  # whitespace tolerant


def test_iso_falls_back_to_delta():
    # 30 minutes ago
    from datetime import datetime, timedelta, timezone
    iso = (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
    delta = _since_to_seconds(iso)
    # tolerate ±10s of jitter for clock noise
    assert 1700 <= delta <= 1900


def test_garbage_returns_zero():
    assert _since_to_seconds("not a time") == 0
    assert _since_to_seconds("") == 0


def test_negative_short_unit_unsupported_returns_zero():
    # Negative deltas make no sense for "since" — we floor at 0.
    assert _since_to_seconds("-5m") == 0