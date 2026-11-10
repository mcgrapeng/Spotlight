"""A filtered node list must not be reported as "this cluster has no nodes".

Teleport's `kubernetes_resources` cuts resources by role. Without `nodes`
read access, `list_node` does not answer 403 — it answers **an empty
array**. So the adapter returned `[]`, the API answered `200 []`, and the
frontend rendered "this cluster has not registered any node".

For an operations tool that is the worst kind of wrong: it states a fact
about the cluster that is false, and the reader has no way to tell a
permission boundary from a healthy-but-empty cluster. The pods tell the
truth — 78 pods, all with a `spec.nodeName`, on 3 nodes the list call
never mentioned.

The adapter now detects that shape (empty node list + pods referencing
node names) and raises 403, so the existing error mapping answers with a
permission denial instead of a silent empty list.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from kubernetes.client.exceptions import ApiException

from app.infrastructure.k8s.adapter import KubernetesAdapter
from app.interface.api.v1.dependencies import k8s_repo
from app.main import app


# ── fakes ──────────────────────────────────────────────────────────────────

class _FakeNode:
    def __init__(self, name: str) -> None:
        self.metadata = type("M", (), {
            "name": name, "creation_timestamp": None, "labels": {},
        })()
        self.status = type("S", (), {
            "conditions": None, "capacity": {}, "allocatable": {},
            "node_info": None,
        })()
        self.spec = type("SP", (), {"node_name": name})()


class _FakePod:
    def __init__(self, node_name: str | None) -> None:
        self.spec = type("SP", (), {"node_name": node_name})()


class _FakeList:
    def __init__(self, items) -> None:
        self.items = items


class _FakeApi:
    """A CoreV1Api whose list_node/list_pod return canned results."""

    def __init__(self, nodes, pods) -> None:
        self._nodes = nodes
        self._pods = pods

    def list_node(self, **_kw):
        return _FakeList(self._nodes)

    def list_pod_for_all_namespaces(self, **_kw):
        return _FakeList(self._pods)


class _FakePool:
    def __init__(self, api) -> None:
        self._api = api

    def get(self, *_a, **_kw):
        return self._api, "fake-context"


def _adapter(nodes, pods) -> KubernetesAdapter:
    ad = KubernetesAdapter(session_token="t", kubeconfig_path=None)
    ad._pool = _FakePool(_FakeApi(nodes, pods))
    return ad


# ── the detection ──────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_empty_node_list_with_pods_on_nodes_raises_403():
    """The shape that matters: 0 nodes listed, pods on 3 nodes."""
    pods = [_FakePod("izuf66fi30um86795xndnpz") for _ in range(36)]
    pods += [_FakePod("izuf61fgelb6a8mse0avpxz") for _ in range(26)]
    ad = _adapter(nodes=[], pods=pods)

    with pytest.raises(ApiException) as exc:
        await ad.list_nodes(None)
    assert exc.value.status == 403


@pytest.mark.asyncio
async def test_a_cluster_that_really_has_no_nodes_stays_empty():
    """No nodes AND no pod on any node → genuinely empty, not a denial."""
    ad = _adapter(nodes=[], pods=[_FakePod(None)])

    assert await ad.list_nodes(None) == []


@pytest.mark.asyncio
async def test_a_cluster_with_nodes_is_unaffected():
    """The normal path must not raise."""
    ad = _adapter(nodes=[_FakeNode("node-a")], pods=[_FakePod("node-a")])

    nodes = await ad.list_nodes(None)
    assert len(nodes) == 1
    assert nodes[0].name == "node-a"
    assert nodes[0].pod_count == 1


@pytest.mark.asyncio
async def test_unreadable_pods_do_not_fake_a_denial():
    """Pods the caller may not list must not turn "no nodes" into "denied".

    A pod list that is empty because of RBAC looks exactly like a pod
    list that is empty because nothing is scheduled. Claiming a permission
    denial we cannot prove is worse than the empty list we are replacing.
    """
    ad = _adapter(nodes=[], pods=[])

    assert await ad.list_nodes(None) == []


# ── what the API answers ───────────────────────────────────────────────────

class _DeniedNodes:
    async def list_nodes(self, *a, **k):
        raise ApiException(status=403, reason="Forbidden")


@pytest.fixture
def denied_client():
    app.dependency_overrides[k8s_repo] = lambda: _DeniedNodes()
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_the_api_answers_403_not_an_empty_list(denied_client):
    r = denied_client.get("/api/v1/nodes")
    assert r.status_code == 403, r.text
    assert "权限" in r.json()["detail"]
