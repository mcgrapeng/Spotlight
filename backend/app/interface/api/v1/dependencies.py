"""FastAPI dependency providers.

Each use case is instantiated once per request with its concrete dependency
(the K8s / SQL adapter). The interface layer stays HTTP-only; business
wiring lives here.
"""
from __future__ import annotations

import secrets

from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.ai import AIUseCases
from app.application.use_cases.clusters import ClusterUseCases
from app.application.use_cases.dashboard import DashboardUseCases
from app.application.use_cases.events import EventUseCases
from app.application.use_cases.favorites import FavoriteUseCases
from app.application.use_cases.logs import LogUseCases
from app.application.use_cases.namespaces import NamespaceUseCases
from app.application.use_cases.nodes import NodeUseCases
from app.application.use_cases.pods import PodUseCases
from app.infrastructure.ai.providers.litellm_provider import LiteLLMAIRepository
from app.infrastructure.ai.providers.sql_provider import SQLAIProviderRepository
from app.infrastructure.auth import session as session_store
from app.infrastructure.auth.session import Session
from app.infrastructure.config.settings import get_settings, is_open_mode
from app.infrastructure.k8s.adapter import KubernetesAdapter
from app.infrastructure.persistence.db import get_session
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository


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


# ── Adapters (singletons — no per-request state) ─────────────────────────
def k8s_repo(s: Session = Depends(current_session)) -> KubernetesAdapter:
    # Per-session kubeconfig lives under s.dir/kubeconfig.yaml; the global
    # host-bound kubeconfig is the fallback when the per-session file is absent.
    kp = str(s.kubeconfig_path) if s.kubeconfig_path.exists() else None
    return KubernetesAdapter(s.token, kp)


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