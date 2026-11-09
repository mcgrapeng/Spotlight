"""Permission use cases: resolution rules, role CRUD guards, assignments."""
from __future__ import annotations

import pytest

from app.application.use_cases.permissions import (
    BuiltinRoleError,
    LastAdminError,
    PermissionUseCases,
    RoleExistsError,
    RoleInUseError,
    RoleNotFoundError,
    UnknownRoleError,
    invalidate_permission_cache,
)
from tests.fakes import FakePermissionRepo
from app.domain.value_objects.permissions import (
    ROLE_ADMIN,
    ROLE_USER,
    ROLE_VIEWER,
    builtin_permissions,
)


@pytest.fixture
def repo() -> FakePermissionRepo:
    return FakePermissionRepo()


@pytest.fixture
def uc(repo: FakePermissionRepo) -> PermissionUseCases:
    # cache disabled: the module-level cache is shared between instances, and
    # these tests assert on freshly written state.
    invalidate_permission_cache()
    return PermissionUseCases(repo, cache_ttl=0)


# ── resolution ─────────────────────────────────────────────────────────────
async def test_a_configured_admin_cannot_be_locked_out(repo):
    """A configured admin has no user row until one is written — and a
    DISABLED row beats admin_users in effective_permissions, so allowing
    this would leave the deployment with no admin at all, and the admin
    surface unreachable through the API forever."""
    uc = PermissionUseCases(repo, admin_users=("root",), cache_ttl=0)
    repo.seed_builtin_roles()
    with pytest.raises(LastAdminError):
        await uc.assign_roles("root", [ROLE_VIEWER], disabled=True)


async def test_unknown_user_gets_the_default_role(repo, uc):
    """Nobody assigned a role keeps today's behaviour: the `user` role."""
    repo.seed_builtin_roles()
    eff = await uc.effective_permissions("alice")
    assert eff.roles == (ROLE_USER,)
    assert set(eff.permissions) == set(builtin_permissions(ROLE_USER))
    assert "roles.manage" not in eff.permissions
    assert not eff.disabled


async def test_resolution_survives_a_database_without_the_builtin_rows(repo, uc):
    """A role name with no stored row falls back to its built-in definition."""
    eff = await uc.effective_permissions("alice")
    assert set(eff.permissions) == set(builtin_permissions(ROLE_USER))


async def test_assigned_role_wins_over_the_default(repo, uc):
    repo.seed_builtin_roles()
    await uc.assign_roles("bob", [ROLE_VIEWER])
    eff = await uc.effective_permissions("bob")
    assert eff.roles == (ROLE_VIEWER,)
    assert set(eff.permissions) == set(builtin_permissions(ROLE_VIEWER))
    assert not eff.allows("pods.logs")


async def test_multiple_roles_are_unioned(repo, uc):
    repo.seed_builtin_roles()
    await uc.assign_roles("bob", [ROLE_VIEWER, ROLE_USER])
    eff = await uc.effective_permissions("bob")
    assert eff.allows("pods.logs")
    assert eff.allows("pods.read")


async def test_disabled_user_has_no_permissions(repo, uc):
    repo.seed_builtin_roles()
    await uc.assign_roles("bob", [ROLE_ADMIN], disabled=True)
    eff = await uc.effective_permissions("bob")
    assert eff.disabled
    assert eff.permissions == ()
    assert not eff.allows("pods.read")


async def test_admin_users_are_always_admins(repo):
    """The bootstrap: a configured admin username needs no stored row."""
    repo.seed_builtin_roles()
    uc = PermissionUseCases(repo, admin_users=("root",), cache_ttl=0)
    eff = await uc.effective_permissions("root")
    assert eff.allows("roles.manage")
    assert eff.allows("users.manage")
    assert eff.allows("pods.read")


# ── roles ──────────────────────────────────────────────────────────────────
async def test_create_role_rejects_unknown_permission_codes(repo, uc):
    with pytest.raises(ValueError, match="unknown permission"):
        await uc.create_role("ops", "ops team", ["pods.read", "pods.delete"])


async def test_create_role_rejects_a_duplicate_name(repo, uc):
    repo.seed_builtin_roles()
    await uc.create_role("ops", "ops team", ["pods.read"])
    with pytest.raises(RoleExistsError):
        await uc.create_role("ops", "again", ["pods.read"])


async def test_create_role_rejects_an_invalid_name(repo, uc):
    with pytest.raises(ValueError, match="invalid role name"):
        await uc.create_role("Ops Team", "spaces are not allowed", [])


async def test_update_of_a_missing_role_is_a_404(repo, uc):
    with pytest.raises(RoleNotFoundError):
        await uc.update_role(42, "ops", "", [])


async def test_builtin_roles_cannot_be_edited_or_deleted(repo, uc):
    repo.seed_builtin_roles()
    admin = await repo.get_role_by_name(ROLE_ADMIN)
    with pytest.raises(BuiltinRoleError):
        await uc.update_role(admin.id, "admin", "", ["pods.read"])
    with pytest.raises(BuiltinRoleError):
        await uc.delete_role(admin.id)


async def test_role_in_use_cannot_be_deleted(repo, uc):
    repo.seed_builtin_roles()
    role = await uc.create_role("ops", "ops team", ["pods.read"])
    await uc.assign_roles("bob", ["ops"])
    with pytest.raises(RoleInUseError):
        await uc.delete_role(role.id)


async def test_unused_role_can_be_deleted(repo, uc):
    role = await uc.create_role("ops", "ops team", ["pods.read"])
    assert await uc.delete_role(role.id) is True
    assert await uc.delete_role(role.id) is False


# ── users ──────────────────────────────────────────────────────────────────
async def test_assign_roles_rejects_an_unknown_role(repo, uc):
    repo.seed_builtin_roles()
    with pytest.raises(UnknownRoleError):
        await uc.assign_roles("bob", ["nope"])


async def test_assign_roles_requires_at_least_one_role(repo, uc):
    with pytest.raises(ValueError):
        await uc.assign_roles("bob", [])


async def test_assign_roles_creates_then_updates_the_row(repo, uc):
    repo.seed_builtin_roles()
    created = await uc.assign_roles("bob", [ROLE_VIEWER])
    assert created.roles == (ROLE_VIEWER,)
    updated = await uc.assign_roles("bob", [ROLE_USER])
    assert updated.roles == (ROLE_USER,)
    assert len(await uc.list_users()) == 1


async def test_assign_roles_rejects_an_empty_username(repo, uc):
    with pytest.raises(ValueError):
        await uc.assign_roles("  ", [ROLE_USER])


# ── cache ──────────────────────────────────────────────────────────────────
async def test_writes_invalidate_the_cached_resolution(repo):
    invalidate_permission_cache()
    uc = PermissionUseCases(repo, cache_ttl=60)
    repo.seed_builtin_roles()
    await uc.assign_roles("bob", [ROLE_VIEWER])
    assert not (await uc.effective_permissions("bob")).allows("pods.logs")
    await uc.assign_roles("bob", [ROLE_USER])
    assert (await uc.effective_permissions("bob")).allows("pods.logs")
    invalidate_permission_cache()
