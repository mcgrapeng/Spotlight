"""Inbound ports: use cases invoked by the interface layer.

Each use case is a Protocol — implementations live in `application/use_cases/`.
"""
from __future__ import annotations

from typing import Iterator, Protocol, runtime_checkable

from app.application.dto import (
    AnalyzeLogsResult,
    DashboardDTO,
    EventDTO,
    FavoriteDTO,
    LogStreamParams,
    NamespaceDTO,
    NodeDTO,
    PodDTO,
    PodListDTO,
)
from app.domain.entities.ai import AIProviderConfig
from app.domain.value_objects.primitives import LogFilter, ResourceRef


@runtime_checkable
class ClusterUseCases(Protocol):
    def list_clusters(self) -> list[dict]: ...
    def current_cluster(self) -> str | None: ...


@runtime_checkable
class NamespaceUseCases(Protocol):
    def list_namespaces(self, cluster: str | None) -> list[NamespaceDTO]: ...


@runtime_checkable
class PodUseCases(Protocol):
    def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None,
        label_selector: str | None,
    ) -> PodListDTO: ...
    def get_pod(self, ref: ResourceRef) -> PodDTO: ...
    def dashboard(self, cluster: str | None) -> DashboardDTO: ...


@runtime_checkable
class LogUseCases(Protocol):
    def read_history(
        self, ref: ResourceRef, container: str | None, tail: int,
    ) -> list[LogStreamParams]: ...
    def stream(
        self, ref: ResourceRef, container: str | None, tail: int,
    ) -> Iterator[LogStreamParams]: ...


@runtime_checkable
class EventUseCases(Protocol):
    def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventDTO]: ...


@runtime_checkable
class NodeUseCases(Protocol):
    def list_nodes(self, cluster: str | None) -> list[NodeDTO]: ...


@runtime_checkable
class FavoriteUseCases(Protocol):
    def list(self) -> list[FavoriteDTO]: ...
    def add(self, payload: dict) -> FavoriteDTO: ...
    def remove(self, fav_id: int) -> None: ...


@runtime_checkable
class AIUseCases(Protocol):
    def list_providers(self) -> list[AIProviderConfig]: ...
    def upsert_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    def delete_provider(self, provider_id: int) -> bool: ...
    def set_default(self, provider_id: int) -> AIProviderConfig: ...
    def analyze_logs(
        self, provider_id: int, ref: ResourceRef,
        log_lines: list[str], question: str,
    ) -> AnalyzeLogsResult: ...
