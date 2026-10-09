"""Log use case: read & stream pod logs with severity classification + filtering."""
from __future__ import annotations

import re
from typing import Iterator

from app.application.dto import LogStreamParams
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.services.log_classifier import get_classifier
from app.domain.services.log_parser import parse_log_line
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
            yield self._enrich(entry)

    def _enrich(self, entry) -> LogStreamParams:
        ts, content = parse_log_line(entry.content, entry.container)
        return LogStreamParams(
            timestamp=ts, content=content, container=entry.container,
            severity=self._classifier.classify(content).value,
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
    if flt.since and entry.timestamp < flt.since:
        return False
    if flt.keyword:
        haystack = entry.content.lower() if flt.case_insensitive else entry.content
        needle = flt.keyword.lower() if flt.case_insensitive else flt.keyword
        if flt.regex:
            if not re.search(needle, haystack):
                return False
        elif needle not in haystack:
            return False
    return True