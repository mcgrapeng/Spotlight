"""Back-compat shim. All schemas now live in `app.application.dto/`.

Importing from here is deprecated but kept so external test files and
route handlers keep working without a wide rename pass.
"""
from app.application.dto import (  # noqa: F401
    AIAnalyzeIn,
    AIAnalyzeOut,
    AIProviderIn,
    AIProviderOut,
    ClusterOut,
    ContainerOut,
    DashboardOut,
    EventOut,
    FavoriteCreate,
    FavoriteOut,
    KubeLoginIn,
    KubeLoginOut,
    LoginIn,
    LoginOut,
    LogStreamParams,
    NamespaceOut,
    NodeOut,
    PodListOut,
    PodOut,
    StatusOut,
)

# Backwards-compat alias — old code may still import LogLineOut.
LogLineOut = LogStreamParams