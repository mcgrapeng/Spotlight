"""Node use cases — cached reads."""
from __future__ import annotations

from app.application.dto import NodeOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import TTLCache
from app.infrastructure.config.settings import get_settings

_caches: dict[str | None, TTLCache[list[NodeOut]]] = {}


def _cache_for(cluster: str | None) -> TTLCache[list[NodeOut]]:
    c = _caches.get(cluster)
    if c is None:
        c = TTLCache(float(get_settings().cache_ttl_nodes))
        _caches[cluster] = c
    return c


class NodeUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_nodes(self, cluster: str | None) -> list[NodeOut]:
        cache = _cache_for(cluster)
        async def _load() -> list[NodeOut]:
            return [NodeOut.model_validate(n) for n in await self._repo.list_nodes(cluster)]
        return await cache.get_or_load(_load)