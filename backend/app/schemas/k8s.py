from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ClusterInfo(BaseModel):
    name: str
    cluster: str
    user: str
    namespace: str
    is_current: bool = False


class NamespaceInfo(BaseModel):
    name: str
    status: str
    labels: dict[str, str] = Field(default_factory=dict)
    age: Optional[str] = None
    created_at: Optional[datetime] = None


class ContainerInfo(BaseModel):
    name: str
    image: str
    ready: bool
    restart_count: int
    state: str
    started_at: Optional[str] = None
    reason: Optional[str] = None
    message: Optional[str] = None


class PodInfo(BaseModel):
    name: str
    namespace: str
    node: Optional[str] = None
    pod_ip: Optional[str] = None
    phase: str
    reason: Optional[str] = None
    message: Optional[str] = None
    restart_count: int = 0
    age: Optional[str] = None
    created_at: Optional[datetime] = None
    labels: dict[str, str] = Field(default_factory=dict)
    containers: list[ContainerInfo] = Field(default_factory=list)
    owner_kind: Optional[str] = None
    owner_name: Optional[str] = None


class PodListResponse(BaseModel):
    total: int
    items: list[PodInfo]


class LogLine(BaseModel):
    timestamp: str
    content: str
    container: str


class EventInfo(BaseModel):
    name: str
    namespace: str
    type: str  # Normal / Warning
    reason: str
    message: str
    involved_kind: str
    involved_name: str
    count: int = 0
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None


class NodeInfo(BaseModel):
    name: str
    status: str
    roles: list[str] = Field(default_factory=list)
    version: str
    os_image: str
    kubelet_version: str
    cpu_capacity: str
    memory_capacity: str
    cpu_allocatable: str
    memory_allocatable: str
    pod_count: int = 0
    age: Optional[str] = None


class DashboardStats(BaseModel):
    total_pods: int
    running: int
    pending: int
    failed: int
    succeeded: int
    warning_events: int
    nodes_total: int
    nodes_ready: int
    namespaces_count: int
    restart_top: list[dict] = Field(default_factory=list)


class FavoriteCreate(BaseModel):
    resource_type: str = Field(pattern="^(pod|node|namespace)$")
    name: str
    namespace: str = ""
    cluster: str = ""
    note: str = ""


class FavoriteOut(BaseModel):
    id: int
    resource_type: str
    name: str
    namespace: str
    cluster: str
    note: str
    created_at: datetime

    class Config:
        from_attributes = True
