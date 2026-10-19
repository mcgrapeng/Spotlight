"""Event use cases — cached reads, keyed by (cluster, namespace, involved_name, limit)."""
from __future__ import annotations

from app.application.dto import EventOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import ScopedCaches
from app.infrastructure.config.settings import get_settings

# One slot per (session, cluster, namespace, involved, limit).
MAX_SLOTS = 32
_caches: ScopedCaches[list[EventOut]] = ScopedCaches(max_slots=MAX_SLOTS)


def _list_key(scope: str, cluster: str | None, namespace: str | None,
              involved: str | None, limit: int) -> str:
    return f"{scope}|{cluster or ''}|{namespace or ''}|{involved or ''}|{limit}"


def _cache_for(key: str):
    return _caches.get(key, float(get_settings().cache_ttl_events))


class EventUseCases:
    def __init__(self, scope: str, repo: K8sRepositoryPort) -> None:
        self._scope = scope
        self._repo = repo

    async def list_events(
        self, cluster: str | None, namespace: str | None,
        involved: str | None, limit: int,
    ) -> list[EventOut]:
        cache = _cache_for(_list_key(self._scope, cluster, namespace, involved, limit))
        async def _load() -> list[EventOut]:
            events = await self._repo.list_events(cluster, namespace, involved, limit)
            events.sort(key=lambda e: e.last_seen or "", reverse=True)
            return [EventOut.model_validate(e) for e in events[:limit]]
        return await cache.get_or_load(_load)
