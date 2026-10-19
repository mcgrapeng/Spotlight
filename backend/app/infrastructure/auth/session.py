"""Login sessions issued after successful auth.

Every session owns a private ``0700`` directory under ``SESSIONS_ROOT``
holding the kubeconfig produced during `acquire`. Sessions are in-memory:
process restart drops all sessions (users re-login) — acceptable for an
operator console and avoids a persistence layer nobody asked for.
"""
from __future__ import annotations

import secrets
import shutil
import time
from dataclasses import dataclass
from pathlib import Path
from threading import Lock

from app.infrastructure.auth.plugins.base import Identity

COOKIE_NAME = "spotlight_session"
SESSIONS_ROOT = Path("./data/sessions")
MAX_SESSIONS = 256
DEV_TOKEN = "dev"

_lock = Lock()


@dataclass
class Session:
    token: str
    provider_id: str
    identity: Identity
    dir: Path
    expires_at: float

    @property
    def kubeconfig_path(self) -> Path:
        return self.dir / "kubeconfig.yaml"


_sessions: dict[str, Session] = {}


def create_session(provider_id: str, identity: Identity, ttl_seconds: int) -> Session:
    SESSIONS_ROOT.mkdir(parents=True, exist_ok=True)
    token = secrets.token_urlsafe(32)
    dir_ = SESSIONS_ROOT / token
    dir_.mkdir(mode=0o700)
    s = Session(token=token, provider_id=provider_id, identity=identity,
                dir=dir_, expires_at=time.monotonic() + ttl_seconds)
    with _lock:
        while len(_sessions) >= MAX_SESSIONS:
            oldest = min(_sessions, key=lambda t: _sessions[t].expires_at)
            _drop_locked(oldest, delete_dir=True)
        _sessions[token] = s
    return s


def get_session(token: str | None) -> Session | None:
    if not token:
        return None
    with _lock:
        s = _sessions.get(token)
        if s is None:
            return None
        if s.expires_at < time.monotonic():
            _drop_locked(token, delete_dir=True)
            return None
        return s


def revoke_session(token: str | None) -> None:
    if not token:
        return
    with _lock:
        _drop_locked(token, delete_dir=True)


def sweep_expired() -> int:
    now = time.monotonic()
    with _lock:
        dead = [t for t, s in _sessions.items() if s.expires_at < now]
        for t in dead:
            _drop_locked(t, delete_dir=True)
    return len(dead)


def purge_orphans() -> int:
    """Delete session dirs with no in-memory Session.

    Sessions live in memory only, so a restart orphans every directory under
    SESSIONS_ROOT — each holding a real kubeconfig with a long-lived token.
    Called on shutdown (all of them are orphans then) and on startup (reap
    whatever a previous run or a crash left behind).

    Single-process only, which is no loss: `_sessions` is per-process, so a
    second worker could never serve another worker's cookie anyway, and its
    startup would reap directories that worker is actively using. Run one
    worker (or put a sticky load balancer in front) if you need more.
    """
    if not SESSIONS_ROOT.is_dir():
        return 0
    with _lock:
        live = {s.dir.resolve() for s in _sessions.values()}
    removed = 0
    for child in SESSIONS_ROOT.iterdir():
        if not child.is_dir():
            continue
        try:
            if child.resolve() in live:
                continue
            shutil.rmtree(child)
            removed += 1
        except OSError:
            pass
    return removed


def dev_session() -> Session:
    with _lock:
        s = _sessions.get(DEV_TOKEN)
        if s is None:
            SESSIONS_ROOT.mkdir(parents=True, exist_ok=True)
            dir_ = SESSIONS_ROOT / DEV_TOKEN
            dir_.mkdir(mode=0o700, exist_ok=True)
            s = Session(token=DEV_TOKEN, provider_id="dev",
                        identity=Identity(username="dev"),
                        dir=dir_, expires_at=time.monotonic() + 10 * 365 * 86400)
            _sessions[DEV_TOKEN] = s
        return s


def _drop_locked(token: str, *, delete_dir: bool) -> None:
    s = _sessions.pop(token, None)
    if s is not None and delete_dir:
        shutil.rmtree(s.dir, ignore_errors=True)
