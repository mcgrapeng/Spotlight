"""Inbound ports: use cases invoked by the interface layer.

Use cases return Pydantic schema models directly (interface layer types).
"""
from __future__ import annotations

from typing import Iterator, Protocol, runtime_checkable

from app.domain.entities.ai import AIProviderConfig
from app.domain.value_objects.primitives import LogFilter, ResourceRef


@runtime_checkable
class ClusterUseCases(Protocol):
    async def list_clusters(self) -> list[dict]: ...
    def current_cluster(self) -> str | None: ...


# Ponytail: Pydantic models in interface layer become the API contract;
# application layer imports them as forward references. This eliminates ~185
# lines of DTO/mapper duplication while keeping the type bridge stable.

@runtime_checkable
class NamespaceUseCases(Protocol):
    async def list_namespaces(self, cluster: str | None) -> list: ...


@runtime_checkable
class PodUseCases(Protocol):
    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None,
        label_selector: str | None,
    ) -> object: ...
    async def get_pod(self, ref: ResourceRef) -> object: ...
    async def dashboard(self, cluster: str | None) -> object: ...


@runtime_checkable
class LogUseCases(Protocol):
    async def read_history(
        self, ref: ResourceRef, container: str | None, tail: int,
        since: str | None = None,
    ) -> list: ...
    def stream(
        self, ref: ResourceRef, container: str | None, tail: int,
    ) -> Iterator: ...


@runtime_checkable
class EventUseCases(Protocol):
    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list: ...


@runtime_checkable
class NodeUseCases(Protocol):
    async def list_nodes(self, cluster: str | None) -> list: ...


@runtime_checkable
class FavoriteUseCases(Protocol):
    async def list(self) -> list: ...
    async def add(self, payload: dict) -> object: ...
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
    ) -> object: ...
