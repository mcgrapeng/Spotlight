from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Optional

from dateutil import parser as dtparser  # 复用日期解析
from kubernetes import watch

from app.core.k8s_client import get_manager, k8s_api
from app.core.logging import get_logger
from app.schemas.k8s import (
    ContainerInfo,
    DashboardStats,
    EventInfo,
    NamespaceInfo,
    NodeInfo,
    PodInfo,
    PodListResponse,
)

log = get_logger(__name__)


def _age(created_at: Optional[str]) -> Optional[str]:
    if not created_at:
        return None
    try:
        ts = dtparser.isoparse(created_at)
        if ts.tzinfo is None:
            ts = ts.replace(tzinfo=timezone.utc)
        delta = datetime.now(timezone.utc) - ts
        secs = int(delta.total_seconds())
        if secs < 60:
            return f"{secs}s"
        if secs < 3600:
            return f"{secs // 60}m"
        if secs < 86400:
            return f"{secs // 3600}h"
        return f"{secs // 86400}d"
    except Exception:
        return None


def _container_state(cstatus: Any) -> tuple[str, str | None, str | None]:
    state = cstatus.state
    if state.waiting:
        return ("waiting", state.waiting.reason, state.waiting.message)
    if state.terminated:
        return ("terminated", state.terminated.reason, state.terminated.message)
    if state.running:
        return ("running", None, None)
    return ("unknown", None, None)


def _pod_to_info(pod: Any) -> PodInfo:
    cs = pod.status.container_statuses or []
    containers: list[ContainerInfo] = []
    restarts = 0
    for c in cs:
        state_name, reason, msg = _container_state(c)
        restarts += c.restart_count
        containers.append(
            ContainerInfo(
                name=c.name,
                image=c.image,
                ready=c.ready,
                restart_count=c.restart_count,
                state=state_name,
                reason=reason,
                message=msg,
                started_at=str(c.state.running.started_at) if c.state.running else None,
            )
        )

    owner_kind, owner_name = None, None
    refs = pod.metadata.owner_references or []
    if refs:
        owner_kind, owner_name = refs[0].kind, refs[0].name

    reason = pod.status.reason
    message = pod.status.message
    if not reason and pod.status.conditions:
        for cond in pod.status.conditions:
            if cond.status == "False" and cond.type == "Ready":
                reason = cond.reason
                message = cond.message
                break

    return PodInfo(
        name=pod.metadata.name,
        namespace=pod.metadata.namespace,
        node=pod.spec.node_name,
        pod_ip=pod.status.pod_ip,
        phase=pod.status.phase or "Unknown",
        reason=reason,
        message=message,
        restart_count=restarts,
        age=_age(str(pod.metadata.creation_timestamp)),
        created_at=pod.metadata.creation_timestamp,
        labels=dict(pod.metadata.labels or {}),
        containers=containers,
        owner_kind=owner_kind,
        owner_name=owner_name,
    )


def _event_to_info(e: Any) -> EventInfo:
    involved = e.involved_object
    return EventInfo(
        name=e.metadata.name,
        namespace=e.metadata.namespace or "",
        type=e.type or "Normal",
        reason=e.reason or "",
        message=e.message or "",
        involved_kind=involved.kind if involved else "",
        involved_name=involved.name if involved else "",
        count=e.count or 0,
        first_seen=str(e.first_timestamp) if e.first_timestamp else None,
        last_seen=str(e.last_timestamp) if e.last_timestamp else None,
    )


def list_clusters() -> list[dict[str, Any]]:
    return get_manager().contexts


def list_namespaces(context: Optional[str] = None) -> list[NamespaceInfo]:
    with k8s_api(context) as api:
        result = api.list_namespace(timeout_seconds=15)
    return [
        NamespaceInfo(
            name=n.metadata.name,
            status=n.status.phase or "Active",
            labels=dict(n.metadata.labels or {}),
            age=_age(str(n.metadata.creation_timestamp)),
            created_at=n.metadata.creation_timestamp,
        )
        for n in result.items
    ]


def list_pods(
    context: Optional[str] = None,
    namespace: Optional[str] = None,
    label_selector: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
) -> PodListResponse:
    with k8s_api(context) as api:
        kw: dict[str, Any] = {"timeout_seconds": 15}
        if namespace and namespace != "_all":
            kw["namespace"] = namespace
        if label_selector:
            kw["label_selector"] = label_selector
        result = api.list_pod_for_all_namespaces if (not namespace or namespace == "_all") else api.list_namespaced_pod
        pods = result(**kw).items

    items = [_pod_to_info(p) for p in pods]

    if status and status != "all":
        items = [p for p in items if p.phase.lower() == status.lower()]
    if search:
        s = search.lower()
        items = [
            p
            for p in items
            if s in p.name.lower() or any(s in c.name.lower() for c in p.containers) or s in (p.node or "").lower()
        ]

    items.sort(key=lambda p: (p.namespace, p.name))
    return PodListResponse(total=len(items), items=items)


