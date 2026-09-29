"""Inbound ports: use cases invoked by the interface layer.

Each use case is a Protocol — implementations live in `application/use_cases/`.

All K8s-touching use cases are async — the underlying repository wraps
sync SDK calls in `run_in_threadpool`. The K8s cluster itself has to
respond to the apiserver, which is real wall-clock time, so we want to
await that I/O rather than hold a threadpool worker for it.
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
    async def list_clusters(self) -> list[dict]: ...
    def current_cluster(self) -> str | None: ...


@runtime_checkable
class NamespaceUseCases(Protocol):
    async def list_namespaces(self, cluster: str | None) -> list[NamespaceDTO]: ...


@runtime_checkable
class PodUseCases(Protocol):
    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None,
        label_selector: str | None,
    ) -> PodListDTO: ...
    async def get_pod(self, ref: ResourceRef) -> PodDTO: ...
    async def dashboard(self, cluster: str | None) -> DashboardDTO: ...


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
class EventUseCases(Protocol):
    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventDTO]: ...


@runtime_checkable
class NodeUseCases(Protocol):
    async def list_nodes(self, cluster: str | None) -> list[NodeDTO]: ...


@runtime_checkable
class FavoriteUseCases(Protocol):
    async def list(self) -> list[FavoriteDTO]: ...
    async def add(self, payload: dict) -> FavoriteDTO: ...
    async def remove(self, fav_id: int) -> None: ...


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
