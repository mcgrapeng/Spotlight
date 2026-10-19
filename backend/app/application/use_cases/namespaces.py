"""Namespace use cases — cached reads."""
from __future__ import annotations

from app.application.dto import NamespaceOut
from app.application.ports.outbound import K8sRepositoryPort
from app.infrastructure.cache.ttl_cache import ScopedCaches
from app.infrastructure.config.settings import get_settings

# Module-level cache keyed by (scope, cluster). Namespaces are scoped to a cluster,
# so a single cluster has at most one cache slot per session.
_caches: ScopedCaches[list[NamespaceOut]] = ScopedCaches(max_slots=128)


def _cache_for(scope: str, cluster: str | None):
    # `<scope>|…` prefix is what `invalidate_scope` matches on.
    key = f"{scope}|{cluster or ''}"
    return _caches.get(key, float(get_settings().cache_ttl_namespaces))


class NamespaceUseCases:
    def __init__(self, scope: str, repo: K8sRepositoryPort) -> None:
        self._scope = scope
        self._repo = repo

    async def list_namespaces(self, cluster: str | None) -> list[NamespaceOut]:
        cache = _cache_for(self._scope, cluster)
        async def _load() -> list[NamespaceOut]:
            return [
                NamespaceOut.model_validate(n)
                for n in await self._repo.list_namespaces(cluster)
            ]
        return await cache.get_or_load(_load)
