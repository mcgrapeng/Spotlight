"""Unit tests for the k8s SDK → domain mappers.

Everything here is a pure function over duck-typed SDK-shaped objects, so the
tests build SimpleNamespace stand-ins: no kubernetes client, no network. The
crash-shield behaviour matters most — a mapper that throws turns a whole pod
list response into a 500.
"""
from __future__ import annotations

import random
from datetime import datetime, timezone
from types import SimpleNamespace as NS

import pytest

from app.application.dto import NodeOut
from app.infrastructure.k8s.mapper.mappers import (
    _age_seconds,
    _container_state,
    _parse_dt,
    map_event,
    map_namespace,
    map_namespaces_batch,
    map_node,
    map_nodes_batch,
    map_pod,
    map_pods_batch,
)

_NOW = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)


def _pod() -> NS:
    return NS(
        metadata=NS(
            name="p", namespace="ns",
            creation_timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc),
            labels={"app": "x"}, owner_references=None,
        ),
        spec=NS(node_name="node-1"),
        status=NS(
            container_statuses=[], phase="Running",
            reason=None, message=None, conditions=None, pod_ip="10.0.0.1",
        ),
    )


def _node() -> NS:
    return NS(
        metadata=NS(name="n1", creation_timestamp=None, labels={}),
        status=NS(
            conditions=[NS(type="Ready", status="True")],
            capacity={"cpu": "8", "memory": "32Gi"},
            allocatable={"cpu": "7", "memory": "30Gi"},
            node_info=NS(kubelet_version="v1.29.0", os_image="Ubuntu"),
        ),
    )


def _event() -> NS:
    return NS(
        metadata=NS(name="e1", namespace="ns"),
        type="Warning", reason="Failed", message="boom",
        involved_object=NS(kind="Pod", name="p"),
        count=3,
        first_timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc),
        last_timestamp=datetime(2026, 1, 2, tzinfo=timezone.utc),
        series=None,
    )


# ── container state ─────────────────────────────────────────────────────


@pytest.mark.parametrize(
    "state,expected",
    [
        (None, ("unknown", None, None)),
        (NS(waiting=NS(reason="CrashLoopBackOff", message="boom"), terminated=None, running=None),
         ("waiting", "CrashLoopBackOff", "boom")),
        (NS(waiting=None, terminated=NS(reason="Error", message="exit 1"), running=None),
         ("terminated", "Error", "exit 1")),
        (NS(waiting=None, terminated=None,
            running=NS(started_at=datetime(2026, 1, 1, tzinfo=timezone.utc))),
         ("running", None, None)),
        (NS(waiting=None, terminated=None, running=None), ("unknown", None, None)),
        (NS(waiting=NS(reason="W", message="w"), terminated=NS(reason="T", message="t"), running=None),
         ("waiting", "W", "w")),
    ],
    ids=["unset", "waiting", "terminated", "running", "empty", "waiting-wins"],
)
def test_container_state_reads_the_filling_state_in_order(state, expected):
    # "unset" is real during admission races and must never crash a pod list.
    assert _container_state(NS(state=state)) == expected


# ── timestamps ──────────────────────────────────────────────────────────


def test_parse_dt_accepts_the_k8s_z_suffix_and_passes_datetimes_through():
    assert _parse_dt("2026-01-01T00:00:00Z") == datetime(2026, 1, 1, tzinfo=timezone.utc)
    dt = datetime(2026, 1, 1, tzinfo=timezone.utc)
    assert _parse_dt(dt) is dt
    assert _parse_dt("not a date") is None
    assert _parse_dt(None) is None


def test_age_seconds_clamps_the_future_to_zero_and_treats_naive_as_utc():
    now = datetime(2026, 1, 1, 1, 0, 0, tzinfo=timezone.utc)
    assert _age_seconds("2026-01-01T00:00:00Z", now) == 3600
    assert _age_seconds("2026-01-01T00:30:00", now) == 1800
    assert _age_seconds("2026-01-02T00:00:00Z", now) == 0  # future clamps at zero
    assert _age_seconds("garbage", now) is None
    assert _age_seconds(None, now) is None


# ── pods ────────────────────────────────────────────────────────────────


