"""查询参数名必须与前端一致。

`context` 还是 `cluster`？两边在初始提交里就各写各的，从未对齐：后端声明
`cluster: str | None = Query(...)`，前端一律发 `?context=<name>`。FastAPI 默认
忽略未知查询参数，于是用户的集群选择被静默丢弃，所有请求退回
kubeconfig 的 current-context。

之所以一直没人发现：Teleport 模式下每个会话的 kubeconfig 只有一个 context，
current-context 恰好等于用户选的那个，看起来一切正常。只有多 context 的
kubeconfig（也就是直连模式、以及真正的多集群）才会暴露。

未知参数被静默忽略是这里最阴险的一点，所以用两个方向锁死：既断言后端认
`context`，也断言 OpenAPI 里不再出现 `cluster`。
"""
from __future__ import annotations

import re

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture(scope="module")
def openapi_paths() -> dict:
    schema = create_app().openapi()
    return schema["paths"]


# These are the routes that select a kubeconfig context. Every one of them must
# accept `context`, or the cluster selector silently does nothing.
CONTEXT_ROUTES = [
    ("get", "/api/v1/namespaces"),
    ("get", "/api/v1/nodes"),
    ("get", "/api/v1/events"),
    ("get", "/api/v1/pods"),
    ("get", "/api/v1/pods/stats"),
    ("get", "/api/v1/pods/{namespace}/{name}"),
    ("get", "/api/v1/pods/{namespace}/{name}/logs"),
    ("get", "/api/v1/pods/{namespace}/{name}/logs/stream"),
    ("post", "/api/v1/ai/analyze/{namespace}/{name}"),
]

_ROUTE_IDS = [f"{m.upper()} {p}" for m, p in CONTEXT_ROUTES]


def _params(openapi_paths: dict, method: str, path: str) -> list[dict]:
    return openapi_paths[path][method].get("parameters", [])


@pytest.mark.parametrize("method,path", CONTEXT_ROUTES, ids=_ROUTE_IDS)
def test_route_accepts_context_query_param(method: str, path: str, openapi_paths: dict):
    names = {p["name"] for p in _params(openapi_paths, method, path) if p["in"] == "query"}
    assert "context" in names, f"{path} does not accept ?context= (has {sorted(names)})"


@pytest.mark.parametrize("method,path", CONTEXT_ROUTES, ids=_ROUTE_IDS)
def test_route_no_longer_declares_the_mismatched_cluster_param(
    method: str, path: str, openapi_paths: dict,
):
    """A leftover `cluster` alias is how the drift goes unnoticed next time."""
    names = {p["name"] for p in _params(openapi_paths, method, path) if p["in"] == "query"}
    assert "cluster" not in names, (
        f"{path} still declares ?cluster= while the UI sends ?context= — "
        "the selection would be silently dropped again"
    )


def test_frontend_and_backend_agree_on_the_parameter_name():
    """Pin the contract against the actual frontend source.

    Not the prettiest test, but it is the only one that can catch the two sides
    drifting apart again — a hand-written request will always agree with the
    hand-written server.
    """
    from pathlib import Path

    fe = Path(__file__).resolve().parents[3] / "frontend" / "src" / "api" / "endpoints.ts"
    if not fe.exists():      # backend-only checkout
        pytest.skip("frontend/ not present")

    src = fe.read_text()
    assert "params: { context:" in src, "frontend no longer sends ?context="
    assert "params: { cluster:" not in src, "frontend switched to ?cluster= — realign the API"


def _frontend_query_params(src: str) -> set[str]:
    """Every query-parameter key the axios layer actually sends.

    Two shapes appear in endpoints.ts: `params: { k: v, ... }` object
    literals, and `qs.set('k', v)` in the hand-built SSE URL. Blocks are
    skipped when they contain a `;` — that is a TypeScript *type* annotation
    (`params: { cluster?: string }`), where the keys are JS-side names, not
    wire names.
    """
    names: set[str] = set()
    for block in re.findall(r"params:\s*\{(.*?)\}", src, re.S):
        if ";" in block:
            continue
        # Whole-line `//` comments inside a config object are ordinary style;
        # drop them rather than forbidding them at the call site. A `//` after
        # real code is left alone so a URL literal survives.
        lines = [("" if ln[: ln.index("//")].strip() == ""
                  else ln) if "//" in ln else ln for ln in block.splitlines()]
        for part in ",".join(lines).split(","):
            if ":" in part:
                name = part.split(":")[0].strip()
                if re.fullmatch(r"\w+", name):
                    names.add(name)
    for chunk in src.split("qs.set(")[1:]:
        rest = chunk.lstrip()
        names.add(rest[1:].split(rest[0])[0])
    return names


