"""Resource use cases: clusters, namespaces, pods, nodes, events."""
from __future__ import annotations

import asyncio
from collections import Counter

from app.application.ports.outbound import K8sRepositoryPort
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.interface.api.v1.schemas import (
    DashboardOut,
    EventOut,
    NamespaceOut,
    NodeOut,
    PodListOut,
    PodOut,
)


class ResourceUseCases:
    def __init__(self, repo: K8sRepositoryPort):
        self._repo = repo

    # Cluster
    async def list_clusters(self) -> list[dict]:
        clusters = await self._repo.list_clusters()
        return [
            {
                "name": c.name, "cluster": c.server, "user": c.user,
                "namespace": c.default_namespace, "is_current": c.is_current,
            }
            for c in clusters
        ]

    def current_cluster(self) -> str | None:
        return self._repo.current_cluster()

    # Ponytail: 用 Pydantic.from_attributes 直接从 domain entity 构建 schema,
    # 删了 7 个手写 mapper 函数 + 5 个 DTO 类 (~185 行)。
    async def list_namespaces(self, cluster: str | None) -> list[NamespaceOut]:
        ns = await self._repo.list_namespaces(cluster)
        return [NamespaceOut.model_validate(n) for n in ns]

    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None, label_selector: str | None,
    ) -> PodListOut:
        selector = LabelSelector.parse(label_selector)
        pods = await self._repo.list_pods(cluster, namespace, selector, search, status)
        items = sorted(
            (PodOut.model_validate(p) for p in pods),
            key=lambda p: (p.namespace, p.name),
        )
        return PodListOut(total=len(items), items=items)

    async def get_pod(self, ref: ResourceRef) -> PodOut:
        return PodOut.model_validate(await self._repo.get_pod(ref))

    async def list_nodes(self, cluster: str | None) -> list[NodeOut]:
        nds = await self._repo.list_nodes(cluster)
        return [NodeOut.model_validate(n) for n in nds]

    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventOut]:
        events = await self._repo.list_events(cluster, namespace, involved, limit)
        events.sort(key=lambda e: e.last_seen or "", reverse=True)
        return [EventOut.model_validate(e) for e in events[:limit]]

    async def dashboard(self, cluster: str | None) -> DashboardOut:
        pods_task = asyncio.create_task(
            self._repo.list_pods(cluster, None, LabelSelector(), None, None)
        )
        nodes_task = asyncio.create_task(self._repo.list_nodes(cluster))
        events_task = asyncio.create_task(
            self._repo.list_events(cluster, None, None, 500)
        )
        namespaces_task = asyncio.create_task(
            self._repo.list_namespaces(cluster)
        )
        pods, nodes, events, namespaces = await asyncio.gather(
            pods_task, nodes_task, events_task, namespaces_task,
        )

        phase_counter = Counter(p.phase for p in pods)
        restart_top = sorted(
            ((f"{p.namespace}/{p.name}", p.total_restarts) for p in pods if p.total_restarts > 0),
            key=lambda x: x[1], reverse=True,
        )[:10]

        recent_warns = [e for e in events if e.is_warning][:8]

        return DashboardOut(
            total_pods=len(pods),
            running=phase_counter.get("Running", 0),
            pending=phase_counter.get("Pending", 0),
            failed=phase_counter.get("Failed", 0),
            succeeded=phase_counter.get("Succeeded", 0),
            warning_events=sum(1 for e in events if e.is_warning),
            nodes_total=len(nodes),
            nodes_ready=sum(1 for n in nodes if n.is_ready),
            namespaces_count=len(namespaces),
            restart_top=[{"pod": k, "restarts": v} for k, v in restart_top],
            recent_warns=[EventOut.model_validate(e) for e in recent_warns],
        )