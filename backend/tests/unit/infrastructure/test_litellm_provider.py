"""The litellm call is where a provider's key leaves the machine.

Two things are pinned here: the call carries an explicit timeout (the
browser gives up at 60s, so the server must not keep calling — and
paying — long after that), and the provider still reads the answer the
way it always did.
"""
from __future__ import annotations

import sys
import types
from types import SimpleNamespace

import pytest

from app.domain.entities.ai import AIAnalysisRequest, AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef
from app.infrastructure.ai.providers.litellm_provider import (
    LLM_CALL_TIMEOUT_SECONDS,
    LLMTimeoutError,
    LiteLLMAIRepository,
)


def _cfg(**overrides) -> AIProviderConfig:
    base = dict(id=1, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="sk-x")
    base.update(overrides)
    return AIProviderConfig(**base)


def _req() -> AIAnalysisRequest:
    return AIAnalysisRequest(
        provider_id=1,
        pod_ref=ResourceRef(cluster="c", namespace="ns", kind="Pod", name="p"),
        log_lines=["boom"],
    )


def _response(content: str = "because"):
    return SimpleNamespace(
        id="resp-1",
        model="gpt-4o-mini",
        usage=SimpleNamespace(prompt_tokens=11, completion_tokens=3),
        choices=[SimpleNamespace(message=SimpleNamespace(content=content))],
    )


@pytest.fixture
def fake_litellm(monkeypatch):
    """A stand-in for the litellm module (importing the real one is heavy)."""
    calls: list[dict] = []

    async def acompletion(**kwargs):
        calls.append(kwargs)
        return _response()

    module = types.ModuleType("litellm")
    module.acompletion = acompletion  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "litellm", module)
    return calls


async def test_a_timeout_gets_a_name_the_route_can_answer(monkeypatch):
    """The timeout is an expected outcome, not a crash.

    litellm's own exception escaped the route handlers as a bare 500, so
    the browser showed "Request failed with status code 500" instead of
    "the model was too slow".
    """

    async def acompletion(**kwargs):
        raise TimeoutError("the model did not answer")

    module = types.ModuleType("litellm")
    module.acompletion = acompletion  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "litellm", module)

    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]
    with pytest.raises(LLMTimeoutError):
        await repo.analyze(_cfg(), _req())


async def test_the_call_gives_up_before_the_browser_does(fake_litellm):
    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]

    await repo.analyze(_cfg(), _req())

    assert fake_litellm[0]["timeout"] == LLM_CALL_TIMEOUT_SECONDS
    # The frontend's own client timeout is 60s; the server has to be the
    # one that gives up first, or the model keeps running (and billing)
    # after the browser has gone.
    assert LLM_CALL_TIMEOUT_SECONDS < 60


async def test_the_answer_still_comes_back(fake_litellm):
    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]

    result = await repo.analyze(_cfg(), _req())

    assert result.answer == "because"
    assert result.input_tokens == 11
    assert result.output_tokens == 3


async def test_the_extra_dict_cannot_widen_the_timeout(fake_litellm):
    """`extra` is a passthrough for provider params, not for the guard."""
    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]

    await repo.analyze(_cfg(extra={"timeout": 600}), _req())

    assert fake_litellm[0]["timeout"] == LLM_CALL_TIMEOUT_SECONDS


async def _drain(repo, cfg, req):
    async for _text in repo.stream_analyze(cfg, req):
        pass


async def test_the_streaming_path_carries_the_timeout_too(monkeypatch):
    """A stream with no timeout is a model call that never ends.

    The browser giving up does not cancel the provider's work — the call
    keeps running, and keeps billing. On the streaming path the timeout is
    the READ timeout: the model has to produce something within it.
    """
    calls: list[dict] = []

    async def acompletion(**kwargs):
        calls.append(kwargs)

        async def chunks():
            yield SimpleNamespace(
                choices=[SimpleNamespace(delta=SimpleNamespace(content="hi"))]
            )

        return chunks()

    module = types.ModuleType("litellm")
    module.acompletion = acompletion  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "litellm", module)

    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]
    await _drain(repo, _cfg(), _req())

    assert calls[0]["timeout"] == LLM_CALL_TIMEOUT_SECONDS


async def test_the_extra_dict_cannot_widen_the_streaming_timeout(monkeypatch):
    calls: list[dict] = []

    async def acompletion(**kwargs):
        calls.append(kwargs)

        async def chunks():
            yield SimpleNamespace(
                choices=[SimpleNamespace(delta=SimpleNamespace(content="hi"))]
            )

        return chunks()

    module = types.ModuleType("litellm")
    module.acompletion = acompletion  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "litellm", module)

    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]
    await _drain(repo, _cfg(extra={"timeout": 600}), _req())

    assert calls[0]["timeout"] == LLM_CALL_TIMEOUT_SECONDS


async def test_a_streaming_timeout_gets_a_name_the_route_can_answer(monkeypatch):
    async def acompletion(**kwargs):
        raise TimeoutError("the model did not answer")

    module = types.ModuleType("litellm")
    module.acompletion = acompletion  # type: ignore[attr-defined]
    monkeypatch.setitem(sys.modules, "litellm", module)

    repo = LiteLLMAIRepository(providers=None)  # type: ignore[arg-type]
    with pytest.raises(LLMTimeoutError):
        await _drain(repo, _cfg(), _req())
