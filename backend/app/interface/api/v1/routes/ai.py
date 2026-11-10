"""AI routes: provider CRUD + log analysis."""
from __future__ import annotations

import json
import time
from threading import Lock
from typing import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException, Path, Request, status
from sse_starlette.sse import EventSourceResponse

from app.application.dto import (
    AIAnalyzeIn,
    AIAnalyzeOut,
    AIAskIn,
    AIProviderIn,
    AIProviderOut,
)
from app.application.use_cases.ai import AIUseCases, SingleActiveProviderError
from app.domain.entities.ai import AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef
from app.infrastructure.ai.providers.litellm_provider import LLMTimeoutError
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import (
    ai_uc,
    current_session,
    require_permission,
)

router = APIRouter(tags=["ai"])
log = get_logger("ai.routes")

# sqlite INTEGER is int64 — a path id beyond it overflows the driver and
# turned into a 500 (found by API fuzzing). Out-of-range ids are a 422.
_MAX_SQL_ID = 2**63 - 1

# Every model call costs the operator money and ships cluster content to an
# external service, so the model routes get a budget. The login route has had
# a limiter for ages; these had none, so one script could call them in a loop.
_AI_WINDOW_SECONDS = 60.0
_AI_MAX_PER_MINUTE = 20
_ai_calls: dict[str, list[float]] = {}
_ai_lock = Lock()


# shortcut: 限流计数在进程内。单进程下每分钟 20 次是每用户 20 次；多 worker
# 下会变成每进程 20 次。同上，真要多 worker 时挪进共享存储。
def _ai_rate_limited(bucket: str) -> bool:
    """Whether this caller is over their model-call budget.

    The key is the SESSION TOKEN, not the username: the username is chosen
    by whoever logs in (the shared-token plugin accepts any name), so a
    budget keyed on it can be minted afresh by logging in again. The token
    is issued by the server and is not guessable.
    """
    now = time.monotonic()
    with _ai_lock:
        kept = [t for t in _ai_calls.get(bucket, []) if now - t < _AI_WINDOW_SECONDS]
        if not kept:
            # Drop the bucket once its window is empty, or every session that
            # ever called the model leaves an entry behind for good.
            _ai_calls.pop(bucket, None)
        if len(kept) >= _AI_MAX_PER_MINUTE:
            _ai_calls[bucket] = kept
            return True
        kept.append(now)
        _ai_calls[bucket] = kept
        return False


def _limit_model_calls(request: Request) -> None:
    """Dependency: refuse the call when the caller is over their budget."""
    if _ai_rate_limited(current_session(request).token):
        raise HTTPException(status_code=429, detail="AI 请求过于频繁，请稍后再试")


def _to_entity(p: AIProviderIn, *, id: int | None = None) -> AIProviderConfig:
    return AIProviderConfig(
        id=id,
        name=p.name, provider=p.provider, model=p.model,
        api_key=p.api_key, api_base=p.api_base,
        temperature=p.temperature, max_tokens=p.max_tokens,
        is_default=p.is_default, enabled=p.enabled, extra=p.extra,
    )


def _mask_key(k: str) -> str:
    if not k:
        return ""
    if len(k) <= 8:
        return "***"
    return f"{k[:4]}***{k[-4:]}"


def _to_out(p: AIProviderConfig) -> AIProviderOut:
    return AIProviderOut(
        id=p.id or 0, name=p.name, provider=p.provider, model=p.model,
        api_base=p.api_base, temperature=p.temperature, max_tokens=p.max_tokens,
        is_default=p.is_default, enabled=p.enabled, extra=p.extra,
        api_key_masked=_mask_key(p.api_key),
    )


@router.get(
    "/ai/providers",
    response_model=list[AIProviderOut],
    # Reading the provider list is part of USING the AI panel (it picks the
    # model to call), not of managing it — so it needs `ai.use`, not
    # `ai.manage`.
    dependencies=[Depends(require_permission("ai.use"))],
)
async def list_providers(uc: AIUseCases = Depends(ai_uc)):
    """Return ALL providers (enabled + disabled) so the UI can manage them."""
    return [_to_out(p) for p in await uc.list_providers()]


@router.post(
    "/ai/providers",
    response_model=AIProviderOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("ai.manage"))],
    responses={400: {"description": "Invalid provider configuration"}},
)
async def add_provider(payload: AIProviderIn, uc: AIUseCases = Depends(ai_uc)):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except ValueError as e:
        # Domain validation ("api_key required for non-ollama provider"):
        # bad input is a 400, never a 500. ValueError only — a KeyError
        # inside the use case is a server bug and must stay a 5xx.
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.put(
    "/ai/providers/{provider_id}",
    response_model=AIProviderOut,
    dependencies=[Depends(require_permission("ai.manage"))],
    responses={
        400: {"description": "Invalid provider configuration"},
        404: {"description": "Provider not found"},
    },
)
async def update_provider(
    payload: AIProviderIn,
    provider_id: int = Path(ge=1, le=_MAX_SQL_ID),
    uc: AIUseCases = Depends(ai_uc),
):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload, id=provider_id)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.delete(
    "/ai/providers/{provider_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("ai.manage"))],
    responses={404: {"description": "Provider not found"}},
)
async def delete_provider(
    provider_id: int = Path(ge=1, le=_MAX_SQL_ID),
    uc: AIUseCases = Depends(ai_uc),
):
    ok = await uc.delete_provider(provider_id)
    if not ok:
        raise HTTPException(status_code=404, detail="provider not found")
    return None


