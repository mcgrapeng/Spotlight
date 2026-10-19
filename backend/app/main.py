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
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import UnknownContextError, get_pool
from app.infrastructure.logging import configure_logging, get_logger
from app.infrastructure.persistence.db import init_db
from app.interface.api.v1.router import v1_router

configure_logging()
log = get_logger("main")
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
    # 开发默认：cors_origins 为空时，按 localhost 正则放行任意端口，
    # 前端换端口无需改这里。显式配置 CORS_ORIGINS 后不再走正则，
    # 避免生产环境意外开放。
    _dev_origin_regex = _settings.cors_origin_regex if not _settings.cors_list else None

    # Behind a reverse proxy, TRUSTED_PROXY_IPS is applied where uvicorn is
    # configured (app/server.py), not here. Logging it here too means the
    # warning still appears when someone launched the plain `uvicorn` form
    # and silently lost the setting.
    if not _settings.trusted_proxy_list:
        log.warning(
            "proxy.headers.untrusted",
            hint="behind a reverse proxy? set TRUSTED_PROXY_IPS and start via "
                 "`python -m app.server`, or the login rate limiter will bucket "
                 "every user together",
        )

    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_settings.cors_list,
        allow_origin_regex=_dev_origin_regex or None,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
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

    @app.get("/healthz", tags=["health"])
    def healthz():
        return {"status": "ok"}

    return app


app = create_app()
