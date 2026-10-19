"""Top-level v1 router."""
from fastapi import APIRouter, Depends

from app.interface.api.v1.dependencies import reject_legacy_cluster_param, require_auth
from app.interface.api.v1.routes import ai, auth, clusters, events, favorites, logs, pods

# Refuse `?cluster=` on every route that selects a kubeconfig context. FastAPI
# drops query parameters a route does not declare, so the pre-rename name turned
# a stale client's cluster selection into a 200 carrying the DEFAULT context's
# data — a wrong answer with no error, which is what the rename was meant to
# end. Declared here as a router-level dependency, before the routers are
# included: `include_router` copies `dependencies` by value at include time, so
# appending afterwards does nothing. Going router-level rather than per-route
# means a new context-selecting endpoint inherits the guard. `favorites` is
# excluded on purpose — it reads the SQL store and has no context to confuse.
_auth = [Depends(require_auth)]
_context_auth = [*_auth, Depends(reject_legacy_cluster_param)]

v1_router = APIRouter(prefix="/api/v1")
# /auth/status and /auth/login are public (pre-login bootstrap); every other
# v1 route requires a session cookie or the static bearer token.
v1_router.include_router(auth.router)
v1_router.include_router(clusters.router, dependencies=_context_auth)
v1_router.include_router(pods.router, dependencies=_context_auth)
v1_router.include_router(logs.router, dependencies=_context_auth)
v1_router.include_router(events.router, dependencies=_context_auth)
v1_router.include_router(favorites.router, dependencies=_auth)
v1_router.include_router(ai.router, dependencies=_context_auth)
