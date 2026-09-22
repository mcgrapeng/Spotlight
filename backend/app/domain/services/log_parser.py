"""Log line parser: separates raw pod-log output into (timestamp, content)."""
from __future__ import annotations

import re
from datetime import datetime, timezone
from functools import lru_cache

# RFC3339Nano (k8s CRI emits this) — first non-whitespace token
_TS_RE = re.compile(
    r"^(?P<ts>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z?(?:[+-]\d{2}:?\d{2})?)\s+(?P<rest>.*)$"
)


@lru_cache(maxsize=1)
def _parser():
    return _TS_RE


def parse_log_line(raw: str, container: str, *, now: datetime | None = None) -> tuple[str, str]:
    """Return (timestamp_iso, content). If no timestamp in line, use `now`."""
    if not raw:
        return (now_iso(now), "")
    m = _parser().match(raw)
    if m:
        return m.group("ts"), m.group("rest")
    return now_iso(now), raw


def now_iso(now: datetime | None = None) -> str:
    return (now or datetime.now(timezone.utc)).isoformat(timespec="seconds")
