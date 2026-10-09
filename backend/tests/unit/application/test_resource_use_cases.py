"""Tests for the focused K8s use cases — using hand-rolled fake repositories.

After the god-class split:
- PodUseCases owns list_pods + get_pod
- NamespaceUseCases owns list_namespaces
- EventUseCases owns list_events
- DashboardUseCases owns dashboard aggregation

No K8s SDK calls → fast, deterministic.
"""
import pytest

from app.application.use_cases.dashboard import DashboardUseCases
from app.application.use_cases.events import EventUseCases
from app.application.use_cases.namespaces import NamespaceUseCases
from app.application.use_cases.pods import PodUseCases
from app.domain.entities.resources import (
    Container,
    K8sEvent,
    Namespace,
    Node,
    Pod,
)
from app.domain.value_objects.primitives import ResourceRef


class FakeK8sRepo:
    """In-memory implementation of K8sRepositoryPort for testing."""

    def __init__(self) -> None:
        self.pods: list[Pod] = []
        self.nodes: list[Node] = []
        self.events: list[K8sEvent] = []
        self.namespaces: list[Namespace] = []

    async def list_clusters(self): return []
    def current_cluster(self): return None
    async def list_namespaces(self, cluster): return list(self.namespaces)

    async def list_pods(self, cluster, namespace, label_selector, search, status):
        items = self.pods
        if namespace and namespace != "_all":
            items = [p for p in items if p.namespace == namespace]
        if search:
            q = search.lower()
            items = [p for p in items if q in p.name.lower()]
        if status and status.lower() != "all":
            items = [p for p in items if p.phase.lower() == status.lower()]
        return items

    async def get_pod(self, ref):
        for p in self.pods:
            if p.name == ref.name and p.namespace == ref.namespace:
                return p
        raise KeyError(ref.name)

    async def list_events(self, cluster, namespace, involved_name, limit):
        return list(self.events)[:limit]

    async def list_nodes(self, cluster): return list(self.nodes)
    async def read_logs(self, *a, **kw): return []
    def stream_logs(self, *a, **kw):
        return iter([])


@pytest.fixture
def repo() -> FakeK8sRepo:
    repo = FakeK8sRepo()
    repo.namespaces = [
        Namespace(name="default", status="Active", labels={}, age_seconds=86400),
        Namespace(name="kube-system", status="Active", labels={}, age_seconds=86400),
    ]
    repo.pods = [
        Pod(
            name="p-ok", namespace="default", phase="Running", node="n1",
            pod_ip="10.0.0.1", age_seconds=300, created_at=None,
            containers=[Container(name="app", image="x", ready=True, state="running", restart_count=0)],
        ),
        Pod(
            name="p-crash", namespace="default", phase="CrashLoopBackOff", node="n1",
            pod_ip="10.0.0.2", age_seconds=600, created_at=None, reason="CrashLoopBackOff",
            message="back-off restarting failed container",
            containers=[Container(name="app", image="x", ready=False, state="waiting",
                                  restart_count=5, reason="CrashLoopBackOff")],
        ),
        Pod(
            name="p-search", namespace="kube-system", phase="Running", node="n2",
            pod_ip="10.0.0.3", age_seconds=900, created_at=None,
            containers=[Container(name="coredns", image="coredns:1.10", ready=True, state="running", restart_count=0)],
        ),
    ]
    repo.nodes = [
        Node(name="n1", status="Ready", roles=("worker",),
             kubelet_version="v1.30", os_image="Ubuntu 22.04",
             cpu_capacity="4", memory_capacity="8Gi",
             cpu_allocatable="3.5", memory_allocatable="7Gi",
             pod_count=2, age_seconds=86400),
    ]
    repo.events = [
        K8sEvent(name="e1", namespace="default", type="Warning", reason="BackOff",
                 message="Back-off restarting", involved_kind="Pod", involved_name="p-crash",
                 count=5, first_seen=None, last_seen="2024-01-01T00:00:00Z"),
        K8sEvent(name="e2", namespace="default", type="Normal", reason="Started",
                 message="started", involved_kind="Pod", involved_name="p-ok",
                 count=1, first_seen=None, last_seen="2024-01-01T00:00:01Z"),
        K8sEvent(name="e3", namespace="kube-system", type="Warning", reason="FailedMount",
                 message="Unable to attach volumes", involved_kind="Pod", involved_name="p-search",
                 count=3, first_seen=None, last_seen="2024-01-01T00:00:00Z"),
    ]
    return repo


# ── PodUseCases ──────────────────────────────────────────────────────────
async def test_list_pods_all(repo):
    uc = PodUseCases(repo)
    result = await uc.list_pods(None, None, "all", None, None)
    assert result.total == 3
    assert result.items[0].namespace == "default"
    assert result.items[0].name == "p-crash"


async def test_list_pods_filter_namespace(repo):
    uc = PodUseCases(repo)
    result = await uc.list_pods(None, "kube-system", "all", None, None)
    assert result.total == 1
    assert result.items[0].name == "p-search"


async def test_list_pods_filter_search(repo):
    uc = PodUseCases(repo)
    result = await uc.list_pods(None, None, "all", "crash", None)
    assert result.total == 1
    assert result.items[0].name == "p-crash"


async def test_list_pods_filter_status(repo):
    uc = PodUseCases(repo)
    result = await uc.list_pods(None, None, "Running", None, None)
    assert result.total == 2


async def test_get_pod_success(repo):
    uc = PodUseCases(repo)
    ref = ResourceRef(cluster="", namespace="default", kind="Pod", name="p-ok")
    p = await uc.get_pod(ref)
    assert p.name == "p-ok"
    assert p.phase == "Running"


async def test_get_pod_not_found(repo):
    uc = PodUseCases(repo)
    ref = ResourceRef(cluster="", namespace="default", kind="Pod", name="missing")
    with pytest.raises(KeyError):
        await uc.get_pod(ref)


# ── DashboardUseCases ───────────────────────────────────────────────────
async def test_dashboard_aggregates(repo):
    uc = DashboardUseCases(repo)
    d = await uc.build(None)
    assert d.total_pods == 3
    assert d.running == 2
    assert d.failed == 0
    assert d.warning_events == 2
    assert d.nodes_total == 1
    assert d.nodes_ready == 1
    assert d.namespaces_count == 2
    assert d.restart_top[0].restarts == 5
    assert d.restart_top[0].pod == "default/p-crash"


# ── EventUseCases ───────────────────────────────────────────────────────
async def test_events_sorted_by_recency(repo):
    uc = EventUseCases(repo)
    out = await uc.list_events(None, None, None, 10)
    assert out[0].type == "Normal"  # more recent
    assert out[1].type == "Warning"


# ── NamespaceUseCases ───────────────────────────────────────────────────
async def test_list_namespaces(repo):
    uc = NamespaceUseCases(repo)
    ns = await uc.list_namespaces(None)
    assert [n.name for n in ns] == ["default", "kube-system"]