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
async def read_history(
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
    items = await uc.read_history(
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
    keepalive_seconds: int = Query(default=15, ge=5, le=60),
    uc: LogUseCases = Depends(log_uc),
) -> EventSourceResponse:
    """SSE log stream with heartbeat.

    Production hardening vs. the v1 implementation:
    - **Heartbeat** — yield a `: ping` SSE comment every `keepalive_seconds`
      so reverse proxies (nginx default 60s) don't silently drop the
      connection during quiet periods.
    - **Cancellation on disconnect** — `run_in_executor` does not honor
      cooperative cancellation, so we explicitly poll `request.is_disconnected()`
      and break the loop when the client goes away.
    - **End-of-stream always emitted** in the `finally` block so clients
      see a clean termination instead of a half-flushed buffer.
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
                # Race the next() against the keepalive timeout. If the
                # upstream goes silent for too long we emit a ping so the
                # proxy doesn't close the connection.
                try:
                    entry = await asyncio.wait_for(
                        loop.run_in_executor(None, next, sync_iter),
                        timeout=keepalive_seconds,
                    )
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": ""}
                    continue
                except StopIteration:
                    break
                except Exception as exc:
                    log.exception("sse.stream.error", error=str(exc))
                    yield {"event": "error", "data": json.dumps({"message": str(exc)})}
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