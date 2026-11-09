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
from dataclasses import replace
from typing import AsyncIterator

from app.application.dto import AIAnalyzeOut
from app.application.ports.outbound import AIRepositoryPort
from app.domain.entities.ai import AIAnalysisRequest, AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef


class SingleActiveProviderError(ValueError):
    """Raised when an operation would result in >1 enabled providers."""


def _is_placeholder_key(key: str) -> bool:
    """Whether the key means "the caller did not type one".

    The API only ever hands out a masked key, so an edit round-trip carries
    `sk-a***b3cd` — a truthy string that is not a key. A real key never
    contains the mask.
    """
    return not key or "***" in key


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
        if cfg.id is not None:
            # The API only ever hands out a MASKED key, so an edit round-trip
            # can never carry the plaintext one. An empty key in the payload
            # means "keep the stored key", not "erase it" — and the merge has
            # to happen before validate(), which would otherwise reject the
            # edit outright ("api_key required").
            stored = await self._repo.get_provider(cfg.id)
            # "Keep the stored key" is an EMPTY key or the MASKED one the
            # API handed out (sk-a***b3cd) — a client that round-trips the
            # masked value would otherwise overwrite the secret with the
            # mask. The provider type has to match too: an OpenAI key
            # re-attached to another provider would be sent to it.
            if (
                stored is not None
                and stored.provider == cfg.provider
                and _is_placeholder_key(cfg.api_key)
            ):
                cfg = replace(cfg, api_key=stored.api_key)
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

    async def ask(
        self, provider_id: int, question: str, context: str,
    ) -> AIAnalyzeOut:
        """Answer a cluster-level question against a context snapshot."""
        cfg = await self._require_enabled_provider(provider_id)
        if not context.strip():
            raise ValueError("context is required to answer a cluster-level question")
        req = AIAnalysisRequest(
            provider_id=provider_id,
            pod_ref=ResourceRef(cluster="", namespace="", kind="Cluster", name=""),
            log_lines=[],
            question=question,
            context=context,
        )
        result = await self._repo.analyze(cfg, req)
        return AIAnalyzeOut(
            answer=result.answer,
            model=result.model,
            latency_ms=result.latency_ms or 0,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
        )

    async def check_ask(self, provider_id: int, context: str) -> AIProviderConfig:
        """Validate a cluster-level ask BEFORE the response starts.

        The streaming route has to answer 400 for a missing or disabled
        provider, but it cannot wait for the first token to find out — by
        then the response has already begun and the only way to report a
        failure is a broken stream. This is the same check `ask` does,
        hoisted so the route can run it first.
        """
        if not context.strip():
            raise ValueError("context is required to answer a cluster-level question")
        return await self._require_enabled_provider(provider_id)

    async def ask_stream(
        self, provider_id: int, question: str, context: str,
    ) -> AsyncIterator[str]:
        """Answer a cluster-level question, yielding the text as it arrives.

        The wait is the problem this solves: a cluster-level question
        takes the model tens of seconds, and a spinner for that long
        looks exactly like a hang. Run `check_ask` first so a bad
        provider is a 400 rather than a stream that dies mid-flight.
        """
        cfg = await self._require_enabled_provider(provider_id)
        if not context.strip():
            raise ValueError("context is required to answer a cluster-level question")
        req = AIAnalysisRequest(
            provider_id=provider_id,
            pod_ref=ResourceRef(cluster="", namespace="", kind="Cluster", name=""),
            log_lines=[],
            question=question,
            context=context,
        )
        async for text in self._repo.stream_analyze(cfg, req):
            yield text

    async def _require_enabled_provider(self, provider_id: int) -> AIProviderConfig:
        cfg = await self._repo.get_provider(provider_id)
        if cfg is None:
            raise ValueError(f"ai provider {provider_id} not found")
        if not cfg.enabled:
            raise ValueError(f"ai provider {cfg.name} is disabled")
        return cfg

    async def _can_enable(self, exclude_id: int | None) -> bool:
        """True if enabling `exclude_id` (None for a new row) keeps active count ≤1."""
        for p in await self._repo.list_providers():
            if not p.enabled:
                continue
            if exclude_id is not None and p.id == exclude_id:
                continue
            return False
        return True