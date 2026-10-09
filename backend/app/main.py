"""FastAPI application factory."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
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


@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("app.starting", name=_settings.app_name)
    try:
        get_pool()
        log.info("k8s.pool.ready", contexts=len(get_pool().list_contexts()))
    except Exception as e:
        log.warning("k8s.pool.deferred", error=str(e))

    await init_db()
    log.info("db.ready")
    yield
    log.info("app.shutdown")


def create_app() -> FastAPI:
    app = FastAPI(
        title=_settings.app_name,
        version="2.0.0",
        description="Clean Architecture K8s viewer + AI log analysis (via LiteLLM).",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=_settings.cors_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(v1_router)

    @app.get("/healthz", tags=["health"])
    def healthz():
        return {"status": "ok"}

    return app


app = create_app()
