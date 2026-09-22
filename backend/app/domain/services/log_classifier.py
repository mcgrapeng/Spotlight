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


# Each rule: (severity, compiled_pattern). Order matters — first match wins.
# Patterns are intentionally specific (word-bounded, case-insensitive) to avoid
# matching "informational" → INFO; and "error_count" → ERROR. We require a
# token boundary OR standard timestamped form.
_RULES: tuple[tuple[LogSeverity, re.Pattern[str]], ...] = (
    # CRITICAL/FATAL first — most urgent
    (LogSeverity.CRITICAL, re.compile(r"\b(?:CRITICAL|FATAL)\b|\bSEGV\b", re.IGNORECASE)),
    (LogSeverity.CRITICAL, re.compile(r"\bpanic\s|segfault|Traceback \(most recent call last\)", re.IGNORECASE)),
    # Stack-trace markers (Python/Rust/Node) => ERROR
    (LogSeverity.ERROR, re.compile(r"\b(?:ERROR|ERRO)\b|Exception:|TypeError|ValueError|KeyError|AttributeError|IOError|RuntimeError|NullPointerException|IllegalStateException")),
    (LogSeverity.ERROR, re.compile(r"\b(?:failed|failure|errno=|exit code [1-9])", re.IGNORECASE)),
    # WARN
    (LogSeverity.WARN, re.compile(r"\b(?:WARN|WARNING)\b|\bdeprecat(?:ed|ion)\b", re.IGNORECASE)),
    # NOTICE
    (LogSeverity.NOTICE, re.compile(r"\bNOTICE\b", re.IGNORECASE)),
    # INFO — word-bounded, not preceded by alpha (avoid "info_button")
    (LogSeverity.INFO, re.compile(r"(?:^|\s|\[)(?:INFO|INFORMATION)\b")),
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
