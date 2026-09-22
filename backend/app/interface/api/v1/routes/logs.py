"""Logs routes: history (JSON) + SSE stream."""
from __future__ import annotations

import json
from typing import AsyncIterator, Optional

from fastapi import APIRouter, Depends, Query
from sse_starlette.sse import EventSourceResponse

from app.application.use_cases.logs import LogUseCases
from app.domain.value_objects.primitives import ResourceRef
from app.interface.api.v1.dependencies import log_uc
from app.interface.api.v1.schemas import LogLineOut
from app.infrastructure.logging import get_logger

router = APIRouter(tags=["logs"])
log = get_logger("api.logs")


@router.get("/pods/{namespace}/{name}/logs", response_model=dict)
def read_history(
    namespace: str,
    name: str,
    cluster: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=500, ge=10, le=5000),
    uc: LogUseCases = Depends(log_uc),
):
    items = uc.read_history(
        ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name),
        container, tail_lines,
    )
    return {
        "total": len(items),
        "items": [
            LogLineOut(
                timestamp=i.timestamp, content=i.content,
                container=i.container, severity=i.severity,
            ).model_dump()
            for i in items
        ],
    }


@router.get("/pods/{namespace}/{name}/logs/stream")
async def stream(
    namespace: str,
    name: str,
    cluster: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=200, ge=10, le=5000),
    uc: LogUseCases = Depends(log_uc),
) -> EventSourceResponse:
    async def event_gen() -> AsyncIterator[dict]:
        log.info("sse.open", pod=f"{namespace}/{name}", container=container)
        try:
            for entry in uc.stream(
                ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name),
                container, tail_lines,
            ):
                yield {"event": "log", "data": json.dumps({
                    "timestamp": entry.timestamp, "content": entry.content,
                    "container": entry.container, "severity": entry.severity,
                }, ensure_ascii=False)}
        except Exception as e:
            log.exception("sse.error", error=str(e))
            yield {"event": "error", "data": json.dumps({"message": str(e)})}
        finally:
            yield {"event": "end", "data": "[DONE]"}

    return EventSourceResponse(event_gen())
