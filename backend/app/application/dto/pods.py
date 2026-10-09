"""Pod and container DTOs."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

_ENTITY = ConfigDict(from_attributes=True)


class ContainerOut(BaseModel):
    model_config = _ENTITY
    name: str
    image: str
    ready: bool
    state: str
    restart_count: int
    reason: Optional[str] = None
    message: Optional[str] = None
    started_at: Optional[str] = None


class PodOut(BaseModel):
    model_config = _ENTITY
    name: str
    namespace: str
    node: Optional[str] = None
    pod_ip: Optional[str] = None
    phase: str
    reason: Optional[str] = None
    message: Optional[str] = None
    restart_count: int = 0
    age: Optional[str] = None
    labels: dict[str, str]
    containers: list[ContainerOut]
    owner_kind: Optional[str] = None
    owner_name: Optional[str] = None


class PodListOut(BaseModel):
    total: int
    items: list[PodOut]