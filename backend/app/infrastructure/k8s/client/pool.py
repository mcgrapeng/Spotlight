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
from urllib3.util.retry import Retry

from app.infrastructure.logging import get_logger

log = get_logger("k8s.client")


class UnknownContextError(Exception):
    """The requested context is not in the kubeconfig we loaded.

    Almost always a stale client: the browser kept a cluster name from a
    previous login while the current session's kubeconfig only holds the
    cluster that login actually selected. Callers turn this into a 4xx so the
    UI can re-sync instead of showing a 500.
    """


class CredentialUnavailableError(Exception):
    """The kubeconfig's exec credential plugin produced no credentials.

    The Kubernetes SDK runs the plugin while loading the kubeconfig and
    swallows its failure — it only logs it — then sends requests without any
    credentials. The cluster answers 401/403 and nothing points at the real
    cause, which is how a wrong `TELEPORT_HOME` looks exactly like a
    permissions problem.

    The pool checks the result right after loading, where the answer is still
    known, so the caller can say what actually went wrong.
    """


def _kubeconfig_uses_exec_plugin(path: str) -> bool:
    """Whether the kubeconfig authenticates through an exec credential plugin."""
    try:
        # PyYAML rides in with the kubernetes SDK, so this needs no extra dep.
        import yaml

        with open(path, encoding="utf-8") as fh:
            data = yaml.safe_load(fh) or {}
    except Exception:
        return False
    for user in data.get("users") or []:
        if "exec" in (user.get("user") or {}):
            return True
    return False


def _has_credentials(cfg: client.Configuration) -> bool:
    """Whether the loaded configuration carries any usable credential."""
    return bool(cfg.api_key) or bool(cfg.username) or bool(cfg.cert_file)


def _host_kubeconfig_exists() -> bool:
    """Whether the SDK would find a kubeconfig at all.

    KUBECONFIG may be a `:`-separated list, which is legal but not the common
    case — check each entry rather than treating the whole string as a path.
    """
    env = os.environ.get("KUBECONFIG", "").strip()
    if env:
        return any(os.path.exists(p) for p in env.split(os.pathsep) if p.strip())
    return os.path.exists(os.path.join(os.path.expanduser("~"), ".kube", "config"))


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
        self,
        context: Optional[str],
        kubeconfig_path: Optional[str],
        session_token: str = "",
    ) -> client.ApiClient:
        """Build an ApiClient bound to an explicit per-client Configuration.

        `client_configuration` keeps this off the SDK's global default, so
        concurrent builds for different contexts can't cross-contaminate.

        The session token is here for the error messages only, and only its
        first eight characters: the kubeconfig path embeds the whole token,
        and that token IS the session cookie — a log line or an error body
        carrying it hands the session to whoever reads them.
        """
        cfg = client.Configuration()
        # urllib3 retries a timed-out READ three times by default, so a hung
        # apiserver holds the request for 4 x k8s_request_timeout — longer
        # than the browser's own timeout, so the user would watch the request
        # fail before the server had answered. A read that timed out will not
        # succeed on a second try; a refused connection might. Retry the
        # connection, not the read.
        cfg.retries = Retry(total=3, connect=3, read=0)
        path = kubeconfig_path
        if path and os.path.exists(path):
            try:
                config.load_kube_config(
                    config_file=path, context=context, client_configuration=cfg
                )
            except config.ConfigException as e:
                # The path exists but the context in it does not — a stale
                # cluster name, not a broken kubeconfig. Let the caller answer
                # 4xx instead of letting this surface as a 500.
                raise UnknownContextError(
                    f"context {context!r} not found in session {session_token[:8]}"
                ) from e
            if (
                _kubeconfig_uses_exec_plugin(path)
                and not _has_credentials(cfg)
            ):
                # The SDK ran the credential plugin and swallowed its failure.
                raise CredentialUnavailableError(
                    f"credential plugin for session {session_token[:8]} "
                    "produced no credentials"
                )
        else:
            try:
                config.load_kube_config(context=context, client_configuration=cfg)
            except config.ConfigException as e:
                # Two unrelated failures arrive here, and telling them apart is
                # the whole job: either there is no kubeconfig at all (in-cluster
                # is then the right answer), or there is one and it simply does
                # not contain this context — a stale selection from a previous
                # login, which is a 4xx the UI can recover from.
                #
                # Guessing wrong in either direction is bad: treat a stale
                # context as "no config" and every request 500s on a connection
                # error that never gets a chance to be reported as a 409.
                if _host_kubeconfig_exists():
                    raise UnknownContextError(
                        f"context {context!r} not found in the host kubeconfig"
                    ) from e
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
                cli = self._build(context, kubeconfig_path, session_token)
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
