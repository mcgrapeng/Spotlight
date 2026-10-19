"""Async-safe TTL cache for K8s use cases.

Settings already exposes cache_ttl_pods/nodes/events/namespaces (5-60s).
This module wires them up: dedupes duplicate reads within the TTL window,
returns the cached value on the hot path, and (importantly) runs the
fetcher only ONCE when N concurrent callers hit a cold cache.

`invalidate_scope(scope)` drops the cached snapshots belonging to one session
(used when that session rotates credentials or switches cluster) — otherwise
the UI shows the previous cluster's data for up to a full TTL window. Scoped
rather than global so one user switching cluster doesn't flush everyone else's
cache.
"""
from __future__ import annotations

import asyncio
import time
from typing import Awaitable, Callable, Generic, TypeVar

T = TypeVar("T")

_instances: list["TTLCache"] = []


def invalidate_scope(scope: str) -> None:
    """Drop every cached snapshot whose key starts with `<scope>|`.

    Use case keys are built as `f"{scope}|{cluster}|..."` by the use-case
    layer, so a prefix match scopes the flush to one session.
    """
    prefix = f"{scope}|"
    for c in list(_instances):
        if c.key.startswith(prefix):
            c.invalidate()


class TTLCache(Generic[T]):
    __slots__ = ("key", "_ttl", "_lock", "_inflight", "_value", "_expires_at", "_gen")

    def __init__(self, key: str, ttl_seconds: float) -> None:
        self.key = key
        self._ttl = ttl_seconds
        self._lock = asyncio.Lock()
        self._inflight: asyncio.Task[T] | None = None
        self._value: T | None = None
        self._expires_at: float = 0.0
        self._gen: int = 0  # bumped by invalidate(); stale fetches bail
        _instances.append(self)

    async def get_or_load(self, loader: Callable[[], Awaitable[T]]) -> T:
        # Ponytail: hit cache if fresh — avoids re-running the loader (which
        # itself is a thread-pool round-trip to kube-apiserver).
        now = time.monotonic()
        if self._value is not None and now < self._expires_at:
            return self._value

        # ponytail: coalesce concurrent callers. Without the inflight task,
        # 5 concurrent /pods hits would build 5 SDK call tasks against the same
        # cold cache and hammer kube-apiserver.
        async with self._lock:
            now = time.monotonic()
            if self._value is not None and now < self._expires_at:
                return self._value
            if self._inflight is None:
                self._inflight = asyncio.create_task(self._fetch(loader, self._gen))
            task = self._inflight
        try:
            return await task
        finally:
            # Only the task's own waiters clear it — a *late* waiter must not
            # wipe a newer inflight task (that caused duplicate fetches).
            async with self._lock:
                if self._inflight is task:
                    self._inflight = None

    async def _fetch(self, loader: Callable[[], Awaitable[T]], gen: int) -> T:
        value = await loader()
        if gen == self._gen:  # discard writes from before an invalidate()
            self._value = value
            self._expires_at = time.monotonic() + self._ttl
        return value

    def invalidate(self) -> None:
        self._gen += 1
        self._value = None
        self._expires_at = 0.0

    def dispose(self) -> None:
        """Deregister an evicted cache so `_instances` does not grow forever.

        Use-case modules hold their slots in a `ScopedCaches`; without this the
        module-level registry kept every evicted cache alive, so a long-running
        process leaked one object per unique (session, cluster[, filter]) key.
        """
        try:
            _instances.remove(self)
        except ValueError:
            pass


class ScopedCaches(Generic[T]):
    """A use-case module's cache slots, bounded by FIFO eviction.

    One instance per use-case module, keyed the way that module keys its own
    dict today. Eviction lives here rather than in each module so no module can
    grow a cache without also growing the `_instances` registry — the two
    drifting apart is what kept this leak invisible: the evicted slot held both
    its last snapshot and a registry entry, and neither file looked wrong.

    A bound is required because keys are `<session>|<cluster>[|<filters>]`.
    Sessions live in memory only and are reaped on logout or expiry, but
    nothing removed their cache slots, so the dict grew for the life of the
    process — one entry per (dead session, cluster) pair, forever.
    """

    def __init__(self, max_slots: int) -> None:
        self._max = max_slots
        self._caches: dict[str, TTLCache[T]] = {}
        self._order: list[str] = []

    def __len__(self) -> int:
        return len(self._caches)

    def get(self, key: str, ttl: float) -> TTLCache[T]:
        """The cache for `key`, created and registered on first request."""
        c = self._caches.get(key)
        if c is not None:
            return c
        c = TTLCache(key, ttl)
        self._caches[key] = c
        self._order.append(key)
        while len(self._order) > self._max:
            evict = self._order.pop(0)
            old = self._caches.pop(evict, None)
            if old is not None:
                old.dispose()
        return c
