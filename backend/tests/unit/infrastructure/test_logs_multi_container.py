"""Reading a pod's logs without naming a container.

The apiserver requires a container name when a pod has more than one
container — it answers 400 otherwise. The adapter used to pass
container=None straight through, so the SDK raised ApiException, the route
did not catch it, and the whole endpoint answered 500.

That never showed on a demo cluster, where every pod has one container. It
showed on the first multi-container production pod: the log panel — the
product's core surface — failed the moment it opened, with an English
"Request failed with status code 500" in a Chinese interface.

The frontend was already built for merged output (per-container tabs, a
per-container filter, per-container counts). The backend never produced it.
"""
from __future__ import annotations

import asyncio

import pytest

from app.domain.value_objects.primitives import ResourceRef
from app.infrastructure.k8s import adapter as adapter_mod

REF = ResourceRef(cluster="c", namespace="ns", kind="Pod", name="p")


class _C:
    def __init__(self, name: str) -> None:
        self.name = name


class _Spec:
    def __init__(self, containers, init_containers=()) -> None:
        self.containers = list(containers)
        self.init_containers = list(init_containers)


class _Pod:
    def __init__(self, spec) -> None:
        self.spec = spec


class _Api:
    """A pod with two containers, each with its own log lines."""

    def __init__(self, logs, containers=("mcp", "renderer")) -> None:
        self.logs = logs
        self.containers = list(containers)
        self.reads: list[str | None] = []

    def read_namespaced_pod(self, **kw):
        return _Pod(_Spec([_C(n) for n in self.containers]))

    def read_namespaced_pod_log(self, **kw):
        container = kw.get("container")
        self.reads.append(container)
        # The apiserver answers 400 for a container-less read on a
        # multi-container pod. Refuse it the way the real one does, so the
        # test fails if the adapter ever asks for one again.
        if not container:
            from kubernetes.client.exceptions import ApiException
            raise ApiException(status=400, reason="a container name is required")
        return self.logs.get(container, "")


def _repo(api) -> adapter_mod.KubernetesAdapter:
    repo = object.__new__(adapter_mod.KubernetesAdapter)
    repo._pool = type("P", (), {"get": staticmethod(lambda *a, **k: (api, "ctx"))})()
    repo._session_token = "tok"
    repo._kubeconfig_path = None
    repo._timeout = 5
    return repo


LOGS = {
    "mcp": "2026-10-21T10:00:01.000Z from mcp\n2026-10-21T10:00:03.000Z mcp again\n",
    "renderer": "2026-10-21T10:00:02.000Z from renderer\n",
}


def test_reading_without_a_container_merges_every_container():
    api = _Api(LOGS)
    entries = asyncio.run(_repo(api).read_logs(REF, None, 100, None))
    assert [e.content for e in entries] == ["from mcp", "from renderer", "mcp again"]
    assert [e.container for e in entries] == ["mcp", "renderer", "mcp"]
    # The apiserver is never asked for a container-less read.
    assert all(api.reads)


def test_the_merged_lines_are_in_time_order():
    entries = asyncio.run(_repo(_Api(LOGS)).read_logs(REF, None, 100, None))
    stamps = [e.timestamp for e in entries]
    assert stamps == sorted(stamps)


def test_naming_a_container_reads_only_that_one():
    api = _Api(LOGS)
    entries = asyncio.run(_repo(api).read_logs(REF, "renderer", 100, None))
    assert [e.content for e in entries] == ["from renderer"]
    assert api.reads == ["renderer"]


def test_a_pod_with_no_containers_reads_as_empty():
    api = _Api({}, containers=[])
    assert asyncio.run(_repo(api).read_logs(REF, None, 100, None)) == []
