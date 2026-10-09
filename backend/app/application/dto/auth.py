"""Auth DTOs (Teleport login + RBAC probe)."""
from __future__ import annotations

from pydantic import BaseModel, Field


class LoginIn(BaseModel):
    password: str = Field(min_length=1, max_length=512)
    # Optional MFA TOTP. Only needed if the cluster has MFA enforced for
    # this user — otherwise leave empty. ASCII-only: fed to tsh via pty.
    otp: str = Field(default="", max_length=16, pattern=r"^[0-9A-Za-z]*$")


class LoginOut(BaseModel):
    ok: bool
    proxy: str
    user: str
    cluster: str  # Teleport cluster (== proxy host)
    kube_clusters: list[str] = []  # K8s clusters available after auth
    message: str = ""


class KubeLoginIn(BaseModel):
    # Whitelist: the value is passed as a `tsh kube login <cluster>` argv
    # element — never a shell string — so this is defense-in-depth against
    # flag injection (e.g. "--insecure").
    cluster: str = Field(min_length=1, max_length=128, pattern=r"^[A-Za-z0-9._-]+$")


class KubeLoginOut(BaseModel):
    ok: bool
    cluster: str
    message: str = ""


class StatusOut(BaseModel):
    configured: bool  # Teleport auth is set up on the server
    available: bool  # `tsh` binary is on PATH
    proxy: str
    user: str
    cluster: str
    # True when there's a kubeconfig on disk that the pool can read.
    session_valid: bool
    # True when this server demands authentication on /api/v1 routes
    # (Teleport configured and/or API_TOKEN set).
    auth_required: bool
    # True when THIS HTTP caller already holds a valid session (cookie or
    # bearer token) — unlike session_valid, which is server-wide state.
    client_session: bool