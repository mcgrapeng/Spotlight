"""Log severity classifier.

Pure function, no IO. Implements multi-pattern recognition covering:
- Java/Kotlin (logback, log4j2, JUL)
- Python (logging, loguru)
- Go (logrus, zap, stdlib)
- Node.js (pino, winston, bunyan)
- Rust (env_logger, log, tracing)
- Generic CRITICAL/FATAL/ERROR/WARN/INFO/DEBUG/TRACE keywords

Compiled once at import time; bounded regex count for predictable perf.
"""
from __future__ import annotations

import re
from functools import lru_cache

from app.domain.value_objects.enums import LogSeverity


# ANSI SGR escape sequences must be stripped before matching: an inline
# "\x1b[34mdebug" puts 'm' before 'd', killing the \b word boundary that the
# DEBUG/INFO rules rely on — coloured lines used to classify as UNKNOWN.
_ANSI_RE = re.compile(r"\x1b\[[0-9;]*[a-zA-Z]")

# The level word at the START of a line is authoritative (pino/winston/
# loguru style: "warn [api] api error ...") — it beats in-content keywords,
# which are often part of the message text itself. Optional leading
# timestamp ("2026-10-09 03:28:56 warn …" / "06:02:42 warn …") is skipped.
_LEADING_RE = re.compile(
    r"^\s*(?:\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?\s*|[0-9]{1,2}:[0-9]{2}:[0-9]{2}(?:[.,]\d+)?\s+)?"
    r"(TRACE|DEBUG|INFO|INFORMATION|NOTICE|WARN|WARNING|ERROR|ERRO|CRITICAL|FATAL|PANIC)\b",
    re.IGNORECASE,
)
_LEADING_LEVEL: dict[str, LogSeverity] = {
    "trace": LogSeverity.TRACE,
    "debug": LogSeverity.DEBUG,
    "info": LogSeverity.INFO, "information": LogSeverity.INFO,
    "notice": LogSeverity.NOTICE,
    "warn": LogSeverity.WARN, "warning": LogSeverity.WARN,
    "error": LogSeverity.ERROR, "erro": LogSeverity.ERROR,
    "critical": LogSeverity.CRITICAL, "fatal": LogSeverity.FATAL,
    "panic": LogSeverity.CRITICAL,
}


# Each rule: (severity, compiled_pattern). Order matters — first match wins.
# Patterns are intentionally specific (word-bounded, case-insensitive) to avoid
# matching "informational" → INFO; and "error_count" → ERROR. We require a
# token boundary OR standard timestamped form.
_RULES: tuple[tuple[LogSeverity, re.Pattern[str]], ...] = (
    # CRITICAL/FATAL first — most urgent
    (LogSeverity.CRITICAL, re.compile(r"\b(?:CRITICAL|FATAL)\b|\bSEGV\b", re.IGNORECASE)),
    (LogSeverity.CRITICAL, re.compile(r"\bpanic\s|segfault|Traceback \(most recent call last\)", re.IGNORECASE)),
    # Stack-trace markers (Python/Rust/Node) => ERROR
    # ERROR — keyword case-insensitive ("error"/"Error"/"ERROR"); exception
    # class names stay case-sensitive (CamelCase only).
    (LogSeverity.ERROR, re.compile(r"\b(?:ERROR|ERRO)\b", re.IGNORECASE)),
    (LogSeverity.ERROR, re.compile(r"Exception:|TypeError|ValueError|KeyError|AttributeError|IOError|RuntimeError|NullPointerException|IllegalStateException")),
    (LogSeverity.ERROR, re.compile(r"\b(?:failed|failure|errno=|exit code [1-9])", re.IGNORECASE)),
    # WARN
    (LogSeverity.WARN, re.compile(r"\b(?:WARN|WARNING)\b|\bdeprecat(?:ed|ion)\b", re.IGNORECASE)),
    # NOTICE
    (LogSeverity.NOTICE, re.compile(r"\bNOTICE\b", re.IGNORECASE)),
    # INFO — word-bounded, not preceded by alpha (avoid "info_button")
    (LogSeverity.INFO, re.compile(r"(?:^|\s|\[)(?:INFO|INFORMATION)\b", re.IGNORECASE)),
    # DEBUG
    (LogSeverity.DEBUG, re.compile(r"\bDEBUG\b|\bdbg\b", re.IGNORECASE)),
    # TRACE
    (LogSeverity.TRACE, re.compile(r"\bTRACE\b", re.IGNORECASE)),
)


class LogSeverityClassifier:
    """Stateless classifier. Safe for concurrent use."""

    __slots__ = ()

    def classify(self, line: str) -> LogSeverity:
        """Return the most severe matching severity. UNKNOWN if no match."""
        if not line:
            return LogSeverity.UNKNOWN
        line = _ANSI_RE.sub("", line)
        # Leading level word wins (authoritative app level marker).
        m = _LEADING_RE.match(line)
        if m:
            return _LEADING_LEVEL[m.group(1).lower()]
        # First pass: short-circuit on the most urgent levels to keep hot-path cheap
        if "FATAL" in line or "panic" in line.lower():
            return LogSeverity.FATAL if "FATAL" in line else LogSeverity.CRITICAL
        for severity, pattern in _RULES:
            if pattern.search(line):
                return severity
        return LogSeverity.UNKNOWN

    def classify_batch(self, lines: list[str]) -> list[LogSeverity]:
        return [self.classify(l) for l in lines]


@lru_cache(maxsize=1)
def get_classifier() -> LogSeverityClassifier:
    return LogSeverityClassifier()
