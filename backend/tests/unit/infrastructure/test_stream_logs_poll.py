"""`stream_logs` follows by polling self-terminating snapshots.

The streaming API is unusable against this cluster — every variant leaves the
apiserver holding a chunked response until the read times out (measured: 30s
ReadTimeoutError for `since_seconds=5`, for `follow=True`, and for both). The
old implementation therefore produced a stream that lived exactly as long as
its read timeout and then died of an exception, reconnected by the browser,
forever. A preloaded read returns in about a second, so this polls those.

These tests pin the properties that matter: overlap between consecutive polls
is not re-sent, a poll never lets the apiserver truncate the window it
reads, a quiet pod backs off instead of hammering the apiserver, a deleted
pod ends the stream, and a transient error does not.
"""
from __future__ import annotations

import asyncio
import threading
import time
from typing import List

import pytest
from kubernetes.client.exceptions import ApiException

from app.domain.value_objects.primitives import ResourceRef
from app.infrastructure.k8s import adapter as adapter_mod

REF = ResourceRef(cluster="c", namespace="ns", kind="Pod", name="p")


class _OneContainerPod:
    """Mixin: the adapter resolves the pod's container list before a
    container-less read.

    The apiserver refuses a container-less read on a multi-container pod,
    so the adapter asks the pod which containers it has and reads them one
    by one. These fakes model a one-container pod, which keeps the
    scripted log bodies in the order the test wrote them.
    """

    def read_namespaced_pod(self, **kw):  # noqa: N802 - SDK name
        class _C:
            name = "app"

        class _Spec:
            containers = [_C()]
            init_containers = []

        class _Pod:
            spec = _Spec()

        return _Pod()


class _Api(_OneContainerPod):
    """Answers a scripted sequence of log bodies, one per poll."""

    def __init__(self, script: List[str]) -> None:
        self.script = script
        self.calls: List[float] = []
        self.kwargs: List[dict] = []

    def read_namespaced_pod_log(self, **kw):  # noqa: N802 - SDK name
        self.calls.append(time.monotonic())
        self.kwargs.append(kw)
        return self.script.pop(0) if self.script else ""


def _repo(api) -> adapter_mod.KubernetesAdapter:
    repo = object.__new__(adapter_mod.KubernetesAdapter)
    repo._pool = type("P", (), {"get": staticmethod(lambda *a, **k: (api, "ctx"))})()
    repo._session_token = "tok"
    repo._kubeconfig_path = None
    repo._timeout = 5
    return repo


def _drive(repo, stop: threading.Event, want: int, budget: float = 5.0):
    """Run the generator on a thread until `want` lines or the budget expires."""
    box: List = []

    def run():
        try:
            for e in repo.stream_logs(REF, None, 200, stop_event=stop):
                box.append(e.content)
                if len(box) >= want:
                    return
        except Exception as exc:  # surfaced by the assertions below
            box.append(exc)

    t = threading.Thread(target=run, daemon=True)
    t.start()
    deadline = time.monotonic() + budget
    while len(box) < want and time.monotonic() < deadline:
        time.sleep(0.02)
    stop.set()
    t.join(timeout=5)
    return box


def test_consecutive_polls_do_not_resend_overlapping_lines(monkeypatch):
    # `since_seconds` re-reads the tail, so poll 2 sees everything poll 1
    # already sent. Re-sending it would double the panel.
    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: None)
    body = "2026-01-01T00:00:00Z line-a\n2026-01-01T00:00:01Z line-b\n"
    api = _Api([body] * 30)

    got = _drive(_repo(api), threading.Event(), want=2)

    # The content carries the LINE, not the apiserver's timestamp prefix —
    # the history path strips it, so the follow-stream has to as well.
    assert got == ["line-a", "line-b"]


def test_read_window_covers_the_longest_backoff():
    """The invariant the quiet-pod line loss came from.

    The gap between two polls is the READ plus the SLEEP — a poll that wakes
    after the backoff re-reads a window that has to reach back over that
    whole gap, or the lines written while the previous poll was still
    reading fall out of the window and are gone for good. A window narrower
    than (read + sleep) silently drops every line written into a quiet gap
    — reproduced against a live pod, where probe lines written between polls
    never reached the panel.
    """
    assert (
        adapter_mod._STREAM_SINCE_SECONDS
        >= adapter_mod._STREAM_MAX_INTERVAL + adapter_mod._STREAM_READ_TIMEOUT
    )


def test_a_poll_never_lets_the_apiserver_truncate_the_window(monkeypatch):
    """The apiserver returns the last N lines OF the window.

    The window itself is computed by the node
    (pkg/kubelet/kuberuntime/kuberuntime_logs.go), where `since` and `tail`
    commute: the answer is the last `tail` lines of the window, not the
    window cut down to `tail`. So a poll that asks for a tail DROPS the
    window's oldest lines whenever the pod bursts, and the next poll's
    window has already moved past them — the burst is lost for good.

    The follow poll must therefore not ask for a tail at all.
    """
    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: None)
    api = _Api(["2026-01-01T00:00:00Z x\n"] * 5)

    _drive(_repo(api), threading.Event(), want=1)

    assert api.kwargs, "no polls were made"
    assert all(kw.get("tail_lines") is None for kw in api.kwargs), api.kwargs


