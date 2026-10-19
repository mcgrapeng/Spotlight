"""AI routes: provider CRUD + log analysis."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dto import (
    AIAnalyzeIn,
    AIAnalyzeOut,
    AIProviderIn,
    AIProviderOut,
)
from app.application.use_cases.ai import AIUseCases, SingleActiveProviderError
from app.domain.entities.ai import AIProviderConfig
from app.domain.value_objects.primitives import ResourceRef
from app.interface.api.v1.dependencies import ai_uc

router = APIRouter(tags=["ai"])


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


@router.get("/ai/providers", response_model=list[AIProviderOut])
async def list_providers(uc: AIUseCases = Depends(ai_uc)):
    """Return ALL providers (enabled + disabled) so the UI can manage them."""
    return [_to_out(p) for p in await uc.list_providers()]


@router.post("/ai/providers", response_model=AIProviderOut, status_code=status.HTTP_201_CREATED)
async def add_provider(payload: AIProviderIn, uc: AIUseCases = Depends(ai_uc)):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e


@router.put("/ai/providers/{provider_id}", response_model=AIProviderOut)
async def update_provider(
    provider_id: int, payload: AIProviderIn, uc: AIUseCases = Depends(ai_uc),
):
    try:
        return _to_out(await uc.upsert_provider(_to_entity(payload, id=provider_id)))
    except SingleActiveProviderError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e


@router.delete("/ai/providers/{provider_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_provider(provider_id: int, uc: AIUseCases = Depends(ai_uc)):
    ok = await uc.delete_provider(provider_id)
    if not ok:
        raise HTTPException(status_code=404, detail="provider not found")
    return None


@router.post("/ai/providers/{provider_id}/default", response_model=AIProviderOut)
async def set_default(provider_id: int, uc: AIUseCases = Depends(ai_uc)):
    return _to_out(await uc.set_default(provider_id))


@router.post(
    "/ai/analyze/{namespace}/{name}",
    response_model=AIAnalyzeOut,
    summary="Analyze pod logs with the configured LLM",
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