def test_every_frontend_query_param_is_declared_by_the_server():
    """The whole class of bug, not just this one instance of it.

    `eventsApi.list` sent `involved_name` — a RESPONSE field — while the route
    declares `involved`. FastAPI dropped it, so the filter did nothing and
    nothing failed. It sat one column over from the cluster/context bug the
    tests above exist for, behind the identical mechanism.

    Rather than list names by hand (which is how the first one got missed),
    cross-check every key the frontend sends against every query parameter the
    OpenAPI spec declares. A new typo fails here.
    """
    from pathlib import Path

    fe = Path(__file__).resolve().parents[3] / "frontend" / "src" / "api" / "endpoints.ts"
    if not fe.exists():      # backend-only checkout
        pytest.skip("frontend/ not present")

    schema = create_app().openapi()
    declared: set[str] = set()
    for methods in schema["paths"].values():
        for op in methods.values():
            if not isinstance(op, dict):
                continue
            for p in op.get("parameters", []):
                if p.get("in") == "query":
                    declared.add(p["name"])

    sent = _frontend_query_params(fe.read_text())
    assert sent, "parser found nothing - the endpoints.ts shapes changed"
    unknown = sorted(sent - declared)
    assert not unknown, (
        f"frontend sends query params the server does not declare: {unknown}. "
        "FastAPI ignores unknown params, so these filters are silently dead."
    )


def test_unknown_query_param_is_ignored_as_documented():
    """A silently-ignored typo is what made this bug survive since `init`.

    Starlette ignores extra query params by default, so `?cluser=prod` looks
    like a successful request. This test documents that behaviour rather than
    changing it, so the next person to hit it knows to check the name.
    """
    app = FastAPI()

    @app.get("/x")
    def x(context: str | None = None) -> dict:
        return {"context": context}

    c = TestClient(app)
    assert c.get("/x?context=a").json() == {"context": "a"}
    # Unrecognised name: accepted, but the value is not what was sent. Exactly
    # the failure mode that hid the cluster/context mismatch.
    assert c.get("/x?cluser=a").json() == {"context": None}


@pytest.mark.parametrize("method,path", CONTEXT_ROUTES, ids=_ROUTE_IDS)
def test_legacy_cluster_param_is_refused_not_silently_ignored(
    method: str, path: str, openapi_paths: dict,
):
    """A stale client must not read the wrong cluster in silence.

    This is the boundary case of the rename. An already-open browser tab runs
    the previously-built SPA, which still sends the old name; FastAPI discards
    it, the request succeeds, and every page shows the kubeconfig's
    current-context - the wrong cluster, reported as success. The frontend
    loadClusters() re-sync covers the in-app case; nothing covers a client that
    cannot know the name changed, so the server refuses it instead.

    Path segments are filled with placeholders so what is under test is the
    dependency, not resource validation or routing.
    """
    from fastapi.testclient import TestClient

    client = TestClient(create_app())
    concrete = path.replace("{namespace}", "ns").replace("{name}", "pod")
    call = getattr(client, method.lower())
    url = concrete + "?cluster=prod-cluster"
    resp = call(url, json={}) if method == "post" else call(url)
    assert resp.status_code == 400, resp.text
    assert "?context=" in resp.json()["detail"]


def test_context_param_is_not_itself_refused():
    """The guard keys on the exact name, so the new spelling keeps working."""
    from fastapi.testclient import TestClient

    client = TestClient(create_app())
    assert client.get("/api/v1/namespaces?context=prod-cluster").status_code != 400
