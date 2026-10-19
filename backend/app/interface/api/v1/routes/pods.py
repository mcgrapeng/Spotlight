"""Pod routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from kubernetes.client.exceptions import ApiException

from app.application.dto import DashboardOut, PodListOut, PodOut
from app.application.use_cases.dashboard import DashboardUseCases
from app.application.use_cases.pods import PodUseCases
from app.domain.value_objects.primitives import ResourceRef
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import dashboard_uc, pod_uc

router = APIRouter(tags=["pods"])
log = get_logger("api.pods")


@router.get("/pods", response_model=PodListOut)
async def list_pods(
    context: str | None = Query(default=None),
    namespace: str | None = Query(default=None, description="namespace name or '_all'"),
    status: str = Query(default="all"),
    search: str | None = Query(default=None),
    label_selector: str | None = Query(default=None),
    uc: PodUseCases = Depends(pod_uc),
):
    return await uc.list_pods(context, namespace, status, search, label_selector)


@router.get("/pods/stats", response_model=DashboardOut)
async def stats(
    context: str | None = Query(default=None),
    uc: DashboardUseCases = Depends(dashboard_uc),
):
    return await uc.build(context)


@router.get("/pods/{namespace}/{name}", response_model=PodOut)
async def get_pod(
    namespace: str,
    name: str,
    context: str | None = Query(default=None),
    uc: PodUseCases = Depends(pod_uc),
):
    try:
        return await uc.get_pod(
            ResourceRef(cluster=context or "", namespace=namespace, kind="Pod", name=name)
        )
    except ApiException as e:
        # Only a genuine not-found is a 404 — auth/ratelimit/timeout must
        # not masquerade as "pod doesn't exist".
        if e.status == 404:
            raise HTTPException(status_code=404, detail="Pod 不存在或已被删除") from e
        if e.status in (401, 403):
            raise HTTPException(status_code=e.status, detail="无权访问该 Pod") from e
        log.warning("api.pods.get.failed", status=e.status, detail=e.reason)
        raise HTTPException(status_code=502, detail="K8s API 请求失败") from e
    except Exception:
        log.exception("api.pods.get.error", pod=f"{namespace}/{name}")
        raise HTTPException(status_code=502, detail="查询 Pod 失败") from None