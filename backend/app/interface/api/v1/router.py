"""Top-level v1 router."""
from fastapi import APIRouter

from app.interface.api.v1.routes import ai, clusters, events, favorites, logs, pods

v1_router = APIRouter(prefix="/api/v1")
v1_router.include_router(clusters.router)
v1_router.include_router(pods.router)
v1_router.include_router(logs.router)
v1_router.include_router(events.router)
v1_router.include_router(favorites.router)
v1_router.include_router(ai.router)
