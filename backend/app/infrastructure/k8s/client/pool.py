"""Multi-cluster kubeconfig loader + ApiClient pool.

Reuses the official `kubernetes` SDK. The pool is keyed by context name so we
don't rebuild the HTTP client every request.

Thread-safety
-------------
Every ApiClient is built with its own `client.Configuration` loaded via
`load_kube_config(..., client_configuration=cfg)`. We NEVER touch the SDK's
process-global default Configuration (`Configuration.set_default`) — that
global is mutated by the plain `load_kube_config()` call and would let two
threads building clients for different clusters cross-wire credentials.

Performance notes
-----------------
- kubeconfig parsing happens only on cache misses (one client per context)
  and on path change / reload(). The hot path is an O(1) dict lookup.
- The current-context name is cached; it re-parses only after reload().
- `reload()` closes dropped ApiClients so their connection pools don't leak.
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
        self._resolved_path: str | None = None
        self._current: str | None = None

    def _resolve_path(self) -> str | None:
        return get_settings().kubeconfig_path or os.environ.get("KUBECONFIG")

    def _clear_locked(self) -> None:
        for cli in self._clients.values():
            try:
                cli.close()
            except Exception:
                pass
        self._clients.clear()
        self._current = None

    def _sync_path_locked(self) -> str | None:
        """Adopt the current kubeconfig path; drop clients when it changes."""
        path = self._resolve_path()
        if path != self._resolved_path:
            self._clear_locked()
            self._resolved_path = path
        return path

    def _build(self, context: Optional[str]) -> client.ApiClient:
        """Build an ApiClient bound to an explicit per-client Configuration.

        `client_configuration` keeps this off the SDK's global default, so
        concurrent builds for different contexts can't cross-contaminate.
        """
        cfg = client.Configuration()
        path = self._resolved_path
        if path and os.path.exists(path):
            config.load_kube_config(
                config_file=path, context=context, client_configuration=cfg
            )
        else:
            try:
                config.load_kube_config(context=context, client_configuration=cfg)
            except config.ConfigException:
                config.load_incluster_config(client_configuration=cfg)
        return client.ApiClient(configuration=cfg)

    def initialize(self) -> None:
        with self._lock:
            self._sync_path_locked()
            active = self.current() or "default"
            if active not in self._clients:
                self._clients[active] = self._build(None)
                log.info("k8s.client.created", context=active)

    def reload(self) -> None:
        """Force a rebuild (e.g. after Teleport `tsh kube login` rotates certs
        or switches the current context)."""
        with self._lock:
            self._clear_locked()
            self._resolved_path = self._resolve_path()

    def get(self, context: Optional[str] = None) -> tuple[client.CoreV1Api, str]:
        """Return (CoreV1Api, active_context_name). Thread-safe; O(1) on cache hit."""
        with self._lock:
            self._sync_path_locked()
            active = context or self._current or self.current() or "default"
            cli = self._clients.get(active)
            if cli is None:
                cli = self._build(context)
                self._clients[active] = cli
                log.info("k8s.client.created", context=active)
            return client.CoreV1Api(cli), active

    def current(self) -> str | None:
        with self._lock:
            self._sync_path_locked()
            if self._current is None:
                try:
                    _, current = config.list_kube_config_contexts(
                        config_file=self._resolved_path
                    )
                    self._current = current.get("name") if current else None
                except Exception:
                    self._current = None
            return self._current

    def list_contexts(self) -> list[dict]:
        with self._lock:
            self._sync_path_locked()
            contexts, current = config.list_kube_config_contexts(
                config_file=self._resolved_path
            )
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
