from fastapi import APIRouter, HTTPException, Query

from app.schemas.k8s import DashboardStats, PodInfo, PodListResponse
from app.services import k8s_service

router = APIRouter()


@router.get("", response_model=PodListResponse, summary="List pods")
def list_pods(
    context: str | None = Query(default=None),
    namespace: str | None = Query(default=None, description="namespace name or '_all'"),
    label_selector: str | None = Query(default=None),
    status: str = Query(default="all"),
    search: str | None = Query(default=None, description="按 pod/container/node 模糊匹配"),
):
    return k8s_service.list_pods(
        context=context,
        namespace=namespace,
        label_selector=label_selector,
        status=status,
        search=search,
    )


@router.get("/stats", response_model=DashboardStats, summary="Dashboard 聚合统计")
def stats(context: str | None = Query(default=None)):
    return k8s_service.dashboard_stats(context=context)


@router.get("/{namespace}/{name}", response_model=PodInfo, summary="Pod 详情")
def get_pod(
    namespace: str,
    name: str,
    context: str | None = Query(default=None),
):
    try:
        return k8s_service.get_pod(context, namespace, name)
    except Exception as e:  # K8s ApiException 等
        raise HTTPException(status_code=404, detail=str(e)) from e
