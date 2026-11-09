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

# The application's own prefix: `<timestamp> <LEVEL> …`.
#
# The panel already renders both facts — the line's time in its own column,
# the level in its own badge — so a line that keeps them spends its first
# twenty-odd characters saying the same thing twice. Measured on a real
# 10,000-line panel, that was 42% of the row before the message started.
#
# The shapes, in the wild:
#   2026-11-09 02:00:19.123 INFO  [exec-1] com.example - message
#   2026-11-09T02:00:19Z INFO com.example - message
#   02:00:19 INFO message
#   \x1b[32m2026-11-09 02:00:19 INFO message      (coloured)
#
# The ANSI escapes are kept: they colour the rest of the line, and the panel
# renders them.
_ANSI = r"(?:\x1b\[[0-9;]*[a-zA-Z])*"
_APP_TS_RE = re.compile(
    rf"^(?P<ansi>{_ANSI})\s*"
    r"(?:\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d{1,9})?(?:Z|[+-]\d{2}:?\d{2})?\s+"
    r"|\d{1,2}:\d{2}:\d{2}(?:[.,]\d{1,9})?\s+)"
)
_APP_LEVEL_RE = re.compile(
    rf"^(?P<ansi>{_ANSI})\s*"
    r"(?P<level>TRACE|DEBUG|INFO|INFORMATION|NOTICE|WARN|WARNING|ERROR|ERRO|"
    r"CRITICAL|FATAL|PANIC)\b(?:\s+|$)",
    re.IGNORECASE,
)


def strip_app_prefix(line: str) -> str:
    """Remove the application's own `<timestamp> <LEVEL>` prefix from a line.

    Only the prefix goes; the message that follows is the app's, untouched.
    A line without that shape is returned as it came in.
    """
    if not line:
        return line
    m = _APP_TS_RE.match(line)
    if m:
        line = m.group("ansi") + line[m.end():]
    m = _APP_LEVEL_RE.match(line)
    if m:
        word = m.group("level")
        # The convention is UPPERCASE ("INFO"), and some frameworks use
        # lowercase ("info"). Mixed case ("Info about the outage") is a
        # sentence that happens to start with a level word, not a level
        # marker — it stays.
        if word.isupper() or word.islower():
            line = m.group("ansi") + line[m.end():]
    return line


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
