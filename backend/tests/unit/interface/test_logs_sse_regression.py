"""SSE 日志流的并发闸门 + 事件编码。

这块曾有一份回归测试（`test_logs_sse_regression.py`，只剩 .pyc 残骸），而它
守的正是并发控制：信号量、背压队列、线程↔asyncio 桥。旧的进程级
`BoundedSemaphore(8)` 让团队里第 4 个人开日志面板就吃 429——已改为按会话
计数，这里锁住新语义。
"""
from __future__ import annotations

import asyncio
import threading

import pytest

from app.interface.api.v1.routes import logs as logs_route
from app.infrastructure.auth import session as session_store


@pytest.fixture(autouse=True)
def _reset_slots():
    logs_route._session_slots.clear()
    yield
    logs_route._session_slots.clear()


def test_cap_is_per_session_not_global():
    """每个会话各有 4 个额度；一个人开满不该影响别人。"""
    alice = "sess-alice"
    assert all(logs_route._acquire_slot(alice) for _ in range(logs_route.MAX_STREAMS_PER_SESSION))
    assert logs_route._acquire_slot(alice) is False          # 她自己的第 5 个被拒
    assert logs_route._acquire_slot("sess-bob") is True      # Bob 完全不受影响


def test_releasing_frees_a_slot():
    token = "sess-carol"
    for _ in range(logs_route.MAX_STREAMS_PER_SESSION):
        assert logs_route._acquire_slot(token)
    assert logs_route._acquire_slot(token) is False

    logs_route._release_slot(token)
    assert logs_route._acquire_slot(token) is True


def test_slot_key_is_removed_when_count_reaches_zero():
    """最后一个额度归还后 key 必须消失，否则 dict 随会话数单调增长。"""
    token = "sess-dave"
    logs_route._acquire_slot(token)
    assert token in logs_route._session_slots
    logs_route._release_slot(token)
    assert token not in logs_route._session_slots


def test_release_below_zero_does_not_go_negative():
    token = "sess-erin"
    logs_route._release_slot(token)
    assert token not in logs_route._session_slots
    assert logs_route._acquire_slot(token) is True


