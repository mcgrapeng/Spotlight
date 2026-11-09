"""Routes: thin HTTP handlers. Each delegates to a focused use case."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query
from kubernetes.config import ConfigException

from app.application.use_cases.clusters import ClusterUseCases
from app.application.use_cases.namespaces import NamespaceUseCases
from app.application.use_cases.nodes import NodeUseCases
from app.application.dto import ClusterOut, NamespaceOut, NodeOut
from app.interface.api.v1.k8s_errors import k8s_call
from app.interface.api.v1.dependencies import (
    cluster_uc,
    namespace_uc,
    node_uc,
    require_permission,
)

router = APIRouter(tags=["clusters"])


@router.get(
    "/clusters",
    response_model=list[ClusterOut],
    dependencies=[Depends(require_permission("clusters.read"))],
)
async def list_clusters(uc: ClusterUseCases = Depends(cluster_uc)):
    try:
        return await uc.list_clusters()
    except ConfigException as e:
        # An empty/corrupt kubeconfig is an unusable dependency, not a crash:
        # report it as unavailable instead of a bare 500 (fuzz-found).
        raise HTTPException(status_code=503, detail=f"kubeconfig 无效：{e}") from e


@router.get(
    "/clusters/current",
    dependencies=[Depends(require_permission("clusters.read"))],
)
def current_cluster(uc: ClusterUseCases = Depends(cluster_uc)):
    return {"name": uc.current_cluster()}


@router.get(
    "/namespaces",
    response_model=list[NamespaceOut],
    dependencies=[Depends(require_permission("namespaces.read"))],
)
async def list_namespaces(
    context: str | None = Query(default=None),
    uc: NamespaceUseCases = Depends(namespace_uc),
):
    return await k8s_call(uc.list_namespaces(context), what="查询命名空间")


@router.get(
    "/nodes",
    response_model=list[NodeOut],
    dependencies=[Depends(require_permission("nodes.read"))],
)
async def list_nodes(
    context: str | None = Query(default=None),
    uc: NodeUseCases = Depends(node_uc),
):
    return await k8s_call(uc.list_nodes(context), what="查询节点")