"""Pod use cases — cached reads via TTLCache.

Ponytail: cache is module-level (not per-instance) so requests share state.
Each (cluster, filter-combo) gets its own cache slot, bounded by FIFO eviction.
"""
from __future__ import annotations

from app.application.dto import PodListOut, PodOut
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.infrastructure.cache.ttl_cache import TTLCache
from app.infrastructure.config.settings import get_settings

# Module-level shared cache. Bounded to MAX_SLOTS via FIFO eviction.
_caches: dict[str, TTLCache[PodListOut]] = {}
_order: list[str] = []
MAX_SLOTS = 32


def _list_key(scope: str, cluster: str | None, namespace: str | None, status: str | None,
              search: str | None, label_selector: str | None) -> str:
    return f"{scope}|{cluster or ''}|{namespace or ''}|{status or ''}|{search or ''}|{label_selector or ''}"


def _cache_for(key: str) -> TTLCache[PodListOut]:
    c = _caches.get(key)
    if c is None:
        c = TTLCache(float(get_settings().cache_ttl_pods))
        _caches[key] = c
        _order.append(key)
        if len(_order) > MAX_SLOTS:
            evict = _order.pop(0)
            _caches.pop(evict, None)
    return c


class PodUseCases:
    def __init__(self, scope: str, repo: K8sRepositoryPort) -> None:
        self._scope = scope
        self._repo = repo

    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None, label_selector: str | None,
    ) -> PodListOut:
        selector = LabelSelector.parse(label_selector)
        cache = _cache_for(_list_key(self._scope, cluster, namespace, status, search, label_selector))
        async def _load() -> PodListOut:
            pods = await self._repo.list_pods(cluster, namespace, selector, search, status)
            items = sorted(
                (PodOut.model_validate(p) for p in pods),
                key=lambda p: (p.namespace, p.name),
            )
            return PodListOut(total=len(items), items=items)
        return await cache.get_or_load(_load)

    async def get_pod(self, ref: ResourceRef) -> PodOut:
        return PodOut.model_validate(await self._repo.get_pod(ref))