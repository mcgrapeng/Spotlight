"""In-memory login sessions issued after successful auth.

A session is just a random token bound to the caller's cookie. Process
restart drops all sessions (users re-login) — acceptable for an operator
console and avoids a persistence layer nobody asked for.
"""
from __future__ import annotations

import secrets
import time
from threading import Lock

COOKIE_NAME = "spotlight_session"
MAX_SESSIONS = 256

_sessions: dict[str, float] = {}  # token -> expiry (monotonic seconds)
_lock = Lock()


def issue(ttl_seconds: int) -> str:
    token = secrets.token_urlsafe(32)
    with _lock:
        _prune_locked()
        if len(_sessions) >= MAX_SESSIONS:
            oldest = min(_sessions, key=_sessions.__getitem__)
            del _sessions[oldest]
        _sessions[token] = time.monotonic() + ttl_seconds
    return token


def validate(token: str | None) -> bool:
    if not token:
        return False
    with _lock:
        exp = _sessions.get(token)
        if exp is None:
            return False
        if exp < time.monotonic():
            del _sessions[token]
            return False
        return True


def revoke(token: str | None) -> None:
    if not token:
        return
    with _lock:
        _sessions.pop(token, None)


def _prune_locked() -> None:
    now = time.monotonic()
    expired = [t for t, exp in _sessions.items() if exp < now]
    for t in expired:
        del _sessions[t]
