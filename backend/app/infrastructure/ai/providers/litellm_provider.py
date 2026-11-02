"""LiteLLM-backed adapter implementing AIRepositoryPort.

LiteLLM is imported lazily to avoid pulling its pydantic v1 type surface
at app startup (it transitively defines ReadOnly[Literal[...]] that our
pydantic v2 settings cannot introspect).
"""
from __future__ import annotations

import time
from typing import TYPE_CHECKING, AsyncIterator

from app.application.ports.outbound import AIRepositoryPort
from app.domain.entities.ai import AIAnalysisRequest, AIAnalysisResult, AIProviderConfig
from app.infrastructure.ai.prompts.templates import (
    ASK_SYSTEM_PROMPT,
    SYSTEM_PROMPT,
    build_ask_prompt,
    build_user_prompt,
)
from app.infrastructure.ai.providers.sql_provider import SQLAIProviderRepository
from app.infrastructure.logging import get_logger

if TYPE_CHECKING:
    pass  # litellm is never imported here at type-check time

log = get_logger("ai.litellm")


class LiteLLMAIRepository(AIRepositoryPort):
    def __init__(self, providers: SQLAIProviderRepository):
        self._providers = providers

    async def list_providers(self) -> list[AIProviderConfig]:
        return await self._providers.list()

    async def get_provider(self, provider_id: int) -> AIProviderConfig | None:
        return await self._providers.get(provider_id)

    async def add_provider(self, cfg: AIProviderConfig) -> AIProviderConfig:
        return await self._providers.add(cfg)

    async def update_provider(self, cfg: AIProviderConfig) -> AIProviderConfig:
        return await self._providers.update(cfg)

    async def remove_provider(self, provider_id: int) -> bool:
        return await self._providers.remove(provider_id)

    async def set_default(self, provider_id: int) -> AIProviderConfig:
        return await self._providers.set_default(provider_id)

    async def analyze(self, cfg: AIProviderConfig, req: AIAnalysisRequest) -> AIAnalysisResult:
        # Lazy import — litellm module surface is heavy and not pydantic-v2-clean.
        import litellm  # type: ignore

        messages = self._build_messages(req)
        kwargs = self._build_call_kwargs(cfg, messages)
        started = time.perf_counter()
        try:
            response = await litellm.acompletion(**kwargs)
        except Exception as e:
            log.error("ai.call.failed", error=str(e), provider=cfg.provider, model=cfg.model)
            raise
        latency_ms = int((time.perf_counter() - started) * 1000)
        choices = getattr(response, "choices", None) or []
        answer = ""
        if choices:
            msg = getattr(choices[0], "message", None)
            if msg is not None:
                answer = getattr(msg, "content", "") or ""
        usage = getattr(response, "usage", None) or {}
        return AIAnalysisResult(
            answer=answer,
            model=getattr(response, "model", None) or cfg.model,
            input_tokens=getattr(usage, "prompt_tokens", None),
            output_tokens=getattr(usage, "completion_tokens", None),
            latency_ms=latency_ms,
            raw={"id": getattr(response, "id", "") or ""},
        )

    async def stream_analyze(
        self, cfg: AIProviderConfig, req: AIAnalysisRequest,
    ) -> AsyncIterator[str]:
        """Yield the answer's text as the model produces it.

        Same call as `analyze`, with `stream=True`. The provider-neutral
        bit: every provider LiteLLM fronts normalises the streaming shape
        to chunks with `choices[0].delta.content`, and the role-only first
        chunk carries no text.
        """
        import litellm  # type: ignore

        messages = self._build_messages(req)
        kwargs = self._build_call_kwargs(cfg, messages)
        kwargs["stream"] = True
        try:
            stream = await litellm.acompletion(**kwargs)
            async for chunk in stream:
                choices = getattr(chunk, "choices", None) or []
                if not choices:
                    continue
                delta = getattr(choices[0], "delta", None)
                text = getattr(delta, "content", None) if delta is not None else None
                if text:
                    yield text
        except Exception as e:
            log.error("ai.stream.failed", error=str(e), provider=cfg.provider, model=cfg.model)
            raise

    @staticmethod
    def _build_messages(req: AIAnalysisRequest) -> list[dict]:
        if req.context:
            # A cluster-level question: different system rules, and the
            # context replaces the log excerpt.
            return [
                {"role": "system", "content": ASK_SYSTEM_PROMPT},
                {"role": "user", "content": build_ask_prompt(req.question, req.context)},
            ]
        return [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(req.question, req.pod_ref, req.log_lines)},
        ]

    @staticmethod
    def _build_call_kwargs(cfg: AIProviderConfig, messages: list[dict]) -> dict:
        model = (
            f"{cfg.provider}/{cfg.model}"
            if cfg.provider not in ("ollama", "openai") or "/" not in cfg.model
            else cfg.model
        )
        kwargs: dict = {
            "model": model,
            "messages": messages,
            "temperature": cfg.temperature,
            "max_tokens": cfg.max_tokens,
        }
        if cfg.api_key:
            kwargs["api_key"] = cfg.api_key
        if cfg.api_base:
            kwargs["api_base"] = cfg.api_base
        if cfg.extra:
            kwargs.update(cfg.extra)
        return kwargs
