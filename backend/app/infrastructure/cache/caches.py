"""Module-level cache singletons, keyed by (cluster, filters, ...).

One process-wide cache per use case type. Scoped per cluster so multi-cluster
deployments don't leak between tenants.
"""
from __future__ import annotations

from app.infrastructure.cache.ttl_cache import TTLCache
from app.application.dto import (
    DashboardOut,
    EventOut,
    NamespaceOut,
    NodeOut,
    PodListOut,
)


# ponytail: TTLs come from settings at module import. Settings already exposes
# cache_ttl_pods/nodes/events/namespaces (5-60s) — wire them here so the same
# value drives the cache regardless of which code path constructs the cache.
def _ttl(name: str) -> float:
    from app.infrastructure.config.settings import get_settings
    return float(getattr(get_settings(), name))


# Per-cluster caches. Keyed by cluster name (None → "default") so two clusters
# running on the same backend never share state.
_pods_caches: dict[str | None, TTLCache[PodListOut]] = {}
_namespaces_caches: dict[str | None, TTLCache[list[NamespaceOut]]] = {}
_nodes_caches: dict[str | None, TTLCache[list[NodeOut]]] = {}
_events_caches: dict[str | None, TTLCache[list[EventOut]]] = {}
_dashboards_caches: dict[str | None, TTLCache[DashboardOut]] = {}


def pods_cache(cluster: str | None) -> TTLCache[PodListOut]:
    if cluster not in _pods_caches:
        _pods_caches[cluster] = TTLCache(_ttl("cache_ttl_pods"))
    return _pods_caches[cluster]


def namespaces_cache(cluster: str | None) -> TTLCache[list[NamespaceOut]]:
    if cluster not in _namespaces_caches:
        _namespaces_caches[cluster] = TTLCache(_ttl("cache_ttl_namespaces"))
    return _namespaces_caches[cluster]


def nodes_cache(cluster: str | None) -> TTLCache[list[NodeOut]]:
    if cluster not in _nodes_caches:
        _nodes_caches[cluster] = TTLCache(_ttl("cache_ttl_nodes"))
    return _nodes_caches[cluster]


def events_cache(cluster: str | None) -> TTLCache[list[EventOut]]:
    if cluster not in _events_caches:
        _events_caches[cluster] = TTLCache(_ttl("cache_ttl_events"))
    return _events_caches[cluster]


def dashboards_cache(cluster: str | None) -> TTLCache[DashboardOut]:
    if cluster not in _dashboards_caches:
        _dashboards_caches[cluster] = TTLCache(_ttl("cache_ttl_pods"))
    return _dashboards_caches[cluster]


def invalidate_all() -> None:
    """Drop every cached value. Called after kube_login (cert rotation)."""
    for caches in (_pods_caches, _namespaces_caches, _nodes_caches,
                   _events_caches, _dashboards_caches):
        for c in caches.values():
            c.invalidate()