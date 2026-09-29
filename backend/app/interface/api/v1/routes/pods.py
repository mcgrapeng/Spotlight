"""Pod routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query

from app.application.use_cases.resources import ResourceUseCases
from app.domain.value_objects.primitives import ResourceRef
from app.interface.api.v1.dependencies import resource_uc
from app.interface.api.v1.schemas import DashboardOut, PodListOut, PodOut

router = APIRouter(tags=["pods"])


@router.get("/pods", response_model=PodListOut)
async def list_pods(
    cluster: str | None = Query(default=None),
    namespace: str | None = Query(default=None, description="namespace name or '_all'"),
    status: str = Query(default="all"),
    search: str | None = Query(default=None),
    label_selector: str | None = Query(default=None),
    uc: ResourceUseCases = Depends(resource_uc),
):
    return await uc.list_pods(cluster, namespace, status, search, label_selector)


@router.get("/pods/stats", response_model=DashboardOut)
async def stats(
    cluster: str | None = Query(default=None),
    uc: ResourceUseCases = Depends(resource_uc),
):
    return await uc.dashboard(cluster)


@router.get("/pods/{namespace}/{name}", response_model=PodOut)
async def get_pod(
    namespace: str,
    name: str,
    cluster: str | None = Query(default=None),
    uc: ResourceUseCases = Depends(resource_uc),
):
    try:
        return await uc.get_pod(
            ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name)
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
