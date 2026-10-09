"""Top-level v1 router."""
from fastapi import APIRouter, Depends

from app.interface.api.v1.dependencies import require_auth
from app.interface.api.v1.routes import ai, auth, clusters, events, favorites, logs, pods

v1_router = APIRouter(prefix="/api/v1")
# /auth/status and /auth/login are public (pre-login bootstrap); every other
# v1 route requires a session cookie or the static bearer token.
v1_router.include_router(auth.router)
v1_router.include_router(clusters.router, dependencies=[Depends(require_auth)])
v1_router.include_router(pods.router, dependencies=[Depends(require_auth)])
v1_router.include_router(logs.router, dependencies=[Depends(require_auth)])
v1_router.include_router(events.router, dependencies=[Depends(require_auth)])
v1_router.include_router(favorites.router, dependencies=[Depends(require_auth)])
v1_router.include_router(ai.router, dependencies=[Depends(require_auth)])
