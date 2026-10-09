"""缓存 key 必须带 scope：A 会话的缓存绝不进 B 会话。"""
from __future__ import annotations

from app.application.use_cases.pods import PodUseCases
from app.application.dto import PodListOut


class CountingRepo:
    def __init__(self):
        self.calls = 0

    async def list_pods(self, cluster, namespace, selector, search, status):
        self.calls += 1
        return []


async def test_cache_is_scoped_per_session():
    repo = CountingRepo()
    a = PodUseCases("session-a", repo)
    b = PodUseCases("session-b", repo)
    await a.list_pods(None, None, "all", None, None)
    await a.list_pods(None, None, "all", None, None)   # A 命中缓存
    assert repo.calls == 1
    await b.list_pods(None, None, "all", None, None)   # B 不得命中 A 的缓存
    assert repo.calls == 2