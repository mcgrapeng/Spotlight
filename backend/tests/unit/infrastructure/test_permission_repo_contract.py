"""Contract tests for PermissionRepositoryPort: the in-memory fake and the
SQL implementation must stay behaviourally aligned.

Use-case tests run against the fake while production runs the SQL repo; drift
between the two would make green tests lie. Every test marked `impl` runs
against both. SQL-only semantics (fail-closed JSON, seeding) live below the
contract suite.
"""
from __future__ import annotations

import dataclasses
from contextlib import asynccontextmanager

import pytest

from app.domain.entities.permissions import AppUser, Role
from app.domain.value_objects.permissions import BUILTIN_ROLES
from app.infrastructure.persistence.models.orm import RoleRow
from app.infrastructure.persistence.repositories.permission_repo import (
    SQLPermissionRepository,
    seed_builtin_roles,
)
from tests.fakes import FakePermissionRepo, in_memory_session


@asynccontextmanager
async def _repo(impl: str):
    if impl == "fake":
        yield FakePermissionRepo()
    else:
        async with in_memory_session() as session:
            yield SQLPermissionRepository(session)


# ── contract: both implementations must agree ───────────────────────────


@pytest.mark.parametrize("impl", ["fake", "sql"])
async def test_add_role_round_trips_through_id_and_name(impl):
    async with _repo(impl) as repo:
        saved = await repo.add_role(
            Role(id=None, name="dev", description="developers", permissions=("logs:read",))
        )
        assert saved.id is not None
        assert await repo.get_role(saved.id) == saved
        assert await repo.get_role_by_name("dev") == saved


@pytest.mark.parametrize("impl", ["fake", "sql"])
async def test_update_role_persists_the_changes(impl):
    async with _repo(impl) as repo:
        saved = await repo.add_role(Role(id=None, name="dev", permissions=("logs:read",)))
        updated = await repo.update_role(
            dataclasses.replace(saved, name="dev2", permissions=("logs:read", "ai:use"))
        )
        assert updated.name == "dev2"
        fetched = await repo.get_role(saved.id)
        assert fetched.name == "dev2"
        assert fetched.permissions == ("logs:read", "ai:use")


@pytest.mark.parametrize("impl", ["fake", "sql"])
async def test_remove_role_reports_whether_something_was_deleted(impl):
    async with _repo(impl) as repo:
        saved = await repo.add_role(Role(id=None, name="dev"))
        assert await repo.remove_role(saved.id) is True
        assert await repo.get_role(saved.id) is None
        assert await repo.remove_role(saved.id) is False
        assert await repo.remove_role(999) is False


@pytest.mark.parametrize("impl", ["fake", "sql"])
async def test_upsert_user_creates_then_updates_the_same_username(impl):
    async with _repo(impl) as repo:
        created = await repo.upsert_user(AppUser(id=None, username="alice", roles=("viewer",)))
        assert created.id is not None
        assert (await repo.get_user("alice")).roles == ("viewer",)

        updated = await repo.upsert_user(
            AppUser(id=None, username="alice", roles=("admin",), disabled=True)
        )
        assert updated.id == created.id
        fetched = await repo.get_user("alice")
        assert fetched.roles == ("admin",)
        assert fetched.disabled is True


@pytest.mark.parametrize("impl", ["fake", "sql"])
async def test_lists_hold_everything_that_was_added(impl):
    async with _repo(impl) as repo:
        await repo.add_role(Role(id=None, name="b"))
        await repo.add_role(Role(id=None, name="a"))
        await repo.upsert_user(AppUser(id=None, username="zoe", roles=("viewer",)))
        await repo.upsert_user(AppUser(id=None, username="amy", roles=("viewer",)))

        # Order is not part of the contract; membership is.
        assert sorted(r.name for r in await repo.list_roles()) == ["a", "b"]
        assert sorted(u.username for u in await repo.list_users()) == ["amy", "zoe"]
        assert await repo.get_user("nobody") is None
        assert await repo.get_role_by_name("nobody") is None
        assert await repo.get_role(999) is None


# ── SQL-only semantics ──────────────────────────────────────────────────


async def test_a_malformed_permissions_cell_fails_closed_not_open():
    """Unreadable permission data means "no permissions" (403), never "all"."""
    async with in_memory_session() as session:
        session.add(RoleRow(name="broken", permissions="not json", builtin=False))
        await session.commit()
        repo = SQLPermissionRepository(session)
        role = await repo.get_role_by_name("broken")
        assert role.permissions == ()


async def test_a_non_list_permissions_cell_fails_closed_too():
    async with in_memory_session() as session:
        session.add(RoleRow(name="obj", permissions='{"a": 1}', builtin=False))
        await session.commit()
        repo = SQLPermissionRepository(session)
        assert (await repo.get_role_by_name("obj")).permissions == ()


async def test_seed_builtin_roles_is_idempotent_and_keeps_operator_edits():
    async with in_memory_session() as session:
        repo = SQLPermissionRepository(session)
        assert await seed_builtin_roles(session) == len(BUILTIN_ROLES)
        assert await seed_builtin_roles(session) == 0

        viewer = await repo.get_role_by_name("viewer")
        await repo.update_role(dataclasses.replace(viewer, description="tuned"))
        await seed_builtin_roles(session)
        again = await repo.get_role_by_name("viewer")
        assert again.description == "tuned"
        assert again.id == viewer.id


async def test_update_of_a_missing_role_raises():
    async with in_memory_session() as session:
        repo = SQLPermissionRepository(session)
        with pytest.raises(ValueError):
            await repo.update_role(Role(id=999, name="ghost"))


async def test_builtin_roles_list_before_custom_ones():
    async with in_memory_session() as session:
        repo = SQLPermissionRepository(session)
        await seed_builtin_roles(session)
        await repo.add_role(Role(id=None, name="zz-custom"))
        names = [r.name for r in await repo.list_roles()]
        assert names[-1] == "zz-custom"
        assert names[:-1] == sorted(names[:-1])
