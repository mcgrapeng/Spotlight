"""Tests for domain services + value objects."""
import pytest

from app.domain.services.duration import format_age
from app.domain.services.log_parser import normalize_timestamp, parse_log_line
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


def test_nanosecond_stamps_are_normalised_to_milliseconds():
    # The apiserver stamps nine fractional digits. The ECMAScript date-time
    # format allows three, so a nine-digit stamp is not portable — a browser
    # that rejects it renders the raw UTC string in the time column instead
    # of a local time.
    ts, content = parse_log_line(
        "2026-10-20T10:29:42.050646139Z hello world", "app"
    )
    assert ts == "2026-10-20T10:29:42.050Z"
    assert content == "hello world"


def test_normalize_timestamp_handles_offsets_and_keeps_one_shape():
    assert normalize_timestamp("2026-10-20T10:29:42Z") == "2026-10-20T10:29:42.000Z"
    assert normalize_timestamp("2026-10-20T10:29:42+00:00") == "2026-10-20T10:29:42.000Z"
    # An offset is converted, not dropped: 18:29+08:00 is 10:29 UTC.
    assert normalize_timestamp("2026-10-20T18:29:42+08:00") == "2026-10-20T10:29:42.000Z"
    # Unparseable input is left alone rather than mangled.
    assert normalize_timestamp("not a time") == "not a time"


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
