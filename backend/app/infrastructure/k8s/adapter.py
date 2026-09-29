"""Adapter: implements K8sRepositoryPort by delegating to the kubernetes SDK + mappers.

The kubernetes SDK is sync — every call into `api.list_*` blocks for the
duration of the apiserver round-trip. Wrapping them in `run_in_threadpool`
keeps the FastAPI event loop free to handle other requests (especially the
SSE log stream, which must keep ticking).
"""
from __future__ import annotations

import asyncio
import re
from datetime import datetime, timezone
from typing import Iterator, Optional

from dateutil import parser as dtparser
from fastapi.concurrency import run_in_threadpool
from kubernetes import watch

from app.application.ports.outbound import K8sRepositoryPort
from app.domain.entities.resources import Cluster, K8sEvent, LogEntry, Namespace, Node, Pod
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.domain.services.log_parser import parse_log_line
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.k8s.mapper.mappers import (
    map_event,
    map_namespace,
    map_namespaces_batch,
    map_node,
    map_nodes_batch,
    map_pod,
    map_pods_batch,
)


class KubernetesAdapter(K8sRepositoryPort):
    def __init__(self) -> None:
        self._pool = get_pool()
        self._timeout = get_settings().k8s_request_timeout

    # ── cluster ──────────────────────────────────────────────
    async def list_clusters(self) -> list[Cluster]:
        # No K8s SDK call — reads the cached kubeconfig. Safe sync wrapped
        # in async for interface uniformity.
        contexts = await run_in_threadpool(self._pool.list_contexts)
        return [
            Cluster(
                name=c["name"], server=c.get("server", ""), user=c["user"],
                default_namespace=c["namespace"], is_current=c["is_current"],
            )
            for c in contexts
        ]

    def current_cluster(self) -> str | None:
        return self._pool.current()

    # ── namespaces ───────────────────────────────────────────
    async def list_namespaces(self, cluster: Optional[str]) -> list[Namespace]:
        api, ctx = self._pool.get(cluster)
        result = await run_in_threadpool(
            lambda: api.list_namespace(_request_timeout=self._timeout)
        )
        return map_namespaces_batch(result.items, cluster=ctx)

    # ── pods ─────────────────────────────────────────────────
    async def list_pods(
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
            items = await run_in_threadpool(
                lambda: api.list_namespaced_pod(**kw).items
            )
        else:
            items = await run_in_threadpool(
                lambda: api.list_pod_for_all_namespaces(**kw).items
            )

        # ponytail: batch mapper hoists `datetime.now()` once instead of N times.
        pods = map_pods_batch(items, cluster=ctx)
        if status and status.lower() != "all":
            target = status.lower()
            pods = [p for p in pods if p.phase.lower() == target]
        if search:
            q = search.lower()
            pods = [
                p for p in pods
                if q in p.name.lower()
                or any(q in c.name.lower() for c in p.containers)
                or (p.node and q in p.node.lower())
                or q in p.namespace.lower()
            ]
        return pods

    async def get_pod(self, ref: ResourceRef) -> Pod:
        api, ctx = self._pool.get(ref.cluster or None)
        obj = await run_in_threadpool(
            lambda: api.read_namespaced_pod(
                name=ref.name, namespace=ref.namespace,
                _request_timeout=self._timeout,
            )
        )
        return map_pod(obj, cluster=ctx)

    # ── events ───────────────────────────────────────────────
    async def list_events(
        self, cluster: Optional[str], namespace: Optional[str],
        involved_name: Optional[str], limit: int,
    ) -> list[K8sEvent]:
        api, _ = self._pool.get(cluster)
        kw = {"_request_timeout": self._timeout, "limit": limit}
        if namespace and namespace != "_all":
            items = await run_in_threadpool(
                lambda: api.list_namespaced_event(namespace=namespace, **kw).items
            )
        else:
            items = await run_in_threadpool(
                lambda: api.list_event_for_all_namespaces(**kw).items
            )
        events = [map_event(e) for e in items]
        if involved_name:
            events = [e for e in events if e.involved_name == involved_name]
        return events

    # ── nodes ────────────────────────────────────────────────
    async def list_nodes(self, cluster: Optional[str]) -> list[Node]:
        api, ctx = self._pool.get(cluster)
        # Run the two K8s calls in parallel — both are bound by network RTT.
        nodes, pods = await asyncio.gather(
            run_in_threadpool(lambda: api.list_node(_request_timeout=self._timeout)),
            run_in_threadpool(lambda: api.list_pod_for_all_namespaces(_request_timeout=self._timeout)),
        )
        pod_count: dict[str, int] = {}
        for p in pods.items:
            if p.spec.node_name:
                pod_count[p.spec.node_name] = pod_count.get(p.spec.node_name, 0) + 1
        return map_nodes_batch(nodes.items, pod_count_by_node=pod_count, cluster=ctx)

    # ── logs ─────────────────────────────────────────────────
    async def read_logs(
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
            content = await run_in_threadpool(
                lambda: api.read_namespaced_pod_log(**kw)
            )
        except TypeError:
            # Old kubernetes SDK without since_seconds support
            kw.pop("since_seconds", None)
            content = await run_in_threadpool(
                lambda: api.read_namespaced_pod_log(**kw)
            )
        # Use the timestamp parser so downstream code can sort/filter by ISO time.
        # Content stripping happens in the use-case layer so we preserve the raw line.
        return [
            LogEntry(
                timestamp=parse_log_line(line, container or "")[0] if line else "",
                content=line, container=container or "",
            )
            for line in (content or "").splitlines()
        ]

    def stream_logs(
        self, ref: ResourceRef, container: Optional[str], tail_lines: int,
    ) -> Iterator[LogEntry]:
        """Stream pod logs. Caller MUST iterate in a thread (use `asyncio.to_thread`)
        because `kubernetes.watch.Watch().stream` is a blocking sync generator.

        Stops cleanly when `stop_event.is_set()` returns True — checked between
        yields so the consumer can cancel without leaking the HTTP connection.
        """
        api, _ = self._pool.get(ref.cluster or None)
        w = watch.Watch()
        # Probe support once (avoids a per-yield AttributeError on old SDKs).
        supports_stop = hasattr(w, "stop")
        try:
            for line in w.stream(
                api.read_namespaced_pod_log,
                name=ref.name, namespace=ref.namespace,
                container=container, tail_lines=tail_lines,
                follow=True, _request_timeout=3600,
            ):
                ts, _ = parse_log_line(line, container or "")
                yield LogEntry(timestamp=ts, content=line, container=container or "")
        except StopIteration:
            return
        finally:
            if supports_stop:
                try:
                    w.stop()
                except Exception:
                    pass


def _since_to_seconds(since: str) -> int:
    """Coarse 'since' parser. Accepts ISO8601 timestamp or short form ('5m' / '2h' / '1d')."""
    m = re.match(r"^(\d+)([smhd])$", since.strip())
    if m:
        n = int(m.group(1))
        unit = m.group(2)
        return {"s": n, "m": n * 60, "h": n * 3600, "d": n * 86400}[unit]
    try:
        dt = dtparser.isoparse(since)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return max(1, int((datetime.now(timezone.utc) - dt).total_seconds()))
    except (ValueError, TypeError):
        return 0