@router.post(
    "/ai/providers/{provider_id}/default",
    response_model=AIProviderOut,
    dependencies=[Depends(require_permission("ai.manage"))],
    responses={404: {"description": "Provider not found"}},
)
async def set_default(
    provider_id: int = Path(ge=1, le=_MAX_SQL_ID),
    uc: AIUseCases = Depends(ai_uc),
):
    try:
        return _to_out(await uc.set_default(provider_id))
    except LookupError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.post(
    "/ai/ask",
    response_model=AIAnalyzeOut,
    summary="Answer a cluster-level question with the configured LLM",
    dependencies=[
        Depends(require_permission("ai.use")),
        Depends(_limit_model_calls),
    ],
)
async def ask(
    payload: AIAskIn,
    uc: AIUseCases = Depends(ai_uc),
):
    """Answer a question about the cluster from a context snapshot.

    The pod route below answers "why is this pod broken" from its logs. This
    one answers "which pod is broken" and "what should I look at first" —
    the questions a reader has before they know which pod to open. The
    response shape is the same on purpose, so the UI renders both with one
    component.
    """
    try:
        return await uc.ask(payload.provider_id, payload.question, payload.context)
    except LLMTimeoutError as e:
        raise HTTPException(status_code=504, detail="模型响应超时，请稍后再试") from e
    except ValueError as e:
        # ValueError only: a KeyError inside the use case is a server bug
        # and must stay a 5xx, not a 400.
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post(
    "/ai/ask/stream",
    summary="Answer a cluster-level question, streaming the answer as it arrives",
    dependencies=[
        Depends(require_permission("ai.use")),
        Depends(_limit_model_calls),
    ],
)
async def ask_stream(
    payload: AIAskIn,
    uc: AIUseCases = Depends(ai_uc),
):
    """The same answer as `/ai/ask`, delivered token by token.

    A cluster-level question takes the model tens of seconds. A spinner
    for that long is indistinguishable from a hang, so the panel shows
    the answer as it is written.

    The provider is checked before the response starts, so a missing or
    disabled provider is a 400 rather than a stream that dies halfway
    through.
    """
    try:
        await uc.check_ask(payload.provider_id, payload.context)
    except ValueError as e:
        # ValueError only: a KeyError inside the use case is a server bug
        # and must stay a 5xx, not a 400.
        raise HTTPException(status_code=400, detail=str(e)) from e

    async def event_gen() -> AsyncIterator[dict]:
        try:
            async for text in uc.ask_stream(
                payload.provider_id, payload.question, payload.context,
            ):
                yield {"event": "delta", "data": json.dumps({"text": text}, ensure_ascii=False)}
        except LLMTimeoutError:
            # The model did not answer within the call timeout. The response
            # has already begun, so this cannot be a 504 any more — report it
            # in-band, and say what actually happened.
            log.error("ai.ask.stream.timeout")
            yield {
                "event": "error",
                "data": json.dumps({"detail": "模型响应超时，请稍后再试"}, ensure_ascii=False),
            }
        except Exception as exc:  # noqa: BLE001
            # The response has already begun, so this cannot be an HTTP
            # status any more. Report it in-band and let the client decide
            # what to show.
            #
            # The message sent to the client is generic on purpose: a
            # provider exception can carry the request payload, and the
            # payload carries the question and the cluster snapshot. The
            # detail goes to the server log, where it belongs.
            log.error("ai.ask.stream.failed", error=str(exc))
            yield {
                "event": "error",
                "data": json.dumps({"detail": "the model call failed — see the server log"}, ensure_ascii=False),
            }
        yield {"event": "done", "data": "[DONE]"}

    return EventSourceResponse(event_gen())


@router.post(
    "/ai/analyze/{namespace}/{name}",
    response_model=AIAnalyzeOut,
    summary="Analyze pod logs with the configured LLM",
    dependencies=[
        Depends(require_permission("ai.use")),
        # 日志分析会把日志原文发给模型，所以它需要读日志的权限。
        #
        # 只有 ai.use 不够：那会让「有权用模型、但无权读日志」的角色
        # 也能把日志内容（哪怕是粘贴进来的）送到外部模型去。而日志是
        # 集群读取里敏感的那一半——viewer 角色被故意排除在 pods.logs
        # 之外，就是这个原因。
        Depends(require_permission("pods.logs")),
        Depends(_limit_model_calls),
    ],
)
async def analyze_logs(
    namespace: str,
    name: str,
    payload: AIAnalyzeIn,
    context: str | None = None,
    uc: AIUseCases = Depends(ai_uc),
):
    ref = ResourceRef(cluster=context or "", namespace=namespace, kind="Pod", name=name)
    try:
        result = await uc.analyze_logs(payload.provider_id, ref, payload.log_lines, payload.question)
    except LLMTimeoutError as e:
        raise HTTPException(status_code=504, detail="模型响应超时，请稍后再试") from e
    except (ValueError, LookupError) as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return AIAnalyzeOut(
        answer=result.answer, model=result.model, latency_ms=result.latency_ms,
        input_tokens=result.input_tokens, output_tokens=result.output_tokens,
    )