def test_map_pod_maps_the_fields_the_pod_list_screen_shows():
    pod = _pod()
    started = datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc)
    pod.status.container_statuses = [
        NS(name="app", image="img:1", ready=True, restart_count=2,
           state=NS(waiting=None, terminated=None, running=NS(started_at=started))),
    ]
    pod.metadata.owner_references = [NS(kind="ReplicaSet", name="rs-1")]

    mapped = map_pod(pod, cluster="prod", now=datetime(2026, 1, 1, 0, 10, tzinfo=timezone.utc))

    assert (mapped.name, mapped.namespace, mapped.cluster) == ("p", "ns", "prod")
    assert mapped.phase == "Running"
    assert mapped.node == "node-1"
    assert mapped.pod_ip == "10.0.0.1"
    assert mapped.age_seconds == 600
    assert mapped.created_at == str(datetime(2026, 1, 1, tzinfo=timezone.utc))
    assert mapped.labels == {"app": "x"}
    assert (mapped.owner.kind, mapped.owner.name) == ("ReplicaSet", "rs-1")
    c = mapped.containers[0]
    assert (c.name, c.image, c.ready, c.state, c.restart_count) == ("app", "img:1", True, "running", 2)
    assert c.started_at == str(started)


def test_map_pod_falls_back_to_the_not_ready_condition_for_reason():
    pod = _pod()
    pod.status.reason = None
    pod.status.conditions = [
        NS(type="PodScheduled", status="True", reason=None, message=None),
        NS(type="Ready", status="False", reason="ContainersNotReady", message="one is down"),
    ]
    mapped = map_pod(pod, now=_NOW)
    assert mapped.reason == "ContainersNotReady"
    assert mapped.message == "one is down"


def test_map_pod_keeps_the_status_reason_when_it_is_already_set():
    pod = _pod()
    pod.status.reason = "Evicted"
    pod.status.conditions = [NS(type="Ready", status="False", reason="X", message="y")]
    mapped = map_pod(pod, now=_NOW)
    # The condition fallback only fires when the status itself is silent.
    assert mapped.reason == "Evicted"
    assert mapped.message is None


def test_map_pod_survives_a_container_status_without_a_state():
    pod = _pod()
    pod.status.container_statuses = [
        NS(name="app", image="img:1", ready=False, restart_count=0, state=None),
    ]
    c = map_pod(pod, now=_NOW).containers[0]
    assert (c.state, c.reason, c.message, c.started_at) == ("unknown", None, None, None)


def test_map_pod_without_a_creation_timestamp_has_no_age():
    pod = _pod()
    pod.metadata.creation_timestamp = None
    mapped = map_pod(pod, now=_NOW)
    assert mapped.age_seconds is None
    assert mapped.created_at is None


def test_map_pod_with_no_owner_reference_maps_none():
    pod = _pod()
    pod.metadata.owner_references = []
    assert map_pod(pod, now=_NOW).owner is None


def test_map_pod_maps_an_unknown_phase_to_unknown():
    pod = _pod()
    pod.status.phase = "Weird"
    assert map_pod(pod, now=_NOW).phase == "Unknown"


# ── namespaces and nodes ────────────────────────────────────────────────


def test_map_namespace_defaults_to_active_and_keeps_labels():
    ns = NS(metadata=NS(name="ns1", creation_timestamp=None, labels=None), status=NS(phase=None))
    mapped = map_namespace(ns, cluster="prod", now=_NOW)
    assert (mapped.name, mapped.status, mapped.labels, mapped.age_seconds, mapped.cluster) == (
        "ns1", "Active", {}, None, "prod",
    )


def test_map_node_reads_ready_conditions_and_node_roles():
    node = _node()
    node.metadata.labels = {"node-role.kubernetes.io/control-plane": "", "topology": "a"}
    mapped = map_node(node, pod_count=3, cluster="prod", now=_NOW)
    assert mapped.status == "Ready"
    assert mapped.roles == ("control-plane",)
    assert (mapped.cpu_capacity, mapped.memory_capacity) == ("8", "32Gi")
    assert (mapped.cpu_allocatable, mapped.memory_allocatable) == ("7", "30Gi")
    assert (mapped.pod_count, mapped.kubelet_version, mapped.os_image) == (3, "v1.29.0", "Ubuntu")


def test_map_node_marks_a_not_ready_node_and_defaults_to_the_worker_role():
    node = _node()
    node.status.conditions = [NS(type="Ready", status="False")]
    assert map_node(node, now=_NOW).status == "NotReady"
    assert map_node(node, now=_NOW).roles == ("worker",)


def test_map_node_reads_the_real_pod_cap_from_allocatable():
    # kubelet --max-pods 各集群不同（30/110/250）—— 上限是集群事实，从
    # allocatable.pods 读，不能在前端编一个常量当事实。
    node = _node()
    node.status.allocatable = {"cpu": "7", "memory": "30Gi", "pods": "110"}
    mapped = map_node(node, pod_count=3, cluster="prod", now=_NOW)
    assert mapped.allocatable_pods == 110
    assert NodeOut.model_validate(mapped).allocatable_pods == 110


def test_map_node_without_allocatable_pods_reports_no_cap():
    # 拿不到上限就不编一个 —— 界面不显示上限，而不是显示别的集群的数字。
    mapped = map_node(_node(), pod_count=3, cluster="prod", now=_NOW)
    assert mapped.allocatable_pods is None


