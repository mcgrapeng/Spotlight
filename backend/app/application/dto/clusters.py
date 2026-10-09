"""Cluster, namespace, node, and aggregated dashboard DTOs."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.application.dto.events import EventOut

_ENTITY = ConfigDict(from_attributes=True)


class ClusterOut(BaseModel):
    model_config = _ENTITY
    name: str
    cluster: str
    user: str
    namespace: str
    is_current: bool = False


class NamespaceOut(BaseModel):
    model_config = _ENTITY
    name: str
    status: str
    labels: dict[str, str] = Field(default_factory=dict)
    age: Optional[str] = None


class NodeOut(BaseModel):
    model_config = _ENTITY
    name: str
    status: str
    roles: list[str]
    os_image: str
    kubelet_version: str
    cpu_capacity: str
    memory_capacity: str
    cpu_allocatable: str
    memory_allocatable: str
    pod_count: int = 0
    age: Optional[str] = None


class RestartTopItem(BaseModel):
    pod: str
    restarts: int


class DashboardOut(BaseModel):
    total_pods: int
    running: int
    pending: int
    failed: int
    succeeded: int
    warning_events: int
    nodes_total: int
    nodes_ready: int
    namespaces_count: int
    restart_top: list[RestartTopItem]
    # Inlined from /events?limit=500 — the dashboard's "recent activity"
    # list previously triggered a second K8s API call.
    recent_warns: list[EventOut] = Field(default_factory=list)