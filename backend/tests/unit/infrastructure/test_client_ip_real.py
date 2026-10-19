"""真实 HTTP + 真实反向代理，验证限流的客户端身份。

为什么必须是真跑：限流的故障是"反代后面所有人共用一个桶"。而
`request.client.host` 的取值完全由服务器的配置决定——单元测试里这个值是我们
自己构造的，怎么写都"正确"，只有真的起一个 uvicorn 加一个真的反代进程，才能
证明信任链是通的。

这轮测试查出一个真问题：uvicorn 默认就开着 proxy_headers（trusted=127.0.0.1），
会**先于应用代码**改写 request.client。因此应用层再自己解析一次
X-Forwarded-For 属于重复且错误——现已删除，信任配置移到 app/server.py。
"""
from __future__ import annotations

import http.server
import json
import socket
import socketserver
import threading
import urllib.error
import urllib.request

import pytest
# Module-level on purpose: this file uses `from __future__ import annotations`,
# so FastAPI resolves the `request: Request` annotation against module globals.
# A function-local import leaves it unresolvable and FastAPI then treats
# `request` as a query parameter (422 "Field required: request").
from fastapi import FastAPI, Request

from app.interface.api.v1.routes import auth as auth_route
from app.infrastructure.config.settings import Settings


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def _build_app() -> FastAPI:
    """The real router tree, plus one probe route."""
    from app.interface.api.v1.router import v1_router

    app = FastAPI()
    app.include_router(v1_router)

    @app.get("/__ip")
    def ip(request: Request) -> dict:
        return {"ip": auth_route.client_ip(request)}

    return app


def _serve(app: FastAPI, port: int, **uvicorn_kwargs):
    import uvicorn

    cfg = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="error",
                         **uvicorn_kwargs)
    server = uvicorn.Server(cfg)
    t = threading.Thread(target=server.run, daemon=True)
    t.start()
    for _ in range(200):
        if server.started:
            return server
        threading.Event().wait(0.05)
    server.should_exit = True
    raise RuntimeError("uvicorn did not start")


def _stop(server) -> None:
    server.should_exit = True
    threading.Event().wait(0.3)


def _get(port: int, path: str, headers: dict[str, str] | None = None):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}", headers=headers or {})
    req.add_header("Accept-Encoding", "identity")
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        raise AssertionError(
            f"{path} -> HTTP {e.code}: {e.read()[:500].decode(errors='replace')}"
        ) from None


class _RealProxy(http.server.BaseHTTPRequestHandler):
    """A genuine reverse proxy, like nginx or an Ingress: it forwards the
    request and rewrites the peer address into X-Forwarded-For."""

    backend_port: int = 0

    def do_GET(self):  # noqa: N802
        try:
            prior = self.headers.get("X-Forwarded-For")
            xff = f"{prior}, {self.client_address[0]}" if prior else self.client_address[0]
            req = urllib.request.Request(
                f"http://127.0.0.1:{self.backend_port}{self.path}",
                headers={"X-Forwarded-For": xff},
            )
            with urllib.request.urlopen(req, timeout=5) as up:
                body = up.read()
                status = up.status
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.send_header("Content-Length", "0")
            self.end_headers()
        except Exception:
            self.send_response(502)
            self.send_header("Content-Length", "0")
            self.end_headers()

    def log_message(self, *_args):
        pass


def _start_proxy(backend_port: int) -> tuple[socketserver.ThreadingTCPServer, int]:
    handler = type("P", (_RealProxy,), {"backend_port": backend_port})
    port = _free_port()
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", port), handler)
    httpd.daemon_threads = True
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


# ── the property that matters ─────────────────────────────────────────────

def test_two_users_behind_a_real_proxy_get_distinct_identities():
    """反代后面的两个真实客户端必须被识别为两个人。

    未配置信任时两者都塌缩成代理 IP，限流桶合一，第 11 次登录对全公司失败。
    """
    backend_port = _free_port()
    server = _serve(
        _build_app(), backend_port,
        proxy_headers=True, forwarded_allow_ips=["127.0.0.1"],
    )
    httpd, proxy_port = _start_proxy(backend_port)
    try:
        alice = _get(proxy_port, "/__ip", {"X-Forwarded-For": "198.51.100.10"})
        bob = _get(proxy_port, "/__ip", {"X-Forwarded-For": "198.51.100.20"})
        assert alice["ip"] == "198.51.100.10"
        assert bob["ip"] == "198.51.100.20"
        assert alice["ip"] != bob["ip"]
    finally:
        httpd.shutdown()
        _stop(server)


