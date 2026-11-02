"""Log line parser: separates raw pod-log output into (timestamp, content)."""
from __future__ import annotations

import re
from datetime import datetime, timezone

# ISO 8601 with T separator (k8s CRI default) OR space separator (Node.js /
# many app frameworks that don't bother). Both forms may be followed by an
# optional fractional second + Z / timezone offset.
_TS_RE = re.compile(
    r"^(?P<ts>\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?Z?(?:[+-]\d{2}:?\d{2})?)\s+(?P<rest>.*)$"
)


def parse_timestamp(ts: str) -> datetime | None:
    """Parse a timestamp the app emitted or received. None if unparseable."""
    text = ts[:-1] + "+00:00" if ts.endswith("Z") else ts
    try:
        dt = datetime.fromisoformat(text)
    except ValueError:
        return None
    # A stamp with no offset is ambiguous. Treat it as UTC rather than
    # guessing a zone, so the value never silently shifts under the reader.
    return dt if dt.tzinfo is not None else dt.replace(tzinfo=timezone.utc)


def normalize_timestamp(ts: str) -> str:
    """One shape for every timestamp the app emits: UTC, milliseconds, 'Z'.

    The apiserver stamps nanoseconds ("2026-10-20T10:29:42.005658389Z"). The
    ECMAScript date-time format allows three fractional digits, so a
    nine-digit stamp is not portable — a browser that rejects it renders the
    raw UTC string in the time column instead of a local time. One shape
    everywhere also means two timestamps can be compared as strings, which
    is what the `since` filter does.
    """
    dt = parse_timestamp(ts)
    if dt is None:
        return ts
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def parse_log_line(raw: str, container: str, *, now: datetime | None = None) -> tuple[str, str]:
    """Return (timestamp_iso, content). If no timestamp in line, use `now`."""
    if not raw:
        return (now_iso(now), "")
    m = _TS_RE.match(raw)
    if m:
        return normalize_timestamp(m.group("ts")), m.group("rest")
    return now_iso(now), raw


def now_iso(now: datetime | None = None) -> str:
    """The current time, in the same shape as every other timestamp."""
    return normalize_timestamp((now or datetime.now(timezone.utc)).isoformat())
