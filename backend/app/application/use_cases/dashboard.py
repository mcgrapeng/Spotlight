"""Dashboard use case: aggregate pods/nodes/events/namespaces into one snapshot.

Ponytail: caches the entire snapshot per cluster — 4 parallel K8s API calls
collapse to 1 if the dashboard is re-rendered within the TTL window. The TTL
matches settings.cache_ttl_pods (5s) since pods is the largest dependency.
"""
from __future__ import annotations

import asyncio
from collections import Counter
from datetime import datetime, timedelta, timezone

from app.application.dto import DashboardOut, EventOut
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.value_objects.primitives import LabelSelector
from app.infrastructure.cache.ttl_cache import ScopedCaches
from app.infrastructure.config.settings import get_settings

# One slot per (session, cluster). Bounded because sessions are reaped but
# their slots are not: without a cap this grew by one entry per expired
# session, for the life of the process.
_caches: ScopedCaches[DashboardOut] = ScopedCaches(max_slots=128)

# ponytail: 两个时间窗口，和前端那两句提示一一对应。
#
# 前端写的是「告警 N · 5min 内最近」和「最近活动 · 最近 1h」，而这里的
# 实现从来没按时间过滤过 —— warning_events 是「最近 500 条事件里有几条是
# Warning」，recent_warns 是「最近 500 条事件里最后 8 条 Warning」。
# 提示词说了一个窗口，数字算的是另一个口径，两者对不上。
#
# 这不是措辞问题：接到一个真实集群上就露馅了 —— 集群里只有 1 条 Warning
# 事件，它从 9 月 8 日起一直在重复（同一个事件已经触发 48930 次），
# last_seen 是几秒前。「5min 内最近 1 个」在时间上成立，但「1」这个数
# 让人以为只有一次告警，而真相是它已经烧了六周。
#
# 按窗口算，数字和提示词就一致了；至于「同一个事件重复了 48930 次」，
# 那是 Events 页 count 字段的事，不在仪表盘的职责里。
_WARNING_WINDOW = timedelta(minutes=5)
_ACTIVITY_WINDOW = timedelta(hours=1)


def _within_window(last_seen: str | None, window: timedelta, now: datetime) -> bool:
    """Whether an event's last sighting falls inside the window.

    A missing or unparseable timestamp counts as outside: a warning whose
    age we cannot read is not something to put on the first screen as if it
    just happened.
    """
    if not last_seen:
        return False
    try:
        moment = datetime.fromisoformat(last_seen.replace("Z", "+00:00"))
    except ValueError:
        return False
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return now - moment <= window


def _cache_key(scope: str, cluster: str | None) -> str:
    # `<scope>|…` prefix is what `invalidate_scope` matches on.
    return f"{scope}|{cluster or ''}"


def _cache_for(scope: str, cluster: str | None):
    key = _cache_key(scope, cluster)
    return _caches.get(key, float(get_settings().cache_ttl_pods))


class DashboardUseCases:
    def __init__(self, scope: str, k8s: K8sRepositoryPort) -> None:
        self._scope = scope
        self._k8s = k8s

    async def build(self, cluster: str | None) -> DashboardOut:
        cache = _cache_for(self._scope, cluster)
        async def _load() -> DashboardOut:
            pods, nodes, events, namespaces = await asyncio.gather(
                self._k8s.list_pods(cluster, None, LabelSelector(), None, None),
                self._k8s.list_nodes(cluster),
                self._k8s.list_events(cluster, None, None, 500),
                self._k8s.list_namespaces(cluster),
            )
            phase_counter = Counter(p.phase for p in pods)
            restart_top = sorted(
                ((f"{p.namespace}/{p.name}", p.restart_count) for p in pods if p.restart_count > 0),
                key=lambda x: x[1], reverse=True,
            )[:10]
            now = datetime.now(timezone.utc)
            warnings = sorted(
                (e for e in events if e.is_warning),
                key=lambda e: e.last_seen or "", reverse=True,
            )
            recent_warns = [
                e for e in warnings
                if _within_window(e.last_seen, _ACTIVITY_WINDOW, now)
            ][:8]
            return DashboardOut(
                total_pods=len(pods),
                running=phase_counter.get("Running", 0),
                pending=phase_counter.get("Pending", 0),
                failed=phase_counter.get("Failed", 0),
                succeeded=phase_counter.get("Succeeded", 0),
                warning_events=sum(
                    1 for e in warnings
                    if _within_window(e.last_seen, _WARNING_WINDOW, now)
                ),
                nodes_total=len(nodes),
                nodes_ready=sum(1 for n in nodes if n.is_ready),
                namespaces_count=len(namespaces),
                restart_top=[{"pod": k, "restarts": v} for k, v in restart_top],
                recent_warns=[EventOut.model_validate(e) for e in recent_warns],
            )
        return await cache.get_or_load(_load)
