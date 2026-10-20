"""The SSE stream must terminate when the upstream watch ends.

`event_gen` reads a `None` sentinel off the queue to mean "producer finished".
The main loop treats it as `break`. The burst-drain loop below it used not to:
it broke out of the *inner* while and fell back to the top of the *outer*
`while True`, waited on a queue nothing would ever fill again, and emitted
keepalive pings forever. No `end` event, and the connection held its session
slot and its executor thread until the client happened to disconnect.

Pacing matters. If the consumer keeps up, the sentinel is always waiting at the
top of `queue.get()` and the correct path runs, which is why a naive test of
this passes against the broken code. The race needs the producer to run to
completion while the consumer is parked, so this test stalls once after the
first chunk — letting the drain thread finish and queue the sentinel behind the
remaining batches — and then drains the rest at full speed. The burst drain
then has no choice but to walk into the sentinel.
"""
from __future__ import annotations

import asyncio
import json
import threading
import time

import pytest

from app.application.dto import LogStreamParams
from app.interface.api.v1.routes import logs as logs_route

pytestmark = pytest.mark.asyncio


class _UseCase:
    """Yields `n` entries, then lets the watch end like a stopped pod would."""

    def __init__(self, n: int) -> None:
        self.n = n
        # The thread that drove the blocking watch, and whether that generator
        # has been unwound. See the thread-liveness test for why this — and not
        # `threading.enumerate()` — is the thing worth asserting.
        self.thread: threading.Thread | None = None
        self.unwound = False

    def stream(self, ref, container, tail, stop_event=None):
        self.thread = threading.current_thread()
        try:
            for i in range(self.n):
                yield LogStreamParams(
                    timestamp="2026-01-01T00:00:00Z",
                    content=f"line-{i}",
                    container="c",
                    severity="INFO",
                )
        finally:
            # Runs on exhaustion AND on GeneratorExit, i.e. exactly when the
            # drain loop stopped driving the watch.
            self.unwound = True


class _Request:
    async def is_disconnected(self) -> bool:
        return False


class _Session:
    token = "sess-terminate-test"


@pytest.fixture(autouse=True)
def _reset_slots():
    logs_route._session_slots.clear()
    yield
    logs_route._session_slots.clear()


async def _collect(n_entries: int, stall: float = 0.0) -> list[dict]:
    uc = _UseCase(n_entries)
    resp = await logs_route.stream(
        request=_Request(),
        namespace="ns",
        name="p",
        context="ctx",
        container=None,
        tail_lines=500,
        keepalive_seconds=5,
        uc=uc,
        s=_Session(),
    )
    events: list[dict] = []
    it = resp.body_iterator.__aiter__()

    async def take(chunk) -> None:
        if isinstance(chunk, dict):
            events.append(chunk)

    await take(await it.__anext__())
    if stall:
        # The producer thread runs to completion behind us here, queueing every
        # remaining batch and then the sentinel.
        await asyncio.sleep(stall)
    async for chunk in it:
        await take(chunk)

    # The generator's `finally` runs when the async-for exhausts it, but the
    # producer thread it cancels is NOT part of that teardown: `task.cancel()`
    # only cancels the awaiting coroutine, and the blocking watch inside
    # `asyncio.to_thread` unwinds on its own via `stop_event`. Give it a bounded
    # window to notice, so the assertions below are not racing the teardown.
    await asyncio.sleep(0.3)

    return events, uc


async def test_stream_sends_end_when_the_producer_outruns_the_consumer():
    entries = 250  # 3 batches of BATCH_MAX, so the drain has work to do
    events, _ = await asyncio.wait_for(_collect(entries, stall=1.5), timeout=15.0)

    kinds = [e.get("event") for e in events]
    assert kinds[-1] == "end", f"stream never terminated; got {kinds[-5:]}"
    assert "ping" not in kinds, "a finished stream must not keep pinging"
    assert _lines(events) == entries, "every line must still be delivered"


async def test_stream_sends_end_with_a_single_batch():
    # The boring path, kept so the fix cannot be "just delete the drain loop".
    events, _ = await _collect(3)
    assert [e.get("event") for e in events] == ["log", "end"]
    assert _lines(events) == 3


async def test_termination_releases_the_session_slot_exactly_once():
    # The hang's real cost: a stream that ended without releasing its lease
    # held a slot until the client happened to disconnect. Four flaky streams
    # and every later log panel in that session got a permanent 429. Assert the
    # slot is GONE rather than merely decremented, and assert a second stream
    # on the same token still works — a double release would hand out a slot
    # nobody paid for, which only shows up as the cap silently drifting up.
    await asyncio.wait_for(_collect(250, stall=1.5), timeout=15.0)
    assert logs_route._session_slots == {}, "slot leaked after the stream ended"

    await asyncio.wait_for(_collect(3), timeout=15.0)
    assert logs_route._session_slots == {}


async def test_termination_leaves_no_producer_thread_running():
    # Each stream pins one shared-executor thread for the life of the blocking
    # watch, and that pool serves ALL other K8s I/O in the process.
    #
    # The assertion is that the blocking generator was UNWOUND, not that a
    # thread object died: `asyncio.to_thread` runs on the event loop's shared
    # default ThreadPoolExecutor, whose idle workers are deliberately kept
    # alive for reuse and are only joined at loop shutdown. Counting live
    # threads fails on correct code. What must not happen is the drain loop
    # still driving the watch after the response has ended — that is the thread
    # pinned forever, and `stop_event` is the only thing that frees it.
    _, uc = await asyncio.wait_for(_collect(250, stall=1.5), timeout=15.0)

    deadline = time.monotonic() + 5.0
    while time.monotonic() < deadline:
        if uc.unwound:
            break
        await asyncio.sleep(0.1)

    assert uc.unwound, "the blocking watch was still driven after the stream ended"


def _lines(events: list[dict]) -> int:
    return sum(
        len(json.loads(e["data"]))
        for e in events
        if e.get("event") == "log"
    )
