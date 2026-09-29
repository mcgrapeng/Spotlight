"""Inbound ports: use cases invoked by the interface layer.

Use cases return application-layer DTOs (see `app.application.dto`).
"""
from __future__ import annotations

from typing import Iterator, Protocol, runtime_checkable

from app.application.dto import (
    AIProviderOut,
    ClusterOut,
    DashboardOut,
    EventOut,
    FavoriteOut,
    LogStreamParams,
    NamespaceOut,
    NodeOut,
    PodListOut,
    PodOut,
)
from app.domain.entities.ai import AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef


@runtime_checkable
class ClusterUseCases(Protocol):
    async def list_clusters(self) -> list[ClusterOut]: ...
    def current_cluster(self) -> str | None: ...


@runtime_checkable
class NamespaceUseCases(Protocol):
    async def list_namespaces(self, cluster: str | None) -> list[NamespaceOut]: ...


@runtime_checkable
class PodUseCases(Protocol):
    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None, label_selector: str | None,
    ) -> PodListOut: ...
    async def get_pod(self, ref: ResourceRef) -> PodOut: ...


@runtime_checkable
class NodeUseCases(Protocol):
    async def list_nodes(self, cluster: str | None) -> list[NodeOut]: ...


@runtime_checkable
class EventUseCases(Protocol):
    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventOut]: ...


@runtime_checkable
class DashboardUseCases(Protocol):
    async def build(self, cluster: str | None) -> DashboardOut: ...


@runtime_checkable
class LogUseCases(Protocol):
    async def read_history(
        self, ref: ResourceRef, container: str | None, tail: int,
        since: str | None = None,
    ) -> list[LogStreamParams]: ...
    def stream(
        self, ref: ResourceRef, container: str | None, tail: int,
    ) -> Iterator[LogStreamParams]: ...


@runtime_checkable
class FavoriteUseCases(Protocol):
    async def list(self) -> list[FavoriteOut]: ...
    async def add(self, payload: dict) -> FavoriteOut: ...
    async def remove(self, fav_id: int) -> None: ...


@runtime_checkable
class AIUseCases(Protocol):
    async def list_providers(self) -> list[AIProviderConfig]: ...
    async def upsert_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    async def delete_provider(self, provider_id: int) -> bool: ...
    async def set_default(self, provider_id: int) -> AIProviderConfig: ...
    async def analyze_logs(
        self, provider_id: int, ref: ResourceRef,
        log_lines: list[str], question: str,
    ) -> object: ...