"""Tests for the log use case — classification + filter logic."""
import pytest

from app.application.use_cases.logs import LogUseCases, apply_filter
from app.application.dto import LogStreamParams
from app.domain.entities.resources import LogEntry
from app.domain.value_objects.primitives import LogFilter, ResourceRef


class FakeLogRepo:
    def __init__(self, lines: list[str], follow_extra: list[str] | None = None):
        self._history = lines
        self._follow = follow_extra or []

    async def read_logs(self, ref, container, tail_lines, since):
        return [LogEntry(timestamp="", content=l, container=container or "") for l in self._history[:tail_lines]]

    def stream_logs(self, ref, container, tail_lines, stop_event=None):
        yield from (LogEntry(timestamp="", content=l, container=container or "") for l in self._history[:tail_lines])
        yield from (LogEntry(timestamp="", content=l, container=container or "") for l in self._follow)


@pytest.fixture
def repo() -> FakeLogRepo:
    return FakeLogRepo(
        lines=[
            "2024-01-01T00:00:00Z INFO  service ready",
            "2024-01-01T00:00:01Z DEBUG cache miss key=user",
            "2024-01-01T00:00:02Z ERROR connection refused",
            "2024-01-01T00:00:03Z WARN  deprecated api",
        ],
        follow_extra=["2024-01-01T00:00:04Z FATAL kernel panic"],
    )


@pytest.fixture
def ref() -> ResourceRef:
    return ResourceRef(cluster="", namespace="default", kind="Pod", name="p1")


# ── classification ──────────────────────────────────────────────────────────
async def test_history_is_classified(repo, ref):
    uc = LogUseCases(repo)
    out = await uc.read_history(ref, "app", 100)
    assert [e.severity for e in out] == ["info", "debug", "error", "warn"]


def test_stream_continues(repo, ref):
    uc = LogUseCases(repo)
    items = list(uc.stream(ref, "app", 100))
    assert len(items) == 5
    assert items[-1].severity == "fatal"


# ── apply_filter ────────────────────────────────────────────────────────────
def test_apply_filter_keyword_case_insensitive():
    e = LogStreamParams(timestamp="", content="ERROR oops", container="app", severity="error")
    assert apply_filter(e, LogFilter(keyword="OOPS", case_insensitive=True))
    assert not apply_filter(e, LogFilter(keyword="OOPS", case_insensitive=False))


def test_apply_filter_severity_threshold():
    e_warn = LogStreamParams(timestamp="", content="x", container="app", severity="warn")
    e_error = LogStreamParams(timestamp="", content="x", container="app", severity="error")
    flt = LogFilter(severities=frozenset({"error"}))
    assert not apply_filter(e_warn, flt)
    assert apply_filter(e_error, flt)


def test_apply_filter_container_match():
    e = LogStreamParams(timestamp="", content="x", container="api", severity="info")
    assert apply_filter(e, LogFilter(container="api"))
    assert not apply_filter(e, LogFilter(container="worker"))


def test_apply_filter_inactive_passes_everything():
    e = LogStreamParams(timestamp="", content="anything", container="x", severity="unknown")
    assert apply_filter(e, LogFilter())


def test_apply_filter_regex():
    e = LogStreamParams(timestamp="", content="GET /api/v1/users 200", container="api", severity="info")
    assert apply_filter(e, LogFilter(keyword=r"/api/v\d+/users", regex=True))
    assert not apply_filter(e, LogFilter(keyword=r"^POST", regex=True))


def test_apply_filter_since():
    e = LogStreamParams(timestamp="2024-01-01T00:00:05Z", content="x", container="c", severity="info")
    assert apply_filter(e, LogFilter(since="2024-01-01T00:00:04Z"))
    assert not apply_filter(e, LogFilter(since="2024-01-01T00:00:06Z"))
