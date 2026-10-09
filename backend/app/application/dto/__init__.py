"""Application-layer DTOs.

Pydantic models that cross the application boundary. The interface layer
re-exports them; the application layer owns the shape so it can be tested
without any HTTP/SQL/K8s imports.
"""
from app.application.dto.auth import (
    KubeLoginIn,
    KubeLoginOut,
    LoginIn,
    LoginOut,
    StatusOut,
)
from app.application.dto.clusters import (
    ClusterOut,
    DashboardOut,
    NamespaceOut,
    NodeOut,
)
from app.application.dto.events import EventOut
from app.application.dto.favorites import FavoriteCreate, FavoriteOut
from app.application.dto.logs import LogHistoryOut, LogStreamParams
from app.application.dto.pods import ContainerOut, PodListOut, PodOut
from app.application.dto.ai import (
    AIAnalyzeIn,
    AIAnalyzeOut,
    AIProviderIn,
    AIProviderOut,
)

__all__ = [
    "ClusterOut",
    "NamespaceOut",
    "NodeOut",
    "DashboardOut",
    "PodOut",
    "ContainerOut",
    "PodListOut",
    "EventOut",
    "LogStreamParams",
    "LogHistoryOut",
    "FavoriteCreate",
    "FavoriteOut",
    "AIAnalyzeIn",
    "AIAnalyzeOut",
    "AIProviderIn",
    "AIProviderOut",
    "KubeLoginIn",
    "KubeLoginOut",
    "LoginIn",
    "LoginOut",
    "StatusOut",
]