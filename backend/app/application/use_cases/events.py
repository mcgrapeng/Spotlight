"""Event use cases — cached reads, keyed by (cluster, namespace, involved_name, limit)."""
from __future__ import annotations

from app.application.dto import EventOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import TTLCache
from app.infrastructure.config.settings import get_settings

_caches: dict[str, TTLCache[list[EventOut]]] = {}
_order: list[str] = []
MAX_SLOTS = 32


def _list_key(scope: str, cluster: str | None, namespace: str | None,
              involved: str | None, limit: int) -> str:
    return f"{scope}|{cluster or ''}|{namespace or ''}|{involved or ''}|{limit}"


def _cache_for(key: str) -> TTLCache[list[EventOut]]:
    c = _caches.get(key)
    if c is None:
        c = TTLCache(float(get_settings().cache_ttl_events))
        _caches[key] = c
        _order.append(key)
        if len(_order) > MAX_SLOTS:
            evict = _order.pop(0)
            _caches.pop(evict, None)
    return c


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