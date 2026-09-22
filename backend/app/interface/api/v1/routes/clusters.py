"""Routes: thin HTTP handlers. Each delegates to a use case (one line of business)."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.application.use_cases.resources import ResourceUseCases
from app.interface.api.v1.dependencies import resource_uc
from app.interface.api.v1.schemas import ClusterOut, NamespaceOut, NodeOut

router = APIRouter(tags=["clusters"])


@router.get("/clusters", response_model=list[ClusterOut])
def list_clusters(uc: ResourceUseCases = Depends(resource_uc)):
    return uc.list_clusters()


@router.get("/clusters/current")
def current_cluster(uc: ResourceUseCases = Depends(resource_uc)):
    return {"name": uc.current_cluster()}


@router.get("/namespaces", response_model=list[NamespaceOut])
def list_namespaces(
    cluster: str | None = Query(default=None),
    uc: ResourceUseCases = Depends(resource_uc),
):
    return uc.list_namespaces(cluster)


@router.get("/nodes", response_model=list[NodeOut])
def list_nodes(
    cluster: str | None = Query(default=None),
    uc: ResourceUseCases = Depends(resource_uc),
):
    return uc.list_nodes(cluster)
