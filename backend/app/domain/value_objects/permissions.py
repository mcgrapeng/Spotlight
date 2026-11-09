"""Permission catalog — the capability vocabulary the whole app agrees on.

Codes are stable strings (`resource.action`) stored verbatim in role rows,
so renaming one is a data migration, not a refactor. The catalog below is the
single place that says which codes exist; anything outside it is rejected at
the use-case boundary (a typo in a role definition must not become a
permission that silently grants nothing).

The catalog is deliberately about *Spotlight's own* capabilities, not the
K8s RBAC of the cluster behind it: those two are unrelated. A cluster role
decides what a user can see in Kubernetes; a Spotlight permission decides
which parts of the console they may use at all.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class Permission:
    """One capability the console can gate."""

    code: str
    name: str
    description: str = ""


PERMISSIONS: tuple[Permission, ...] = (
    Permission("clusters.read", "查看集群", "浏览可用集群与上下文"),
    Permission("namespaces.read", "查看命名空间", "列出命名空间"),
    Permission("pods.read", "查看 Pod", "查看 Pod 列表与详情"),
    Permission("pods.logs", "查看日志", "读取与流式读取 Pod 日志"),
    Permission("nodes.read", "查看节点", "列出集群节点"),
    Permission("events.read", "查看事件", "列出 Kubernetes 事件"),
    Permission("favorites.read", "查看收藏", "读取收藏列表"),
    Permission("favorites.write", "管理收藏", "新增与删除收藏"),
    Permission("ai.use", "使用 AI 解读", "调用 AI 分析日志"),
    Permission("ai.manage", "管理 AI 模型", "增删改 AI provider"),
    Permission("roles.manage", "管理角色", "创建、修改与删除角色"),
    Permission("users.manage", "管理用户", "为用户分配角色"),
)

PERMISSION_CODES: frozenset[str] = frozenset(p.code for p in PERMISSIONS)

ADMIN_ONLY: frozenset[str] = frozenset({"roles.manage", "users.manage"})

#: What a caller may still do while the permission lookup itself is failing.
#:
#: Reading the cluster is already limited by the session's own kubeconfig, so
#: refusing it would only turn a database hiccup into an outage. Everything
#: else — changing where an API key goes, sending log content to a model,
#: managing roles — is a decision nobody can take while the database is down.
FALLBACK_READ_ONLY: frozenset[str] = frozenset({
    "clusters.read",
    "namespaces.read",
    "pods.read",
    "pods.logs",
    "nodes.read",
    "events.read",
    "favorites.read",
})

# Built-in role names. `admin` is the escape hatch (everything), `user` is
# the default for anyone without an explicit assignment, `viewer` is the
# read-only profile an operator hands to colleagues.
ROLE_ADMIN = "admin"
ROLE_USER = "user"
ROLE_VIEWER = "viewer"

BUILTIN_ROLES: dict[str, tuple[str, ...]] = {
    ROLE_ADMIN: tuple(sorted(PERMISSION_CODES)),
    ROLE_USER: tuple(sorted(c for c in PERMISSION_CODES if c not in ADMIN_ONLY)),
    ROLE_VIEWER: (
        "clusters.read",
        "namespaces.read",
        "pods.read",
        "nodes.read",
        "events.read",
        "favorites.read",
    ),
}

# A user with no row in the database (the common case: the auth plugin
# vouches for them, nobody ever assigned them a role) gets the `user` role —
# i.e. today's behaviour. Anything else would silently lock people out of
# their own console the day the feature ships.
DEFAULT_ROLE = ROLE_USER


def is_known_permission(code: str) -> bool:
    return code in PERMISSION_CODES


def builtin_permissions(role_name: str) -> tuple[str, ...]:
    return BUILTIN_ROLES.get(role_name, ())


__all__ = [
    "ADMIN_ONLY",
    "BUILTIN_ROLES",
    "DEFAULT_ROLE",
    "FALLBACK_READ_ONLY",
    "PERMISSIONS",
    "PERMISSION_CODES",
    "ROLE_ADMIN",
    "ROLE_USER",
    "ROLE_VIEWER",
    "Permission",
    "builtin_permissions",
    "is_known_permission",
]
