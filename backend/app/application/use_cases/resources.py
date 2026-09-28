"""Resource use cases: clusters, namespaces, pods, nodes, events."""
from __future__ import annotations

from collections import Counter

from app.application.dto import DashboardDTO, NamespaceDTO, NodeDTO, PodDTO, PodListDTO, EventDTO
from app.application.ports.outbound import K8sRepositoryPort
from app.application.use_cases.mappers import (
    event_to_dto,
    namespace_to_dto,
    node_to_dto,
    pod_to_dto,
)
from app.domain.value_objects.primitives import LabelSelector, ResourceRef


class ResourceUseCases:
    def __init__(self, repo: K8sRepositoryPort):
        self._repo = repo

    # Cluster
    def list_clusters(self) -> list[dict]:
        return [
            {
                "name": c.name, "cluster": c.server, "user": c.user,
                "namespace": c.default_namespace, "is_current": c.is_current,
            }
            for c in self._repo.list_clusters()
        ]

    def current_cluster(self) -> str | None:
        return self._repo.current_cluster()

    # Namespace
    def list_namespaces(self, cluster: str | None) -> list[NamespaceDTO]:
        return [namespace_to_dto(n) for n in self._repo.list_namespaces(cluster)]

    # Pod
    def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None, label_selector: str | None,
    ) -> PodListDTO:
        selector = LabelSelector.parse(label_selector)
        pods = self._repo.list_pods(cluster, namespace, selector, search, status)
        items = [pod_to_dto(p) for p in pods]
        items.sort(key=lambda p: (p.namespace, p.name))
        return PodListDTO(total=len(items), items=items)

    def get_pod(self, ref: ResourceRef) -> PodDTO:
        return pod_to_dto(self._repo.get_pod(ref))

    # Nodes
    def list_nodes(self, cluster: str | None) -> list[NodeDTO]:
        return [node_to_dto(n) for n in self._repo.list_nodes(cluster)]

    # Events
    def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventDTO]:
        events = self._repo.list_events(cluster, namespace, involved, limit)
        events.sort(key=lambda e: e.last_seen or "", reverse=True)
        return [event_to_dto(e) for e in events[:limit]]

    # Dashboard
    def dashboard(self, cluster: str | None) -> DashboardDTO:
        pods = self._repo.list_pods(cluster, None, LabelSelector(), None, None)
        nodes = self._repo.list_nodes(cluster)
        events = self._repo.list_events(cluster, None, None, 500)
        namespaces = self._repo.list_namespaces(cluster)

        phase_counter = Counter(p.phase for p in pods)
        restart_top = sorted(
            ((f"{p.namespace}/{p.name}", p.total_restarts) for p in pods if p.total_restarts > 0),
            key=lambda x: x[1], reverse=True,
        )[:10]

        return DashboardDTO(
            total_pods=len(pods),
            running=phase_counter.get("Running", 0),
            pending=phase_counter.get("Pending", 0),
            failed=phase_counter.get("Failed", 0),
            succeeded=phase_counter.get("Succeeded", 0),
            # ponytail: 告警数 = 告警源条目数（与 /events 列表行数一致）。单条 event 的
# count 字段（重复触发次数）保留在 row 内部显示，全局计数不重复加总 —— 避免
# badge / Dashboard 与用户实际看到的行数对不上。
warning_events=sum(1 for e in events if e.is_warning),
            nodes_total=len(nodes),
            nodes_ready=sum(1 for n in nodes if n.is_ready),
            namespaces_count=len(namespaces),
            restart_top=[{"pod": k, "restarts": v} for k, v in restart_top],
        )
