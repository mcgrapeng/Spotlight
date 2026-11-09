"""FastAPI dependency providers.

Each use case is instantiated once per request with its concrete dependency
(the K8s / SQL adapter). The interface layer stays HTTP-only; business
wiring lives here.
"""
from __future__ import annotations

import secrets

from fastapi import Depends, HTTPException, Request
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.ai import AIUseCases
from app.application.use_cases.clusters import ClusterUseCases
from app.application.use_cases.dashboard import DashboardUseCases
from app.application.use_cases.events import EventUseCases
from app.application.use_cases.favorites import FavoriteUseCases
from app.application.use_cases.logs import LogUseCases
from app.application.use_cases.namespaces import NamespaceUseCases
from app.application.use_cases.nodes import NodeUseCases
from app.application.use_cases.permissions import (
    EffectivePermissions,
    PermissionUseCases,
)
from app.application.use_cases.pods import PodUseCases
from app.domain.value_objects.permissions import FALLBACK_READ_ONLY
from app.infrastructure.ai.providers.litellm_provider import LiteLLMAIRepository
from app.infrastructure.ai.providers.sql_provider import SQLAIProviderRepository
from app.infrastructure.auth import session as session_store
from app.infrastructure.auth.session import Session
from app.infrastructure.config.settings import get_settings, is_open_mode
from app.infrastructure.k8s.adapter import KubernetesAdapter
from app.infrastructure.logging import get_logger
from app.infrastructure.persistence.db import get_session
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository
from app.infrastructure.persistence.repositories.permission_repo import SQLPermissionRepository


log = get_logger("api.permissions")


# ── Auth ─────────────────────────────────────────────────────────────────
def require_auth(request: Request) -> None:
    """Reject unauthenticated callers.

    Accepted proofs:
      1. `Authorization: Bearer <API_TOKEN>` when `api_token` is set
         (script / host-bound access — synthetic dev session).
      2. A session cookie issued by `/auth/login` (real login).
      3. Open mode (no provider + no api_token) — local-dev fallback.

    `is_open_mode()` is the single source of truth for "the server
    doesn't require auth"; matches the brief's policy alignment.
    """
    s = get_settings()
    header = request.headers.get("authorization", "")
    if s.api_token and secrets.compare_digest(header, f"Bearer {s.api_token}"):
        return
    if session_store.get_session(request.cookies.get(session_store.COOKIE_NAME)) is not None:
        return
    if is_open_mode():
        return
    raise HTTPException(status_code=401, detail="未认证，请先登录")


def current_session(request: Request) -> Session:
    """Resolve the request's session.

    Order:
      1. `Authorization: Bearer <API_TOKEN>` → dev session (synthetic;
         Bearer is host-bound, no per-session kubeconfig dir).
      2. Cookie-issued Session (real login).
      3. Open mode → dev session (local-dev fallback).
      4. Otherwise 401 — caller must present a real session cookie.
    """
    s = get_settings()
    header = request.headers.get("authorization", "")
    if s.api_token and secrets.compare_digest(header, f"Bearer {s.api_token}"):
        return session_store.dev_session()
    cookie_token = request.cookies.get(session_store.COOKIE_NAME)
    sess = session_store.get_session(cookie_token)
    if sess is not None:
        return sess
    if is_open_mode():
        return session_store.dev_session()
    raise HTTPException(status_code=401, detail="未认证，请先登录")


# ── Permissions ───────────────────────────────────────────────────────────
def current_username(request: Request) -> str:
    """The caller's username, as vouched for by the auth plugin.

    A Bearer-token or open-mode caller has no per-user identity, so it
    resolves to the shared `dev` identity — the same one `dev_session()`
    carries.
    """
    cookie_token = request.cookies.get(session_store.COOKIE_NAME)
    sess = session_store.get_session(cookie_token)
    if sess is not None:
        return sess.identity.username
    return session_store.DEV_TOKEN


def permission_uc(session: AsyncSession = Depends(get_session)) -> PermissionUseCases:
    return PermissionUseCases(
        SQLPermissionRepository(session),
        admin_users=tuple(get_settings().admin_user_list),
    )


