"""Tests for domain services + value objects."""
import pytest

from app.domain.services.duration import format_age
from app.domain.services.log_parser import parse_log_line
from app.domain.value_objects.enums import PodPhase
from app.domain.value_objects.primitives import LabelSelector, LogFilter


# ── PodPhase ────────────────────────────────────────────────────────────────
def test_phase_parse_valid():
    assert PodPhase.parse("Running") is PodPhase.RUNNING


def test_phase_parse_invalid():
    assert PodPhase.parse("garbage") is PodPhase.UNKNOWN


def test_phase_parse_none():
    assert PodPhase.parse(None) is PodPhase.UNKNOWN


def test_phase_health():
    assert PodPhase.RUNNING.is_healthy
    assert PodPhase.SUCCEEDED.is_healthy
    assert not PodPhase.FAILED.is_healthy


# ── LabelSelector ───────────────────────────────────────────────────────────
def test_label_selector_parse():
    sel = LabelSelector.parse("app=foo, tier=backend")
    assert sel.pairs == {"app": "foo", "tier": "backend"}
    assert sel.to_query() == "app=foo,tier=backend"


def test_label_selector_empty():
    sel = LabelSelector.parse(None)
    assert sel.pairs == {}
    assert sel.to_query() is None


def test_label_selector_malformed():
    sel = LabelSelector.parse("app, =value, foo=bar")
    # malformed tokens skipped
    assert sel.pairs == {"foo": "bar"}


# ── LogFilter ───────────────────────────────────────────────────────────────
def test_log_filter_inactive():
    f = LogFilter()
    assert not f.is_active()


def test_log_filter_keyword_active():
    f = LogFilter(keyword="error")
    assert f.is_active()


# ── parse_log_line ───────────────────────────────────────────────────────────
def test_parse_with_iso_timestamp():
    line = "2024-01-01T12:34:56.789Z INFO hello world"
    ts, content = parse_log_line(line, "app")
    assert ts == "2024-01-01T12:34:56.789Z"
    assert content == "INFO hello world"


def test_parse_without_timestamp():
    line = "just a plain log line"
    ts, content = parse_log_line(line, "app")
    assert "T" in ts  # ISO format
    assert content == line


def test_parse_empty():
    ts, content = parse_log_line("", "app")
    assert content == ""


# ── format_age ──────────────────────────────────────────────────────────────
@pytest.mark.parametrize("seconds,expected", [
    (30, "30s"),
    (90, "1m"),
    (3600, "1h"),
    (86400, "1d"),
    (None, None),
    (-5, None),
])
def test_format_age(seconds, expected):
    assert format_age(seconds) == expected
