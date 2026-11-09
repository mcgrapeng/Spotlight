"""Adapter: implements K8sRepositoryPort by delegating to the kubernetes SDK + mappers.

The kubernetes SDK is sync — every call into `api.list_*` blocks for the
duration of the apiserver round-trip. Wrapping them in `run_in_threadpool`
keeps the FastAPI event loop free to handle other requests (especially the
SSE log stream, which must keep ticking).
"""
from __future__ import annotations

import ast
import asyncio
import re
import threading
import time
from collections import deque
from datetime import datetime, timezone
from typing import Deque, Iterator, Optional

from fastapi.concurrency import run_in_threadpool
from kubernetes.client.exceptions import ApiException

# Follow-stream tuning. See KubernetesRepository.stream_logs for why each of
# these exists — the numbers are measured against a real apiserver, not guessed.
#
# THE INVARIANT: the read window must cover the longest gap between two
# polls, and that gap is the READ plus the SLEEP. A poll wakes after the
# backoff and re-reads a window that has to reach back over that whole gap,
# or the lines written while the previous poll was still reading fall out of
# the window and are gone for good. (Reproduced against a live pod: probe
# lines written into the gap never reached the panel while neighbours
# written during a busy burst did.) The window is DERIVED from the interval
# AND the read timeout so the two cannot drift apart again — see
# test_stream_logs_poll.test_read_window_covers_the_longest_backoff.
#
# The window itself is computed by the node
# (pkg/kubelet/kuberuntime/kuberuntime_logs.go), where `since` and `tail`
# commute: the answer is the last `tail` lines OF the window, not the
# window cut down to `tail`. That is why the follow poll asks for NO tail
# at all — see stream_logs.
_STREAM_MIN_INTERVAL = 2.0    # while the pod is producing
_STREAM_MAX_INTERVAL = 8.0    # once it goes quiet; worst-case tail lag ≈ 9s
_STREAM_READ_TIMEOUT = 10.0   # a preloaded read is ~1s; this is the safety net
_STREAM_SKEW_MARGIN = 2.0     # clock skew between the apiserver and the node
_STREAM_SINCE_SECONDS = int(
    _STREAM_MAX_INTERVAL + _STREAM_READ_TIMEOUT + _STREAM_SKEW_MARGIN
)
_STREAM_DEDUP_WINDOW = 4096   # signatures kept to cover poll overlap


def _container_names(api, ref: ResourceRef, timeout: float) -> list[str]:
    """The pod's container names, in spec order.

    Blocking on purpose: the caller is either a threadpool worker
    (read_logs) or the follow-stream's own thread (stream_logs), and the
    kubernetes SDK is synchronous.

    Init containers are included — they have logs too, and a crashed init
    container is exactly where a CrashLoopBackOff story starts.

    An unreadable pod (deleted mid-request, RBAC on pods/get) yields no
    containers rather than raising: the caller then has nothing to read,
    which the API can report as an empty log set instead of a 500.
    """
    try:
        pod = api.read_namespaced_pod(
            name=ref.name, namespace=ref.namespace, _request_timeout=timeout,
        )
    except ApiException:
        return []
    spec = getattr(pod, "spec", None)
    if spec is None:
        return []
    names = [c.name for c in (getattr(spec, "containers", None) or [])]
    names += [c.name for c in (getattr(spec, "init_containers", None) or [])]
    return [n for n in names if n]


def _decode_sdk_log_content(value: object) -> str:
    """Normalize a value from the kubernetes SDK's pod-log endpoints into
    a proper UTF-8 string with real newlines.

    The kubernetes Python SDK 36.x falls back to ``repr(bytes_object)`` when
    its strict text decode fails on a single non-UTF-8 byte in the response
    body (e.g. an ANSI ESC ``\\x1b`` mid-stream). The fallback is
    lossless but the resulting string is unusable: ``\\n`` is two characters
    (backslash + n), not a newline, so downstream ``splitlines()`` returns a
    single "line" containing the whole log blob.

    This helper unwraps both raw ``bytes`` and the ``repr`` string form, so
    ``read_logs`` and ``stream_logs`` share one decoder. Empty / ``None`` →
    empty string. Anything that is neither ``bytes`` nor a recognizable
    ``b'…'`` / ``b"…"`` repr is returned as-is (passthrough keeps a
    legitimate log line that happens to start with ``b`` intact, and any
    malformed literal raises inside ``ast.literal_eval`` and is caught).
    """
    if value is None or value == "":
        return ""
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    if isinstance(value, str):
        # repr-of-bytes form: b'…' or b"…", matching outer quote. Length
        # guard rejects trivial false positives (e.g. the literal two-char
        # string "b'" which is not a valid bytes literal anyway).
        if len(value) >= 4 and value[:2] in ("b'", 'b"') and value[-1] == value[1]:
            try:
                return ast.literal_eval(value).decode("utf-8", errors="replace")
            except (SyntaxError, ValueError):
                return value  # not a real repr — pass through untouched
        return value
    return str(value)

