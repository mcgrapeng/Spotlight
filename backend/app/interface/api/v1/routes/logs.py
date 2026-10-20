"""Logs routes: history (JSON) + SSE stream (batch-encoded)."""
from __future__ import annotations

import asyncio
import json
import threading
from typing import AsyncIterator, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sse_starlette.sse import EventSourceResponse

from app.application.dto import LogHistoryOut
from app.application.use_cases.logs import LogUseCases
from app.domain.value_objects.primitives import ResourceRef
from starlette.background import BackgroundTask

from app.infrastructure.auth import session as session_store
from app.infrastructure.auth.session import Session
from app.infrastructure.logging import get_logger
from app.interface.api.v1.dependencies import current_session, log_uc

router = APIRouter(tags=["logs"])
log = get_logger("api.logs")

# Each follow-stream pins one default-executor thread for its lifetime (the
# kubernetes watch is blocking). Without a cap, a handful of idle browser
# tabs exhausts the shared pool and freezes ALL other K8s I/O in the
# process. Per-session, not per-process: a single shared budget means the 9th
# tab across the whole team gets a 429, whoever opened it.
MAX_STREAMS_PER_SESSION = 4
# The synthetic dev session is not one user. It backs Bearer and open-mode
# callers, so every host-bound request in the process shares it. Charging them
# the per-session budget would halve the previous process-wide cap of 8 for
# exactly the deployments with no per-session identity to separate them, so
# they keep the old allowance.
MAX_STREAMS_SHARED_SESSION = 8
_session_slots: dict[str, int] = {}
_session_slots_lock = threading.Lock()


def _cap_for(token: str) -> int:
    return (
        MAX_STREAMS_SHARED_SESSION
        if token == session_store.DEV_TOKEN
        else MAX_STREAMS_PER_SESSION
    )


def _acquire_slot(session_token: str) -> bool:
    with _session_slots_lock:
        n = _session_slots.get(session_token, 0)
        if n >= _cap_for(session_token):
            return False
        _session_slots[session_token] = n + 1
        return True


def _release_slot(session_token: str) -> None:
    with _session_slots_lock:
        n = _session_slots.get(session_token, 0) - 1
        if n > 0:
            _session_slots[session_token] = n
        else:
            _session_slots.pop(session_token, None)


class _SlotLease:
    """One acquired stream slot, released exactly once.

    Two paths run the release: the generator's `finally`, and the response's
    background task, which covers a client that vanished before the generator
    ever yielded — in which case the slot used to leak for the rest of the
    session's TTL, and four flaky reconnects would leave the panel permanently
    429. Whichever runs first wins; a double release would hand out a slot
    nobody paid for, so the guard lives here rather than at the call sites.
    """

    def __init__(self, token: str) -> None:
        self._token = token
        self._released = False

    def release(self) -> None:
        if self._released:
            return
        self._released = True
        _release_slot(self._token)

# Queue holds JSON-ready batches: ≤ QUEUE_MAX_BATCHES × BATCH_MAX lines of
# memory per stream (≈1MB), then the producer thread applies backpressure.
QUEUE_MAX_BATCHES = 100
BATCH_MAX = 100


