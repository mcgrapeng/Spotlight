"""日志分析接口的权限门。

日志分析会把日志原文发给模型。日志是集群读取里敏感的那一半
（`viewer` 角色被故意排除在 `pods.logs` 之外），所以这个接口需要的
不止是 `ai.use`——它还需要读日志的权限。

只有 `ai.use` 就够的话，一个「有权用模型、但无权读日志」的角色也能
把日志内容送到模型去：日志原文是客户端带过来的，服务端不重读，
于是服务端没有任何机会发现这个人本来读不到那些日志。
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.application.use_cases.permissions import PermissionUseCases
from app.domain.entities.permissions import AppUser, Role
from app.interface.api.v1.dependencies import permission_uc
from app.main import app
from tests.fakes import FakePermissionRepo


@pytest.fixture
def repo() -> FakePermissionRepo:
    r = FakePermissionRepo()
    r.seed_builtin_roles()
    return r


@pytest.fixture
def client(repo: FakePermissionRepo):
    uc = PermissionUseCases(repo, cache_ttl=0)
    app.dependency_overrides[permission_uc] = lambda: uc
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def test_analyze_needs_the_log_permission_not_just_ai_use(client, repo):
    repo.roles[98] = Role(id=98, name="model-only", permissions=("ai.use",))
    repo.users["dev"] = AppUser(id=1, username="dev", roles=("model-only",))
    r = client.post(
        "/api/v1/ai/analyze/default/cache-001",
        json={"provider_id": 1, "log_lines": ["line one"]},
    )
    assert r.status_code == 403
    assert r.json()["detail"]["permission"] == "pods.logs"


def test_analyze_is_allowed_with_both_permissions(client, repo):
    repo.roles[97] = Role(id=97, name="analyst", permissions=("ai.use", "pods.logs"))
    repo.users["dev"] = AppUser(id=1, username="dev", roles=("analyst",))
    r = client.post(
        "/api/v1/ai/analyze/default/cache-001",
        json={"provider_id": 1, "log_lines": ["line one"]},
    )
    # 权限过了；再往后是 provider 之类的事（这里没有 provider，
    # 所以是 400），但绝不该是 403。
    assert r.status_code != 403


def test_the_cluster_question_does_not_need_the_log_permission(client, repo):
    """提问模式发的是集群快照，不是日志原文。"""
    repo.roles[96] = Role(id=96, name="model-only", permissions=("ai.use",))
    repo.users["dev"] = AppUser(id=1, username="dev", roles=("model-only",))
    r = client.post(
        "/api/v1/ai/ask",
        json={"provider_id": 1, "question": "哪个 Pod 在反复重启", "context": "{}"},
    )
    assert r.status_code != 403
