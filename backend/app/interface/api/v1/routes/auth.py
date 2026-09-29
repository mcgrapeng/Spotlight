"""Auth routes: Teleport tsh login + kube cluster fetch.

Three-step login (mirrors the operator's terminal flow):

  1. POST /auth/login         → `tsh login` (auth only)
  2. POST /auth/kube-login    → `tsh kube login <cluster>` (per chosen cluster)
  3. GET  /api/v1/clusters    → reads the kubeconfig written by step 2
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.infrastructure.auth.teleport import kube_login, list_kube_clusters
from app.infrastructure.auth.teleport import login as tsh_login
from app.infrastructure.auth.teleport import probe_rbac, tsh_available
from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger
from app.interface.api.v1.schemas import KubeLoginIn, KubeLoginOut, LoginIn, LoginOut

router = APIRouter(tags=["auth"])
log = get_logger("api.auth")


class StatusOut(BaseModel):
    configured: bool          # Teleport auth is set up on the server
    available: bool           # `tsh` binary is on PATH
    proxy: str
    user: str
    cluster: str
    # True when there's a kubeconfig on disk that the pool can read.
    # Frontend uses this to decide whether to show the login form on page
    # refresh: even though Teleport may be configured, an existing
    # kubeconfig means we already have a working session.
    session_valid: bool


def _kubeconfig_path() -> Path:
    """Where the in-process kube pool would read from. Mirror of
    `k8s.client.pool._resolve_path()` plus our tsh default.
    """
    s = get_settings()
    return Path(
        s.kubeconfig_path
        or os.environ.get("KUBECONFIG")
        or (Path.home() / "teleport-kubeconfig.yaml")
    )


@router.get("/auth/status", response_model=StatusOut)
def status() -> StatusOut:
    s = get_settings()
    # Ponytail: 检查多个候选路径(settings.kubeconfig_path → KUBECONFIG env
    # → ~/teleport-kubeconfig.yaml fallback)而不是单一路径。kube_login
    # 写过 KUBECONFIG env,但 settings.kubeconfig_path 可能仍为空 —— 单
    # 路径检查会出现 false-true 抖动,触发路由把已登录用户推回 /login。
    # 多候选路径保证"任一处有 kubeconfig 就视为 session valid"。
    candidates = [
        s.kubeconfig_path or None,
        os.environ.get("KUBECONFIG"),
        str(Path.home() / "teleport-kubeconfig.yaml"),
    ]
    session_valid = any(
        p and Path(p).exists() for p in candidates if p
    )
    return StatusOut(
        configured=s.teleport_configured,
        available=tsh_available(s.tsh_binary),
        proxy=s.teleport_proxy,
        user=s.teleport_user,
        cluster=s.teleport_cluster,
        session_valid=session_valid,
    )


@router.post("/auth/login", response_model=LoginOut)
async def post_login(payload: LoginIn) -> LoginOut:
    """Authenticate against the Teleport proxy and return the K8s clusters
    the user has access to. Does NOT fetch kube creds — that's a separate
    call so the UI can show a dropdown.
    """
    s = get_settings()
    if not s.teleport_configured:
        raise HTTPException(status_code=503, detail="Teleport proxy not configured on server")
    if not tsh_available(s.tsh_binary):
        raise HTTPException(status_code=503, detail=f"'{s.tsh_binary}' not found on PATH")
    res = await tsh_login(payload.password, otp=payload.otp)
    if not res.ok:
        raise HTTPException(status_code=401, detail=res.message or "login failed")
    return LoginOut(
        ok=True,
        proxy=res.proxy,
        user=res.user,
        cluster=res.cluster,
        kube_clusters=res.kube_clusters,
        message=res.message,
    )


@router.get("/auth/kube-clusters", response_model=list[str])
async def get_kube_clusters() -> list[str]:
    """Re-list K8s clusters available to the current tsh session. Useful
    when the frontend wants to refresh the dropdown without re-entering
    password.
    """
    return await list_kube_clusters()


@router.post("/auth/kube-login", response_model=KubeLoginOut)
async def post_kube_login(payload: KubeLoginIn) -> KubeLoginOut:
    """Run `tsh kube login <cluster>` against the existing tsh session and
    reload the in-process kubeconfig.
    """
    res = await kube_login(payload.cluster)
    if not res.ok:
        raise HTTPException(status_code=401, detail=res.message or "kube login failed")
    return KubeLoginOut(ok=True, cluster=res.cluster, message=res.message)


@router.get("/auth/permissions", response_model=dict[str, bool])
async def get_permissions() -> dict[str, bool]:
    """For each common K8s resource, ask `kubectl auth can-i list <res>` and
    return whether the current Teleport role allows it.

    The frontend uses this to distinguish "no data because the cluster is
    empty" from "no data because RBAC denied access" — most commonly the
    latter for `nodes` and `persistentvolumes` when a Teleport role wasn't
    given an explicit `kubernetes_resources` entry.
    """
    return await probe_rbac()