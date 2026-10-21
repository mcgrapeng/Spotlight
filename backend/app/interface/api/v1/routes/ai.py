"""AI routes: provider CRUD + log analysis."""
from __future__ import annotations

import json
from typing import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException, status
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
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import ai_uc, require_permission

router = APIRouter(tags=["ai"])
log = get_logger("ai.routes")


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
)
async def add_provider(payload: AIProviderIn, uc: AIUseCases = Depends(ai_uc)):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e


@router.put(
    "/ai/providers/{provider_id}",
    response_model=AIProviderOut,
    dependencies=[Depends(require_permission("ai.manage"))],
)
async def update_provider(
    provider_id: int, payload: AIProviderIn, uc: AIUseCases = Depends(ai_uc),
):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload, id=provider_id)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e


@router.delete(
    "/ai/providers/{provider_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("ai.manage"))],
)
async def delete_provider(provider_id: int, uc: AIUseCases = Depends(ai_uc)):
    ok = await uc.delete_provider(provider_id)
    if not ok:
        raise HTTPException(status_code=404, detail="provider not found")
    return None


@router.post(
    "/ai/providers/{provider_id}/default",
    response_model=AIProviderOut,
    dependencies=[Depends(require_permission("ai.manage"))],
)
async def set_default(provider_id: int, uc: AIUseCases = Depends(ai_uc)):
    return _to_out(await uc.set_default(provider_id))


@router.post(
    "/ai/ask",
    response_model=AIAnalyzeOut,
    summary="Answer a cluster-level question with the configured LLM",
    dependencies=[Depends(require_permission("ai.use"))],
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
    except ValueError as e:
        # ValueError only: a KeyError inside the use case is a server bug
        # and must stay a 5xx, not a 400.
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post(
    "/ai/ask/stream",
    summary="Answer a cluster-level question, streaming the answer as it arrives",
    dependencies=[Depends(require_permission("ai.use"))],
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
    dependencies=[Depends(require_permission("ai.use"))],
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
    except (ValueError, LookupError) as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return AIAnalyzeOut(
        answer=result.answer, model=result.model, latency_ms=result.latency_ms,
        input_tokens=result.input_tokens, output_tokens=result.output_tokens,
    )