"""Auth routes: plugin-backed dynamic-form login + per-session cluster select.

Login is driven by the active `AuthPlugin`:

  1. GET  /auth/status         → active provider's form fields, caller session
  2. POST /auth/login          → plugin.login → create_session + cookie
  3. POST /auth/cluster        → plugin.acquire → write session kubeconfig
  4. GET  /auth/kube-clusters  → plugin.list_clusters (re-listing)
  5. POST /auth/logout         → plugin.logout + revoke_session

There is no RBAC probe endpoint: every user is a developer on the same pages,
so "is this resource denied or genuinely empty" is not a question the UI needs
to answer.
"""
from __future__ import annotations

import secrets
import time
from threading import Lock

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from app.application.dto import (
    ClusterSelectIn,
    LoginIn,
    LoginOut,
    ProviderFieldOut,
    ProviderInfoOut,
    SessionInfoOut,
    StatusOut,
)
from app.infrastructure.auth import session as session_store
from app.infrastructure.auth.plugins import active_plugin
from app.infrastructure.auth.plugins.base import AuthError, Identity
from app.infrastructure.cache.ttl_cache import invalidate_scope
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import require_auth

router = APIRouter(tags=["auth"])
log = get_logger("api.auth")

# ── Login rate limiting (in-memory, per client IP) ────────────────────────
_RATE_WINDOW = 300.0  # seconds
_RATE_MAX = 10        # attempts per window
_attempts: dict[str, list[float]] = {}
_attempts_lock = Lock()


def client_ip(request: Request) -> str:
    """The caller's IP as uvicorn resolved it.

    Do not re-parse X-Forwarded-For here. uvicorn already does it, one layer
    down, honouring its own `forwarded_allow_ips` — so by the time a handler
    runs, `request.client.host` IS the client address and the header has been
    consumed. Parsing it a second time is wrong twice over: the peer we would
    compare against the trust list is already the rewritten client, and any
    header that survives is attacker-controlled.

    `TRUSTED_PROXY_IPS` is applied where it has to be — when uvicorn is
    configured, in `app/server.py`. Keeping that in one place is what makes the
    rate limiter's identity trustworthy.
    """
    return request.client.host if request.client else "unknown"


def _rate_limited(ip: str) -> bool:
    now = time.monotonic()
    with _attempts_lock:
        kept = [t for t in _attempts.get(ip, []) if now - t < _RATE_WINDOW]
        if kept:
            _attempts[ip] = kept
        else:
            # Drop the key entirely once its window is empty, otherwise every
            # source IP that ever touched this endpoint leaves a permanent entry.
            _attempts.pop(ip, None)
        if len(kept) >= _RATE_MAX:
            return True
        kept.append(now)
        _attempts[ip] = kept
        return False


def _issue_cookie(response: Response, request: Request, token: str, ttl: int) -> None:
    response.set_cookie(
        session_store.COOKIE_NAME,
        token,
        max_age=ttl,
        httponly=True,
        samesite="strict",
        secure=request.url.scheme == "https",
        path="/",
    )


# ── AuthError → HTTP status mapping ───────────────────────────────────────
_STATUS_FOR_CODE = {
    "invalid_credentials": 401,
    "mfa_required": 401,
    "bad_otp": 401,
}


def _http_for_auth_error(e: AuthError) -> HTTPException:
    status = _STATUS_FOR_CODE.get(e.code, 503)
    return HTTPException(status_code=status, detail={"code": e.code, "message": e.message})


def _resolve_session(request: Request):
    """Return the active Session for this request, or None.

    Priority: Bearer API_TOKEN (script access → synthetic dev session) →
    real Cookie session. Open mode has no session here — callers in open
    mode read `dev_session()` via `current_session()` instead.
    """
    s = get_settings()
    header = request.headers.get("authorization", "")
    if s.api_token and secrets.compare_digest(header, f"Bearer {s.api_token}"):
        return session_store.dev_session()
    cookie_token = request.cookies.get(session_store.COOKIE_NAME)
    return session_store.get_session(cookie_token)


# ── GET /auth/status ──────────────────────────────────────────────────────
@router.get("/auth/status", response_model=StatusOut)
def status(request: Request) -> StatusOut:
    s = get_settings()
    plugin = active_plugin()
    provider: ProviderInfoOut | None = None
    if plugin is not None:
        provider = ProviderInfoOut(
            id=plugin.id,
            label=plugin.label,
            fields=[
                ProviderFieldOut(
                    name=f.name, label=f.label, type=f.type, required=f.required,
                )
                for f in plugin.form_fields()
            ],
        )
    sess = _resolve_session(request)
    return StatusOut(
        configured=plugin is not None,
        provider=provider,
        auth_required=bool(plugin is not None or s.api_token),
        client_session=sess is not None,
        session=SessionInfoOut(username=sess.identity.username) if sess is not None else None,
    )


