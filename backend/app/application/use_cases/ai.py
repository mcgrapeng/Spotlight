"""AI use cases: provider CRUD + log analysis.

Business rules (single source of truth):
- A provider can be `enabled` only if no other provider is currently `enabled`.
  At most one active provider at any time.
- `is_default` is independent of `enabled` (so the UI can show a "default" hint
  even before the user activates it). At most one default.
- analyze_logs() rejects disabled or unknown providers; uses the provider row as
  configured (no fallback).
"""
from __future__ import annotations

from app.application.ports.outbound import AIRepositoryPort
from app.domain.entities.ai import AIAnalysisRequest, AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef
from app.interface.api.v1.schemas import AIAnalyzeOut

class SingleActiveProviderError(ValueError):
    """Raised when an operation would result in >1 enabled providers."""


class AIUseCases:
    def __init__(self, repo: AIRepositoryPort):
        self._repo = repo

    async def list_providers(self) -> list[AIProviderConfig]:
        """Return ALL providers (including disabled) so the UI can manage them."""
        return await self._repo.list_providers()

    async def list_enabled_providers(self) -> list[AIProviderConfig]:
        """Return only currently-active providers (used for log analysis)."""
        return [p for p in await self._repo.list_providers() if p.enabled]

    async def upsert_provider(self, cfg: AIProviderConfig) -> AIProviderConfig:
        cfg.validate()
        if cfg.enabled and not await self._can_enable(cfg.id):
            raise SingleActiveProviderError(
                "已有启用的 AI 模型，请先禁用后再切换（系统限制同时只可启用一个模型）。"
            )
        if cfg.id is None:
            return await self._repo.add_provider(cfg)
        return await self._repo.update_provider(cfg)

    async def delete_provider(self, provider_id: int) -> bool:
        return await self._repo.remove_provider(provider_id)

    async def set_default(self, provider_id: int) -> AIProviderConfig:
        return await self._repo.set_default(provider_id)

    async def analyze_logs(
        self, provider_id: int, ref: ResourceRef,
        log_lines: list[str], question: str,
    ) -> AIAnalyzeOut:
        cfg = await self._repo.get_provider(provider_id)
        if cfg is None:
            raise ValueError(f"ai provider {provider_id} not found")
        if not cfg.enabled:
            raise ValueError(f"ai provider {cfg.name} is disabled")

        bounded = log_lines[-200:]
        req = AIAnalysisRequest(
            provider_id=provider_id, pod_ref=ref, log_lines=bounded, question=question,
        )
        result = await self._repo.analyze(cfg, req)
        return AIAnalyzeOut(
            answer=result.answer,
            model=result.model,
            latency_ms=result.latency_ms or 0,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
        )

    async def _can_enable(self, exclude_id: int | None) -> bool:
        """True if enabling `exclude_id` (None for a new row) keeps active count ≤1."""
        for p in await self._repo.list_providers():
            if not p.enabled:
                continue
            if exclude_id is not None and p.id == exclude_id:
                continue
            return False
        return True
