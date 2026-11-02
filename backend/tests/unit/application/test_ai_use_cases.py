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

    async def stream_analyze(self, cfg, req):
        self.analysis_calls.append((cfg, req))
        for piece in ("mock ", "answer ", "streamed"):
            yield piece


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


async def test_ask_unknown_provider(uc):
    with pytest.raises(ValueError):
        await uc.ask(provider_id=99, question="which pod?", context="total=1 running=1")


async def test_ask_disabled_provider(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="x", provider="openai", model="m", api_key="k", enabled=False,
    ))
    with pytest.raises(ValueError):
        await uc.ask(saved.id, "which pod?", "total=1 running=1")


async def test_ask_carries_the_context_and_the_question(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k",
    ))
    result = await uc.ask(saved.id, "which pod is restarting?", "total=287 running=258")
    assert "mock answer" in result.answer
    _, req = uc._repo.analysis_calls[-1]
    # The context replaces the log excerpt: there is no pod here.
    assert req.context == "total=287 running=258"
    assert req.question == "which pod is restarting?"
    assert req.log_lines == []


def test_ask_prompt_carries_the_question_and_the_context():
    from app.infrastructure.ai.prompts.templates import build_ask_prompt

    prompt = build_ask_prompt("which pod?", "total=287 running=258")
    assert "which pod?" in prompt
    assert "total=287 running=258" in prompt


async def test_check_ask_rejects_a_disabled_provider(uc):
    """The streaming route has to know before the response starts."""
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="x", provider="openai", model="m", api_key="k", enabled=False,
    ))
    with pytest.raises(ValueError):
        await uc.check_ask(saved.id, "total=1")


async def test_check_ask_rejects_an_empty_context(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="OpenAI", provider="openai", model="m", api_key="k",
    ))
    with pytest.raises(ValueError):
        await uc.check_ask(saved.id, "   ")


async def test_ask_stream_yields_the_answer_in_pieces(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k",
    ))
    pieces = []
    async for text in uc.ask_stream(saved.id, "which pod?", "total=287 running=258"):
        pieces.append(text)
    assert "".join(pieces) == "mock answer streamed"
    _, req = uc._repo.analysis_calls[-1]
    assert req.context == "total=287 running=258"
    assert req.question == "which pod?"


async def test_ask_stream_rejects_a_disabled_provider(uc):
    saved = await uc.upsert_provider(AIProviderConfig(
        id=None, name="x", provider="openai", model="m", api_key="k", enabled=False,
    ))
    with pytest.raises(ValueError):
        async for _ in uc.ask_stream(saved.id, "which pod?", "total=1"):
            pass


async def test_ask_uses_the_cluster_prompt():
    """A context switches the adapter to the cluster prompt, not the log one."""
    from app.infrastructure.ai.prompts.templates import ASK_SYSTEM_PROMPT, SYSTEM_PROMPT
    from app.infrastructure.ai.providers.litellm_provider import LiteLLMAIRepository

    repo = FakeAIRepo()
    saved = await repo.add_provider(AIProviderConfig(
        id=None, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k",
    ))
    captured: list = []

    class _Resp:
        model = "gpt-4o-mini"
        id = "x"
        choices = [type("C", (), {"message": type("M", (), {"content": "hi"})()})()]
        usage = type("U", (), {"prompt_tokens": 1, "completion_tokens": 1})()

    async def fake_acompletion(**kwargs):
        captured.append(kwargs)
        return _Resp()

    with patch("litellm.acompletion", new=fake_acompletion):
        adapter = LiteLLMAIRepository(repo)
        await adapter.analyze(saved, type("R", (), {
            "question": "which pod?", "context": "total=1", "pod_ref": None, "log_lines": [],
        })())
        await adapter.analyze(saved, type("R", (), {
            "question": "why?", "context": "",
            "pod_ref": ResourceRef(cluster="", namespace="ns", kind="Pod", name="p"),
            "log_lines": ["x"],
        })())

    assert captured[0]["messages"][0]["content"] == ASK_SYSTEM_PROMPT
    assert "total=1" in captured[0]["messages"][1]["content"]
    assert captured[1]["messages"][0]["content"] == SYSTEM_PROMPT
