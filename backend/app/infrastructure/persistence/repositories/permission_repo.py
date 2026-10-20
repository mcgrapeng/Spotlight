"""Async SQLAlchemy repository for roles and user assignments."""
from __future__ import annotations

import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.ports.outbound import PermissionRepositoryPort
from app.domain.entities.permissions import AppUser, Role
from app.domain.value_objects.permissions import BUILTIN_ROLES
from app.infrastructure.persistence.models.orm import AppUserRow, RoleRow


def _dumps(values: tuple[str, ...] | list[str]) -> str:
    return json.dumps(list(values), ensure_ascii=False)


def _loads(raw: str | None) -> tuple[str, ...]:
    """Read a JSON array column back into a tuple.

    A malformed cell must not take the whole console down: an unreadable
    permission list is treated as "no permissions granted", which fails
    closed (the user sees 403) instead of granting everything.
    """
    if not raw:
        return ()
    try:
        data = json.loads(raw)
    except (TypeError, ValueError):
        return ()
    if not isinstance(data, list):
        return ()
    return tuple(str(item) for item in data)


class SQLPermissionRepository(PermissionRepositoryPort):
    def __init__(self, session: AsyncSession):
        self._session = session

    # ── roles ───────────────────────────────────────────────────────────
    async def list_roles(self) -> list[Role]:
        result = await self._session.execute(
            select(RoleRow).order_by(RoleRow.builtin.desc(), RoleRow.name)
        )
        return [self._to_role(r) for r in result.scalars().all()]

    async def get_role(self, role_id: int) -> Role | None:
        row = await self._session.get(RoleRow, role_id)
        return self._to_role(row) if row is not None else None

    async def get_role_by_name(self, name: str) -> Role | None:
        result = await self._session.execute(
            select(RoleRow).where(RoleRow.name == name)
        )
        row = result.scalar_one_or_none()
        return self._to_role(row) if row is not None else None

    async def add_role(self, role: Role) -> Role:
        row = RoleRow(
            name=role.name,
            description=role.description,
            permissions=_dumps(role.permissions),
            builtin=role.builtin,
        )
        self._session.add(row)
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_role(row)

    async def update_role(self, role: Role) -> Role:
        row = await self._session.get(RoleRow, role.id)
        if row is None:
            raise ValueError(f"role not found: {role.id}")
        row.name = role.name
        row.description = role.description
        row.permissions = _dumps(role.permissions)
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_role(row)

    async def remove_role(self, role_id: int) -> bool:
        row = await self._session.get(RoleRow, role_id)
        if row is None:
            return False
        await self._session.delete(row)
        await self._session.commit()
        return True

    # ── users ───────────────────────────────────────────────────────────
    async def list_users(self) -> list[AppUser]:
        result = await self._session.execute(
            select(AppUserRow).order_by(AppUserRow.username)
        )
        return [self._to_user(r) for r in result.scalars().all()]

    async def get_user(self, username: str) -> AppUser | None:
        result = await self._session.execute(
            select(AppUserRow).where(AppUserRow.username == username)
        )
        row = result.scalar_one_or_none()
        return self._to_user(row) if row is not None else None

    async def upsert_user(self, user: AppUser) -> AppUser:
        row = await self.get_user_row(user.username)
        if row is None:
            row = AppUserRow(username=user.username)
            self._session.add(row)
        row.roles = _dumps(user.roles)
        row.disabled = user.disabled
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_user(row)

    async def get_user_row(self, username: str) -> AppUserRow | None:
        result = await self._session.execute(
            select(AppUserRow).where(AppUserRow.username == username)
        )
        return result.scalar_one_or_none()

    # ── mapping ─────────────────────────────────────────────────────────
    @staticmethod
    def _to_role(row: RoleRow) -> Role:
        return Role(
            id=row.id,
            name=row.name,
            description=row.description or "",
            permissions=_loads(row.permissions),
            builtin=bool(row.builtin),
            created_at=row.created_at,
        )

    @staticmethod
    def _to_user(row: AppUserRow) -> AppUser:
        return AppUser(
            id=row.id,
            username=row.username,
            roles=_loads(row.roles),
            disabled=bool(row.disabled),
            created_at=row.created_at,
        )


async def seed_builtin_roles(session: AsyncSession) -> int:
    """Insert the built-in roles that are missing. Idempotent.

    Called on startup so a fresh database already knows `admin`, `user` and
    `viewer`. Built-in roles are only seeded when absent — an operator who
    tuned the `viewer` role keeps their edit across restarts.
    """
    repo = SQLPermissionRepository(session)
    created = 0
    for name, permissions in BUILTIN_ROLES.items():
        if await repo.get_role_by_name(name) is not None:
            continue
        await repo.add_role(
            Role(
                id=None,
                name=name,
                description=_BUILTIN_DESCRIPTIONS.get(name, ""),
                permissions=permissions,
                builtin=True,
            )
        )
        created += 1
    return created


_BUILTIN_DESCRIPTIONS = {
    "admin": "全部权限，包括角色与用户管理",
    "user": "日常使用（不含角色与用户管理）",
    "viewer": "只读：浏览资源与收藏，不能看日志或使用 AI",
}
