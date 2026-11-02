"""build_config is where TRUSTED_PROXY_IPS becomes uvicorn's
`forwarded_allow_ips` — the line that decides whose X-Forwarded-For the login
rate limiter believes. Wrong here means spoofable client IPs and a shared
rate-limit bucket.
"""
from __future__ import annotations

from app.infrastructure.config.settings import get_settings
from app.server import build_config


def test_trusted_proxies_enable_forwarded_header_honouring(monkeypatch):
    monkeypatch.setenv("TRUSTED_PROXY_IPS", "10.0.0.1, 10.0.0.2")
    get_settings.cache_clear()
    cfg = build_config(port=9999)
    assert cfg.proxy_headers is True
    assert cfg.forwarded_allow_ips == ["10.0.0.1", "10.0.0.2"]
    assert cfg.port == 9999
    assert cfg.host == "0.0.0.0"


def test_without_trusted_proxies_forwarded_headers_are_off(monkeypatch):
    # With no trusted peers the header machinery switches off entirely —
    # uvicorn's own default would trust 127.0.0.1, which is fine for a local
    # sidecar and spoofable for anything reachable.
    monkeypatch.setenv("TRUSTED_PROXY_IPS", "")
    get_settings.cache_clear()
    cfg = build_config()
    assert cfg.proxy_headers is False
    assert cfg.port == 8002


def test_overrides_win_over_the_defaults(monkeypatch):
    monkeypatch.setenv("TRUSTED_PROXY_IPS", "10.0.0.1")
    get_settings.cache_clear()
    cfg = build_config(host="127.0.0.1", port=1234, reload=True)
    assert (cfg.host, cfg.port, cfg.reload) == ("127.0.0.1", 1234, True)