def test_the_history_read_still_honours_the_requested_tail():
    """The client's tail contract lives on the backfill, not on the poll.

    The follow poll reads the whole window so a burst cannot be truncated
    away; the history read still asks the apiserver for exactly the number
    of lines the client asked for.
    """
    api = _Api(["2026-01-01T00:00:00Z x\n"])

    asyncio.run(_repo(api).read_logs(REF, None, 123, None))

    assert [kw.get("tail_lines") for kw in api.kwargs] == [123]


def test_every_poll_reads_the_full_window(monkeypatch):
    """What the loop actually asks the apiserver for.

    Pins the `since_seconds` the polls send, so a future edit cannot narrow
    the window without this file noticing.
    """
    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: None)
    api = _Api(["2026-01-01T00:00:00Z x\n"] * 5)

    _drive(_repo(api), threading.Event(), want=1)

    assert api.kwargs, "no polls were made"
    assert {kw["since_seconds"] for kw in api.kwargs} == {
        adapter_mod._STREAM_SINCE_SECONDS
    }
    assert {kw["timestamps"] for kw in api.kwargs} == {True}


def test_a_quiet_pod_backs_off_instead_of_polling_every_two_seconds(monkeypatch):
    # The point of the backoff: an idle log panel must not cost an API call
    # every two seconds for the rest of the shift.
    waited: List[float] = []
    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: waited.append(s))

    # BaseException, not Exception: the loop's `except Exception` deliberately
    # swallows transport errors and keeps polling, so an Exception subclass
    # would be treated as a blip and the loop would never end.
    class _Done(BaseException):
        pass

    class _Quiet(_OneContainerPod):
        def __init__(self):
            self.calls = 0

        def read_namespaced_pod_log(self, **kw):
            self.calls += 1
            if self.calls > 12:
                raise _Done
            return ""

    # A stop_event that never trips, so the loop's `stop_event.wait(interval)`
    # records the backoff instead of really sleeping for 15 seconds.
    class _EternalStop:
        def is_set(self):
            return False

        def wait(self, s):
            waited.append(s)
            return False

    api = _Quiet()
    with pytest.raises(_Done):
        list(_repo(api).stream_logs(REF, None, 200, stop_event=_EternalStop()))

    assert api.calls >= 8, api.calls
    assert waited == sorted(waited), waited
    assert max(waited) <= adapter_mod._STREAM_MAX_INTERVAL, waited
    assert waited[-1] > 2.0, waited


def test_a_deleted_pod_ends_the_stream_instead_of_retrying_forever(monkeypatch):
    # 404 is the apiserver saying the container is gone — a real end of stream,
    # which is what lets the SSE endpoint send `end` rather than looping on an
    # error until the client gives up.
    class _Gone(_OneContainerPod):
        def __init__(self):
            self.calls = 0

        def read_namespaced_pod_log(self, **kw):
            self.calls += 1
            raise ApiException(status=404, reason="Not Found")

    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: pytest.fail("slept"))
    api = _Gone()

    assert list(_repo(api).stream_logs(REF, None, 200, stop_event=threading.Event())) == []
    assert api.calls == 1


def test_a_transient_error_does_not_end_the_stream(monkeypatch):
    # A 500 must not kill the panel: an apiserver restart should not blank it.
    class _Flaky(_OneContainerPod):
        def __init__(self):
            self.calls = 0

        def read_namespaced_pod_log(self, **kw):
            self.calls += 1
            if self.calls == 1:
                raise ApiException(status=500, reason="boom")
            return "2026-01-01T00:00:00Z recovered\n"

    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: None)
    api = _Flaky()

    got = _drive(_repo(api), threading.Event(), want=1)

    assert got == ["recovered"]


def test_stop_event_set_upfront_means_no_poll_at_all():
    # A closed tab must not keep the worker thread alive for the rest of the
    # backoff interval, nor spend an API call discovering there is nothing to do.
    api = _Api([""] * 10)
    stop = threading.Event()
    stop.set()

    assert list(_repo(api).stream_logs(REF, None, 200, stop_event=stop)) == []
    assert len(api.calls) == 0, "polled despite stop_event already being set"


def test_timestamp_less_lines_are_still_deduplicated_across_polls(monkeypatch):
    # Regression, found on a real cluster rather than reasoned about.
    # Containers usually do not prefix their output, so the apiserver's line
    # has no timestamp of its own and `parse_log_line` falls back to "now".
    # Deduplicating on that fallback stamped the same line with a different
    # second on every poll, so the key never matched and every overlapping line
    # was re-sent — a live pod showed 95 lines for 46 distinct ones, going
    # backwards as it went. `timestamps=True` makes the apiserver supply a real
    # stamp, so the key is stable.
    waited: List[float] = []
    monkeypatch.setattr(adapter_mod.time, "sleep", lambda s: waited.append(s))

    class _Done(BaseException):
        pass

    stamp = "2026-10-20T03:45:12.123456789Z"

    class _Api2(_OneContainerPod):
        def __init__(self):
            self.calls = 0

        def read_namespaced_pod_log(self, **kw):
            self.calls += 1
            if self.calls > 6:
                raise _Done
            assert kw.get("timestamps") is True, "stream must ask for timestamps"
            # Same two lines on every poll, as an overlapping tail looks.
            return f"{stamp} tick-a\n{stamp} tick-b\n"

    class _EternalStop:
        def is_set(self):
            return False

        def wait(self, s):
            return False

    api = _Api2()
    seen = []
    with pytest.raises(_Done):
        for e in _repo(api).stream_logs(REF, None, 200, stop_event=_EternalStop()):
            if e is not None:
                seen.append(e.content)

    assert len(seen) == 2, f"re-sent overlapping lines across {api.calls} polls: {seen}"
