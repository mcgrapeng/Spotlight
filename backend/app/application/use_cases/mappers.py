"""Shared mappers: Domain Entity → Application DTO. Pure functions, no IO."""
from __future__ import annotations

from app.application.dto import (
    ContainerDTO,
    EventDTO,
    NamespaceDTO,
    NodeDTO,
    PodDTO,
)
from app.domain.entities.resources import Container, K8sEvent, Namespace, Node, Pod
from app.domain.services.duration import format_age


def container_to_dto(c: Container) -> ContainerDTO:
    return ContainerDTO(
        name=c.name, image=c.image, ready=c.ready, state=c.state,
        restart_count=c.restart_count, reason=c.reason, message=c.message,
        started_at=c.started_at,
    )


def pod_to_dto(p: Pod) -> PodDTO:
    return PodDTO(
        name=p.name, namespace=p.namespace, node=p.node, pod_ip=p.pod_ip,
        phase=p.phase, reason=p.reason, message=p.message,
        restart_count=p.total_restarts, age=format_age(p.age_seconds),
        labels=dict(p.labels),
        containers=[container_to_dto(c) for c in p.containers],
        owner_kind=p.owner.kind if p.owner else None,
        owner_name=p.owner.name if p.owner else None,
    )


def namespace_to_dto(n: Namespace) -> NamespaceDTO:
    return NamespaceDTO(name=n.name, status=n.status, labels=dict(n.labels), age=format_age(n.age_seconds))


def node_to_dto(n: Node) -> NodeDTO:
    return NodeDTO(
        name=n.name, status=n.status, roles=list(n.roles),
        version=n.version, os_image=n.os_image, kubelet_version=n.version,
        cpu_capacity=n.cpu_capacity, memory_capacity=n.memory_capacity,
        cpu_allocatable=n.cpu_allocatable, memory_allocatable=n.memory_allocatable,
        pod_count=n.pod_count, age=format_age(n.age_seconds),
    )


def event_to_dto(e: K8sEvent) -> EventDTO:
    return EventDTO(
        name=e.name, namespace=e.namespace, type=e.type, reason=e.reason,
        message=e.message, involved_kind=e.involved_kind, involved_name=e.involved_name,
        count=e.count, first_seen=e.first_seen, last_seen=e.last_seen,
    )
