"""Human-friendly duration formatter. Used for 'X seconds ago' / Age column."""
from __future__ import annotations


def format_age(seconds: int | None) -> str | None:
    if seconds is None or seconds < 0:
        return None
    if seconds < 60:
        return f"{seconds}s"
    if seconds < 3600:
        return f"{seconds // 60}m"
    if seconds < 86400:
        return f"{seconds // 3600}h"
    return f"{seconds // 86400}d"
