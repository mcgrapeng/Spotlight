"""Adapter: implements K8sRepositoryPort by delegating to the kubernetes SDK + mappers."""
from __future__ import annotations

from typing import Iterator, Optional

from kubernetes import watch

from app.application.ports.outbound import K8sRepositoryPort
from app.domain.entities.resources import Cluster, K8sEvent, LogEntry, Namespace, Node, Pod
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.k8s.mapper.mappers import (
    map_event,
    map_namespace,
    map_node,
    map_pod,
)


class KubernetesAdapter(K8sRepositoryPort):
    def __init__(self) -> None:
        self._pool = get_pool()
        self._timeout = get_settings().k8s_request_timeout

    # ── cluster ──────────────────────────────────────────────
    def list_clusters(self) -> list[Cluster]:
        return [
            Cluster(
                name=c["name"], server=c.get("server", ""), user=c["user"],
                default_namespace=c["namespace"], is_current=c["is_current"],
            )
            for c in self._pool.list_contexts()
        ]

    def current_cluster(self) -> str | None:
        return self._pool.current()

    # ── namespaces ───────────────────────────────────────────
    def list_namespaces(self, cluster: Optional[str]) -> list[Namespace]:
        api, ctx = self._pool.get(cluster)
        result = api.list_namespace(_request_timeout=self._timeout)
        return [map_namespace(n, cluster=ctx) for n in result.items]

    # ── pods ─────────────────────────────────────────────────
    def list_pods(
        self, cluster: Optional[str], namespace: Optional[str],
        label_selector: LabelSelector, search: Optional[str], status: Optional[str],
    ) -> list[Pod]:
        api, ctx = self._pool.get(cluster)
        kw: dict = {"_request_timeout": self._timeout}
        if namespace and namespace != "_all":
            kw["namespace"] = namespace
        if label_selector.pairs:
            kw["label_selector"] = label_selector.to_query()
        if namespace and namespace != "_all":
            items = api.list_namespaced_pod(**kw).items
        else:
            items = api.list_pod_for_all_namespaces(**kw).items

        pods = [map_pod(p, cluster=ctx) for p in items]
        if status and status.lower() != "all":
            pods = [p for p in pods if p.phase.lower() == status.lower()]
        if search:
            q = search.lower()
            pods = [
                p for p in pods
                if q in p.name.lower()
                or any(q in c.name.lower() for c in p.containers)
                or (p.node and q in p.node.lower())
            ]
        return pods

    def get_pod(self, ref: ResourceRef) -> Pod:
        api, ctx = self._pool.get(ref.cluster or None)
        obj = api.read_namespaced_pod(name=ref.name, namespace=ref.namespace, _request_timeout=self._timeout)
        return map_pod(obj, cluster=ctx)

    # ── events ───────────────────────────────────────────────
    def list_events(
        self, cluster: Optional[str], namespace: Optional[str],
        involved_name: Optional[str], limit: int,
    ) -> list[K8sEvent]:
        api, _ = self._pool.get(cluster)
        kw = {"_request_timeout": self._timeout, "limit": limit}
        if namespace and namespace != "_all":
            items = api.list_namespaced_event(namespace=namespace, **kw).items
        else:
            items = api.list_event_for_all_namespaces(**kw).items
        events = [map_event(e) for e in items]
        if involved_name:
            events = [e for e in events if e.involved_name == involved_name]
        return events

    # ── nodes ────────────────────────────────────────────────
    def list_nodes(self, cluster: Optional[str]) -> list[Node]:
        api, ctx = self._pool.get(cluster)
        nodes = api.list_node(_request_timeout=self._timeout).items
        pods = api.list_pod_for_all_namespaces(_request_timeout=self._timeout).items
        pod_count: dict[str, int] = {}
        for p in pods:
            if p.spec.node_name:
                pod_count[p.spec.node_name] = pod_count.get(p.spec.node_name, 0) + 1
        return [map_node(n, pod_count=pod_count.get(n.metadata.name, 0), cluster=ctx) for n in nodes]

    # ── logs ─────────────────────────────────────────────────
    def read_logs(
        self, ref: ResourceRef, container: Optional[str],
        tail_lines: int, since: Optional[str],
    ) -> list[LogEntry]:
        api, _ = self._pool.get(ref.cluster or None)
        kw = {
            "name": ref.name, "namespace": ref.namespace,
            "container": container, "tail_lines": tail_lines,
            "_request_timeout": self._timeout,
        }
        if since:
            kw["since_seconds"] = _since_to_seconds(since)
        try:
            content = api.read_namespaced_pod_log(**kw)
        except TypeError:
            kw.pop("since_seconds", None)
            content = api.read_namespaced_pod_log(**kw)
        return [
            LogEntry(timestamp=line[:30] if line else "", content=line, container=container or "")
            for line in (content or "").splitlines()
        ]

    def stream_logs(
        self, ref: ResourceRef, container: Optional[str], tail_lines: int,
    ) -> Iterator[LogEntry]:
        api, _ = self._pool.get(ref.cluster or None)
        w = watch.Watch()
        try:
            for line in w.stream(
                api.read_namespaced_pod_log,
                name=ref.name, namespace=ref.namespace,
                container=container, tail_lines=tail_lines,
                follow=True, _request_timeout=3600,
            ):
                yield LogEntry(timestamp=line[:30] if line else "", content=line, container=container or "")
        except StopIteration:
            return


def _since_to_seconds(since: str) -> int:
    """Coarse 'since' parser. Accepts ISO8601 timestamp or '5m' / '2h' style."""
    import re
    m = re.match(r"^(\d+)([smhd])$", since.strip())
    if m:
        n = int(m.group(1))
        unit = m.group(2)
        return {"s": n, "m": n * 60, "h": n * 3600, "d": n * 86400}[unit]
    # ISO timestamp — fall back to delta vs now (best-effort)
    from datetime import datetime, timezone
    from dateutil import parser as dtparser
    try:
        dt = dtparser.isoparse(since)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return max(1, int((datetime.now(timezone.utc) - dt).total_seconds()))
    except (ValueError, TypeError):
        return 0
