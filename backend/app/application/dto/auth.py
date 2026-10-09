"""Auth DTOs for the plugin-backed login flow (T7).

Login is driven by a pluggable provider (`token` / `teleport` / future
adapters). The frontend asks `/auth/status` for the active provider's
form fields, posts `{username, fields}` to `/auth/login`, picks a cluster
via `/auth/cluster`, and reads the kubeconfig the per-session pool wrote
under `session.dir/kubeconfig.yaml`.

Error mapping (see `routes/auth.py`):
  invalid_credentials → 401  {code, message}
  mfa_required        → 401  {code, message}
  bad_otp             → 401  {code, message}
  unavailable         → 503
  rate-limited        → 429
"""
from __future__ import annotations

from pydantic import BaseModel, Field


class LoginIn(BaseModel):
    """Login payload: username + dynamic form fields from the active provider."""

    username: str = Field(min_length=1, max_length=128)
    fields: dict[str, str] = Field(default_factory=dict)


class LoginOut(BaseModel):
    """Login response: success flag + kube clusters available after auth."""

    ok: bool
    kube_clusters: list[str] = []
    message: str = ""


class ClusterSelectIn(BaseModel):
    """Pick a K8s cluster to log into. Whitelisted to alphanumeric + . _ -."""

    cluster: str = Field(min_length=1, max_length=128, pattern=r"^[A-Za-z0-9._-]+$")


class ProviderFieldOut(BaseModel):
    """One form field the frontend should render."""

    name: str
    label: str
    type: str
    required: bool = True


class ProviderInfoOut(BaseModel):
    """Active provider metadata for the login page."""

    id: str
    label: str
    fields: list[ProviderFieldOut]


class SessionInfoOut(BaseModel):
    """Per-session info returned in /auth/status when the caller is logged in."""

    username: str


class StatusOut(BaseModel):
    """Public status: tells the frontend whether/how to show a login form."""

    # True when an auth provider is registered (kept as a top-level bool for
    # the frontend's "configured?" check; the provider details live under
    # `provider`).
    configured: bool
    provider: ProviderInfoOut | None = None
    # True when the server demands authentication. False in open mode.
    auth_required: bool
    # True when THIS HTTP caller has a valid session (cookie or bearer).
    client_session: bool
    # Session info (only populated when client_session=True).
    session: SessionInfoOut | None = None
