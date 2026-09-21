from fastapi import APIRouter, Query

from app.schemas.k8s import NamespaceInfo
from app.services import k8s_service

router = APIRouter()


@router.get("", response_model=list[NamespaceInfo], summary="List namespaces")
def list_namespaces(context: str | None = Query(default=None)):
    return k8s_service.list_namespaces(context)
