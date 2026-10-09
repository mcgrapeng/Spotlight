"""Integration tests for FastAPI HTTP layer.

Override DI with fake repositories — no K8s SDK, no DB, no network.
"""
from dataclasses import replace
from typing import Iterator

import pytest
from fastapi.testclient import TestClient

from app.application.dto import LogStreamParams
from app.application.use_cases.favorites import FavoriteUseCases
from app.domain.entities.ai import AIAnalysisResult, AIProviderConfig, Favorite
from app.domain.entities.resources import (
    Container, K8sEvent, LogEntry, Namespace, Node, Pod,
)
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.infrastructure.cache.ttl_cache import invalidate_all
from app.interface.api.v1.dependencies import ai_repo, favorite_uc, k8s_repo
from app.main import app


# ── In-memory adapters ──────────────────────────────────────────────────────
class FakeK8s:
    def __init__(self) -> None:
        self.pods = [
            Pod(name="p1", namespace="default", phase="Running", node="n1",
                pod_ip="10.0.0.1", age_seconds=60, created_at=None,
                containers=[Container(name="app", image="x", ready=True, state="running", restart_count=0)]),
        ]
        self.namespaces = [Namespace(name="default", status="Active", labels={}, age_seconds=3600)]
        self.nodes = [Node(name="n1", status="Ready", roles=("worker",), kubelet_version="v1.30",
                            os_image="Ubuntu", cpu_capacity="4", memory_capacity="8Gi",
                            cpu_allocatable="3", memory_allocatable="7Gi",
                            pod_count=1, age_seconds=86400)]
        self.events = [
            K8sEvent(name="e1", namespace="default", type="Warning", reason="BackOff",
                     message="oops", involved_kind="Pod", involved_name="p1",
                     count=2, first_seen="2024-01-01T00:00:00Z", last_seen="2024-01-01T00:00:00Z"),
        ]
        self.log_lines = ["INFO x", "ERROR y", "DEBUG z"]

    async def list_clusters(self):
        return []

    def current_cluster(self):
        return "default"

    async def list_namespaces(self, cluster):
        return self.namespaces

    async def list_pods(self, cluster, namespace, label_selector: LabelSelector, search, status):
        return self.pods

    async def get_pod(self, ref: ResourceRef):
        return next(p for p in self.pods if p.name == ref.name)

    async def list_events(self, cluster, namespace, involved_name, limit):
        return self.events

    async def list_nodes(self, cluster):
        return self.nodes

    async def read_logs(self, ref, container, tail_lines, since):
        if since:
            # honour the adapter contract: garbage `since` raises ValueError
            from app.infrastructure.k8s.adapter import _since_to_seconds
            _since_to_seconds(since)
        return [LogEntry(timestamp="", content=l, container=container or "") for l in self.log_lines[:tail_lines]]

    def stream_logs(self, ref, container, tail_lines, stop_event=None) -> Iterator[LogEntry]:
        return iter([LogEntry(timestamp="", content=l, container=container or "") for l in self.log_lines])


class FakeAIProviderRepo:
    def __init__(self) -> None:
        self._id = 0
        self._store: dict[int, AIProviderConfig] = {}

    async def list_providers(self): return list(self._store.values())
    async def get_provider(self, pid): return self._store.get(pid)
    async def add_provider(self, cfg):
        self._id += 1
        saved = replace(cfg, id=self._id)
        self._store[self._id] = saved
        return saved
    async def update_provider(self, cfg):
        self._store[cfg.id] = cfg
        return cfg
    async def remove_provider(self, pid):
        return self._store.pop(pid, None) is not None
    async def set_default(self, pid):
        self._store[pid] = replace(self._store[pid], is_default=True)
        return self._store[pid]

    async def analyze(self, cfg, req):
        return AIAnalysisResult(
            answer=f"diagnostic for {req.pod_ref.name}",
            model=cfg.model, latency_ms=12, input_tokens=5, output_tokens=3,
        )


class FakeFavRepo:
    def __init__(self) -> None:
        self._id = 0
        self._store: dict[int, Favorite] = {}

    async def list(self):
        return sorted(self._store.values(), key=lambda f: f.id or 0, reverse=True)

    async def add(self, fav):
        self._id += 1
        saved = replace(fav, id=self._id)
        self._store[self._id] = saved
        return saved

    async def remove(self, fav_id: int):
        return self._store.pop(fav_id, None) is not None


