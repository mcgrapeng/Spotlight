"""Tests for AI single-active-provider constraint."""
from __future__ import annotations

from dataclasses import replace

import pytest

from app.application.use_cases.ai import AIUseCases, SingleActiveProviderError
from app.domain.entities.ai import AIAnalysisResult, AIProviderConfig


class FakeProviderStore:
    def __init__(self) -> None:
        self._id = 0
        self._store: dict[int, AIProviderConfig] = {}

    async def list_providers(self): return list(self._store.values())
    async def get_provider(self, provider_id: int): return self._store.get(provider_id)
    async def add_provider(self, cfg):
        self._id += 1
        saved = replace(cfg, id=self._id)
        self._store[self._id] = saved
        return saved
    async def update_provider(self, cfg):
        self._store[cfg.id] = cfg
        return cfg
    async def remove_provider(self, provider_id: int):
        return self._store.pop(provider_id, None) is not None
    async def set_default(self, provider_id: int):
        self._store[provider_id] = replace(self._store[provider_id], is_default=True)
        return self._store[provider_id]
    async def analyze(self, cfg, req):
        return AIAnalysisResult(answer="ok", model=cfg.model, latency_ms=1)


def _cfg(name: str, *, enabled: bool = True, provider: str = "openai", model: str = "gpt-4o-mini") -> AIProviderConfig:
    return AIProviderConfig(
        id=None, name=name, provider=provider, model=model,
        api_key="sk-test", api_base=None, temperature=0.2, max_tokens=256,
        is_default=False, enabled=enabled, extra={},
    )


async def test_list_returns_all_including_disabled():
    store = FakeProviderStore()
    uc = AIUseCases(store)
    a = await uc.upsert_provider(_cfg("A"))
    b = await uc.upsert_provider(_cfg("B", enabled=False))
    all_ = await uc.list_providers()
    assert {p.name for p in all_} == {"A", "B"}
    enabled_only = await uc.list_enabled_providers()
    assert {p.name for p in enabled_only} == {"A"}


async def test_cannot_enable_two_providers():
    store = FakeProviderStore()
    uc = AIUseCases(store)
    await uc.upsert_provider(_cfg("A", enabled=True))
    with pytest.raises(SingleActiveProviderError):
        await uc.upsert_provider(_cfg("B", enabled=True))


async def test_can_enable_when_other_is_disabled():
    store = FakeProviderStore()
    uc = AIUseCases(store)
    a = await uc.upsert_provider(_cfg("A", enabled=True))
    # Disabling A and enabling B should succeed
    await uc.upsert_provider(replace(_cfg("A", enabled=False), id=a.id))
    b = await uc.upsert_provider(_cfg("B", enabled=True))
    assert b.enabled == True
    assert [p.name for p in await uc.list_enabled_providers()] == ["B"]


async def test_can_update_same_provider():
    store = FakeProviderStore()
    uc = AIUseCases(store)
    a = await uc.upsert_provider(_cfg("A", enabled=True))
    # Updating the SAME provider (with same id) to remain enabled should be allowed
    same = replace(a, temperature=0.7)
    updated = await uc.upsert_provider(same)
    assert updated.temperature == 0.7