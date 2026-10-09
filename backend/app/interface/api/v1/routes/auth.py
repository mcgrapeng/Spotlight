"""Auth routes: API-token login + per-session Teleport plugin entry points.

Three-step login (mirrors the operator's terminal flow):

  1. POST /auth/login         → API_TOKEN check OR 503 redirect to plugin flow
  2. (plugin)                 → Teleport login via `TeleportPlugin.login`
  3. (plugin)                 → kube creds via `TeleportPlugin.acquire`
  GET  /api/v1/clusters       → reads the kubeconfig written by step 3

Teleport auth moved to the plugin path (Task 4). The legacy `login()` /
`kube_login()` helpers in `app.infrastructure.auth.teleport` are retired;
the new endpoints that drive `TeleportPlugin` land in Task 5/6. Until then
the teleport-specific POST endpoints here return 503 so callers get a
clear "wrong flow" signal instead of an import error.
"""
from __future__ import annotations

import os
import secrets
import time
from pathlib import Path
from threading import Lock

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.application.dto import (
    KubeLoginIn,
    KubeLoginOut,
    LoginIn,
    LoginOut,
    StatusOut,
)
from app.infrastructure.auth import session as session_store
from app.infrastructure.auth.plugins.teleport import tsh_available
from app.infrastructure.auth.rbac import probe_rbac
from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import require_auth

router = APIRouter(tags=["auth"])
log = get_logger("api.auth")

# ── Login rate limiting (in-memory, per client IP) ────────────────────────
_RATE_WINDOW = 300.0  # seconds
_RATE_MAX = 10        # attempts per window
_attempts: dict[str, list[float]] = {}
_attempts_lock = Lock()


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _attempts_lock:
        kept = [t for t in _attempts.get(ip, []) if now - t < _RATE_WINDOW]
        if len(kept) >= _RATE_MAX:
            _attempts[ip] = kept
            return True
        kept.append(now)
        _attempts[ip] = kept
        return False


def _issue_cookie(response: Response, request: Request) -> None:
    s = get_settings()
    token = session_store.issue(s.session_ttl_seconds)
    response.set_cookie(
        session_store.COOKIE_NAME,
        token,
        max_age=s.session_ttl_seconds,
        httponly=True,
        samesite="strict",
        secure=request.url.scheme == "https",
        path="/",
    )


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
def status(request: Request) -> StatusOut:
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
        # Username is per-session now (TeleportPlugin.login(username, ...));
        # no global `teleport_user` setting on the server.
        user="",
        cluster=s.teleport_cluster,
        session_valid=session_valid,
        auth_required=bool(s.teleport_configured or s.api_token),
        client_session=_has_session(request),
    )


def _has_session(request: Request) -> bool:
    s = get_settings()
    header = request.headers.get("authorization", "")
    if s.api_token and secrets.compare_digest(header, f"Bearer {s.api_token}"):
        return True
    return session_store.validate(request.cookies.get(session_store.COOKIE_NAME))


@router.post("/auth/login", response_model=LoginOut)
async def post_login(payload: LoginIn, request: Request, response: Response) -> LoginOut:
    """API-token login only. Teleport login moved to the plugin path
    (POST /auth/login-via-plugin, Task 5) which yields a per-session
    `Identity` and calls `create_session()`.

    Without Teleport, a configured API_TOKEN can be presented as the
    password to open a session (host-bound deployments).
    """
    s = get_settings()
    ip = request.client.host if request.client else "unknown"
    if _rate_limited(ip):
        raise HTTPException(status_code=429, detail="尝试过于频繁，请稍后再试")

    if s.teleport_configured:
        # Teleport login now lives in the plugin flow. The legacy endpoint
        # refuses so callers (and our own test suite) get a clear signal
        # to use the new route instead of receiving a stale 200.
        raise HTTPException(
            status_code=503,
            detail="Teleport login moved to plugin flow (POST /auth/login-via-plugin)",
        )

    if s.api_token:
        if secrets.compare_digest(payload.password, s.api_token):
            _issue_cookie(response, request)
            return LoginOut(ok=True, proxy="", user="", cluster="", kube_clusters=[], message="ok")
        log.warning("auth.login.failed", reason="bad api token", ip=ip)
        raise HTTPException(status_code=401, detail="访问令牌错误")
    raise HTTPException(status_code=503, detail="Teleport proxy not configured on server")


@router.get("/auth/kube-clusters", response_model=list[str], dependencies=[Depends(require_auth)])
async def get_kube_clusters() -> list[str]:
    """Re-list K8s clusters available to the current tsh session.

    Teleport path is now driven by `TeleportPlugin.list_clusters(identity,
    session_dir)`. This endpoint is a placeholder for the host-bound
    (API_TOKEN) flow which has no `tsh` session to query.
    """
    return []


@router.post("/auth/kube-login", response_model=KubeLoginOut, dependencies=[Depends(require_auth)])
async def post_kube_login(payload: KubeLoginIn) -> KubeLoginOut:
    """Run `tsh kube login <cluster>` against the existing tsh session.

    Per-session replacement lives in `TeleportPlugin.acquire(identity,
    cluster, session_dir)` and is wired into a new endpoint in Task 5/6.
    """
    raise HTTPException(
        status_code=503,
        detail="kube login moved to plugin flow (POST /auth/kube-acquire)",
    )


@router.get("/auth/permissions", response_model=dict[str, bool], dependencies=[Depends(require_auth)])
async def get_permissions() -> dict[str, bool]:
    """For each common K8s resource, ask `kubectl auth can-i list <res>` and
    return whether the current Teleport role allows it.

    `probe_rbac(kubeconfig_path=None)` falls back to the host KUBECONFIG /
    `~/teleport-kubeconfig.yaml` so this endpoint keeps working for
    host-bound deployments until the per-session variant is wired in.
    """
    return await probe_rbac(None)


@router.post("/auth/logout")
async def post_logout(request: Request, response: Response) -> dict[str, bool]:
    """Revoke this caller's session and clear the cookie. Harmless to call
    without a session.
    """
    session_store.revoke(request.cookies.get(session_store.COOKIE_NAME))
    response.delete_cookie(session_store.COOKIE_NAME, path="/")
    return {"ok": True}