# ── Fixtures ────────────────────────────────────────────────────────────────
@pytest.fixture(autouse=True)
def _clear_caches():
    invalidate_all()
    yield
    invalidate_all()


@pytest.fixture
def client():
    fake_k8s = FakeK8s()
    fake_fav = FakeFavRepo()
    fake_ai = FakeAIProviderRepo()

    app.dependency_overrides[k8s_repo] = lambda: fake_k8s
    app.dependency_overrides[ai_repo] = lambda: fake_ai
    app.dependency_overrides[favorite_uc] = lambda: FavoriteUseCases(fake_fav)

    yield TestClient(app)
    app.dependency_overrides.clear()


# ── Tests ──────────────────────────────────────────────────────────────────
def test_health(client):
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_list_pods(client):
    r = client.get("/api/v1/pods")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 1
    assert body["items"][0]["name"] == "p1"


def test_pod_detail(client):
    r = client.get("/api/v1/pods/default/p1")
    assert r.status_code == 200
    assert r.json()["phase"] == "Running"


def test_pod_detail_maps_entity_fields(client):
    """regression: restart_count / age / owner used to silently serialize as
    0 / None / None (DTO field names didn't match the entity)."""
    r = client.get("/api/v1/pods/default/p1")
    body = r.json()
    assert body["restart_count"] == 0
    assert body["age"] == "1m"


def test_dashboard(client):
    r = client.get("/api/v1/pods/stats")
    assert r.status_code == 200
    body = r.json()
    assert body["total_pods"] == 1
    assert body["warning_events"] == 1


def test_list_events(client):
    r = client.get("/api/v1/events")
    assert r.status_code == 200
    assert r.json()[0]["type"] == "Warning"


def test_history_logs_classified(client):
    r = client.get("/api/v1/pods/default/p1/logs?tail_lines=10")
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 3
    assert [i["severity"] for i in body["items"]] == ["info", "error", "debug"]


def test_history_logs_rejects_bad_since(client):
    r = client.get("/api/v1/pods/default/p1/logs?since=not-a-time")
    assert r.status_code == 400


def test_favorite_lifecycle(client):
    r = client.post("/api/v1/favorites", json={"resource_type": "pod", "name": "p1", "namespace": "default"})
    assert r.status_code == 201
    fid = r.json()["id"]
    assert fid == 1

    r2 = client.get("/api/v1/favorites")
    assert r2.status_code == 200
    assert len(r2.json()) == 1

    r3 = client.delete(f"/api/v1/favorites/{fid}")
    assert r3.status_code == 204
    assert client.get("/api/v1/favorites").json() == []


def test_favorite_invalid_resource_type(client):
    r = client.post("/api/v1/favorites", json={"resource_type": "bogus", "name": "x"})
    assert r.status_code == 422


def test_favorite_missing_namespace_for_pod(client):
    r = client.post("/api/v1/favorites", json={"resource_type": "pod", "name": "p1"})
    assert r.status_code == 400


def test_ai_provider_create_and_analyze(client):
    r = client.post("/api/v1/ai/providers", json={
        "name": "OpenAI", "provider": "openai", "model": "gpt-4o-mini",
        "api_key": "sk-abc", "is_default": True,
    })
    assert r.status_code == 201
    body = r.json()
    assert body["api_key_masked"].startswith("***") or body["api_key_masked"].startswith("sk-a")
    assert "sk-abc" not in body["api_key_masked"]  # secret never echoed

    r2 = client.post(
        "/api/v1/ai/analyze/default/p1",
        json={"provider_id": 1, "log_lines": ["ERROR oops"], "question": "why?"},
    )
    assert r2.status_code == 200
    out = r2.json()
    assert "diagnostic" in out["answer"]
    assert out["model"] == "gpt-4o-mini"


def test_ai_single_active_enforced(client):
    r1 = client.post("/api/v1/ai/providers", json={
        "name": "A", "provider": "openai", "model": "m", "api_key": "k", "enabled": True,
    })
    assert r1.status_code == 201
    r2 = client.post("/api/v1/ai/providers", json={
        "name": "B", "provider": "openai", "model": "m", "api_key": "k", "enabled": True,
    })
    assert r2.status_code == 409
