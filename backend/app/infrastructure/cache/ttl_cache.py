"""Async-safe TTL cache for K8s use cases.

Settings already exposes cache_ttl_pods/nodes/events/namespaces (5-60s).
This module wires them up: dedupes duplicate reads within the TTL window,
returns the cached value on the hot path, and (importantly) runs the
fetcher only ONCE when N concurrent callers hit a cold cache.
"""
from __future__ import annotations

import asyncio
import time
from typing import Awaitable, Callable, Generic, TypeVar

T = TypeVar("T")


class TTLCache(Generic[T]):
    __slots__ = ("_ttl", "_lock", "_inflight", "_value", "_expires_at")

    def __init__(self, ttl_seconds: float) -> None:
        self._ttl = ttl_seconds
        self._lock = asyncio.Lock()
        self._inflight: asyncio.Task[T] | None = None
        self._value: T | None = None
        self._expires_at: float = 0.0

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
                self._inflight = asyncio.create_task(self._fetch(loader))
        try:
            return await self._inflight
        finally:
            self._inflight = None

    async def _fetch(self, loader: Callable[[], Awaitable[T]]) -> T:
        value = await loader()
        self._value = value
        self._expires_at = time.monotonic() + self._ttl
        return value

    def invalidate(self) -> None:
        self._value = None
        self._expires_at = 0.0