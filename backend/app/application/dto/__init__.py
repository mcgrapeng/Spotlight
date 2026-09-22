"""Application DTOs.

Decoupled from API schemas (Pydantic) — these are pure dataclasses.
Interface layer maps to API DTOs; mappers live in `interface/api/v1/schemas/`.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal


@dataclass(frozen=True, slots=True)
class ContainerDTO:
    name: str
    image: str
    ready: bool
    state: str
    restart_count: int
    reason: str | None = None
    message: str | None = None
    started_at: str | None = None


@dataclass(frozen=True, slots=True)
class PodDTO:
    name: str
    namespace: str
    node: str | None
    pod_ip: str | None
    phase: str
    reason: str | None
    message: str | None
    restart_count: int
    age: str | None
    labels: dict[str, str] = field(default_factory=dict)
    containers: list[ContainerDTO] = field(default_factory=list)
    owner_kind: str | None = None
    owner_name: str | None = None


@dataclass(frozen=True, slots=True)
class PodListDTO:
    total: int
    items: list[PodDTO]


@dataclass(frozen=True, slots=True)
class NamespaceDTO:
    name: str
    status: str
    labels: dict[str, str] = field(default_factory=dict)
    age: str | None = None


@dataclass(frozen=True, slots=True)
class NodeDTO:
    name: str
    status: str
    roles: list[str]
    version: str
    os_image: str
    kubelet_version: str
    cpu_capacity: str
    memory_capacity: str
    cpu_allocatable: str
    memory_allocatable: str
    pod_count: int
    age: str | None = None


@dataclass(frozen=True, slots=True)
class EventDTO:
    name: str
    namespace: str
    type: str
    reason: str
    message: str
    involved_kind: str
    involved_name: str
    count: int
    first_seen: str | None = None
    last_seen: str | None = None


@dataclass(frozen=True, slots=True)
class DashboardDTO:
    total_pods: int
    running: int
    pending: int
    failed: int
    succeeded: int
    warning_events: int
    nodes_total: int
    nodes_ready: int
    namespaces_count: int
    restart_top: list[dict[str, str | int]] = field(default_factory=list)


@dataclass(frozen=True, slots=True)
class FavoriteDTO:
    id: int
    resource_type: Literal["pod", "node", "namespace"]
    name: str
    namespace: str
    cluster: str
    note: str
    created_at: datetime


@dataclass(frozen=True, slots=True)
class LogStreamParams:
    """One log entry, classified + filtered."""

    timestamp: str
    content: str
    container: str
    severity: str = "unknown"


@dataclass(frozen=True, slots=True)
class AnalyzeLogsResult:
    answer: str
    model: str
    latency_ms: int
    input_tokens: int | None = None
    output_tokens: int | None = None
