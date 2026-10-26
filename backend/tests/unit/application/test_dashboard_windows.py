"""The dashboard's counters have to mean what their labels say.

The frontend promises two time windows: "告警 N · 5min 内最近" and
"最近活动 · 最近 1h". The implementation counted "how many of the last 500
events are warnings" — no window at all.

That difference is invisible against a mock and glaring against a real
cluster. The cluster this was measured on has exactly ONE warning event,
and it has been firing since September (the same event, 48930 times). Its
last sighting is seconds ago, so both readings are technically "true" —
but "1 个 Warning 事件" reads as "it happened once", and the truth is that
it has been burning for six weeks.

The counters are now windowed, so the number and the label agree.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest

from app.application.use_cases.dashboard import DashboardUseCases
from app.domain.entities.resources import K8sEvent, Namespace


def _ago(**kw) -> str:
    """An event timestamp in the shape the mapper produces: str(datetime)."""
    return str(datetime.now(timezone.utc) - timedelta(**kw))


class FakeRepo:
    def __init__(self, events):
        self.events = events

    async def list_clusters(self): return []
    def current_cluster(self): return None
    async def list_namespaces(self, cluster): return [Namespace(name="default", status="Active", labels={}, age_seconds=1)]
    async def list_pods(self, cluster, namespace, label_selector, search, status): return []
    async def get_pod(self, ref): raise KeyError(ref.name)
    async def list_events(self, cluster, namespace, involved_name, limit): return list(self.events)
    async def list_nodes(self, cluster): return []
    async def read_logs(self, *a, **kw): return []
    def stream_logs(self, *a, **kw): return iter([])


def _warning(name: str, last_seen: str) -> K8sEvent:
    return K8sEvent(
        name=name, namespace="default", type="Warning", reason="BackOff",
        message="x", involved_kind="Pod", involved_name="p", count=3,
        first_seen=last_seen, last_seen=last_seen,
    )


async def _build(events):
    # A fresh scope per call: DashboardUseCases caches the whole snapshot
    # per (scope, cluster), and a shared scope would hand every test the
    # first test's result.
    return await DashboardUseCases(f"scope-{uuid4().hex}", FakeRepo(events)).build(None)


@pytest.mark.asyncio
async def test_a_warning_two_minutes_old_is_counted():
    out = await _build([_warning("fresh", _ago(minutes=2))])
    assert out.warning_events == 1


@pytest.mark.asyncio
async def test_a_warning_ten_minutes_old_is_not_counted():
    # "5min 内最近" has to mean five minutes.
    out = await _build([_warning("old", _ago(minutes=10))])
    assert out.warning_events == 0


@pytest.mark.asyncio
async def test_the_activity_list_only_covers_the_last_hour():
    out = await _build([
        _warning("in-window", _ago(minutes=30)),
        _warning("out-of-window", _ago(hours=2)),
    ])
    # 30 minutes old: outside the 5-minute alert window, inside the hour.
    assert out.warning_events == 0
    assert [e.name for e in out.recent_warns] == ["in-window"]


@pytest.mark.asyncio
async def test_an_event_without_a_timestamp_is_not_reported_as_just_happened():
    # We cannot place it in a window, so it does not go on the first screen
    # as if it had just happened.
    out = await _build([_warning("no-time", "")])
    assert out.warning_events == 0
    assert out.recent_warns == []


@pytest.mark.asyncio
async def test_the_snapshot_is_scoped_to_the_namespace():
    """The dashboard must read the namespace it is asked about.

    It used to always read the whole cluster, while the sidebar badge
    counted per namespace. Two numbers about the same thing, on the same
    screen, disagreeing: pick "kube-system" in the top bar and the badge
    said 0 while the dashboard said 1.
    """
    seen: list[tuple] = []

    class NamespaceRepo(FakeRepo):
        async def list_pods(self, cluster, namespace, label_selector, search, status):
            seen.append(("pods", namespace))
            return []

        async def list_events(self, cluster, namespace, involved_name, limit):
            seen.append(("events", namespace))
            return list(self.events)

    uc = DashboardUseCases(f"scope-{uuid4().hex}", NamespaceRepo([]))
    await uc.build(None, "kube-system")
    assert seen == [("pods", "kube-system"), ("events", "kube-system")]


@pytest.mark.asyncio
async def test_two_namespaces_do_not_share_a_cached_snapshot():
    """The cache key has to include the namespace.

    Without it, a cluster-wide snapshot served for every namespace for the
    whole TTL — the user switches namespace, the numbers stay.
    """
    class CountingRepo(FakeRepo):
        calls = 0

        async def list_pods(self, cluster, namespace, label_selector, search, status):
            type(self).calls += 1
            return []

        async def list_events(self, cluster, namespace, involved_name, limit):
            return []

    repo = CountingRepo([])
    uc = DashboardUseCases(f"scope-{uuid4().hex}", repo)
    await uc.build(None, "ns-a")
    await uc.build(None, "ns-b")
    # Each namespace loaded its own snapshot; a shared key would have made
    # the second call a cache hit.
    assert repo.calls == 2
