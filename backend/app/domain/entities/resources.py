from __future__ import annotations

from dataclasses import dataclass, field

from app.domain.services.duration import format_age


@dataclass(frozen=True, slots=True)
class Container:
    name: str
    image: str
    ready: bool
    state: str  # ContainerState value
    restart_count: int
    reason: str | None = None
    message: str | None = None
    started_at: str | None = None


@dataclass(frozen=True, slots=True)
class OwnerReference:
    kind: str
    name: str


@dataclass(frozen=True, slots=True)
class Pod:
    name: str
    namespace: str
    phase: str  # PodPhase value
    node: str | None
    pod_ip: str | None
    age_seconds: int | None
    created_at: str | None
    reason: str | None = None
    message: str | None = None
    labels: dict[str, str] = field(default_factory=dict)
    containers: list[Container] = field(default_factory=list)
    owner: OwnerReference | None = None
    cluster: str = ""

    @property
    def restart_count(self) -> int:
        return sum(c.restart_count for c in self.containers)

    @property
    def age(self) -> str | None:
        return format_age(self.age_seconds)

    @property
    def owner_kind(self) -> str | None:
        return self.owner.kind if self.owner else None

    @property
    def owner_name(self) -> str | None:
        return self.owner.name if self.owner else None

    @property
    def is_warning(self) -> bool:
        return self.restart_count > 0 or self.reason is not None


@dataclass(frozen=True, slots=True)
class Node:
    name: str
    status: str  # NodeStatus
    roles: tuple[str, ...]
    kubelet_version: str
    os_image: str
    cpu_capacity: str
    memory_capacity: str
    cpu_allocatable: str
    memory_allocatable: str
    pod_count: int
    age_seconds: int | None
    cluster: str = ""

    @property
    def is_ready(self) -> bool:
        return self.status == "Ready"

    @property
    def age(self) -> str | None:
        return format_age(self.age_seconds)


@dataclass(frozen=True, slots=True)
class Namespace:
    name: str
    status: str
    labels: dict[str, str]
    age_seconds: int | None
    cluster: str = ""

    @property
    def age(self) -> str | None:
        return format_age(self.age_seconds)


@dataclass(frozen=True, slots=True)
class K8sEvent:
    name: str
    namespace: str
    type: str  # Normal | Warning
    reason: str
    message: str
    involved_kind: str
    involved_name: str
    count: int
    first_seen: str | None
    last_seen: str | None

    @property
    def is_warning(self) -> bool:
        return self.type == "Warning"


@dataclass(frozen=True, slots=True)
class Cluster:
    name: str
    server: str
    user: str
    default_namespace: str
    is_current: bool = False


@dataclass(frozen=True, slots=True)
class LogEntry:
    """A single log line, classified."""

    timestamp: str
    content: str
    container: str
    severity: str = "unknown"  # LogSeverity value
