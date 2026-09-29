"""Event use cases."""
from __future__ import annotations

from app.application.dto import EventOut
from app.application.ports.outbound import K8sRepositoryPort


class EventUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventOut]:
        events = await self._repo.list_events(cluster, namespace, involved, limit)
        events.sort(key=lambda e: e.last_seen or "", reverse=True)
        return [EventOut.model_validate(e) for e in events[:limit]]