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
from app.domain.entities.permissions import AppUser, Role
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
    async def list(self, owner: str) -> list[Favorite]: ...
    async def add(self, fav: Favorite) -> Favorite: ...
    async def remove(self, fav_id: int, owner: str) -> bool: ...


@runtime_checkable
class AIRepositoryPort(Protocol):
    async def list_providers(self) -> list[AIProviderConfig]: ...
    async def get_provider(self, provider_id: int) -> AIProviderConfig | None: ...
    async def add_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    async def update_provider(self, cfg: AIProviderConfig) -> AIProviderConfig: ...
    async def remove_provider(self, provider_id: int) -> bool: ...
    async def set_default(self, provider_id: int) -> AIProviderConfig: ...

    async def analyze(self, cfg: AIProviderConfig, req: AIAnalysisRequest) -> AIAnalysisResult: ...

    def stream_analyze(
        self, cfg: AIProviderConfig, req: AIAnalysisRequest,
    ) -> AsyncIterator[str]:
        """Yield the answer as it is produced, token by token.

        The whole point is the wait: a cluster-level question takes the
        model tens of seconds, and a reader staring at a spinner for that
        long has no way to tell "working" from "stuck". The streaming
        variant lets the panel render the answer as it arrives.
        """
        ...


@runtime_checkable
class PermissionRepositoryPort(Protocol):
    """Storage for roles and for the roles granted to each user."""

    async def list_roles(self) -> list[Role]: ...
    async def get_role(self, role_id: int) -> Role | None: ...
    async def get_role_by_name(self, name: str) -> Role | None: ...
    async def add_role(self, role: Role) -> Role: ...
    async def update_role(self, role: Role) -> Role: ...
    async def remove_role(self, role_id: int) -> bool: ...

    async def list_users(self) -> list[AppUser]: ...
    async def get_user(self, username: str) -> AppUser | None: ...
    async def upsert_user(self, user: AppUser) -> AppUser: ...


__all__ = [
    "K8sRepositoryPort",
    "FavoriteRepositoryPort",
    "AIRepositoryPort",
    "PermissionRepositoryPort",
]
