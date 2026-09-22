"""Events route."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.application.use_cases.resources import ResourceUseCases
from app.interface.api.v1.dependencies import resource_uc
from app.interface.api.v1.schemas import EventOut

router = APIRouter(tags=["events"])


@router.get("/events", response_model=list[EventOut])
def list_events(
    cluster: str | None = Query(default=None),
    namespace: str | None = Query(default=None),
    involved: str | None = Query(default=None),
    limit: int = Query(default=200, le=1000),
    uc: ResourceUseCases = Depends(resource_uc),
):
    return uc.list_events(cluster, namespace, involved, limit)
