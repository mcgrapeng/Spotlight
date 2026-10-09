"""Node use cases — cached reads."""
from __future__ import annotations

from app.application.dto import NodeOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import TTLCache
from app.infrastructure.config.settings import get_settings

_caches: dict[tuple[str, str | None], TTLCache[list[NodeOut]]] = {}


def _cache_for(scope: str, cluster: str | None) -> TTLCache[list[NodeOut]]:
    key = (scope, cluster)
    c = _caches.get(key)
    if c is None:
        c = TTLCache(float(get_settings().cache_ttl_nodes))
        _caches[key] = c
    return c


class NodeUseCases:
    def __init__(self, scope: str, repo: K8sRepositoryPort) -> None:
        self._scope = scope
        self._repo = repo

    async def list_nodes(self, cluster: str | None) -> list[NodeOut]:
        cache = _cache_for(self._scope, cluster)
        async def _load() -> list[NodeOut]:
            return [NodeOut.model_validate(n) for n in await self._repo.list_nodes(cluster)]
        return await cache.get_or_load(_load)