def test_map_node_without_conditions_is_unknown():
    node = _node()
    node.status.conditions = []
    assert map_node(node, now=_NOW).status == "Unknown"


def test_map_node_with_missing_capacity_strings_defaults_to_empty():
    node = _node()
    node.status.capacity = None
    node.status.allocatable = {}
    mapped = map_node(node, now=_NOW)
    assert (mapped.cpu_capacity, mapped.memory_capacity,
            mapped.cpu_allocatable, mapped.memory_allocatable) == ("", "", "", "")


def test_map_node_survives_a_missing_node_info():
    # Found live: a minimal apiserver node without nodeInfo crashed the whole
    # node list with AttributeError. Missing optional status fields are not
    # an error.
    node = _node()
    node.status.node_info = None
    mapped = map_node(node, now=_NOW)
    assert (mapped.kubelet_version, mapped.os_image) == ("", "")


# ── events ──────────────────────────────────────────────────────────────


def test_map_event_maps_fields_and_stringifies_times():
    mapped = map_event(_event())
    assert (mapped.name, mapped.namespace, mapped.type, mapped.reason, mapped.message) == (
        "e1", "ns", "Warning", "Failed", "boom",
    )
    assert (mapped.involved_kind, mapped.involved_name, mapped.count) == ("Pod", "p", 3)
    assert mapped.first_seen == str(datetime(2026, 1, 1, tzinfo=timezone.utc))
    assert mapped.last_seen == str(datetime(2026, 1, 2, tzinfo=timezone.utc))


def test_map_event_falls_back_to_the_series_observed_time_for_new_style_events():
    # events.k8s.io/v1 events carry no last_timestamp; sorting on "no time"
    # would bury fresh events at the bottom of the list.
    ev = _event()
    ev.last_timestamp = None
    ev.series = NS(last_observed_time=datetime(2026, 1, 3, tzinfo=timezone.utc))
    assert map_event(ev).last_seen == str(datetime(2026, 1, 3, tzinfo=timezone.utc))


def test_map_event_with_no_times_or_object_maps_nulls_and_defaults():
    ev = _event()
    ev.last_timestamp = None
    ev.series = None
    ev.first_timestamp = None
    ev.involved_object = None
    ev.type = None
    ev.reason = None
    ev.message = None
    ev.metadata.namespace = None
    ev.count = None
    mapped = map_event(ev)
    assert mapped.last_seen is None
    assert mapped.first_seen is None
    assert (mapped.type, mapped.reason, mapped.message) == ("Normal", "", "")
    assert (mapped.namespace, mapped.involved_kind, mapped.involved_name, mapped.count) == ("", "", "", 0)


# ── batches ─────────────────────────────────────────────────────────────


def test_batch_mappers_stay_consistent_with_the_single_mappers():
    pods = map_pods_batch([_pod(), _pod()], cluster="prod")
    assert [p.cluster for p in pods] == ["prod", "prod"]

    n2 = _node()
    n2.metadata.name = "n2"
    nodes = map_nodes_batch([_node(), n2], pod_count_by_node={"n2": 5}, cluster="prod")
    assert [n.pod_count for n in nodes] == [0, 5]

    ns = NS(metadata=NS(name="a", creation_timestamp=None, labels=None), status=NS(phase="Active"))
    assert map_namespaces_batch([ns], cluster="prod")[0].name == "a"


# ── invariants over unbounded input (seeded fuzz) ───────────────────────
# Hypothesis-free property checks: a fixed seed keeps them deterministic
# while still hammering the "never raise, never negative" contract that the
# crash shields depend on.


def test_parse_dt_and_age_never_raise_on_arbitrary_strings():
    rng = random.Random(20261102)
    alphabet = "0126-:TZ+., zZé\t\n{}[]\"'\\x1b"
    for _ in range(500):
        raw = "".join(rng.choice(alphabet) for _ in range(rng.randint(0, 24)))
        parsed = _parse_dt(raw)  # must never raise
        assert parsed is None or isinstance(parsed, datetime)
        age = _age_seconds(raw, _NOW)
        assert age is None or age >= 0


def test_age_seconds_is_monotone_for_ordered_timestamps():
    rng = random.Random(20261102)
    base = datetime(2026, 1, 1, tzinfo=timezone.utc)
    for seconds in rng.sample(range(0, 86_400 * 30), 100):
        older = base.timestamp() + seconds
        newer = older + 1
        assert _age_seconds(datetime.fromtimestamp(newer, tz=timezone.utc), _NOW) <= \
            _age_seconds(datetime.fromtimestamp(older, tz=timezone.utc), _NOW)
