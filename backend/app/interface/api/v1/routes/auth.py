"""Auth routes: Teleport tsh login endpoint."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.infrastructure.auth.teleport import login as tsh_login
from app.infrastructure.auth.teleport import tsh_available
from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger

router = APIRouter(tags=["auth"])
log = get_logger("api.auth")


class LoginIn(BaseModel):
    password: str = Field(min_length=1, max_length=512)


class LoginOut(BaseModel):
    ok: bool
    proxy: str
    user: str
    cluster: str
    message: str = ""


class StatusOut(BaseModel):
    configured: bool
    available: bool
    proxy: str
    user: str
    cluster: str


@router.get("/auth/status", response_model=StatusOut)
def status() -> StatusOut:
    s = get_settings()
    return StatusOut(
        configured=s.teleport_configured,
        available=tsh_available(s.tsh_binary),
        proxy=s.teleport_proxy,
        user=s.teleport_user,
        cluster=s.teleport_cluster,
    )


@router.post("/auth/login", response_model=LoginOut)
async def post_login(payload: LoginIn) -> LoginOut:
    s = get_settings()
    if not s.teleport_configured:
        raise HTTPException(status_code=503, detail="Teleport proxy not configured on server")
    if not tsh_available(s.tsh_binary):
        raise HTTPException(status_code=503, detail=f"'{s.tsh_binary}' not found on PATH")
    res = await tsh_login(payload.password)
    if not res.ok:
        # 401 keeps the UX consistent with "wrong password", but we log the
        # real cause server-side (operator can debug without user confusion).
        raise HTTPException(status_code=401, detail=res.message or "login failed")
    return LoginOut(
        ok=True, proxy=res.proxy, user=res.user, cluster=res.cluster, message=res.message,
    )