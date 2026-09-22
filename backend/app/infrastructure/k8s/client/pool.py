"""Multi-cluster kubeconfig loader + ApiClient pool.

Reuses the official `kubernetes` SDK. The pool is keyed by context name so we
don't rebuild the HTTP client every request.

Performance notes
-----------------
- kubeconfig is loaded ONCE at startup. The `kubernetes` SDK mutates module-level
  state on every `load_kube_config()` call, so calling it per request would be
  costly AND unsafe under concurrent use. We only reload if the source path
  changed at runtime (rare — covered by Teleport login flow).
- Each context→CoreV1Api lookup is O(1) dict access under an RLock.
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
        self._kubeconfig_path: str | None = None
        self._loaded_path: str | None = None

    def _resolve_path(self) -> str | None:
        return get_settings().kubeconfig_path or os.environ.get("KUBECONFIG")

    def _load_kubeconfig(self, force: bool = False) -> None:
        path = self._resolve_path()
        self._kubeconfig_path = path

        if not force and path == self._loaded_path:
            return  # idempotent — most frequent path on the hot path

        if path and os.path.exists(path):
            config.load_kube_config(config_file=path)
        else:
            try:
                config.load_kube_config()
            except config.ConfigException:
                config.load_incluster_config()
        self._loaded_path = path
        # Any previously-cached clients were built against the old config; drop.
        with self._lock:
            self._clients.clear()
        log.info("k8s.kubeconfig.loaded", path=path or "<default>")

    def initialize(self) -> None:
        self._load_kubeconfig(force=True)

    def reload(self) -> None:
        """Force a kubeconfig reload (e.g. after Teleport `tsh login` rotates certs)."""
        self._load_kubeconfig(force=True)

    def get(self, context: Optional[str] = None) -> tuple[client.CoreV1Api, str]:
        """Return (CoreV1Api, current_context_name). Thread-safe; O(1) on cache hit."""
        if context:
            # SDK requires the *named* context to be loaded before constructing the client.
            # We only re-run load_kube_config if the kubeconfig path actually changed.
            path = self._resolve_path()
            if path != self._loaded_path:
                self._load_kubeconfig()
            config.load_kube_config(context=context, config_file=self._loaded_path)

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
        _, current = config.list_kube_config_contexts(config_file=self._loaded_path)
        return current.get("name") if current else None

    def list_contexts(self) -> list[dict]:
        contexts, current = config.list_kube_config_contexts(config_file=self._loaded_path)
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
