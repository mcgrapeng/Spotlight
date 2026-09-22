"""AI use cases: provider CRUD + log analysis."""
from __future__ import annotations

from app.application.dto import AnalyzeLogsResult
from app.application.ports.outbound import AIRepositoryPort
from app.domain.entities.ai import AIAnalysisRequest, AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef


class AIUseCases:
    def __init__(self, repo: AIRepositoryPort):
        self._repo = repo

    async def list_providers(self) -> list[AIProviderConfig]:
        providers = await self._repo.list_providers()
        return [p for p in providers if p.enabled]

    async def upsert_provider(self, cfg: AIProviderConfig) -> AIProviderConfig:
        cfg.validate()
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
    ) -> AnalyzeLogsResult:
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
        return AnalyzeLogsResult(
            answer=result.answer,
            model=result.model,
            latency_ms=result.latency_ms or 0,
            input_tokens=result.input_tokens,
            output_tokens=result.output_tokens,
        )
