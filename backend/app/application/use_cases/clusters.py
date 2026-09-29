"""Cluster use cases."""
from __future__ import annotations

from app.application.dto import ClusterOut
from app.application.ports.outbound import K8sRepositoryPort


class ClusterUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_clusters(self) -> list[ClusterOut]:
        return [
            ClusterOut.model_validate(c) for c in await self._repo.list_clusters()
        ]

    def current_cluster(self) -> str | None:
        return self._repo.current_cluster()