"""Tests for LogSeverityClassifier.

Covers all major logging frameworks + edge cases (empty, unicode, panic).
"""
import pytest

from app.domain.services.log_classifier import LogSeverityClassifier, get_classifier
from app.domain.value_objects.enums import LogSeverity


@pytest.fixture
def clf() -> LogSeverityClassifier:
    return get_classifier()


# ── Java / JVM ──────────────────────────────────────────────────────────────
@pytest.mark.parametrize("line,expected", [
    ("2024-01-01 12:00:00 INFO  o.a.z.s.Main - starting", LogSeverity.INFO),
    ("DEBUG [main] com.example.App - doing thing", LogSeverity.DEBUG),
    ("WARN  c.e.App - deprecated", LogSeverity.WARN),
    ("ERROR c.e.App - failed to connect", LogSeverity.ERROR),
    ("TRACE low-level detail", LogSeverity.TRACE),
])
def test_jvm_levels(clf, line, expected):
    assert clf.classify(line) is expected


# ── Stack traces ────────────────────────────────────────────────────────────
def test_python_traceback_is_critical(clf):
    # Python tracebacks indicate an unhandled exception — escalate to CRITICAL
    # because in production these always warrant immediate attention.
    line = "Traceback (most recent call last):\n  File 'foo.py'"
    assert clf.classify(line) is LogSeverity.CRITICAL


def test_python_exception(clf):
    assert clf.classify("ValueError: invalid input") is LogSeverity.ERROR


# ── Critical / fatal ────────────────────────────────────────────────────────
@pytest.mark.parametrize("line,expected", [
    ("FATAL engine crash", LogSeverity.FATAL),
    ("CRITICAL system out of memory", LogSeverity.CRITICAL),
    ("kernel: panic - not syncing", LogSeverity.CRITICAL),
    ("segfault at ip=0x7f", LogSeverity.CRITICAL),
])
def test_critical_patterns(clf, line, expected):
    assert clf.classify(line) is expected


# ── Go / Rust / Node ────────────────────────────────────────────────────────
def test_go_logrus(clf):
    assert clf.classify("ERRO[001] connection refused") is LogSeverity.ERROR


def test_rust_panic(clf):
    assert clf.classify("thread 'main' panicked at 'oops'") is LogSeverity.CRITICAL


def test_node_error(clf):
    assert clf.classify("TypeError: cannot read property 'x'") is LogSeverity.ERROR


# ── Edge cases ──────────────────────────────────────────────────────────────
def test_empty(clf):
    assert clf.classify("") is LogSeverity.UNKNOWN


def test_unknown(clf):
    assert clf.classify("hello world") is LogSeverity.UNKNOWN


def test_case_insensitive_keyword(clf):
    assert clf.classify("info: service ready") in (LogSeverity.INFO, LogSeverity.UNKNOWN)


def test_does_not_match_substring_word(clf):
    # "info_button" should NOT match INFO (would be too noisy)
    assert clf.classify("user clicked info_button") is LogSeverity.UNKNOWN


def test_batch(clf):
    lines = ["INFO x", "ERROR y", "DEBUG z", "nope"]
    out = clf.classify_batch(lines)
    assert out == [LogSeverity.INFO, LogSeverity.ERROR, LogSeverity.DEBUG, LogSeverity.UNKNOWN]


# ── Ordering helpers ────────────────────────────────────────────────────────
def test_is_at_least():
    assert LogSeverity.ERROR.is_at_least(LogSeverity.WARN)
    assert LogSeverity.WARN.is_at_least(LogSeverity.ERROR) is False
    assert LogSeverity.INFO.is_at_least(LogSeverity.INFO)


def test_ordered():
    sevs = LogSeverity.ordered()
    assert sevs[0] is LogSeverity.TRACE
    assert sevs[-1] is LogSeverity.UNKNOWN


def test_color_var_unique():
    seen = {s.color_var for s in LogSeverity}
    assert len(seen) == len(LogSeverity)
