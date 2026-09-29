"""K8s SDK objects → Domain Entity mappers. Pure functions, easy to test."""
from __future__ import annotations

from datetime import datetime, timezone

from dateutil import parser as dtparser

from app.domain.entities.resources import (
    Container,
    K8sEvent,
    Namespace,
    Node,
    OwnerReference,
    Pod,
)
from app.domain.value_objects.enums import ContainerState, NodeStatus, PodPhase


def _parse_dt(raw: str | datetime | None) -> datetime | None:
    if raw is None:
        return None
    if isinstance(raw, datetime):
        return raw
    try:
        return dtparser.isoparse(raw)
    except (ValueError, TypeError):
        return None


def _age_seconds(raw: str | datetime | None, now: datetime) -> int | None:
    dt = _parse_dt(raw)
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return max(0, int((now - dt).total_seconds()))


def _container_state(cstatus) -> tuple[str, str | None, str | None]:
    state = cstatus.state
    if state.waiting:
        return ContainerState.WAITING.value, state.waiting.reason, state.waiting.message
    if state.terminated:
        return ContainerState.TERMINATED.value, state.terminated.reason, state.terminated.message
    if state.running:
        return ContainerState.RUNNING.value, None, None
    return ContainerState.UNKNOWN.value, None, None


def map_pod(pod_obj, *, cluster: str = "", now: datetime | None = None) -> Pod:
    """Map a single Pod. `now` is hoisted by callers doing batch maps."""
    cs = pod_obj.status.container_statuses or []
    containers: list[Container] = []
    for c in cs:
        state_name, reason, msg = _container_state(c)
        started_at = str(c.state.running.started_at) if c.state.running else None
        containers.append(
            Container(
                name=c.name, image=c.image, ready=c.ready, state=state_name,
                restart_count=c.restart_count, reason=reason, message=msg,
                started_at=started_at,
            )
        )

    refs = pod_obj.metadata.owner_references or []
    owner = OwnerReference(kind=refs[0].kind, name=refs[0].name) if refs else None

    phase = PodPhase.parse(getattr(pod_obj.status, "phase", None)).value
    reason = pod_obj.status.reason
    message = pod_obj.status.message
    if not reason and pod_obj.status.conditions:
        for cond in pod_obj.status.conditions:
            if cond.status == "False" and cond.type == "Ready":
                reason, message = cond.reason, cond.message
                break

    # ponytail: `now` hoisted — for a 5000-pod list this saves 5000 syscalls.
    age = _age_seconds(pod_obj.metadata.creation_timestamp, now or datetime.now(timezone.utc))
    return Pod(
        name=pod_obj.metadata.name,
        namespace=pod_obj.metadata.namespace,
        phase=phase,
        node=pod_obj.spec.node_name,
        pod_ip=pod_obj.status.pod_ip,
        age_seconds=age,
        created_at=str(pod_obj.metadata.creation_timestamp) if pod_obj.metadata.creation_timestamp else None,
        reason=reason,
        message=message,
        labels=dict(pod_obj.metadata.labels or {}),
        containers=containers,
        owner=owner,
        cluster=cluster,
    )


def map_namespace(ns_obj, *, cluster: str = "", now: datetime | None = None) -> Namespace:
    return Namespace(
        name=ns_obj.metadata.name,
        status=ns_obj.status.phase or "Active",
        labels=dict(ns_obj.metadata.labels or {}),
        age_seconds=_age_seconds(ns_obj.metadata.creation_timestamp, now or datetime.now(timezone.utc)),
        cluster=cluster,
    )


def map_node(node_obj, *, pod_count: int = 0, cluster: str = "", now: datetime | None = None) -> Node:
    status = NodeStatus.UNKNOWN.value
    for c in node_obj.status.conditions or []:
        if c.type == "Ready":
            status = NodeStatus.READY.value if c.status == "True" else NodeStatus.NOT_READY.value
            break

    roles = tuple(
        k.replace("node-role.kubernetes.io/", "")
        for k in (node_obj.metadata.labels or {}).keys()
        if k.startswith("node-role.kubernetes.io/")
    ) or ("worker",)

    cap = node_obj.status.capacity or {}
    alloc = node_obj.status.allocatable or {}
    return Node(
        name=node_obj.metadata.name,
        status=status,
        roles=roles,
        kubelet_version=node_obj.status.node_info.kubelet_version,
        os_image=node_obj.status.node_info.os_image,
        cpu_capacity=cap.get("cpu", ""),
        memory_capacity=cap.get("memory", ""),
        cpu_allocatable=alloc.get("cpu", ""),
        memory_allocatable=alloc.get("memory", ""),
        pod_count=pod_count,
        age_seconds=_age_seconds(node_obj.metadata.creation_timestamp, now or datetime.now(timezone.utc)),
        cluster=cluster,
    )


def map_event(ev_obj) -> K8sEvent:
    involved = ev_obj.involved_object
    return K8sEvent(
        name=ev_obj.metadata.name,
        namespace=ev_obj.metadata.namespace or "",
        type=ev_obj.type or "Normal",
        reason=ev_obj.reason or "",
        message=ev_obj.message or "",
        involved_kind=involved.kind if involved else "",
        involved_name=involved.name if involved else "",
        count=ev_obj.count or 0,
        first_seen=str(ev_obj.first_timestamp) if ev_obj.first_timestamp else None,
        last_seen=str(ev_obj.last_timestamp) if ev_obj.last_timestamp else None,
    )


def map_pods_batch(items, *, cluster: str = "") -> list:
    """Convenience: hoist `now` once for a list of pods."""
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    return [map_pod(p, cluster=cluster, now=now) for p in items]


def map_nodes_batch(items, *, pod_count_by_node: dict | None = None, cluster: str = "") -> list:
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    pod_count_by_node = pod_count_by_node or {}
    return [
        map_node(n, pod_count=pod_count_by_node.get(n.metadata.name, 0), cluster=cluster, now=now)
        for n in items
    ]


def map_namespaces_batch(items, *, cluster: str = "") -> list:
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    return [map_namespace(ns, cluster=cluster, now=now) for ns in items]