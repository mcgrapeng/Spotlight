"""Multi-cluster kubeconfig loader + ApiClient pool keyed by (session, context).

Reuses the official `kubernetes` SDK. The pool is keyed by
`(session_token, context)` so each authenticated session gets its own isolated
client built from its own kubeconfig path (per-session Teleport tsh state).
T6 wires the caller (KubernetesAdapter) to this new signature; the per-context
`client_configuration` isolation built in the audit round is preserved verbatim
inside `_build`.

Thread-safety
-------------
Every ApiClient is built with its own `client.Configuration` loaded via
`load_kube_config(..., client_configuration=cfg)`. We NEVER touch the SDK's
process-global default Configuration (`Configuration.set_default`) — that
global is mutated by the plain `load_kube_config()` call and would let two
threads building clients for different clusters cross-wire credentials.

Performance notes
-----------------
- kubeconfig parsing happens only on cache misses (one client per
  (session_token, context)) and on drop_session() / reload().
- The current-context name is resolved fresh per `get()` call when no explicit
  context is supplied, so per-session kubeconfig changes are picked up
  immediately without a global cache invalidation.
- `drop_session()` and `reload()` close dropped ApiClients so their connection
  pools don't leak.
"""
from __future__ import annotations

import os
from threading import RLock
from typing import Optional

from kubernetes import client, config

from app.infrastructure.logging import get_logger

log = get_logger("k8s.client")


class KubernetesClientPool:
    def __init__(self) -> None:
        self._clients: dict[tuple[str, str], client.ApiClient] = {}
        self._lock = RLock()

    def _clear_locked(self) -> None:
        for cli in self._clients.values():
            try:
                cli.close()
            except Exception:
                pass
        self._clients.clear()

    def _build(
        self, context: Optional[str], kubeconfig_path: Optional[str]
    ) -> client.ApiClient:
        """Build an ApiClient bound to an explicit per-client Configuration.

        `client_configuration` keeps this off the SDK's global default, so
        concurrent builds for different contexts can't cross-contaminate.
        """
        cfg = client.Configuration()
        path = kubeconfig_path
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
        # No eager build: with per-session isolation there is no "default"
        # session. Startup may call reload() to drop any stale clients.
        with self._lock:
            self._clear_locked()

    def reload(self) -> None:
        """Clear every cached (session, context) client. Intended for startup;
        the per-session kube-login path uses drop_session() instead."""
        with self._lock:
            self._clear_locked()

    def get(
        self,
        session_token: str,
        kubeconfig_path: Optional[str],
        context: Optional[str] = None,
    ) -> tuple[client.CoreV1Api, str]:
        """Return (CoreV1Api, active_context_name). Thread-safe; O(1) on cache hit.

        `context` defaults to the kubeconfig's current-context for this call.
        """
        with self._lock:
            active = context if context is not None else self.current(kubeconfig_path) or ""
            key = (session_token, active)
            cli = self._clients.get(key)
            if cli is None:
                cli = self._build(context, kubeconfig_path)
                self._clients[key] = cli
                log.info(
                    "k8s.client.created",
                    session=session_token[:8],
                    context=active,
                )
            return client.CoreV1Api(cli), active

    def current(self, kubeconfig_path: Optional[str]) -> str | None:
        with self._lock:
            try:
                _, current = config.list_kube_config_contexts(
                    config_file=kubeconfig_path
                )
                return current.get("name") if current else None
            except Exception:
                return None

    def list_contexts(self, kubeconfig_path: Optional[str]) -> list[dict]:
        with self._lock:
            contexts, current = config.list_kube_config_contexts(
                config_file=kubeconfig_path
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

    def drop_session(self, session_token: str) -> None:
        """Evict every cached client owned by `session_token`. Closes each
        ApiClient so its connection pool doesn't leak. Called on logout and on
        per-session cluster switch (T6)."""
        with self._lock:
            keys = [k for k in self._clients if k[0] == session_token]
            for k in keys:
                try:
                    self._clients[k].close()
                except Exception:
                    pass
                del self._clients[k]
            log.info(
                "k8s.client.session_dropped",
                session=session_token[:8],
                evicted=len(keys),
            )


_pool: KubernetesClientPool | None = None


def get_pool() -> KubernetesClientPool:
    global _pool
    if _pool is None:
        _pool = KubernetesClientPool()
        _pool.initialize()
    return _pool
