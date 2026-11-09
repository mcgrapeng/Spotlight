"""Log use case: read & stream pod logs with severity classification + filtering."""
from __future__ import annotations

from typing import Iterator

from app.application.dto import LogStreamParams
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.services.log_classifier import get_classifier
from app.domain.services.log_parser import parse_timestamp
from app.domain.value_objects.enums import LogSeverity
from app.domain.value_objects.primitives import LogFilter, ResourceRef


class LogUseCases:
    def __init__(self, repo: K8sRepositoryPort):
        self._repo = repo
        self._classifier = get_classifier()

    async def read_history(
        self, ref: ResourceRef, container: str | None, tail: int,
        since: str | None = None,
    ) -> list[LogStreamParams]:
        entries = await self._repo.read_logs(ref, container, tail, since=since)
        return [self._enrich(e) for e in entries]

    def stream(
        self, ref: ResourceRef, container: str | None, tail: int,
        stop_event=None,
    ) -> Iterator[LogStreamParams]:
        for entry in self._repo.stream_logs(ref, container, tail, stop_event=stop_event):
            # `None` is the repo's poll-boundary marker (this poll is done,
            # flush what it produced). It carries no content and must not be
            # classified or enriched.
            if entry is None:
                yield None  # type: ignore[misc]
                continue
            yield self._enrich(entry)

    def _enrich(self, entry) -> LogStreamParams:
        # The repository already split the apiserver's timestamp off the
        # line: `entry.timestamp` is the line's real time and `entry.content`
        # is the line itself. This used to re-parse the content, which no
        # longer carried a timestamp, and fall back to "now" — so every row
        # of the history showed the moment the log was fetched, and the
        # follow-stream showed the real per-line times. The two paths
        # disagreed, and neither one was right.
        return LogStreamParams(
            timestamp=entry.timestamp, content=entry.content,
            container=entry.container,
            severity=self._classifier.classify(entry.content).value,
        )


def apply_filter(entry: LogStreamParams, flt: LogFilter) -> bool:
    """Apply a LogFilter to a classified entry. Pure."""
    if not flt.is_active():
        return True
    if flt.container and entry.container != flt.container:
        return False
    if flt.severities:
        try:
            threshold = min(LogSeverity(s) for s in flt.severities)
        except ValueError:
            threshold = LogSeverity.UNKNOWN
        entry_sev = LogSeverity(entry.severity)
        if not entry_sev.is_at_least(threshold):
            return False
    if flt.since:
        # Compare instants, not strings. The client sends its own ISO shape
        # ("2026-10-20T10:00:00Z") while the entries carry milliseconds
        # ("2026-10-20T10:00:00.000Z"), and a lexicographic comparison of
        # the two drops or keeps the wrong lines around the boundary.
        cutoff = parse_timestamp(flt.since)
        moment = parse_timestamp(entry.timestamp)
        if cutoff is not None and moment is not None and moment < cutoff:
            return False
    if flt.keyword:
        haystack = entry.content.lower() if flt.case_insensitive else entry.content
        needle = flt.keyword.lower() if flt.case_insensitive else flt.keyword
        if needle not in haystack:
            return False
    return True
