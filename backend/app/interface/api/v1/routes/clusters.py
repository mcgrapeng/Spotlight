"""Routes: thin HTTP handlers. Each delegates to a focused use case."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.application.use_cases.clusters import ClusterUseCases
from app.application.use_cases.namespaces import NamespaceUseCases
from app.application.use_cases.nodes import NodeUseCases
from app.application.dto import ClusterOut, NamespaceOut, NodeOut
from app.interface.api.v1.dependencies import (
    cluster_uc,
    namespace_uc,
    node_uc,
)

router = APIRouter(tags=["clusters"])


@router.get("/clusters", response_model=list[ClusterOut])
async def list_clusters(uc: ClusterUseCases = Depends(cluster_uc)):
    return await uc.list_clusters()


@router.get("/clusters/current")
def current_cluster(uc: ClusterUseCases = Depends(cluster_uc)):
    return {"name": uc.current_cluster()}


@router.get("/namespaces", response_model=list[NamespaceOut])
async def list_namespaces(
    cluster: str | None = Query(default=None),
    uc: NamespaceUseCases = Depends(namespace_uc),
):
    return await uc.list_namespaces(cluster)


@router.get("/nodes", response_model=list[NodeOut])
async def list_nodes(
    cluster: str | None = Query(default=None),
    uc: NodeUseCases = Depends(node_uc),
):
    return await uc.list_nodes(cluster)