# ── POST /auth/login ──────────────────────────────────────────────────────
@router.post("/auth/login", response_model=LoginOut)
async def post_login(payload: LoginIn, request: Request, response: Response) -> LoginOut:
    s = get_settings()
    ip = client_ip(request)
    if _rate_limited(ip):
        raise HTTPException(status_code=429, detail="尝试过于频繁，请稍后再试")

    plugin = active_plugin()
    if plugin is None:
        raise HTTPException(status_code=503, detail="认证服务未配置")

    # ponytail: issue the session BEFORE plugin.login so we always have a
    # private dir ready for plugin state (tsh TELEPORT_HOME, kubeconfig
    # bootstrap). On login failure we revoke the half-created session.
    sess = session_store.create_session(plugin.id, Identity(username=payload.username), s.session_ttl_seconds)
    try:
        identity = await plugin.login(payload.username, payload.fields, sess.dir)
    except AuthError as e:
        session_store.revoke_session(sess.token)
        log.warning("auth.login.failed", code=e.code, ip=ip)
        raise _http_for_auth_error(e) from None

    # Successful login: carry any extra fields the plugin computed
    # (e.g. proxy for Teleport) by replacing the bootstrap identity.
    sess.identity = identity  # type: ignore[misc]
    _issue_cookie(response, request, sess.token, s.session_ttl_seconds)
    # An enumeration failure must NOT read as "no clusters". The frontend sends
    # the user straight through on an empty list, and no session kubeconfig was
    # written, so `k8s_repo` falls back to the host's — which means a Teleport
    # user whose `tsh kube ls` hiccupped would be shown the server's admin
    # cluster, with no indication anything went wrong. Report it instead.
    clusters_error: str | None = None
    try:
        kube_clusters = await plugin.list_clusters(identity, sess.dir)
    except AuthError as e:
        log.warning("auth.list_clusters.failed", code=e.code, ip=ip)
        kube_clusters = []
        clusters_error = e.message
    return LoginOut(
        ok=True,
        kube_clusters=kube_clusters,
        message="ok",
        clusters_error=clusters_error,
    )


# ── POST /auth/cluster ───────────────────────────────────────────────────
def _require_cookie_session(request: Request) -> None:
    """Reject cluster requests without a real session cookie.

    `POST /auth/cluster` needs a logged-in caller; `require_auth` is too
    permissive (it also lets Bearer + open-mode through, neither of which
    carries a per-session kubeconfig dir).
    """
    cookie_token = request.cookies.get(session_store.COOKIE_NAME)
    if session_store.get_session(cookie_token) is None:
        raise HTTPException(status_code=401, detail="未认证，请先登录")


@router.post("/auth/cluster", dependencies=[Depends(_require_cookie_session)])
async def post_cluster(payload: ClusterSelectIn, request: Request) -> dict:
    sess = _resolve_session(request)
    if sess is None:
        # Dependency should have rejected; defensive.
        raise HTTPException(status_code=401, detail="未认证，请先登录")
    plugin = active_plugin()
    if plugin is None:
        raise HTTPException(status_code=503, detail="认证服务未配置")

    try:
        kc = await plugin.acquire(sess.identity, payload.cluster, sess.dir)
    except AuthError as e:
        log.warning("auth.cluster.failed", code=e.code, cluster=payload.cluster)
        raise _http_for_auth_error(e) from None

    # ponytail: write kubeconfig bytes to session.kubeconfig_path, then
    # pool.drop_session + invalidate_scope — otherwise the cached client
    # would still point at the previous (cluster, credentials) pair and
    # the next request would silently read stale data (matches T4 ledger's
    # "重要提醒": acquire must trigger reload of the same session's pool).
    # Scoped, not global: another user switching cluster must not evict
    # everyone's cached reads.
    sess.kubeconfig_path.write_bytes(kc.yaml)
    get_pool().drop_session(sess.token)
    invalidate_scope(sess.token)
    return {"ok": True, "cluster": payload.cluster, "context": kc.context}


# ── GET /auth/kube-clusters ───────────────────────────────────────────────
@router.get("/auth/kube-clusters", response_model=list[str], dependencies=[Depends(_require_cookie_session)])
async def get_kube_clusters(request: Request) -> list[str]:
    sess = _resolve_session(request)
    assert sess is not None  # _require_cookie_session guarantees this
    plugin = active_plugin()
    if plugin is None:
        raise HTTPException(status_code=503, detail="认证服务未配置")
    try:
        return await plugin.list_clusters(sess.identity, sess.dir)
    except AuthError as e:
        log.warning("auth.kube_clusters.failed", code=e.code)
        raise _http_for_auth_error(e) from None


# ── POST /auth/logout ─────────────────────────────────────────────────────
@router.post("/auth/logout")
async def post_logout(request: Request, response: Response) -> dict:
    sess = _resolve_session(request)
    # The synthetic "dev" session backs Bearer/open-mode callers and is shared
    # by all of them. Tearing it down would close the ApiClient out from under
    # every other in-flight request, and it holds no real credentials anyway.
    if sess is not None and sess.token != session_store.DEV_TOKEN:
        plugin = active_plugin()
        if plugin is not None:
            # ponytail: best-effort. Plugin logout (e.g. `tsh logout`) can
            # fail without affecting our local session cleanup.
            try:
                await plugin.logout(sess.identity, sess.dir)
            except Exception:
                pass
        get_pool().drop_session(sess.token)
        session_store.revoke_session(sess.token)
    response.delete_cookie(session_store.COOKIE_NAME, path="/")
    return {"ok": True}
