"""Shared in-memory fakes for the test suite."""
from __future__ import annotations

from app.domain.entities.permissions import AppUser, Role


class FakePermissionRepo:
    """In-memory stand-in for the SQL permission repository.

    Lives here (not in a test module) because both the use-case tests and the
    HTTP tests need the same fake.
    """

    def __init__(self) -> None:
        self.roles: dict[int, Role] = {}
        self.users: dict[str, AppUser] = {}
        self._next_id = 1

    async def list_roles(self) -> list[Role]:
        return list(self.roles.values())

    async def get_role(self, role_id: int) -> Role | None:
        return self.roles.get(role_id)

    async def get_role_by_name(self, name: str) -> Role | None:
        for r in self.roles.values():
            if r.name == name:
                return r
        return None

    async def add_role(self, role: Role) -> Role:
        role = Role(
            id=self._next_id, name=role.name, description=role.description,
            permissions=role.permissions, builtin=role.builtin,
        )
        self._next_id += 1
        self.roles[role.id] = role
        return role

    async def update_role(self, role: Role) -> Role:
        self.roles[role.id] = role
        return role

    async def remove_role(self, role_id: int) -> bool:
        return self.roles.pop(role_id, None) is not None

    async def list_users(self) -> list[AppUser]:
        return list(self.users.values())

    async def get_user(self, username: str) -> AppUser | None:
        return self.users.get(username)

    async def upsert_user(self, user: AppUser) -> AppUser:
        existing = self.users.get(user.username)
        saved = AppUser(
            id=existing.id if existing else len(self.users) + 1,
            username=user.username, roles=user.roles, disabled=user.disabled,
        )
        self.users[user.username] = saved
        return saved

    def seed_builtin_roles(self) -> None:
        """Insert the built-in roles the way the startup seeder does."""
        from app.domain.value_objects.permissions import BUILTIN_ROLES

        for name, permissions in BUILTIN_ROLES.items():
            self.roles[self._next_id] = Role(
                id=self._next_id, name=name, permissions=permissions, builtin=True,
            )
            self._next_id += 1
