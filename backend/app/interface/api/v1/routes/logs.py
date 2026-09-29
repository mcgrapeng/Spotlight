"""Logs routes: history (JSON) + SSE stream (batch-encoded)."""
from __future__ import annotations

import asyncio
import json
from typing import AsyncIterator, List, Optional

from fastapi import APIRouter, Depends, Query, Request
from sse_starlette.sse import EventSourceResponse

from app.application.use_cases.logs import LogUseCases
from app.domain.value_objects.primitives import ResourceRef
from app.interface.api.v1.dependencies import log_uc
from app.application.dto import LogStreamParams
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
        "items": [i.model_dump() for i in items],
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
    """SSE log stream — single executor hop + 1 encode per flush.

    Ponytail: previous version called `loop.run_in_executor(None, next, sync_iter)`
    per line — 100 lines/sec = 100 executor tasks + 100 json.dumps calls.
    New version drives the blocking generator via asyncio.to_thread (one
    concurrent task per stream), pushes entries into an asyncio.Queue, and
    flushes them as a JSON array — N lines collapse to 1 encode per window.
    Wire format: `{"event": "log", "data": "<json-array-of-entries>"}` —
    frontend handles both array and single-object payloads.
    """
    ref = ResourceRef(cluster=cluster or "", namespace=namespace, kind="Pod", name=name)
    queue: asyncio.Queue = asyncio.Queue(maxsize=10_000)

    async def producer() -> None:
        # ONE blocking reader task. Drains the sync generator in a worker thread
        # and bulk-pushes to the asyncio queue. Producer-side errors end the stream.
        try:
            await asyncio.to_thread(_drain, uc, ref, container, tail_lines, queue)
        except Exception as exc:  # noqa: BLE001
            log.exception("sse.stream.producer_error", error=str(exc))
        finally:
            await queue.put(None)  # sentinel = stream ended

    async def event_gen() -> AsyncIterator[dict]:
        asyncio.create_task(producer())
        last_flush = asyncio.get_event_loop().time()
        FLUSH_INTERVAL = 0.1
        BATCH_MAX = 100
        try:
            while True:
                # Short get timeout so the keepalive + disconnect check fires
                # even when the upstream is silent.
                try:
                    batch = await asyncio.wait_for(queue.get(), timeout=min(keepalive_seconds, 1.0))
                except asyncio.TimeoutError:
                    if await request.is_disconnected():
                        log.info("sse.client.disconnected", pod=f"{namespace}/{name}")
                        break
                    yield {"event": "ping", "data": ""}
                    last_flush = asyncio.get_event_loop().time()
                    continue

                if batch is None:  # stream ended
                    break

                # Yield each line as its own SSE event for frontend compatibility,
                # but use one bulk JSON-array string per flush. Frontend splits.
                yield {
                    "event": "log",
                    "data": json.dumps(batch, ensure_ascii=False),
                }
                last_flush = asyncio.get_event_loop().time()

                # If a big batch came in, keep flushing until the queue drains
                # to keep latency low under burst load.
                while not queue.empty():
                    try:
                        next_batch = queue.get_nowait()
                    except asyncio.QueueEmpty:
                        break
                    if next_batch is None:
                        break
                    yield {
                        "event": "log",
                        "data": json.dumps(next_batch, ensure_ascii=False),
                    }
                    last_flush = asyncio.get_event_loop().time()
        finally:
            yield {"event": "end", "data": "[DONE]"}

    return EventSourceResponse(event_gen())


def _drain(
    uc: LogUseCases,
    ref: ResourceRef,
    container: Optional[str],
    tail_lines: int,
    queue: asyncio.Queue,
) -> None:
    """Sync helper: drive the blocking sync generator in a worker thread.

    Buffers up to BATCH_MAX entries per push so each queue item is a JSON-array
    payload — N line yields collapse to 1 queue.put (and 1 json.dumps in the
    consumer).
    """
    BATCH_MAX = 100
    batch: list[dict] = []
    for entry in uc.stream(ref, container, tail_lines):
        batch.append({
            "timestamp": entry.timestamp, "content": entry.content,
            "container": entry.container, "severity": entry.severity,
        })
        if len(batch) >= BATCH_MAX:
            queue.put_nowait(batch)
            batch = []
    if batch:
        queue.put_nowait(batch)