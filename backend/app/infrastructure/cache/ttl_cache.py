"""Async-safe TTL cache for K8s use cases.

Settings already exposes cache_ttl_pods/nodes/events/namespaces (5-60s).
This module wires them up: dedupes duplicate reads within the TTL window,
returns the cached value on the hot path, and (importantly) runs the
fetcher only ONCE when N concurrent callers hit a cold cache.

`invalidate_all()` lets the auth layer drop every cached snapshot after a
credential/cluster switch (kube-login) — otherwise the UI shows the
previous cluster's data for up to a full TTL window.
"""
from __future__ import annotations

import asyncio
import time
from typing import Awaitable, Callable, Generic, TypeVar

T = TypeVar("T")

_instances: list["TTLCache"] = []


def invalidate_all() -> None:
    """Drop every cached snapshot (kube-login rotates creds/cluster)."""
    for c in list(_instances):
        c.invalidate()


class TTLCache(Generic[T]):
    __slots__ = ("_ttl", "_lock", "_inflight", "_value", "_expires_at", "_gen")

    def __init__(self, ttl_seconds: float) -> None:
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
