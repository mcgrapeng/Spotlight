"""Logs routes: history (JSON) + SSE stream."""
from __future__ import annotations

import asyncio
import json
from typing import AsyncIterator, Optional

from fastapi import APIRouter, Depends, Query, Request
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
    since: Optional[str] = Query(
        default=None, description="ISO timestamp or short form like 5m / 1h / 7d",
    ),
    uc: LogUseCases = Depends(log_uc),
):
    items = uc.read_history(
        ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name),
        container, tail_lines, since,
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
    request: Request,
    namespace: str,
    name: str,
    cluster: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=200, ge=10, le=5000),
    uc: LogUseCases = Depends(log_uc),
) -> EventSourceResponse:
    """SSE log stream.

    The kubernetes SDK's `Watch.stream` is a **blocking sync** generator that
    would otherwise pin an entire ASGI worker to one slow client. We push the
    iteration off the event loop via `asyncio.to_thread` and surface a
    cancellation flag the generator can poll each yield. When the client
    disconnects, `request.is_disconnected()` returns True and we stop the watch.
    """
    ref = ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name)

    async def event_gen() -> AsyncIterator[dict]:
        log.info("sse.open", pod=f"{namespace}/{name}", container=container)
        loop = asyncio.get_running_loop()
        sync_iter = iter(uc.stream(ref, container, tail_lines))
        try:
            while True:
                if await request.is_disconnected():
                    log.info("sse.client.disconnected", pod=f"{namespace}/{name}")
                    break
                try:
                    entry = await loop.run_in_executor(None, next, sync_iter)
                except StopIteration:
                    break
                except Exception as e:
                    log.exception("sse.stream.error", error=str(e))
                    yield {"event": "error", "data": json.dumps({"message": str(e)})}
                    return
                yield {
                    "event": "log",
                    "data": json.dumps({
                        "timestamp": entry.timestamp, "content": entry.content,
                        "container": entry.container, "severity": entry.severity,
                    }, ensure_ascii=False),
                }
        finally:
            yield {"event": "end", "data": "[DONE]"}

    return EventSourceResponse(event_gen())
