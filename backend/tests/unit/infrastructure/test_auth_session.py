"""会话生命周期：建目录 0700、过期清理、登出删目录、上限淘汰。"""
from __future__ import annotations

import time

from app.infrastructure.auth import session as sess
from app.infrastructure.auth.plugins.base import Identity


def _ident(name: str = "alice") -> Identity:
    return Identity(username=name)


def test_create_session_makes_private_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(sess, "SESSIONS_ROOT", tmp_path / "sessions")
    s = sess.create_session("token", _ident(), ttl_seconds=60)
    assert s.dir.is_dir()
    assert oct(s.dir.stat().st_mode)[-3:] == "700"
    assert s.kubeconfig_path == s.dir / "kubeconfig.yaml"
    assert sess.get_session(s.token) is not None


def test_expired_session_is_cleaned_on_read(tmp_path, monkeypatch):
    monkeypatch.setattr(sess, "SESSIONS_ROOT", tmp_path / "sessions")
    s = sess.create_session("token", _ident(), ttl_seconds=60)
    sess._sessions[s.token].expires_at = time.monotonic() - 1   # 强制过期
    assert sess.get_session(s.token) is None
    assert not s.dir.exists()


def test_revoke_removes_dir_and_token(tmp_path, monkeypatch):
    monkeypatch.setattr(sess, "SESSIONS_ROOT", tmp_path / "sessions")
    s = sess.create_session("token", _ident(), ttl_seconds=60)
    sess.revoke_session(s.token)
    assert not s.dir.exists()
    assert sess.get_session(s.token) is None


def test_max_sessions_evicts_oldest_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(sess, "SESSIONS_ROOT", tmp_path / "sessions")
    monkeypatch.setattr(sess, "MAX_SESSIONS", 2)
    a = sess.create_session("token", _ident("a"), 60)
    b = sess.create_session("token", _ident("b"), 60)
    c = sess.create_session("token", _ident("c"), 60)
    assert not a.dir.exists()          # 最老的被淘汰且目录删除
    assert sess.get_session(a.token) is None
    assert b.dir.exists() and c.dir.exists()


def test_dev_session_is_shared(tmp_path, monkeypatch):
    monkeypatch.setattr(sess, "SESSIONS_ROOT", tmp_path / "sessions")
    d1, d2 = sess.dev_session(), sess.dev_session()
    assert d1.token == d2.token == "dev"
