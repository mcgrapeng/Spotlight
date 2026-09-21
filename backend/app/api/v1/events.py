from fastapi import APIRouter, Query

from app.schemas.k8s import EventInfo
from app.services import k8s_service

router = APIRouter()


@router.get("", response_model=list[EventInfo], summary="List K8s events")
def list_events(
    context: str | None = Query(default=None),
    namespace: str | None = Query(default=None, description="namespace name or '_all'"),
    involved_name: str | None = Query(default=None),
    limit: int = Query(default=200, le=1000),
):
    return k8s_service.list_events(
        context=context, namespace=namespace, involved_name=involved_name, limit=limit
    )
