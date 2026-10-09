"""Login sessions issued after successful auth.

Two stores live side by side:

* ``_tokens`` — the original simple token -> expiry map behind
  ``issue``/``validate``/``revoke``. Kept working until the auth plugin
  switch (Task 7) deletes it.
* ``_sessions`` — the per-session credential container: every session owns a
  private ``0700`` directory under ``SESSIONS_ROOT`` holding the kubeconfig
  produced during login.

Both are in-memory: process restart drops all sessions (users re-login) —
acceptable for an operator console and avoids a persistence layer nobody
asked for.
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

_tokens: dict[str, float] = {}  # token -> expiry (monotonic seconds)
_lock = Lock()


# --- 旧简单令牌 API（Task 7 删除） ------------------------------------------


def issue(ttl_seconds: int) -> str:
    token = secrets.token_urlsafe(32)
    with _lock:
        _prune_locked()
        if len(_tokens) >= MAX_SESSIONS:
            oldest = min(_tokens, key=_tokens.__getitem__)
            del _tokens[oldest]
        _tokens[token] = time.monotonic() + ttl_seconds
    return token


def validate(token: str | None) -> bool:
    if not token:
        return False
    with _lock:
        exp = _tokens.get(token)
        if exp is None:
            return False
        if exp < time.monotonic():
            del _tokens[token]
            return False
        return True


def revoke(token: str | None) -> None:
    if not token:
        return
    with _lock:
        _tokens.pop(token, None)


def _prune_locked() -> None:
    now = time.monotonic()
    expired = [t for t, exp in _tokens.items() if exp < now]
    for t in expired:
        del _tokens[t]


# --- 会话凭证目录 -----------------------------------------------------------


@dataclass
class Session:
    token: str
    provider_id: str
    identity: "Identity"
    dir: Path
    expires_at: float

    @property
    def kubeconfig_path(self) -> Path:
        return self.dir / "kubeconfig.yaml"


_sessions: dict[str, Session] = {}


def create_session(provider_id: str, identity: "Identity", ttl_seconds: int) -> Session:
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


def dev_session() -> Session:
    with _lock:
        s = _sessions.get("dev")
        if s is None:
            SESSIONS_ROOT.mkdir(parents=True, exist_ok=True)
            dir_ = SESSIONS_ROOT / "dev"
            dir_.mkdir(mode=0o700, exist_ok=True)
            s = Session(token="dev", provider_id="dev",
                        identity=Identity(username="dev"),
                        dir=dir_, expires_at=time.monotonic() + 10 * 365 * 86400)
            _sessions["dev"] = s
        return s


def _drop_locked(token: str, *, delete_dir: bool) -> None:
    s = _sessions.pop(token, None)
    if s is not None and delete_dir:
        shutil.rmtree(s.dir, ignore_errors=True)
