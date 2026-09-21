from fastapi import APIRouter, Query

from app.schemas.k8s import NodeInfo
from app.services import k8s_service

router = APIRouter()


@router.get("", response_model=list[NodeInfo], summary="List nodes")
def list_nodes(context: str | None = Query(default=None)):
    return k8s_service.list_nodes(context=context)
