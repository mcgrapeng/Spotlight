"""Namespace use cases — cached reads."""
from __future__ import annotations

from app.application.dto import NamespaceOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import TTLCache
from app.infrastructure.config.settings import get_settings

# Module-level cache keyed by cluster. Namespaces are scoped to a cluster,
# so a single cluster has at most one cache slot.
_caches: dict[str | None, TTLCache[list[NamespaceOut]]] = {}


def _cache_for(cluster: str | None) -> TTLCache[list[NamespaceOut]]:
    c = _caches.get(cluster)
    if c is None:
        c = TTLCache(float(get_settings().cache_ttl_namespaces))
        _caches[cluster] = c
    return c


class NamespaceUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_namespaces(self, cluster: str | None) -> list[NamespaceOut]:
        cache = _cache_for(cluster)
        async def _load() -> list[NamespaceOut]:
            return [
                NamespaceOut.model_validate(n)
                for n in await self._repo.list_namespaces(cluster)
            ]
        return await cache.get_or_load(_load)