from fastapi import APIRouter

from app.api.v1 import clusters, events, favorites, logs, namespaces, nodes, pods

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(clusters.router, prefix="/clusters", tags=["clusters"])
api_router.include_router(namespaces.router, prefix="/namespaces", tags=["namespaces"])
api_router.include_router(pods.router, prefix="/pods", tags=["pods"])
api_router.include_router(logs.router, prefix="/pods", tags=["logs"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(nodes.router, prefix="/nodes", tags=["nodes"])
api_router.include_router(favorites.router, prefix="/favorites", tags=["favorites"])