def test_slot_counting_is_thread_safe():
    """每个 SSE 请求跑在自己的线程/任务里；并发申请不能超发。"""
    token = "sess-frank"
    granted: list[bool] = []
    lock = threading.Lock()

    def worker():
        ok = logs_route._acquire_slot(token)
        with lock:
            granted.append(ok)

    threads = [threading.Thread(target=worker) for _ in range(40)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    assert sum(granted) == logs_route.MAX_STREAMS_PER_SESSION
    assert logs_route._session_slots[token] == logs_route.MAX_STREAMS_PER_SESSION


def test_shared_dev_session_keeps_the_old_process_wide_allowance():
    """Bearer / open mode all resolve to the one synthetic `dev` session.

    Charging them the per-session budget halved the cap for exactly the callers
    with no per-session identity to tell apart — five open tabs used to work
    under the old process-wide semaphore of 8 and would now 429.
    """
    dev = session_store.DEV_TOKEN
    assert all(logs_route._acquire_slot(dev)
               for _ in range(logs_route.MAX_STREAMS_SHARED_SESSION))
    assert logs_route._acquire_slot(dev) is False
    # …and it is still a separate bucket from a real logged-in session.
    assert logs_route._acquire_slot("sess-alice") is True


def test_release_is_idempotent():
    """The generator's finally and the response's background task both release
    the same lease, so a double release must not hand out a slot nobody paid
    for — that would let one session exceed its cap by one per race."""
    token = "sess-grace"
    assert logs_route._acquire_slot(token)
    lease = logs_route._SlotLease(token)
    for _ in range(3):                 # two real paths, plus a belt-and-braces one
        lease.release()
    assert token not in logs_route._session_slots
    assert logs_route._acquire_slot(token) is True


def test_release_slot_never_goes_negative():
    """`_release_slot` is the blunt instrument; it must not corrupt the dict
    even if a caller releases more than it acquired."""
    token = "sess-ivan"
    assert logs_route._acquire_slot(token)
    for _ in range(5):
        logs_route._release_slot(token)
    assert token not in logs_route._session_slots


def test_stream_response_that_is_never_iterated_still_releases():
    """The slot leak this endpoint had for its whole life.

    The counter is decremented in the SSE generator's `finally`. If the client
    vanishes before the generator's first `yield`, that `finally` never runs
    and the slot is gone for the rest of the session's 12h TTL — four flaky
    reconnects and the panel is permanently 429. The response now carries a
    background task that releases it too.
    """
    import asyncio
    import app.interface.api.v1.routes.logs as mod

    class FakeResponse:
        def __init__(self, body, background=None):
            self.body, self.background = body, background

    real = mod.EventSourceResponse
    mod.EventSourceResponse = FakeResponse
    try:
        # Call the route function directly; the handler is plain async and the
        # stubs below make everything it touches inert.
        class FakeSession:
            token = "sess-heidi"

        class FakeUC:
            async def stream(self, *a, **k):
                return

        class FakeRequest:
            async def is_disconnected(self):
                return True

        resp = asyncio.run(mod.stream(
            FakeRequest(), "ns", "pod", None, None, 200, 15, FakeUC(), FakeSession(),
        ))
        # The generator never ran (nobody consumed it), so only the background
        # task can have released.
        assert logs_route._session_slots[FakeSession.token] == 1
        asyncio.run(resp.background())
        assert FakeSession.token not in logs_route._session_slots
    finally:
        mod.EventSourceResponse = real


# ── backpressure: a full queue suspends the producer instead of dropping ────

class _RunningLoop:
    """`_drain` hands batches over via run_coroutine_threadsafe, which needs a
    loop that is actually RUNNING — not merely created. Run it on its own
    thread for the duration of the test."""

    def __init__(self) -> None:
        self.loop = asyncio.new_event_loop()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def _run(self) -> None:
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()

    def __enter__(self):
        return self.loop

    def __exit__(self, *_):
        self.loop.call_soon_threadsafe(self.loop.stop)
        self._thread.join(timeout=5)
        self.loop.close()


def test_drain_puts_batches_and_flushes_the_tail():
    queue: asyncio.Queue = asyncio.Queue(maxsize=10)
    stop = threading.Event()

    class UC:
        def stream(self, ref, container, tail, stop_event=None):
            for i in range(250):
                yield _entry(i)

    with _RunningLoop() as loop:
        # Drain on its own thread: it blocks on queue.put, and the queue is
        # bounded, so it must run concurrently with the loop feeding it.
        worker = threading.Thread(
            target=logs_route._drain, args=(loop, UC(), None, None, 100, queue, stop)
        )
        worker.start()
        worker.join(timeout=10)
        assert not worker.is_alive()

        batches = []
        while not queue.empty():
            batches.append(queue.get_nowait())

    assert sum(len(b) for b in batches) == 250
    assert all(len(b) <= logs_route.BATCH_MAX for b in batches)
    first = batches[0][0]
    assert set(first) == {"timestamp", "content", "container", "severity"}


def test_drain_respects_backpressure_and_loses_nothing():
    """Queue smaller than one batch: the producer must suspend, not drop. This
    is the property that keeps a fast-logging pod from eating the heap."""
    queue: asyncio.Queue = asyncio.Queue(maxsize=1)
    stop = threading.Event()

    class UC:
        def stream(self, ref, container, tail, stop_event=None):
            for i in range(50):
                yield _entry(i)

    with _RunningLoop() as loop:
        worker = threading.Thread(
            target=logs_route._drain, args=(loop, UC(), None, None, 100, queue, stop)
        )
        worker.start()

        # Consumer drains while the producer runs; total must still be 50.
        received: list = []
        deadline = threading.Event()
        t = threading.Thread(target=lambda: deadline.wait(10))
        t.start()
        while worker.is_alive() or not queue.empty():
            try:
                received.append(queue.get_nowait())
            except asyncio.QueueEmpty:
                pass
        worker.join(timeout=5)
        deadline.set()
        t.join(timeout=1)

    assert sum(len(b) for b in received) == 50


def test_drain_returns_early_when_stop_is_set():
    queue: asyncio.Queue = asyncio.Queue(maxsize=10)
    stop = threading.Event()
    stop.set()

    produced = 0

    class UC:
        def stream(self, ref, container, tail, stop_event=None):
            nonlocal produced
            for i in range(1000):
                produced += 1
                yield _entry(i)

    with _RunningLoop() as loop:
        logs_route._drain(loop, UC(), None, None, 100, queue, stop)

    # The loop pulls one entry before its stop check, so at most one entry is
    # consumed; what matters is that it does not walk all 1000 and that
    # nothing partial was queued.
    assert produced <= 1
    assert queue.empty()


def _entry(i: int):
    class E:
        timestamp = f"2026-01-01T00:00:{i % 60:02d}Z"
        content = f"line {i}"
        container = "app"
        severity = "INFO"
    return E()
