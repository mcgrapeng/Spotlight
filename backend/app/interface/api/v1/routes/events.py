"""Events route."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.application.dto import EventOut
from app.application.use_cases.events import EventUseCases
from app.interface.api.v1.dependencies import event_uc, require_permission
from app.interface.api.v1.k8s_errors import k8s_call

router = APIRouter(tags=["events"])


@router.get(
    "/events",
    response_model=list[EventOut],
    dependencies=[Depends(require_permission("events.read"))],
)
async def list_events(
    context: str | None = Query(default=None),
    namespace: str | None = Query(default=None),
    involved: str | None = Query(default=None),
    limit: int = Query(default=200, le=1000),
    uc: EventUseCases = Depends(event_uc),
):
    return await k8s_call(
        uc.list_events(context, namespace, involved, limit),
        what="查询事件",
    )