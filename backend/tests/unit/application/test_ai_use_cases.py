"""Tests for AIUseCases + LiteLLM adapter (with mocked LiteLLM call)."""
from dataclasses import replace
from unittest.mock import patch

import pytest

from app.application.use_cases.ai import AIUseCases
from app.domain.entities.ai import AIAnalysisResult, AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef


class InMemoryAIProviderRepo:
    def __init__(self) -> None:
        self._store: dict[int, AIProviderConfig] = {}
        self._id = 0

    async def list(self):
        return list(self._store.values())

    async def get(self, provider_id):
        return self._store.get(provider_id)

    async def add(self, cfg):
        self._id += 1
        saved = replace(cfg, id=self._id)
        self._store[self._id] = saved
        return saved

    async def update(self, cfg):
        self._store[cfg.id] = cfg
        return cfg

    async def remove(self, pid):
        return self._store.pop(pid, None) is not None

    async def set_default(self, pid):
        self._store[pid] = replace(self._store[pid], is_default=True)
        return self._store[pid]


class FakeAIRepo:
    def __init__(self) -> None:
        self.providers = InMemoryAIProviderRepo()
        self.analysis_calls: list = []

    async def list_providers(self): return await self.providers.list()
    async def get_provider(self, provider_id: int): return await self.providers.get(provider_id)
    async def add_provider(self, cfg: AIProviderConfig): return await self.providers.add(cfg)
    async def update_provider(self, cfg: AIProviderConfig): return await self.providers.update(cfg)
    async def remove_provider(self, provider_id: int): return await self.providers.remove(provider_id)
    async def set_default(self, provider_id: int): return await self.providers.set_default(provider_id)

    async def analyze(self, cfg, req):
        self.analysis_calls.append((cfg, req))
        return AIAnalysisResult(
            answer=f"mock answer for {req.pod_ref.name}",
            model=cfg.model,
            latency_ms=42,
            input_tokens=10,
            output_tokens=5,
        )


@pytest.fixture
def uc():
    return AIUseCases(FakeAIRepo())


async def test_provider_validation(uc):
    with pytest.raises(ValueError):
        await uc.upsert_provider(AIProviderConfig(
            id=None, name="", provider="openai", model="gpt-4o", api_key="k",
        ))


async def test_provider_validate_temperature(uc):
    with pytest.raises(ValueError):
        await uc.upsert_provider(AIProviderConfig(
            id=None, name="x", provider="openai", model="gpt-4o", api_key="k",
            temperature=3.0,
        ))


async def test_analyze_unknown_provider(uc):
    with pytest.raises(ValueError):
        await uc.analyze_logs(
            provider_id=99,
            ref=ResourceRef(cluster="", namespace="ns", kind="Pod", name="p"),
            log_lines=["INFO x"], question="why",
        )


async def test_analyze_success(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k",
    ))
    result = await uc.analyze_logs(
        provider_id=saved.id,
        ref=ResourceRef(cluster="", namespace="ns", kind="Pod", name="p"),
        log_lines=["INFO x"] * 500,  # bounded to 200
        question="why",
    )
    assert "mock answer" in result.answer
    assert result.latency_ms == 42
    assert result.model == "gpt-4o-mini"


async def test_analyze_disabled_provider(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="x", provider="openai", model="m", api_key="k", enabled=False,
    ))
    with pytest.raises(ValueError):
        await uc.analyze_logs(saved.id, ResourceRef(cluster="", namespace="n", kind="Pod", name="p"), [], "?")


async def test_analyze_bounds_input(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="x", provider="openai", model="m", api_key="k",
    ))
    await uc.analyze_logs(
        saved.id,
        ResourceRef(cluster="", namespace="n", kind="Pod", name="p"),
        ["l"] * 500, "?",
    )
    _, req = uc._repo.analysis_calls[-1]
    assert len(req.log_lines) == 200
