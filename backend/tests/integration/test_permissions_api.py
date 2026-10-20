"""HTTP layer for the permission backend.

Covers /permissions/me, the catalog, and the admin CRUD (roles + user
assignments), including the 403 shape a restricted caller gets.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.application.use_cases.permissions import PermissionUseCases
from app.domain.entities.permissions import AppUser
from app.domain.value_objects.permissions import ROLE_ADMIN, ROLE_VIEWER
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
    """A client whose permission lookups hit the fake repository.

    The dependency is overridden wholesale (no database, no lifespan), so
    these tests exercise the HTTP contract only.
    """
    uc = PermissionUseCases(repo, cache_ttl=0)
    app.dependency_overrides[permission_uc] = lambda: uc
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


def _make_admin(repo: FakePermissionRepo, username: str = "dev") -> None:
    """Give the given username the admin role (the open-mode caller)."""
    repo.users[username] = AppUser(id=1, username=username, roles=(ROLE_ADMIN,))


def _role_row(repo: FakePermissionRepo, name: str):
    """The stored role row for the given name."""
    for role in repo.roles.values():
        if role.name == name:
            return role
    raise AssertionError(f"role not seeded: {name}")


# ── the caller's own permissions ───────────────────────────────────────────
def test_me_reports_the_default_role(client):
    r = client.get("/api/v1/permissions/me")
    assert r.status_code == 200
    body = r.json()
    assert body["username"] == "dev"
    assert body["roles"] == ["user"]
    assert "pods.read" in body["permissions"]
    assert "roles.manage" not in body["permissions"]


def test_catalog_lists_every_permission(client):
    r = client.get("/api/v1/permissions/catalog")
    assert r.status_code == 200
    codes = [p["code"] for p in r.json()]
    assert "pods.read" in codes
    assert "users.manage" in codes
    assert len(codes) == len(set(codes))


def test_me_reflects_an_assigned_role(client, repo):
    repo.users["dev"] = AppUser(id=1, username="dev", roles=(ROLE_VIEWER,))
    body = client.get("/api/v1/permissions/me").json()
    assert body["roles"] == ["viewer"]
    assert "pods.logs" not in body["permissions"]


# ── admin surface is gated ─────────────────────────────────────────────────
def test_role_listing_needs_roles_manage(client):
    r = client.get("/api/v1/permissions/roles")
    assert r.status_code == 403
    assert r.json()["detail"] == {"code": "forbidden", "permission": "roles.manage"}


def test_user_listing_needs_users_manage(client):
    r = client.get("/api/v1/permissions/users")
    assert r.status_code == 403
    assert r.json()["detail"]["permission"] == "users.manage"


def test_role_listing_as_admin(client, repo):
    _make_admin(repo)
    r = client.get("/api/v1/permissions/roles")
    assert r.status_code == 200
    names = [x["name"] for x in r.json()]
    assert "admin" in names and "viewer" in names


# ── role CRUD ──────────────────────────────────────────────────────────────
def test_create_role(client, repo):
    _make_admin(repo)
    r = client.post(
        "/api/v1/permissions/roles",
        json={"name": "ops", "description": "ops team",
              "permissions": ["pods.read", "nodes.read"]},
    )
    assert r.status_code == 201
    body = r.json()
    assert body["name"] == "ops"
    assert body["permissions"] == ["nodes.read", "pods.read"]
    assert body["builtin"] is False


def test_create_duplicate_role_is_a_conflict(client, repo):
    _make_admin(repo)
    payload = {"name": "ops", "description": "", "permissions": ["pods.read"]}
    assert client.post("/api/v1/permissions/roles", json=payload).status_code == 201
    r = client.post("/api/v1/permissions/roles", json=payload)
    assert r.status_code == 409


def test_create_role_with_an_unknown_permission_is_rejected(client, repo):
    _make_admin(repo)
    r = client.post(
        "/api/v1/permissions/roles",
        json={"name": "ops", "description": "", "permissions": ["pods.delete"]},
    )
    assert r.status_code == 400
    assert "unknown permission" in r.json()["detail"]


def test_create_role_with_an_invalid_name_is_rejected(client, repo):
    _make_admin(repo)
    r = client.post(
        "/api/v1/permissions/roles",
        json={"name": "Ops Team", "description": "", "permissions": []},
    )
    assert r.status_code == 422


def test_builtin_role_cannot_be_deleted(client, repo):
    _make_admin(repo)
    admin = _role_row(repo, ROLE_ADMIN)
    r = client.delete(f"/api/v1/permissions/roles/{admin.id}")
    assert r.status_code == 409


def test_role_in_use_cannot_be_deleted(client, repo):
    _make_admin(repo)
    created = client.post(
        "/api/v1/permissions/roles",
        json={"name": "ops", "description": "", "permissions": ["pods.read"]},
    ).json()
    r = client.put(
        "/api/v1/permissions/users/bob",
        json={"roles": ["ops"], "disabled": False},
    )
    assert r.status_code == 200
    d = client.delete(f"/api/v1/permissions/roles/{created['id']}")
    assert d.status_code == 409


def test_unused_role_can_be_deleted(client, repo):
    _make_admin(repo)
    created = client.post(
        "/api/v1/permissions/roles",
        json={"name": "ops", "description": "", "permissions": ["pods.read"]},
    ).json()
    assert client.delete(f"/api/v1/permissions/roles/{created['id']}").status_code == 204
    assert client.delete(f"/api/v1/permissions/roles/{created['id']}").status_code == 404


# ── user assignments ───────────────────────────────────────────────────────
def test_assign_roles(client, repo):
    _make_admin(repo)
    r = client.put(
        "/api/v1/permissions/users/bob",
        json={"roles": ["viewer"], "disabled": False},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["username"] == "bob"
    assert body["roles"] == ["viewer"]
    assert "pods.logs" not in body["permissions"]


def test_assign_roles_to_an_unknown_role_is_rejected(client, repo):
    _make_admin(repo)
    r = client.put(
        "/api/v1/permissions/users/bob",
        json={"roles": ["nope"], "disabled": False},
    )
    assert r.status_code == 400


def test_list_users_shows_the_assignment(client, repo):
    _make_admin(repo)
    client.put("/api/v1/permissions/users/bob", json={"roles": ["viewer"]})
    r = client.get("/api/v1/permissions/users")
    assert r.status_code == 200
    users = {u["username"]: u for u in r.json()}
    assert "bob" in users
    assert users["bob"]["roles"] == ["viewer"]


def test_a_restricted_caller_cannot_assign_roles(client, repo):
    repo.users["dev"] = AppUser(id=1, username="dev", roles=(ROLE_VIEWER,))
    r = client.put("/api/v1/permissions/users/bob", json={"roles": ["viewer"]})
    assert r.status_code == 403


# ── the guard on an existing route ─────────────────────────────────────────
def test_a_caller_without_the_code_is_turned_away_from_a_data_route(client, repo):
    """The permission is enforced on the routes that already existed."""
    from app.domain.entities.permissions import Role

    repo.roles[99] = Role(id=99, name="nobody", permissions=("clusters.read",))
    repo.users["dev"] = AppUser(id=1, username="dev", roles=("nobody",))
    r = client.get("/api/v1/pods")
    assert r.status_code == 403
    assert r.json()["detail"] == {"code": "forbidden", "permission": "pods.read"}


def test_a_disabled_caller_is_turned_away(client, repo):
    repo.users["dev"] = AppUser(
        id=1, username="dev", roles=(ROLE_ADMIN,), disabled=True,
    )
    r = client.get("/api/v1/pods")
    assert r.status_code == 403


def test_auth_status_carries_the_callers_permissions(client, repo):
    """The login page's status call also tells the UI what the user may do."""
    from app.infrastructure.auth import session as session_store
    from app.infrastructure.auth.plugins.base import Identity

    repo.users["alice"] = AppUser(id=1, username="alice", roles=(ROLE_VIEWER,))
    sess = session_store.create_session("token", Identity(username="alice"), 60)
    r = client.get(
        "/api/v1/auth/status",
        cookies={session_store.COOKIE_NAME: sess.token},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["client_session"] is True
    assert body["session"]["username"] == "alice"
    assert "pods.read" in body["permissions"]
    assert "pods.logs" not in body["permissions"]