def get_pod(context: Optional[str], namespace: str, name: str) -> PodInfo:
    with k8s_api(context) as api:
        pod = api.read_namespaced_pod(name=name, namespace=namespace)
    return _pod_to_info(pod)


def list_events(
    context: Optional[str] = None,
    namespace: Optional[str] = None,
    involved_name: Optional[str] = None,
    limit: int = 200,
) -> list[EventInfo]:
    with k8s_api(context) as api:
        if namespace and namespace != "_all":
            evs = api.list_namespaced_event(namespace=namespace, limit=limit).items
        else:
            evs = api.list_event_for_all_namespaces(limit=limit).items

    out = [_event_to_info(e) for e in evs]
    if involved_name:
        out = [e for e in out if e.involved_name == involved_name]
    out.sort(key=lambda e: e.last_seen or "", reverse=True)
    return out[:limit]


def list_nodes(context: Optional[str] = None) -> list[NodeInfo]:
    with k8s_api(context) as api:
        nodes = api.list_node(timeout_seconds=15).items
        pods = api.list_pod_for_all_namespaces(timeout_seconds=15).items

    pod_count: dict[str, int] = {}
    for p in pods:
        if p.spec.node_name:
            pod_count[p.spec.node_name] = pod_count.get(p.spec.node_name, 0) + 1

    out: list[NodeInfo] = []
    for n in nodes:
        status = "Unknown"
        for c in n.status.conditions or []:
            if c.type == "Ready":
                status = "Ready" if c.status == "True" else "NotReady"
                break
        roles = [k.replace("node-role.kubernetes.io/", "") for k in (n.metadata.labels or {}).keys() if k.startswith("node-role.kubernetes.io/")]
        cap = n.status.capacity or {}
        alloc = n.status.allocatable or {}
        out.append(
            NodeInfo(
                name=n.metadata.name,
                status=status,
                roles=roles or ["worker"],
                version=n.status.node_info.kubelet_version,
                os_image=n.status.node_info.os_image,
                kubelet_version=n.status.node_info.kubelet_version,
                cpu_capacity=cap.get("cpu", ""),
                memory_capacity=cap.get("memory", ""),
                cpu_allocatable=alloc.get("cpu", ""),
                memory_allocatable=alloc.get("memory", ""),
                pod_count=pod_count.get(n.metadata.name, 0),
                age=_age(str(n.metadata.creation_timestamp)),
            )
        )
    return out


def dashboard_stats(context: Optional[str] = None) -> DashboardStats:
    pods_resp = list_pods(context=context)
    nodes = list_nodes(context=context)
    evs = list_events(context=context, limit=500)

    by_phase: dict[str, int] = {}
    restart_top: list[tuple[str, int]] = []
    for p in pods_resp.items:
        by_phase[p.phase] = by_phase.get(p.phase, 0) + 1
        if p.restart_count > 0:
            restart_top.append((f"{p.namespace}/{p.name}", p.restart_count))
    restart_top.sort(key=lambda x: x[1], reverse=True)

    return DashboardStats(
        total_pods=pods_resp.total,
        running=by_phase.get("Running", 0),
        pending=by_phase.get("Pending", 0),
        failed=by_phase.get("Failed", 0),
        succeeded=by_phase.get("Succeeded", 0),
        warning_events=sum(1 for e in evs if e.type == "Warning"),
        nodes_total=len(nodes),
        nodes_ready=sum(1 for n in nodes if n.status == "Ready"),
        namespaces_count=len(list_namespaces(context)),
        restart_top=[{"pod": k, "restarts": v} for k, v in restart_top[:10]],
    )


def stream_pod_logs(
    context: Optional[str],
    namespace: str,
    name: str,
    container: Optional[str] = None,
    tail_lines: int = 200,
    follow: bool = True,
):
    """Generator: 持续产出 (timestamp, content) 二元组。

    follow=False 时一次性读取历史；follow=True 时持续 tail。
    """
    with k8s_api(context) as api:
        if follow:
            w = watch.Watch()
            try:
                for line in w.stream(
                    api.read_namespaced_pod_log,
                    name=name,
                    namespace=namespace,
                    container=container,
                    tail_lines=tail_lines,
                    follow=True,
                    _request_timeout=3600,
                ):
                    yield _parse_log_line(line, container or "")
            except StopIteration:
                return
        else:
            content = api.read_namespaced_pod_log(
                name=name,
                namespace=namespace,
                container=container,
                tail_lines=tail_lines,
            )
            for line in content.splitlines():
                yield _parse_log_line(line, container or "")


def _parse_log_line(raw: str, container: str) -> dict[str, str]:
    ts = datetime.now(timezone.utc).isoformat(timespec="seconds")
    content = raw
    if " " in raw and len(raw) > 30:
        head = raw.split(" ", 1)[0]
        try:
            dtparser.isoparse(head)
            ts = head
            content = raw.split(" ", 1)[1]
        except (ValueError, TypeError):
            pass
    return {"timestamp": ts, "content": content, "container": container}