@router.get("/pods/{namespace}/{name}/logs", response_model=LogHistoryOut)
async def read_history(
    namespace: str,
    name: str,
    context: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=500, ge=10, le=5000),
    since: Optional[str] = Query(
        default=None, description="ISO timestamp or short form like 5m / 1h / 7d",
    ),
    uc: LogUseCases = Depends(log_uc),
) -> LogHistoryOut:
    try:
        items = await uc.read_history(
            ResourceRef(cluster=context or "", namespace=namespace, kind="Pod", name=name),
            container, tail_lines, since,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return LogHistoryOut(total=len(items), items=items)


@router.get("/pods/{namespace}/{name}/logs/stream")
async def stream(
    request: Request,
    namespace: str,
    name: str,
    context: Optional[str] = Query(default=None),
    container: Optional[str] = Query(default=None),
    tail_lines: int = Query(default=200, ge=10, le=5000),
    keepalive_seconds: int = Query(default=15, ge=5, le=60),
    uc: LogUseCases = Depends(log_uc),
    s: Session = Depends(current_session),
) -> EventSourceResponse:
    """SSE log stream — single executor hop + 1 encode per flush.

    Wire format: `{"event": "log", "data": "<json-array-of-entries>"}` —
    frontend splits arrays into lines.
    """
    if not _acquire_slot(s.token):
        raise HTTPException(status_code=429, detail="并发日志流已达上限，请稍后再试")

    ref = ResourceRef(cluster=context or "", namespace=namespace, kind="Pod", name=name)
    stop_event = threading.Event()
    queue: asyncio.Queue = asyncio.Queue(maxsize=QUEUE_MAX_BATCHES)
    loop = asyncio.get_event_loop()

    lease = _SlotLease(s.token)

    async def producer() -> None:
        try:
            await asyncio.to_thread(_drain, loop, uc, ref, container, tail_lines, queue, stop_event)
        except Exception as exc:  # noqa: BLE001
            log.exception("sse.stream.producer_error", error=str(exc))
        finally:
            await queue.put(None)  # sentinel = stream ended

    async def event_gen() -> AsyncIterator[dict]:
        task = asyncio.create_task(producer())
        last_ping = asyncio.get_event_loop().time()
        try:
            while True:
                # Short get timeout so the keepalive + disconnect check fires
                # even when the upstream is silent.
                try:
                    batch = await asyncio.wait_for(queue.get(), timeout=1.0)
                except asyncio.TimeoutError:
                    if await request.is_disconnected():
                        log.info("sse.client.disconnected", pod=f"{namespace}/{name}")
                        break
                    now = asyncio.get_event_loop().time()
                    if now - last_ping >= keepalive_seconds:
                        yield {"event": "ping", "data": ""}
                        last_ping = now
                    continue

                if batch is None:  # stream ended
                    break

                yield {
                    "event": "log",
                    "data": json.dumps(batch, ensure_ascii=False),
                }
                # Burst drain to keep latency low under load.
                drained_end = False
                while not queue.empty():
                    try:
                        next_batch = queue.get_nowait()
                    except asyncio.QueueEmpty:
                        break
                    if next_batch is None:
                        # The sentinel means "producer finished", exactly as it
                        # does above — so it has to end the OUTER loop too.
                        # Breaking only the inner one fell back to queue.get()
                        # on a queue nothing will ever fill again: the stream
                        # sat there emitting keepalive pings, holding its
                        # session slot and its executor thread, and never sent
                        # `end`. Reachable whenever the producer finishes while
                        # the consumer is still draining, i.e. any burst.
                        drained_end = True
                        break
                    yield {
                        "event": "log",
                        "data": json.dumps(next_batch, ensure_ascii=False),
                    }
                if drained_end:
                    break
            yield {"event": "end", "data": "[DONE]"}
        finally:
            # Client gone / stream over: stop the blocking watch drain and
            # give the executor thread back. (The thread only lingers if it
            # is parked inside a watch read on a silent pod — it exits on the
            # next line or the watch socket timeout.)
            stop_event.set()
            task.cancel()
            lease.release()

    try:
        return EventSourceResponse(event_gen(), background=BackgroundTask(lease.release))
    except Exception:
        # The response never started, so the generator's finally will not run.
        lease.release()
        raise


def _drain(
    loop: asyncio.AbstractEventLoop,
    uc: LogUseCases,
    ref: ResourceRef,
    container: Optional[str],
    tail_lines: int,
    queue: asyncio.Queue,
    stop_event: threading.Event,
) -> None:
    """Sync helper: drive the blocking sync generator in a worker thread.

    Hand batches to the asyncio queue via call_soon_threadsafe /
    run_coroutine_threadsafe — asyncio.Queue is NOT thread-safe when shared
    across threads. Full queue suspends the put (backpressure), so memory
    stays bounded and no lines are silently dropped.
    """
    batch: list[dict] = []
    for entry in uc.stream(ref, container, tail_lines, stop_event=stop_event):
        if stop_event.is_set():
            return
        batch.append({
            "timestamp": entry.timestamp, "content": entry.content,
            "container": entry.container, "severity": entry.severity,
        })
        if len(batch) >= BATCH_MAX:
            if not _put(loop, queue, batch, stop_event):
                return
            batch = []
    if batch and not stop_event.is_set():
        _put(loop, queue, batch, stop_event)


def _put(
    loop: asyncio.AbstractEventLoop,
    queue: asyncio.Queue,
    batch: list[dict],
    stop_event: threading.Event,
) -> bool:
    """Thread-safe queue.put with stop-aware backpressure. False = stopped."""
    try:
        fut = asyncio.run_coroutine_threadsafe(queue.put(batch), loop)
    except RuntimeError:  # loop closed during shutdown
        return False
    while not fut.done():
        if stop_event.wait(0.25):
            fut.cancel()
            return False
    return True
