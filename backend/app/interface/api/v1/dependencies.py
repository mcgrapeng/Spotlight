"""FastAPI dependency providers.

Each use case is instantiated once per request with its concrete dependencies.
This keeps the FastAPI layer thin (HTTP concerns only) and the application
layer pure (no FastAPI imports).
"""
from __future__ import annotations

from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.use_cases.ai import AIUseCases
from app.application.use_cases.favorites import FavoriteUseCases
from app.application.use_cases.logs import LogUseCases
from app.application.use_cases.resources import ResourceUseCases
from app.infrastructure.ai.providers.litellm_provider import LiteLLMAIRepository
from app.infrastructure.ai.providers.sql_provider import SQLAIProviderRepository
from app.infrastructure.k8s.adapter import KubernetesAdapter
from app.infrastructure.persistence.db import get_session
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository


# ── Singleton resources (adapters that hold NO per-request state) ─────────
def k8s_repo() -> KubernetesAdapter:
    return KubernetesAdapter()


def ai_repo(
    session: AsyncSession = Depends(get_session),
) -> LiteLLMAIRepository:
    return LiteLLMAIRepository(SQLAIProviderRepository(session))


# ── Per-request use cases ───────────────────────────────────────────────────
def resource_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> ResourceUseCases:
    return ResourceUseCases(k8s)


def log_uc(k8s: KubernetesAdapter = Depends(k8s_repo)) -> LogUseCases:
    return LogUseCases(k8s)


def favorite_uc(session: AsyncSession = Depends(get_session)) -> FavoriteUseCases:
    return FavoriteUseCases(SQLFavoriteRepository(session))


def ai_uc(ai: LiteLLMAIRepository = Depends(ai_repo)) -> AIUseCases:
    return AIUseCases(ai)
