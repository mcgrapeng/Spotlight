"""FastAPI application factory."""
from __future__ import annotations

import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from app.infrastructure.auth import session as session_store
from app.infrastructure.config.settings import REMOVED_HOST_IDENTITY, get_settings
from app.infrastructure.k8s.client.pool import (
    CredentialUnavailableError,
    UnknownContextError,
    get_pool,
)
from app.infrastructure.logging import configure_logging, get_logger
from app.infrastructure.persistence.db import init_db, session_scope
from app.infrastructure.persistence.repositories.permission_repo import seed_builtin_roles
from app.interface.api.v1.router import v1_router

configure_logging()
log = get_logger("main")
# The host identity is cleared when the settings module loads — it has to
# happen before the first Settings is constructed, because
# pydantic-settings gives the process environment priority over
# backend/.env, so a stale exported TELEPORT_CLUSTER would silently win
# over the configured one.
_removed_host_identity = REMOVED_HOST_IDENTITY
_settings = get_settings()

if not _settings.teleport_configured and not _settings.api_token:
    log.warning(
        "auth.open_mode",
        hint="API is unauthenticated: set API_TOKEN or TELEPORT_* to require login",
    )

# How often expired login sessions are reaped. Each one holds a private
# directory with a real kubeconfig on disk, so an un-swept process leaks
# credentials until someone restarts it.
SESSION_SWEEP_SECONDS = 300.0


async def _session_reaper() -> None:
    while True:
        await asyncio.sleep(SESSION_SWEEP_SECONDS)
        try:
            n = session_store.sweep_expired()
            if n:
                log.info("auth.sessions.swept", expired=n)
        except Exception as e:  # noqa: BLE001 — a reaper must never die
            log.warning("auth.sweep.failed", error=str(e))


@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("app.starting", name=_settings.app_name)
    if _removed_host_identity:
        log.warning(
            "auth.host_identity_cleared",
            vars=",".join(_removed_host_identity),
            hint="inherited Teleport identity vars are ignored; each session "
                 "logs in on its own",
        )
    # Sessions are memory-only, so every directory left over from a previous run
    # (or a crash) is an orphan holding a live kubeconfig. Reap before serving.
    reaped = session_store.purge_orphans()
    if reaped:
        log.info("auth.sessions.orphans_purged", count=reaped)
    try:
        get_pool()
        # pool.list_contexts now requires the kubeconfig path (T5+ per-session);
        # lifespan has no Session, so resolve from env or fall through to defaults.
        log.info("k8s.pool.ready", contexts=len(get_pool().list_contexts(os.environ.get("KUBECONFIG"))))
    except Exception as e:
        log.warning("k8s.pool.deferred", error=str(e))

    await init_db()
    log.info("db.ready")
    # Seed the built-in roles (admin / user / viewer). Idempotent: a role
    # that already exists is left alone, so an operator's edit to the
    # `viewer` profile survives a restart.
    try:
        async with session_scope() as db_session:
            seeded = await seed_builtin_roles(db_session)
        if seeded:
            log.info("permissions.builtin_roles_seeded", created=seeded)
    except Exception as e:  # noqa: BLE001 — a seeding failure must not stop the app
        log.warning("permissions.seed_failed", error=str(e))
    reaper = asyncio.create_task(_session_reaper())
    try:
        yield
    finally:
        reaper.cancel()
        # Every session dies with the process, so all remaining dirs are orphans.
        session_store.purge_orphans()
        log.info("app.shutdown")


def create_app() -> FastAPI:
    app = FastAPI(
        title=_settings.app_name,
        version="2.0.0",
        description="Clean Architecture K8s viewer + AI log analysis (via LiteLLM).",
        lifespan=lifespan,
    )
    # CORS：只答显式配置的来源。以前 cors_origins 为空时默认放行任意
    # 端口的 localhost —— 端口不影响 SameSite 的"站点"判定，所以
    # http://localhost:9999 上的页面能带着会话 cookie 读走整个控制台。
    # 同源根本不需要 CORS：前端走 vite 代理，浏览器只看到一个源。

    # Behind a reverse proxy, TRUSTED_PROXY_IPS is applied where uvicorn is
    # configured (app/server.py), not here. Logging it here too means the
    # warning still appears when someone launched the plain `uvicorn` form
    # and silently lost the setting.
    if not _settings.trusted_proxy_list:
        log.warning(
            "proxy.headers.untrusted",
            hint="behind a reverse proxy? set TRUSTED_PROXY_IPS and start via "
                 "`python -m app.server`, or the login rate limiter will bucket "
                 "every user together. Until it is set, uvicorn reports the "
                 "scheme as http, so the session cookie is issued without its "
                 "Secure flag even behind TLS",
        )

    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_settings.cors_list,
        allow_origin_regex=_settings.cors_origin_regex or None,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    if not _settings.cors_list and not _settings.cors_origin_regex:
        log.warning(
            "cors.none_configured",
            hint="the API answers same-origin requests only; set CORS_ORIGINS "
                 "if the frontend is served from another origin",
        )
    app.include_router(v1_router)

    @app.exception_handler(UnknownContextError)
    async def _unknown_context(_: Request, e: UnknownContextError) -> JSONResponse:
        # The browser asked for a cluster this session's kubeconfig does not
        # contain. 409 (not 400/500): the request is well-formed, the client's
        # idea of "current cluster" is simply out of date, so the UI re-syncs.
        log.warning("k8s.context.unknown", error=str(e))
        return JSONResponse(
            status_code=409,
            content={"detail": "unknown cluster for the current session; reselect"},
        )

    @app.exception_handler(CredentialUnavailableError)
    async def _no_credentials(_: Request, e: CredentialUnavailableError) -> JSONResponse:
        # The session's credential plugin (tsh) could not produce credentials.
        # 503: the session is not usable right now, and re-login is the fix —
        # not a retry of the same request.
        log.warning("k8s.credentials.unavailable", error=str(e))
        return JSONResponse(
            status_code=503,
            content={
                "detail": "会话凭证不可用，请重新登录（Teleport 凭证或会话已过期）",
            },
        )

    @app.get("/healthz", tags=["health"])
    def healthz():
        return {"status": "ok"}

    return app


app = create_app()
