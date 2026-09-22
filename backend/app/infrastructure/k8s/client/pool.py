"""Multi-cluster kubeconfig loader + ApiClient pool.

Reuses the official `kubernetes` SDK. The pool is keyed by context name so we
don't rebuild the HTTP client every request.

Performance note: kubeconfig is loaded ONCE at startup and on demand when the
active context changes (rare). Each API call is O(1) dict lookup.
"""
from __future__ import annotations

import os
from threading import RLock
from typing import Optional

from kubernetes import client, config

from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger

log = get_logger("k8s.client")


class KubernetesClientPool:
    def __init__(self) -> None:
        self._clients: dict[str, client.ApiClient] = {}
        self._lock = RLock()

    def _load_kubeconfig(self) -> None:
        path = get_settings().kubeconfig_path or os.environ.get("KUBECONFIG")
        if path and os.path.exists(path):
            config.load_kube_config(config_file=path)
        else:
            try:
                config.load_kube_config()
            except config.ConfigException:
                config.load_incluster_config()

    def initialize(self) -> None:
        self._load_kubeconfig()

    def get(self, context: Optional[str] = None) -> tuple[client.CoreV1Api, str]:
        """Return (CoreV1Api, current_context_name). Thread-safe."""
        if context:
            config.load_kube_config(context=context)
            with self._lock:
                self._clients.pop(context, None)

        active = context or self._current_context() or "default"
        with self._lock:
            cli = self._clients.get(active)
            if cli is None:
                cli = client.ApiClient()
                self._clients[active] = cli
                log.info("k8s.client.created", context=active)
            return client.CoreV1Api(cli), active

    def current(self) -> str | None:
        return self._current_context()

    def _current_context(self) -> str | None:
        _, current = config.list_kube_config_contexts()
        return current.get("name") if current else None

    def list_contexts(self) -> list[dict]:
        contexts, current = config.list_kube_config_contexts()
        current_name = current.get("name", "") if current else ""
        return [
            {
                "name": c.get("name", ""),
                "cluster": (c.get("context", {}) or {}).get("cluster", ""),
                "user": (c.get("context", {}) or {}).get("user", ""),
                "namespace": (c.get("context", {}) or {}).get("namespace", "default"),
                "server": "",
                "is_current": c.get("name") == current_name,
            }
            for c in contexts
        ]


_pool: KubernetesClientPool | None = None


def get_pool() -> KubernetesClientPool:
    global _pool
    if _pool is None:
        _pool = KubernetesClientPool()
        _pool.initialize()
    return _pool