def require_permission(code: str):
    """Dependency factory: reject callers without `code` (403).

    The 403 body carries the missing code so the frontend can explain what
    is missing instead of showing a generic "forbidden".

    On a database failure the check falls back to READ-ONLY access instead
    of locking everybody out: reading the cluster is already limited by the
    session's own kubeconfig, so refusing it would only turn a database
    hiccup into an outage. Everything else — changing where an API key goes,
    sending log content to a model, managing roles — is refused, because
    substituting the whole default role handed a `viewer` the `user` role's
    permissions (ai.manage included) for as long as SQLite was unhappy.
    """
    async def _guard(
        request: Request,
        uc: PermissionUseCases = Depends(permission_uc),
    ) -> None:
        username = current_username(request)
        try:
            effective = await uc.effective_permissions(username)
        except SQLAlchemyError as e:
            log.warning("permissions.lookup_failed", error=str(e), username=username)
            effective = EffectivePermissions(username, (), tuple(FALLBACK_READ_ONLY))
        if not effective.allows(code):
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "forbidden",
                    "permission": code,
                    # The frontend prints the detail verbatim. Without a
                    # sentence to print it shows "[object Object]" — and this
                    # is the message a blocked user most needs to read.
                    "message": f"没有权限：{code}",
                },
            )

    return _guard


async def reject_legacy_cluster_param(request: Request) -> None:
    """400 on `?cluster=` instead of silently ignoring it.

    The kubeconfig-context parameter was renamed `cluster` -> `context`, and
    FastAPI discards query parameters a route does not declare. A client still
    sending the old name therefore got a 200 carrying the *default* context's
    data: a wrong answer with no error, which is the exact failure mode the
    rename was meant to end. It bites in any window where a browser tab runs a
    previously-built SPA against a newer backend.

    Refusing is the only honest option. Nothing distinguishes a caller using
    the old name from one with a stray parameter, and accepting is what
    produced the original bug.

    Reads the raw query instead of declaring a parameter, so the old name never
    reappears in the OpenAPI spec that `test_context_param_contract` pins.
    """
    if "cluster" in request.query_params:
        raise HTTPException(
            status_code=400,
            detail=(
                "?cluster= was renamed to ?context=. The old name was being "
                "silently dropped, so the cluster selection had no effect and "
                "the response came from the kubeconfig's current-context. "
                "Send ?context=<cluster-name>."
            ),
        )


# ── Adapters (singletons — no per-request state) ─────────────────────────
def k8s_repo(s: Session = Depends(current_session)) -> KubernetesAdapter:
    """The adapter for THIS session's cluster.

    A real plugin session carries its own kubeconfig, written when the user
    picked a cluster (`POST /auth/cluster`). The host-bound kubeconfig is the
    fallback only for the shared dev session (open mode / Bearer token): for
    a real session the host's file is the OPERATOR's cluster, and a session
    that has not picked one yet must not be served it.
    """
    if s.kubeconfig_path.exists():
        return KubernetesAdapter(s.token, str(s.kubeconfig_path))
    if s.token == session_store.DEV_TOKEN:
        return KubernetesAdapter(s.token, None)
    raise HTTPException(
        status_code=409,
        detail="尚未选择集群，请先完成集群选择",
    )


def ai_repo(
    session: AsyncSession = Depends(get_session),
) -> LiteLLMAIRepository:
    return LiteLLMAIRepository(SQLAIProviderRepository(session))


# ── Use cases (per-request, each one focused) ─────────────────────────────
def cluster_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> ClusterUseCases:
    return ClusterUseCases(k8s)


def namespace_uc(s: Session = Depends(current_session),
                 k8s: KubernetesAdapter = Depends(k8s_repo)) -> NamespaceUseCases:
    return NamespaceUseCases(s.token, k8s)


def pod_uc(s: Session = Depends(current_session),
           k8s: KubernetesAdapter = Depends(k8s_repo)) -> PodUseCases:
    return PodUseCases(s.token, k8s)


def node_uc(s: Session = Depends(current_session),
            k8s: KubernetesAdapter = Depends(k8s_repo)) -> NodeUseCases:
    return NodeUseCases(s.token, k8s)


def event_uc(s: Session = Depends(current_session),
             k8s: KubernetesAdapter = Depends(k8s_repo)) -> EventUseCases:
    return EventUseCases(s.token, k8s)


def dashboard_uc(s: Session = Depends(current_session),
                 k8s: KubernetesAdapter = Depends(k8s_repo)) -> DashboardUseCases:
    return DashboardUseCases(s.token, k8s)


def log_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> LogUseCases:
    return LogUseCases(k8s)


def favorite_uc(session: AsyncSession = Depends(get_session)) -> FavoriteUseCases:
    return FavoriteUseCases(SQLFavoriteRepository(session))


def ai_uc(ai: LiteLLMAIRepository = Depends(ai_repo)) -> AIUseCases:
    return AIUseCases(ai)