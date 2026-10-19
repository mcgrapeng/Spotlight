"""真实 HTTP 跑通 409：陈旧 context 不再是 500。

场景本身就是端到端的：Alice 选了 prod-east 退出，Bob 登录后只有 staging-eu，
但浏览器 localStorage 里还留着 prod-east。每一个 K8s 请求都带着一个当前会话
kubeconfig 里不存在的 context —— 这正是原来抛 ConfigException → 500 的路径。

这里真的起 uvicorn、真的发 HTTP、真的带一份只含 staging-eu 的 kubeconfig。
TestClient 走的是内存 ASGI，端口转发、middleware 顺序、异常处理器注册这些都
要经过真实 socket 才会暴露。
"""
from __future__ import annotations

import json
import socket
import textwrap
import threading
import urllib.error
import urllib.request
from pathlib import Path

import pytest
from fastapi import FastAPI

from app.infrastructure.config.settings import Settings

KUBECONFIG = textwrap.dedent("""
    apiVersion: v1
    kind: Config
    current-context: staging-eu
    clusters:
    - name: staging
      cluster: {server: 'https://127.0.0.1:1', insecure-skip-tls-verify: true}
    contexts:
    - name: staging-eu
      context: {cluster: staging, user: u}
    users:
    - name: u
      user: {token: not-a-real-token}
""")


def _free_port() -> int:
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    port = s.getsockname()[1]
    s.close()
    return port


def _serve(app: FastAPI, port: int):
    import uvicorn

    server = uvicorn.Server(
        uvicorn.Config(app, host="127.0.0.1", port=port, log_level="error")
    )
    threading.Thread(target=server.run, daemon=True).start()
    for _ in range(200):
        if server.started:
            return server
        threading.Event().wait(0.05)
    server.should_exit = True
    raise RuntimeError("uvicorn did not start")


def _get(port: int, path: str):
    req = urllib.request.Request(f"http://127.0.0.1:{port}{path}")
    req.add_header("Accept-Encoding", "identity")
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read()[:400].decode(errors="replace")
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, body


@pytest.fixture
def live(monkeypatch, tmp_path):
    """A real server whose dev session points at a session kubeconfig holding
    exactly one context — the post-`/auth/cluster` shape."""
    kubeconfig = tmp_path / "kubeconfig.yaml"
    kubeconfig.write_text(KUBECONFIG)

    from app.infrastructure.auth import session as session_store
    from app.interface.api.v1.router import v1_router
    from app.main import create_app

    settings = Settings(kubeconfig_path=str(kubeconfig))
    monkeypatch.setattr(
        "app.infrastructure.config.settings.get_settings", lambda: settings
    )
    for mod in (
        "app.interface.api.v1.dependencies",
        "app.infrastructure.k8s.adapter",
        "app.infrastructure.auth.session",
    ):
        monkeypatch.setattr(f"{mod}.get_settings", lambda: settings, raising=False)

    session_store._sessions.clear()
    sess = session_store.dev_session()
    sess.kubeconfig_path.write_text(KUBECONFIG)

    app = create_app()
    port = _free_port()
    server = _serve(app, port)
    try:
        yield port, str(kubeconfig)
    finally:
        server.should_exit = True
        session_store._sessions.clear()


def test_stale_context_returns_409_not_500(live):
    """The headline fix. A context the session kubeconfig does not contain must
    be a 4xx the UI can react to, never a 500."""
    port, _ = live
    for path in (
        "/api/v1/namespaces?context=prod-east",
        "/api/v1/events?context=prod-east&namespace=_all&limit=10",
        "/api/v1/nodes?context=prod-east",
    ):
        status, body = _get(port, path)
        assert status == 409, f"{path} -> {status}: {body}"


def test_409_body_explains_the_resync(live):
    port, _ = live
    status, body = _get(port, "/api/v1/namespaces?context=prod-east")
    assert status == 409
    assert "unknown cluster" in json.dumps(body).lower()


def test_pool_is_not_poisoned_by_the_failed_lookup(live):
    """A rejected context must not leave a broken ApiClient cached, or the
    next good request would keep failing."""
    port, kubeconfig = live
    assert _get(port, "/api/v1/namespaces?context=prod-east")[0] == 409

    from app.infrastructure.k8s.client.pool import get_pool
    pool = get_pool()
    # Every cached client still corresponds to a context that really exists.
    for (session_token, context), cli in list(pool._clients.items()):
        assert context in ("staging-eu", ""), (
            f"a client was cached for an unusable context: {context!r}"
        )


def test_healthz_still_works(live):
    port, _ = live
    assert _get(port, "/healthz")[0] == 200
