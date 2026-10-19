"""invalidate_scope 只清目标会话；dispose 让被淘汰的缓存真正释放。

两条都是安全属性，不是性能优化：
- 误清别人的缓存 → 用户 A 看到用户 B 的数据（租户串号）。
- 不 dispose → `_instances` 无限增长，长跑进程每个过滤组合泄漏一个对象。
"""
from __future__ import annotations

from app.application.use_cases import dashboard, events, namespaces, nodes, pods
from app.application.use_cases.pods import PodUseCases
from app.application.use_cases.dashboard import DashboardUseCases
from app.infrastructure.cache import ttl_cache
from app.infrastructure.cache.ttl_cache import TTLCache, invalidate_scope


class CountingRepo:
    def __init__(self):
        self.calls = 0

    async def list_pods(self, cluster, namespace, selector, search, status):
        self.calls += 1
        return []

    async def list_namespaces(self, cluster):
        self.calls += 1
        return []

    async def list_nodes(self, cluster):
        self.calls += 1
        return []

    async def list_events(self, cluster, namespace, involved, limit):
        self.calls += 1
        return []


async def test_invalidate_scope_leaves_other_sessions_alone():
    repo = CountingRepo()
    a = PodUseCases("sess-A", repo)
    b = PodUseCases("sess-B", repo)
    await a.list_pods(None, None, "all", None, None)
    await b.list_pods(None, None, "all", None, None)
    assert repo.calls == 2

    invalidate_scope("sess-A")

    await a.list_pods(None, None, "all", None, None)   # A 的缓存被清 → 重新取
    assert repo.calls == 3
    await b.list_pods(None, None, "all", None, None)   # B 仍命中
    assert repo.calls == 3


async def test_invalidate_scope_reaches_non_pod_use_cases():
    """Dashboard/Node/Namespace 缓存也必须响应按会话清理——它们的 key 也以
    `<scope>|` 开头。回归锁：这几个模块一度用 tuple key，前缀匹配够不着。"""
    repo = CountingRepo()
    dash = DashboardUseCases("sess-D", repo)
    await dash.build(None)
    assert repo.calls > 0
    first = repo.calls

    invalidate_scope("sess-D")
    await dash.build(None)
    # 整份快照重取。数一遍涨了多少（而不是写死 4 / 8）：Dashboard 以后多接一个
    # 数据源不该让这个测试红——它守的是「清完会不会重新取」，不是「取几次」。
    after_invalidate = repo.calls
    assert after_invalidate > first

    await dash.build(None)                       # 命中，不再取
    assert repo.calls == after_invalidate


async def test_dispose_deregisters_from_instance_registry():
    before = len(ttl_cache._instances)
    cache = TTLCache("disposable|key", 30.0)
    assert len(ttl_cache._instances) == before + 1
    cache.dispose()
    assert len(ttl_cache._instances) == before


async def test_fifo_eviction_disposes_and_registry_stays_bounded():
    """反复造出超过 MAX_SLOTS 的不同过滤组合，注册表不能随之增长。"""
    repo = CountingRepo()
    uc = PodUseCases("sess-E", repo)
    baseline = len(ttl_cache._instances)
    for i in range(200):
        await uc.list_pods(None, "ns-%d" % i, "all", None, None)
    # 32 个槽位 + 其它模块的缓存；不做 dispose 的话这里会是 200+。
    assert len(ttl_cache._instances) - baseline <= 32


async def test_every_cache_module_is_bounded_not_just_pods():
    """Regression: `dispose()` shipped wired only into pods/events.

    dashboard / namespaces / nodes grew a `dict[str, TTLCache]` per module with
    no eviction at all, and `invalidate_scope` only clears a value — it never
    drops the entry or deregisters it from `_instances`. Sessions are memory-
    only and reaped every 5 minutes, so each one left a permanent slot behind,
    and the registry kept a reference to every one of them.

    300 sessions x 5 modules is 1500 entries if nothing is bounded; with
    eviction every module sits at or under its own cap.
    """
    repo = CountingRepo()
    baseline = len(ttl_cache._instances)
    for i in range(300):
        s, c = f"sess-F{i}", f"cl-{i}"
        await dashboard.DashboardUseCases(s, repo).build(c)
        await namespaces.NamespaceUseCases(s, repo).list_namespaces(c)
        await nodes.NodeUseCases(s, repo).list_nodes(c)
        await pods.PodUseCases(s, repo).list_pods(c, None, "all", None, None)
        await events.EventUseCases(s, repo).list_events(c, None, None, 200)

    caps = ((dashboard, 128), (namespaces, 128), (nodes, 128),
            (pods, 32), (events, 32))
    for module, cap in caps:
        assert len(module._caches) <= cap, f"{module.__name__} is unbounded"
    # One registry entry per live slot, not one per request ever made.
    assert len(ttl_cache._instances) - baseline <= sum(cap for _, cap in caps)
