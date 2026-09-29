"""Auth DTOs (Teleport login + RBAC probe)."""
from __future__ import annotations

from pydantic import BaseModel, Field


class LoginIn(BaseModel):
    password: str = Field(min_length=1, max_length=512)
    # Optional MFA TOTP. Only needed if the cluster has MFA enforced for
    # this user — otherwise leave empty.
    otp: str = Field(default="", max_length=16)


class LoginOut(BaseModel):
    ok: bool
    proxy: str
    user: str
    cluster: str  # Teleport cluster (== proxy host)
    kube_clusters: list[str] = []  # K8s clusters available after auth
    message: str = ""


class KubeLoginIn(BaseModel):
    cluster: str = Field(min_length=1, max_length=128)


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
    # Frontend uses this to decide whether to show the login form on page
    # refresh: even though Teleport may be configured, an existing
    # kubeconfig means we already have a working session.
    session_valid: bool