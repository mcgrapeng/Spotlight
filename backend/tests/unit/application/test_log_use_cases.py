"""The log use case must not re-derive a timestamp the repository already gave it.

Regression, found against a real cluster: every row of the log history
showed the moment the log was FETCHED, not the moment the line was
written. The repository splits the apiserver's timestamp off the line and
hands back the line's real time; the use case then re-parsed the content —
which no longer carried a timestamp — and fell back to "now". The
follow-stream, whose content still had the prefix at that point, showed
the real per-line times. The two paths disagreed, and the history was
the wrong one.
"""
from __future__ import annotations

from app.application.use_cases.logs import LogUseCases, apply_filter
from app.domain.entities.resources import LogEntry
from app.domain.value_objects.primitives import LogFilter, ResourceRef

REF = ResourceRef(cluster="c", namespace="ns", kind="Pod", name="p")

# What the repository hands over: the apiserver's stamp, already normalised
# to the one shape the app emits (UTC, milliseconds, 'Z'). The repository
# owns that — the use case must not touch it.
STAMP = "2026-10-20T10:29:42.050Z"


class _Repo:
    """A repository that already did the parsing, as the adapter does."""

    def __init__(self, entries: list[LogEntry]) -> None:
        self.entries = entries

    async def read_logs(self, ref, container, tail, since=None):
        return list(self.entries)

    def stream_logs(self, ref, container, tail, stop_event=None):
        yield from self.entries


def _entry(timestamp: str = STAMP, content: str = "hello world") -> LogEntry:
    return LogEntry(timestamp=timestamp, content=content, container="app")


async def test_the_history_keeps_the_line_s_own_timestamp():
    uc = LogUseCases(_Repo([_entry()]))
    out = await uc.read_history(REF, None, 10)
    assert out[0].timestamp == STAMP
    assert out[0].content == "hello world"


async def test_the_stream_and_the_history_agree():
    uc = LogUseCases(_Repo([_entry()]))
    history = await uc.read_history(REF, None, 10)
    streamed = [e for e in uc.stream(REF, None, 10) if e is not None]
    assert len(streamed) == 1
    assert streamed[0].timestamp == history[0].timestamp
    assert streamed[0].content == history[0].content


def test_the_keyword_filter_matches_a_literal_substring():
    # The keyword used to be able to be a regex. Python's engine backtracks,
    # so a pattern like (a+)+$ over a long log line hangs the request — and
    # the filter was one wiring away from the API. It is a literal now.
    from app.application.dto import LogStreamParams

    entry = LogStreamParams(
        timestamp="2026-10-20T10:00:00.000Z", content="connection refused",
        container="app", severity="error",
    )
    assert apply_filter(entry, LogFilter(keyword="refused")) is True
    assert apply_filter(entry, LogFilter(keyword="REFUSED")) is True
    assert apply_filter(entry, LogFilter(keyword="refus")) is True
    assert apply_filter(entry, LogFilter(keyword="timeout")) is False
    assert apply_filter(entry, LogFilter(keyword="refu.*")) is False


def test_the_since_filter_compares_instants_not_strings():
    # The client sends its own ISO shape; the entries carry milliseconds.
    # A lexicographic comparison dropped the wrong lines around the
    # boundary, because "…T10:00:00.000Z" < "…T10:00:00Z" is true as
    # strings and false as instants.
    from app.application.dto import LogStreamParams

    entry = LogStreamParams(
        timestamp="2026-10-20T10:00:00.000Z", content="x", container="app",
        severity="info",
    )
    assert apply_filter(entry, LogFilter(since="2026-10-20T09:59:59Z")) is True
    assert apply_filter(entry, LogFilter(since="2026-10-20T10:00:00Z")) is True
    assert apply_filter(entry, LogFilter(since="2026-10-20T10:00:01Z")) is False
