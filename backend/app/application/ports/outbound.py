"""Outbound ports: interfaces the application needs.

All async-native — K8s SDK is sync, so adapter methods run the actual
SDK call via `run_in_threadpool` and stay non-blocking. `stream_logs`
keeps its sync iterator signature because the SSE route already wraps
it in `run_in_executor` for keepalive-racing.
"""
from __future__ import annotations

import threading
from typing import AsyncIterator, Iterator, Protocol, runtime_checkable

from app.domain.entities.ai import AIProviderConfig
from app.domain.entities.ai import AIAnalysisRequest, AIAnalysisResult, Favorite
from app.domain.entities.resources import Cluster, K8sEvent, LogEntry, Namespace, Node, Pod
from app.domain.value_objects.primitives import LabelSelector, ResourceRef


@runtime_checkable
class K8sRepositoryPort(Protocol):
    async def list_clusters(self) -> list[Cluster]: ...
    def current_cluster(self) -> str | None: ...

    async def list_namespaces(self, cluster: str | None) -> list[Namespace]: ...
    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        label_selector: LabelSelector, search: str | None, status: str | None,
    ) -> list[Pod]: ...
    async def get_pod(self, ref: ResourceRef) -> Pod: ...
    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved_name: str | None, limit: int,
    ) -> list[K8sEvent]: ...
    async def list_nodes(self, cluster: str | None) -> list[Node]: ...

    async def read_logs(
        self, ref: ResourceRef, container: str | None,
        tail_lines: int, since: str | None,
    ) -> list[LogEntry]: ...
    def stream_logs(
        self, ref: ResourceRef, container: str | None, tail_lines: int,
        stop_event: "threading.Event | None" = None,
    ) -> Iterator[LogEntry]: ...


@runtime_checkable
class FavoriteRepositoryPort(Protocol):
    async def list(self) -> list[Favorite]: ...
    async def add(self, fav: Favorite) -> Favorite: ...
    async def remove(self, fav_id: int) -> bool: ...


@runtime_checkable
class AIRepositoryPort(Protocol):
    async def list_providers(self) -> list[AIProviderConfig]: ...
    async def get_provider(self, provider_id: int) -> AIProviderConfig | None: ...
    async def add_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    async def update_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    async def remove_provider(self, provider_id: int) -> bool: ...
    async def set_default(self, provider_id: int) -> AIProviderConfig: ...

    async def analyze(self, cfg: AIProviderConfig, req: AIAnalysisRequest) -> AIAnalysisResult: ...


__all__ = ["K8sRepositoryPort", "FavoriteRepositoryPort", "AIRepositoryPort"]
