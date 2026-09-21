from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
from app.config import get_settings
from app.core.k8s_client import get_manager
from app.core.logging import get_logger, setup_logging
from app.db.base import init_db

setup_logging()
log = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("starting k8s-viewer backend")
    try:
        get_manager()
        ctxs = get_manager().contexts
        log.info("loaded %d kubeconfig context(s)", len(ctxs))
    except Exception as e:
        log.warning("kubeconfig not loaded yet: %s", e)
    await init_db()
    yield
    log.info("shutting down")


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="K8s pod log & status visualizer via Teleport (tsh) kubeconfig.",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)

    @app.get("/healthz", tags=["health"])
    def health():
        return {"status": "ok"}

    return app


app = create_app()
