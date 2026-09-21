from fastapi import APIRouter, Query

from app.schemas.k8s import ClusterInfo
from app.services import k8s_service

router = APIRouter()


@router.get("", response_model=list[ClusterInfo], summary="List kubeconfig contexts")
def list_clusters():
    return k8s_service.list_clusters()


@router.get("/current", summary="当前 context")
def current_cluster():
    items = k8s_service.list_clusters()
    current = next((c for c in items if c.get("is_current")), None)
    return current or (items[0] if items else {})
