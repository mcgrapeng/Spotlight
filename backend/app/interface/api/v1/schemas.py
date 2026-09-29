"""Pydantic API schemas. Pure data containers for HTTP boundary.

Decoupled from application DTOs so we can evolve them independently.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


# Ponytail: 单一 config 共享给所有 entity-wrap schemas. 之前每个 schema 都要在
# use_cases 里跑一遍 mapper(dto_from(pod_entity)) 才能变成 HTTP 返回 — 现在
# 直接 `PodOut.model_validate(pod)` 一行搞定。dto/__init__.py 130 行 + mappers.py
# 55 行 = ~185 行样板正在消失。
_ENTITY_CONFIG = ConfigDict(from_attributes=True)


class ClusterOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    cluster: str
    user: str
    namespace: str
    is_current: bool = False


class LoginIn(BaseModel):
    password: str = Field(min_length=1, max_length=512)
    # Optional MFA TOTP. Only needed if the cluster has MFA enforced for
    # this user — otherwise leave empty.
    otp: str = Field(default="", max_length=16)


class LoginOut(BaseModel):
    ok: bool
    proxy: str
    user: str
    cluster: str                            # Teleport cluster (== proxy host)
    kube_clusters: list[str] = []           # K8s clusters available after auth
    message: str = ""


class KubeLoginIn(BaseModel):
    cluster: str = Field(min_length=1, max_length=128)


class KubeLoginOut(BaseModel):
    ok: bool
    cluster: str
    message: str = ""


class NamespaceOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    status: str
    labels: dict[str, str] = Field(default_factory=dict)
    age: Optional[str] = None


class ContainerOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    image: str
    ready: bool
    state: str
    restart_count: int
    reason: Optional[str] = None
    message: Optional[str] = None
    started_at: Optional[str] = None


class PodOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    namespace: str
    node: Optional[str] = None
    pod_ip: Optional[str] = None
    phase: str
    reason: Optional[str] = None
    message: Optional[str] = None
    restart_count: int = 0
    age: Optional[str] = None
    labels: dict[str, str] = Field(default_factory=dict)
    containers: list[ContainerOut] = Field(default_factory=list)
    owner_kind: Optional[str] = None
    owner_name: Optional[str] = None


class PodListOut(BaseModel):
    total: int
    items: list[PodOut]


class LogLineOut(BaseModel):
    timestamp: str
    content: str
    container: str
    severity: str = "unknown"


class EventOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    namespace: str
    type: str
    reason: str
    message: str
    involved_kind: str
    involved_name: str
    count: int = 0
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None


class NodeOut(BaseModel):
    model_config = _ENTITY_CONFIG
    name: str
    status: str
    roles: list[str] = Field(default_factory=list)
    # `version` and `kubelet_version` are the same value historically —
    # kept as two fields for API compat. Schema is the source of truth;
    # the dataclass exposes only kubelet_version.
    version: Optional[str] = None
    os_image: str
    kubelet_version: str
    cpu_capacity: str
    memory_capacity: str
    cpu_allocatable: str
    memory_allocatable: str
    pod_count: int = 0
    age: Optional[str] = None


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
    restart_top: list[dict] = Field(default_factory=list)
    # Inlined from /events?limit=500 — the dashboard's "recent activity"
    # list previously triggered a second K8s API call.
    recent_warns: list[EventOut] = Field(default_factory=list)


class FavoriteCreate(BaseModel):
    resource_type: Literal["pod", "node", "namespace"]
    name: str
    namespace: str = ""
    cluster: str = ""
    note: str = ""


class FavoriteOut(BaseModel):
    model_config = _ENTITY_CONFIG
    id: int
    resource_type: Literal["pod", "node", "namespace"]
    name: str
    namespace: str
    cluster: str
    note: str
    created_at: datetime


class AIProviderIn(BaseModel):
    name: str
    provider: str
    model: str
    api_key: str = ""
    api_base: Optional[str] = None
    temperature: float = 0.2
    max_tokens: int = 1024
    is_default: bool = False
    enabled: bool = True
    extra: dict[str, str] = Field(default_factory=dict)


class AIProviderOut(BaseModel):
    id: int
    name: str
    provider: str
    model: str
    api_base: Optional[str] = None
    temperature: float
    max_tokens: int
    is_default: bool
    enabled: bool
    extra: dict[str, str] = Field(default_factory=dict)
    api_key_masked: str  # never expose the secret back to UI


class AIAnalyzeIn(BaseModel):
    provider_id: int
    question: str = "请分析这些日志的根因、异常点和建议"
    log_lines: list[str] = Field(default_factory=list, max_length=2000)


class AIAnalyzeOut(BaseModel):
    answer: str
    model: str
    latency_ms: int
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None