from app.application.ports.outbound import K8sRepositoryPort
from app.domain.entities.resources import Cluster, K8sEvent, LogEntry, Namespace, Node, Pod
from app.domain.value_objects.primitives import LabelSelector, ResourceRef
from app.domain.services.log_parser import parse_log_line
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.k8s.mapper.mappers import (
    map_event,
    map_namespace,
    map_namespaces_batch,
    map_node,
    map_nodes_batch,
    map_pod,
    map_pods_batch,
)


class KubernetesAdapter(K8sRepositoryPort):
    def __init__(self, session_token: str, kubeconfig_path: str | None = None) -> None:
        self._pool = get_pool()
        self._timeout = get_settings().k8s_request_timeout
        self._session_token = session_token
        self._kubeconfig_path = kubeconfig_path

    # ── cluster ──────────────────────────────────────────────
    async def list_clusters(self) -> list[Cluster]:
        # No K8s SDK call — reads the cached kubeconfig. Safe sync wrapped
        # in async for interface uniformity.
        contexts = await run_in_threadpool(self._pool.list_contexts, self._kubeconfig_path)
        return [
            Cluster(
                name=c["name"], server=c.get("server", ""), user=c["user"],
                default_namespace=c["namespace"], is_current=c["is_current"],
                cluster=c.get("cluster", ""),
            )
            for c in contexts
        ]

    def current_cluster(self) -> str | None:
        return self._pool.current(self._kubeconfig_path)

    # ── namespaces ───────────────────────────────────────────
    async def list_namespaces(self, cluster: Optional[str]) -> list[Namespace]:
        api, ctx = self._pool.get(self._session_token, self._kubeconfig_path, cluster)
        result = await run_in_threadpool(
            lambda: api.list_namespace(_request_timeout=self._timeout)
        )
        return map_namespaces_batch(result.items, cluster=ctx)

    # ── pods ─────────────────────────────────────────────────
    async def list_pods(
        self, cluster: Optional[str], namespace: Optional[str],
        label_selector: LabelSelector, search: Optional[str], status: Optional[str],
    ) -> list[Pod]:
        api, ctx = self._pool.get(self._session_token, self._kubeconfig_path, cluster)
        kw: dict = {"_request_timeout": self._timeout}
        if namespace and namespace != "_all":
            kw["namespace"] = namespace
        if label_selector.pairs:
            kw["label_selector"] = label_selector.to_query()
        if namespace and namespace != "_all":
            items = await run_in_threadpool(
                lambda: api.list_namespaced_pod(**kw).items
            )
        else:
            items = await run_in_threadpool(
                lambda: api.list_pod_for_all_namespaces(**kw).items
            )

        # ponytail: batch mapper hoists `datetime.now()` once instead of N times.
        pods = map_pods_batch(items, cluster=ctx)
        if status and status.lower() != "all":
            target = status.lower()
            pods = [p for p in pods if p.phase.lower() == target]
        if search:
            q = search.lower()
            pods = [
                p for p in pods
                if q in p.name.lower()
                or any(q in c.name.lower() for c in p.containers)
                or (p.node and q in p.node.lower())
                or q in p.namespace.lower()
            ]
        return pods

    async def get_pod(self, ref: ResourceRef) -> Pod:
        api, ctx = self._pool.get(self._session_token, self._kubeconfig_path, ref.cluster or None)
        obj = await run_in_threadpool(
            lambda: api.read_namespaced_pod(
                name=ref.name, namespace=ref.namespace,
                _request_timeout=self._timeout,
            )
        )
        return map_pod(obj, cluster=ctx)

    # ── events ───────────────────────────────────────────────
    async def list_events(
        self, cluster: Optional[str], namespace: Optional[str],
        involved_name: Optional[str], limit: int,
    ) -> list[K8sEvent]:
        api, _ = self._pool.get(self._session_token, self._kubeconfig_path, cluster)
        # NOTE: `limit` on the K8s list API is a *page* size, not "last N" —
        # passing it would silently truncate to the first page in arbitrary
        # order. Fetch everything (event objects are compacted away after
        # ~1h, so lists stay small) and truncate locally on sorted time.
        kw = {"_request_timeout": self._timeout}
        if namespace and namespace != "_all":
            items = await run_in_threadpool(
                lambda: api.list_namespaced_event(namespace=namespace, **kw).items
            )
        else:
            items = await run_in_threadpool(
                lambda: api.list_event_for_all_namespaces(**kw).items
            )
        events = [map_event(e) for e in items]
        if involved_name:
            events = [e for e in events if e.involved_name == involved_name]
        events.sort(key=lambda e: e.last_seen or "", reverse=True)
        return events[:limit] if limit and limit > 0 else events

    # ── nodes ────────────────────────────────────────────────
    async def list_nodes(self, cluster: Optional[str]) -> list[Node]:
        api, ctx = self._pool.get(self._session_token, self._kubeconfig_path, cluster)
        # Run the two K8s calls in parallel — both are bound by network RTT.
        nodes, pods = await asyncio.gather(
            run_in_threadpool(lambda: api.list_node(_request_timeout=self._timeout)),
            run_in_threadpool(lambda: api.list_pod_for_all_namespaces(_request_timeout=self._timeout)),
        )
        pod_count: dict[str, int] = {}
        for p in pods.items:
            if p.spec.node_name:
                pod_count[p.spec.node_name] = pod_count.get(p.spec.node_name, 0) + 1
        return map_nodes_batch(nodes.items, pod_count_by_node=pod_count, cluster=ctx)

    # ── logs ─────────────────────────────────────────────────
    async def read_logs(
        self, ref: ResourceRef, container: Optional[str],
        tail_lines: int, since: Optional[str],
    ) -> list[LogEntry]:
        api, _ = self._pool.get(self._session_token, self._kubeconfig_path, ref.cluster or None)
        # ponytail: 没有指定容器时，读这个 Pod 的全部容器。
        #
        # 之前这里把 container=None 直接透给 apiserver，而 apiserver 在 Pod
        # 有多个容器时要求必须指定容器名 —— 于是它回 400，SDK 抛
        # ApiException，路由没接住，整个接口 500。
        #
        # 这个 bug 在 mock 里永远看不见：e2e 把 /logs 整个 mock 掉了，
        # 而真实集群里绝大多数 Pod 是单容器（k3d 演示集群就是），只有接到
        # 一个多容器的生产 Pod 才会露出来 —— 那是日志面板第一次打开就 500，
        # 正是这个产品最核心的那个功能。
        #
        # 前端早就按「多容器合并 + 每行带容器名」设计（容器页签、按容器
        # 过滤、containerCounts），后端只是从来没实现它。
        targets = [container] if container else _container_names(api, ref, self._timeout)
        if not targets:
            return []
        entries: list[LogEntry] = []
        for name in targets:
            entries.extend(await self._read_logs_from(api, ref, name, tail_lines, since))
        # 合并之后按时间排序。tail_lines 是**每个容器**的尾行数，和
        # `kubectl logs --all-containers --tail=N` 一个口径 —— 按整个 Pod
        # 裁一刀的话，安静容器的日志会被话痨容器挤掉，切到那个容器的页签
        # 看到 0 行，而它其实有日志。
        entries.sort(key=lambda e: e.timestamp)
        return entries

    async def _read_logs_from(
        self, api, ref: ResourceRef, container: str,
        tail_lines: int, since: Optional[str],
    ) -> list[LogEntry]:
        kw = {
            "name": ref.name, "namespace": ref.namespace,
            "container": container, "tail_lines": tail_lines,
            "_request_timeout": self._timeout,
        }
        # Ask the apiserver for per-line timestamps. Without this every line
        # comes back bare, and `parse_log_line` falls back to "now" — so the
        # whole history was stamped with the moment it was fetched (all 500
        # rows sharing one timestamp), and the follow-stream's dedup key
        # changed on every poll, re-sending lines it had already sent. Both
        # read paths must agree or their timestamps are not comparable.
        kw["timestamps"] = True
        if since:
            kw["since_seconds"] = _since_to_seconds(since)
        try:
            content = await run_in_threadpool(
                lambda: api.read_namespaced_pod_log(**kw)
            )
        except TypeError:
            # Old kubernetes SDK without since_seconds support
            kw.pop("since_seconds", None)
            content = await run_in_threadpool(
                lambda: api.read_namespaced_pod_log(**kw)
            )
        content = _decode_sdk_log_content(content)
        # `timestamps=True` means every line arrives prefixed with its RFC3339
        # stamp. Split it off here rather than leaving it in `content`: the
        # LogViewer renders `timestamp` in its own column, so a prefixed
        # content would show the time twice. Keeping content as the parsed
        # remainder also makes it comparable with the follow-stream's lines.
        entries = []
        for line in (content or "").splitlines():
            if not line:
                continue
            ts, rest = parse_log_line(line, container or "")
            entries.append(
                LogEntry(timestamp=ts, content=rest, container=container or "")
            )
        return entries

    def stream_logs(
        self, ref: ResourceRef, container: Optional[str], tail_lines: int,
        stop_event: Optional[threading.Event] = None,
    ) -> Iterator[LogEntry]:
        """Follow a pod's logs by polling short, self-terminating snapshots.

        Caller MUST iterate in a thread (`asyncio.to_thread`), because this is
        a blocking sync generator.

        Why polling and not the streaming API — measured against this cluster,
        not assumed. Every streaming variant leaves the apiserver holding a
        chunked response open until the client gives up:

            Watch().stream(..., since_seconds=5)      -> ReadTimeoutError @ 30s
            Watch().stream(..., follow=True)          -> ReadTimeoutError @ 30s
            Watch().stream(..., follow=True, since=5) -> ReadTimeoutError @ 30s
            read_namespaced_pod_log(_preload_content=True)                  -> 1.14s
            read_namespaced_pod_log(since_seconds=5, preload=True)         -> 0.51s

        An earlier version of this docstring claimed an empirical probe showed
        `follow=True` returning in 0.2s. That no longer reproduces, and the
        behaviour it described is what produced a stream that lived exactly as
        long as its read timeout: every ~30s the upstream raised
        ReadTimeoutError, the producer logged it and finished, and the SSE
        response closed only to be reconnected by the browser. An idle pod — the
        common case — therefore pinned an executor thread and a session slot in
        a guaranteed-crash cycle.

        A preloaded read is self-terminating and returns in about a second, so
        this loop never blocks in a socket read. It sleeps between polls, and
        the interval backs off when a pod is quiet: 2s while lines are
        arriving (so a live tail still feels live), up to 8s once it goes
        quiet. An idle log panel costs one API call every 8s instead of a
        permanently held connection.

        The re-read window (`_STREAM_SINCE_SECONDS`) is deliberately wider
        than the longest gap between two polls (the read plus the sleep), so
        a line written into a quiet gap is still inside the window the next
        poll reads. See the constants block above for the invariant.

        Dedup happens HERE, over a bounded recent window, because consecutive
        polls overlap by design (`since_seconds` re-reads the tail). Doing it
        server-side is what lets the client's own dedup set be bounded too.

        Terminates when the pod's container is gone (the apiserver answers 400)
        or when `stop_event` is set, which is what lets the SSE endpoint send a
        real `end` instead of dying of a timeout.

        `tail_lines` is part of the port's signature but the follow poll
        deliberately does NOT use it: the apiserver returns the last `tail`
        lines OF the window, so a burst bigger than the tail loses its oldest
        lines for good — the next poll's window has already moved past them.
        The client's tail contract is honoured by the history backfill
        (`read_logs`), which is where the panel's initial lines come from.
        """
        api, _ = self._pool.get(self._session_token, self._kubeconfig_path, ref.cluster or None)

        # ponytail: 同 read_logs —— 没指定容器时，跟这个 Pod 的所有容器。
        # 之前 container=None 直接进 apiserver，多容器 Pod 上它回 400，
        # 下面的 `except ApiException: 400/404 → return` 于是把整条流
        # 静默结束掉：面板上永远是「暂无日志」，而历史接口那边是 500。
        targets = [container] if container else _container_names(api, ref, self._timeout)
        if not targets:
            return

        # Bounded: only has to cover the overlap between consecutive polls,
        # which is at most one interval's worth of lines.
        recent: Deque[tuple[str, str, str]] = deque(maxlen=_STREAM_DEDUP_WINDOW)
        interval = _STREAM_MIN_INTERVAL

        while True:
            if stop_event is not None and stop_event.is_set():
                return

            emitted = 0
            for target in list(targets):
                try:
                    raw = api.read_namespaced_pod_log(
                        name=ref.name, namespace=ref.namespace,
                        container=target,
                        # NO tail_lines: the apiserver returns the last
                        # `tail` lines OF the window, so a burst bigger
                        # than the tail is truncated away for good — the
                        # next poll's window has already moved past it.
                        # The window is small (seconds), so reading it
                        # whole is cheap; the read timeout is the backstop.
                        since_seconds=_STREAM_SINCE_SECONDS,
                        timestamps=True,
                        _request_timeout=_STREAM_READ_TIMEOUT,
                        _preload_content=True,
                    )
                except ApiException as e:
                    # 400/404: that container is gone (a sidecar was
                    # removed, the pod was replaced). Drop it and keep
                    # following the others; when the last one goes, the
                    # stream is really over and the caller sends `end`.
                    # Anything else (a blip, a 500) is transient — keep
                    # following, because a log panel should survive an
                    # apiserver restart.
                    if e.status in (400, 404):
                        targets.remove(target)
                        if not targets:
                            return
                        continue
                    continue
                except Exception:
                    # Transport blip, DNS, a dropped keep-alive. Treat it as
                    # "no new lines" rather than ending the stream.
                    continue

                for line in _decode_sdk_log_content(raw).splitlines():
                    if not line.strip():
                        continue
                    # Split the apiserver's stamp off the line, exactly as
                    # the history path does, so the use case sees the same
                    # shape from both: the line's real time, and the line's
                    # text. The raw line is still what the dedup key uses —
                    # it is the identity of the line, and the prefix is part
                    # of it. The container name is part of the key too: two
                    # containers can legitimately print the same line, and
                    # dropping the second one would be a silent data loss.
                    ts, rest = parse_log_line(line, target)
                    sig = (ts, target, line)
                    if sig in recent:
                        continue
                    recent.append(sig)
                    emitted += 1
                    yield LogEntry(
                        timestamp=ts, content=rest, container=target
                    )

                # Poll-boundary marker: this poll is complete, flush whatever
                # it produced. Without it a partial batch sits in `_drain`
                # until the batch fills or the stream ends — and the stream no
                # longer ends, because following is now a long-lived poll loop.
                # (That partial flush used to happen by accident: the old
                # streaming implementation died of ReadTimeoutError every 30s,
                # and the dying generator flushed on the way out. A quiet pod
                # therefore showed pings but no lines at all.)
                yield None  # type: ignore[misc]

            if stop_event is not None and stop_event.is_set():
                return

            # Busy pod -> poll again promptly so a live tail stays live; quiet
            # pod -> back off, because an idle log panel should not cost an API
            # call every two seconds for the rest of the shift.
            interval = (
                _STREAM_MIN_INTERVAL if emitted
                else min(interval * 2, _STREAM_MAX_INTERVAL)
            )

            # Interruptible sleep: stop_event.wait returns as soon as the client
            # goes away, so a closed tab does not keep this thread alive for
            # the rest of the interval.
            if stop_event is not None:
                if stop_event.wait(interval):
                    return
            else:
                time.sleep(interval)


def _since_to_seconds(since: str) -> int:
    """Coarse 'since' parser. Accepts ISO8601 timestamp or short form ('5m' / '2h' / '1d').

    Raises ValueError on unparseable input — silently treating bad input as
    "since 0" would quietly return the wrong log window.
    """
    m = re.match(r"^(\d+)([smhd])$", since.strip())
    if m:
        n = int(m.group(1))
        unit = m.group(2)
        return {"s": n, "m": n * 60, "h": n * 3600, "d": n * 86400}[unit]
    try:
        # stdlib since 3.11 handles the "Z" suffix and offsets natively.
        dt = datetime.fromisoformat(since.strip().replace("Z", "+00:00"))
    except ValueError as e:
        raise ValueError(f"unparseable since: {since!r}") from e
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return max(1, int((datetime.now(timezone.utc) - dt).total_seconds()))
