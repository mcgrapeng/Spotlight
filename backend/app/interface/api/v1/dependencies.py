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
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.adapter import KubernetesAdapter
from app.infrastructure.persistence.db import get_session
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository


# ── Auth ─────────────────────────────────────────────────────────────────
def require_auth(request: Request) -> None:
    """Reject unauthenticated callers.

    Accepted proofs: a session cookie issued by /auth/login, or the
    `Authorization: Bearer <API_TOKEN>` header when a static token is
    configured (scripts / host-bound deployments). When neither Teleport
    nor API_TOKEN is configured the API is open (local-dev mode — the app
    logs a startup warning).
    """
    s = get_settings()
    header = request.headers.get("authorization", "")
    if s.api_token and secrets.compare_digest(header, f"Bearer {s.api_token}"):
        return
    if session_store.validate(request.cookies.get(session_store.COOKIE_NAME)):
        return
    if not s.teleport_configured and not s.api_token:
        return
    raise HTTPException(status_code=401, detail="未认证，请先登录")


# ── Adapters (singletons — no per-request state) ─────────────────────────
def k8s_repo() -> KubernetesAdapter:
    return KubernetesAdapter()


def ai_repo(
    session: AsyncSession = Depends(get_session),
) -> LiteLLMAIRepository:
    return LiteLLMAIRepository(SQLAIProviderRepository(session))


# ── Use cases (per-request, each one focused) ─────────────────────────────
def cluster_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> ClusterUseCases:
    return ClusterUseCases(k8s)


def namespace_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> NamespaceUseCases:
    return NamespaceUseCases(k8s)


def pod_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> PodUseCases:
    return PodUseCases(k8s)


def node_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> NodeUseCases:
    return NodeUseCases(k8s)


def event_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> EventUseCases:
    return EventUseCases(k8s)


def dashboard_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> DashboardUseCases:
    return DashboardUseCases(k8s)


def log_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> LogUseCases:
    return LogUseCases(k8s)


def favorite_uc(session: AsyncSession = Depends(get_session)) -> FavoriteUseCases:
    return FavoriteUseCases(SQLFavoriteRepository(session))


def ai_uc(ai: LiteLLMAIRepository = Depends(ai_repo)) -> AIUseCases:
    return AIUseCases(ai)