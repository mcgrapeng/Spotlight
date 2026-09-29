"""Dashboard use case: aggregate pods/nodes/events/namespaces into one snapshot."""
from __future__ import annotations

import asyncio
from collections import Counter

from app.application.dto import DashboardOut, EventOut
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.value_objects.primitives import LabelSelector


class DashboardUseCases:
    def __init__(self, k8s: K8sRepositoryPort) -> None:
        # ponytail: dashboard reuses the K8s repo directly (no extra use-case
        # indirection for what is fundamentally parallel K8s fetches).
        self._k8s = k8s

    async def build(self, cluster: str | None) -> DashboardOut:
        pods, nodes, events, namespaces = await asyncio.gather(
            self._k8s.list_pods(cluster, None, LabelSelector(), None, None),
            self._k8s.list_nodes(cluster),
            self._k8s.list_events(cluster, None, None, 500),
            self._k8s.list_namespaces(cluster),
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