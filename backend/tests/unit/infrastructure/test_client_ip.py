"""client_ip 与登录限流器的行为约定。

限流的故障模式是"反代后面所有人共用一个桶"。这里锁住的是速率限制器本身的
语义；客户端 IP 的解析（以及它必须交给 uvicorn、不能再自己解析一遍的原因）
见 test_client_ip_real.py —— 那里跑的是真 uvicorn + 真反代。
"""
from __future__ import annotations

from app.interface.api.v1.routes import auth as auth_route


# ── rate limiter ───────────────────────────────────────────────────────────

def test_rate_limiter_drops_key_once_window_expires(monkeypatch):
    """`_attempts` 的 key 必须会消失：否则每个碰过登录接口的 IP 都留一条永久记录。"""
    auth_route._attempts.clear()
    monkeypatch.setattr(auth_route, "_RATE_WINDOW", 0.05)
    try:
        for _ in range(auth_route._RATE_MAX):
            assert auth_route._rate_limited("198.51.100.7") is False
        assert "198.51.100.7" in auth_route._attempts   # 已限流，记录还在

        import time as _t
        _t.sleep(0.08)

        assert auth_route._rate_limited("198.51.100.7") is False  # 窗口过后放行
        assert "198.51.100.7" in auth_route._attempts             # 新一轮又记上了
    finally:
        auth_route._attempts.clear()


def test_rate_limiter_keys_are_independent_per_ip():
    auth_route._attempts.clear()
    try:
        for _ in range(auth_route._RATE_MAX):
            auth_route._rate_limited("198.51.100.1")
        # 同源被限流，但换个来源 IP 不受影响——这正是「反代后面所有人共用一个桶」
        # 曾经导致的故障。
        assert auth_route._rate_limited("198.51.100.1") is True
        assert auth_route._rate_limited("198.51.100.2") is False
    finally:
        auth_route._attempts.clear()


def test_repeated_logins_from_one_client_eventually_get_429():
    """The brute-force property: 11 attempts from one client in a window is
    refused. Counted per resolved client IP, which is uvicorn's job."""
    auth_route._attempts.clear()
    try:
        codes = [auth_route._rate_limited("203.0.113.5") for _ in range(_N + 1)]
        assert codes.count(False) == _RATE_MAX
        assert codes[-1] is True
    finally:
        auth_route._attempts.clear()


_N = 11
_RATE_MAX = auth_route._RATE_MAX
