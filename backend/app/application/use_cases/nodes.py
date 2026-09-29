"""Node use cases."""
from __future__ import annotations

from app.application.dto import NodeOut
from app.application.ports.outbound import K8sRepositoryPort


class NodeUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_nodes(self, cluster: str | None) -> list[NodeOut]:
        return [NodeOut.model_validate(n) for n in await self._repo.list_nodes(cluster)]