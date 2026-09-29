"""Namespace use cases."""
from __future__ import annotations

from app.application.dto import NamespaceOut
from app.application.ports.outbound import K8sRepositoryPort


class NamespaceUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_namespaces(self, cluster: str | None) -> list[NamespaceOut]:
        return [
            NamespaceOut.model_validate(n)
            for n in await self._repo.list_namespaces(cluster)
        ]