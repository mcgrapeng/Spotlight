"""TTL cache (stdlib-friendly). Used to short-circuit repeat K8s queries."""
from __future__ import annotations

import threading
import time
from collections import OrderedDict
from typing import Callable, Generic, TypeVar

T = TypeVar("T")


class TTLCache(Generic[T]):
    """Tiny thread-safe LRU+TTL cache. Avoids pulling in cachetools as runtime dep."""

    def __init__(self, max_size: int = 256, ttl_seconds: float = 5.0):
        self._max = max_size
        self._ttl = ttl_seconds
        self._data: OrderedDict[str, tuple[float, T]] = OrderedDict()
        self._lock = threading.Lock()

    def get(self, key: str, loader: Callable[[], T]) -> T:
        now = time.monotonic()
        with self._lock:
            hit = self._data.get(key)
            if hit is not None:
                expires_at, value = hit
                if expires_at > now:
                    self._data.move_to_end(key)
                    return value
                self._data.pop(key, None)
        value = loader()
        with self._lock:
            self._data[key] = (now + self._ttl, value)
            self._data.move_to_end(key)
            while len(self._data) > self._max:
                self._data.popitem(last=False)
        return value

    def invalidate(self, prefix: str | None = None) -> None:
        with self._lock:
            if prefix is None:
                self._data.clear()
            else:
                for k in list(self._data):
                    if k.startswith(prefix):
                        self._data.pop(k)
