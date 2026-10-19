"""会话生命周期：过期清理 + 孤儿目录清理。

会话只在内存里存在，所以磁盘上的目录一旦失去对应的 Session 就是孤儿——里面
躺着真实的 kubeconfig（长期 token）。重启、崩溃、异常退出都会留下一批。
"""
from __future__ import annotations

import time

from app.infrastructure.auth import session as store


def _make(ttl: float = 60.0):
    """Create a session. `create_session` mints its own random token, so tests
    address the returned object rather than guessing a name."""
    return store.create_session("token", store.Identity(username="u"), ttl)


def test_expired_session_is_dropped_on_read_and_dir_removed():
    store._sessions.clear()
    s = _make(ttl=-1.0)
    assert store.get_session(s.token) is None
    assert not s.dir.exists()


def test_sweep_expired_removes_dirs_of_expired_sessions():
    store._sessions.clear()
    s = _make(ttl=-1.0)
    assert s.dir.exists()
    assert store.sweep_expired() >= 1
    assert not s.dir.exists()
    store._sessions.clear()


def test_purge_orphans_removes_dirs_with_no_session():
    """重启后每个目录都是孤儿：内存空了，磁盘还在。"""
    store._sessions.clear()
    orphan = _make(ttl=999.0)
    # Simulate a restart: drop the in-memory record but leave the directory
    # (with its kubeconfig) exactly where the process left it.
    store._sessions.pop(orphan.token, None)
    (orphan.dir / "kubeconfig.yaml").write_text("token: leaked")
    assert orphan.dir.exists()

    removed = store.purge_orphans()
    assert removed >= 1
    assert not orphan.dir.exists()
    store._sessions.clear()


def test_purge_orphans_keeps_live_session_dirs():
    store._sessions.clear()
    live = _make(ttl=999.0)
    store.purge_orphans()
    assert live.dir.exists()
    store.revoke_session(live.token)


def test_purge_orphans_is_safe_when_root_missing(monkeypatch, tmp_path):
    store._sessions.clear()
    monkeypatch.setattr(store, "SESSIONS_ROOT", tmp_path / "does-not-exist")
    assert store.purge_orphans() == 0


def test_dev_session_survives_logout_path():
    """Bearer / 开放模式共用这一个合成会话，logout 不能把它一起销毁，
    否则其它并发请求的 ApiClient 会被从脚下抽走。"""
    store._sessions.clear()
    dev = store.dev_session()
    assert dev.token == store.DEV_TOKEN
    assert store.get_session(store.DEV_TOKEN) is not None
    store._sessions.clear()
