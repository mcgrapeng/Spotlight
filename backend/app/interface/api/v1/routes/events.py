"""Events route."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.application.dto import EventOut
from app.application.use_cases.events import EventUseCases
from app.interface.api.v1.dependencies import event_uc

router = APIRouter(tags=["events"])


@router.get("/events", response_model=list[EventOut])
async def list_events(
    context: str | None = Query(default=None),
    namespace: str | None = Query(default=None),
    involved: str | None = Query(default=None),
    limit: int = Query(default=200, le=1000),
    uc: EventUseCases = Depends(event_uc),
):
    return await uc.list_events(context, namespace, involved, limit)