def test_two_users_behind_a_real_proxy_collapse_when_untrusted():
    """The failure this whole feature exists to prevent, demonstrated.

    With proxy_headers off, both clients arrive as the proxy's own IP. That is
    precisely the shared-bucket outage the audit found.
    """
    backend_port = _free_port()
    server = _serve(_build_app(), backend_port, proxy_headers=False)
    httpd, proxy_port = _start_proxy(backend_port)
    try:
        a = _get(proxy_port, "/__ip", {"X-Forwarded-For": "198.51.100.10"})
        b = _get(proxy_port, "/__ip", {"X-Forwarded-For": "198.51.100.20"})
        assert a["ip"] == b["ip"] == "127.0.0.1"
    finally:
        httpd.shutdown()
        _stop(server)


# ── uvicorn owns header parsing; the app must not double-parse it ─────────

def test_app_layer_does_not_reparse_the_forwarded_header():
    """Regression lock on the bug this file found.

    An earlier implementation re-parsed X-Forwarded-For inside `client_ip`
    after uvicorn had already rewritten `request.client`. Two parsers disagree
    about what the trust boundary is, and the app-side one then took a
    *different hop* than uvicorn did.

    uvicorn returns the nearest upstream address it cannot vouch for as a
    trusted proxy (`10.0.0.1` here) — not the leftmost original client. The app
    must report exactly that; a leftmost re-parse would return `203.0.113.7`.
    """
    port = _free_port()
    server = _serve(
        _build_app(), port,
        proxy_headers=True, forwarded_allow_ips=["127.0.0.1"],
    )
    try:
        body = _get(port, "/__ip", {"X-Forwarded-For": "203.0.113.7, 10.0.0.1"})
        assert body["ip"] == "10.0.0.1"     # uvicorn's resolution, verbatim
        assert body["ip"] != "203.0.113.7"  # and NOT a leftmost re-parse
    finally:
        _stop(server)


def test_forwarded_header_is_ignored_from_an_untrusted_peer():
    """A header arriving from a peer outside forwarded_allow_ips must not move
    the identity."""
    port = _free_port()
    server = _serve(
        _build_app(), port,
        proxy_headers=True, forwarded_allow_ips=["203.0.113.99"],  # not us
    )
    try:
        body = _get(port, "/__ip", {"X-Forwarded-For": "9.9.9.9"})
        assert body["ip"] == "127.0.0.1"
    finally:
        _stop(server)


def test_no_forwarded_header_reports_the_direct_peer():
    port = _free_port()
    server = _serve(
        _build_app(), port, proxy_headers=True, forwarded_allow_ips=["127.0.0.1"],
    )
    try:
        assert _get(port, "/__ip")["ip"] == "127.0.0.1"
    finally:
        _stop(server)


# ── the entrypoint that actually wires the setting ────────────────────────

def test_server_entrypoint_wires_trusted_proxy_ips_into_uvicorn(monkeypatch):
    """`TRUSTED_PROXY_IPS` is a uvicorn setting, so it must reach uvicorn's
    config — that is the only place it has any effect."""
    from app.server import build_config

    monkeypatch.setattr(
        "app.server.get_settings",
        lambda: Settings(trusted_proxy_ips="10.0.0.0/8,192.168.1.1"),
    )
    cfg = build_config()
    assert cfg.proxy_headers is True
    assert cfg.forwarded_allow_ips == ["10.0.0.0/8", "192.168.1.1"]


def test_entrypoint_honours_cli_overrides(monkeypatch):
    """Regression: `--port` was silently dropped.

    `uvicorn.run(config)` re-wraps its first argument in a new Config, so a
    Config instance was treated as the ASGI app — the server booted on the
    default port with a TypeError on every request, and the app's lifespan
    never ran. `main()` now builds a `Server` directly.
    """
    from app.server import build_config
    import uvicorn

    monkeypatch.setattr("app.server.get_settings", lambda: Settings())
    cfg = build_config(host="127.0.0.1", port=9999, reload=False, log_level="warning")
    assert cfg.host == "127.0.0.1"
    assert cfg.port == 9999
    # And the thing we hand to Server() must be the app, not the Config.
    assert cfg.app is not None and callable(cfg.app)


def test_entrypoint_builds_a_runnable_server(monkeypatch):
    """`Server(cfg)` must accept the Config without re-wrapping — the exact
    call `main()` makes."""
    from app.server import build_config
    import uvicorn

    monkeypatch.setattr("app.server.get_settings", lambda: Settings())
    cfg = build_config()
    server = uvicorn.Server(cfg)
    assert server.config is cfg
    assert server.config.app is not None


def test_server_entrypoint_disables_proxy_headers_when_unset(monkeypatch):
    """Safe default: no trusted list means proxy headers are off entirely, so
    uvicorn never rewrites request.client and a forged header cannot dodge the
    rate limiter. `forwarded_allow_ips` keeps uvicorn's inert default — it is
    only consulted when `proxy_headers` is True."""
    from app.server import build_config

    monkeypatch.setattr("app.server.get_settings", lambda: Settings())
    cfg = build_config()
    assert cfg.proxy_headers is False
