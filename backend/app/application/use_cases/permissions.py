"""Permission use cases: roles, user assignments, effective permissions.

Business rules (single source of truth):

- A permission code must exist in the catalog (`domain.value_objects
  .permissions`); an unknown code is rejected instead of stored, so a typo
  cannot become a permission that silently grants nothing.
- Built-in roles are seeded, not deleted. `admin` is immutable — it is the
  escape hatch, and an admin who could edit away their own permissions
  could lock the whole console out of itself.
- Deleting a role that is still granted to somebody is refused: silently
  stripping a user's permissions behind their back is worse than a 409.
- A user with no row at all (the common case — the auth plugin vouches for
  them) gets the default `user` role, i.e. today's behaviour. Locking
  somebody out is an explicit act (`disabled`), never a side effect.
- `disabled` wins over every role: a disabled user has no permissions.
- Usernames listed in `admin_users` always resolve to the admin role. That
  is the bootstrap: without it the very first deployment would have nobody
  able to grant the admin role to anybody.
"""
from __future__ import annotations

import threading
import time
from collections.abc import Iterable
from dataclasses import dataclass

from app.application.ports.outbound import PermissionRepositoryPort
from app.domain.entities.permissions import AppUser, Role
from app.domain.value_objects.permissions import (
    DEFAULT_ROLE,
    PERMISSIONS,
    ROLE_ADMIN,
    Permission,
    builtin_permissions,
)


class RoleError(ValueError):
    """Base class for the role-management errors the HTTP layer maps to 4xx."""


class RoleExistsError(RoleError):
    """A role with that name already exists."""


class RoleNotFoundError(RoleError):
    """No role with that id / name."""


class BuiltinRoleError(RoleError):
    """The role is built in and must not be changed that way."""


class RoleInUseError(RoleError):
    """The role is still granted to at least one user."""


class UnknownRoleError(RoleError):
    """A user was granted a role that does not exist."""


class PrivilegeEscalationError(RoleError):
    """A caller tried to grant a permission it does not hold itself."""


class LastAdminError(RoleError):
    """The change would leave nobody holding the admin role."""


@dataclass(frozen=True, slots=True)
class EffectivePermissions:
    """What one identity may do right now."""

    username: str
    roles: tuple[str, ...]
    permissions: tuple[str, ...]
    disabled: bool = False

    def allows(self, code: str) -> bool:
        return code in self.permissions


# Resolving permissions costs a couple of SELECTs, and the answer changes
# only when somebody edits a role. A short TTL keeps the console snappy and
# gives the console a usable answer during a brief database hiccup; every
# write clears the cache, so the staleness window is the TTL and nothing more.
_CACHE_TTL_SECONDS = 5.0
_cache: dict[str, tuple[float, EffectivePermissions]] = {}
_cache_lock = threading.Lock()


def invalidate_permission_cache(username: str | None = None) -> None:
    """Drop cached resolutions (one user, or everyone)."""
    with _cache_lock:
        if username is None:
            _cache.clear()
        else:
            _cache.pop(username, None)


class PermissionUseCases:
    def __init__(
        self,
        repo: PermissionRepositoryPort,
        *,
        admin_users: tuple[str, ...] = (),
        cache_ttl: float = _CACHE_TTL_SECONDS,
    ):
        self._repo = repo
        self._admin_users = frozenset(admin_users)
        self._cache_ttl = cache_ttl

    # ── catalog ──────────────────────────────────────────────────────────
    async def catalog(self) -> list[Permission]:
        """Every permission the console knows about (for the admin UI)."""
        return list(PERMISSIONS)

    # ── roles ───────────────────────────────────────────────────────────
    async def list_roles(self) -> list[Role]:
        return await self._repo.list_roles()

    async def create_role(
        self, name: str, description: str, permissions: list[str],
        *, actor: str | None = None,
    ) -> Role:
        if await self._repo.get_role_by_name(name) is not None:
            raise RoleExistsError(f"角色已存在: {name}")
        role = Role(
            id=None,
            name=name,
            description=description,
            permissions=tuple(sorted(set(permissions))),
            builtin=False,
        )
        # Validate before the ceiling: an unknown permission code is a bad
        # request (400), whatever the caller happens to hold.
        role.validate()
        await self._assert_within_ceiling(actor, role.permissions)
        created = await self._repo.add_role(role)
        invalidate_permission_cache()
        return created

    async def update_role(
        self, role_id: int, name: str, description: str, permissions: list[str],
        *, actor: str | None = None,
    ) -> Role:
        current = await self._repo.get_role(role_id)
        if current is None:
            raise RoleNotFoundError(f"角色不存在: {role_id}")
        if current.builtin:
            raise BuiltinRoleError(f"内置角色不可修改: {current.name}")
        clash = await self._repo.get_role_by_name(name)
        if clash is not None and clash.id != role_id:
            raise RoleExistsError(f"角色已存在: {name}")
        role = Role(
            id=role_id,
            name=name,
            description=description,
            permissions=tuple(sorted(set(permissions))),
            builtin=False,
        )
        # Validate before the ceiling: an unknown permission code is a bad
        # request (400), whatever the caller happens to hold.
        role.validate()
        await self._assert_within_ceiling(actor, role.permissions)
        updated = await self._repo.update_role(role)
        # A role's permission set changed: everybody holding it is stale.
        invalidate_permission_cache()
        return updated

    async def delete_role(self, role_id: int) -> bool:
        role = await self._repo.get_role(role_id)
        if role is None:
            return False
        if role.builtin:
            raise BuiltinRoleError(f"内置角色不可删除: {role.name}")
        for user in await self._repo.list_users():
            if role.name in user.roles:
                raise RoleInUseError(f"角色仍被用户使用，无法删除: {role.name}")
        ok = await self._repo.remove_role(role_id)
        invalidate_permission_cache()
        return ok

    # ── users ───────────────────────────────────────────────────────────
    async def list_users(self) -> list[AppUser]:
        return await self._repo.list_users()

    async def assign_roles(
        self, username: str, roles: list[str], disabled: bool = False,
        *, actor: str | None = None,
    ) -> AppUser:
        """Grant `roles` to `username`, creating the row if needed.

        `actor` is the identity making the request. When given, it bounds
        what may be granted: nobody can hand out a permission they do not
        hold themselves, and nobody can remove the last admin.
        """
        username = (username or "").strip()
        if not username:
            raise ValueError("用户名不能为空")
        if len(username) > 128:
            raise ValueError("用户名过长（最多 128 个字符）")
        wanted = tuple(dict.fromkeys(r.strip() for r in roles if r.strip()))
        if not wanted:
            raise ValueError("至少需要分配一个角色")
        granted: set[str] = set()
        for name in wanted:
            if await self._repo.get_role_by_name(name) is None:
                raise UnknownRoleError(f"角色不存在: {name}")
            granted.update(await self._role_permissions(name))
        await self._assert_within_ceiling(actor, granted)
        if await self._would_remove_the_last_admin(username, wanted, disabled):
            raise LastAdminError("不能移除最后一个管理员")
        user = AppUser(
            id=None, username=username, roles=wanted, disabled=disabled,
        )
        user.validate()
        saved = await self._repo.upsert_user(user)
        invalidate_permission_cache(username)
        return saved

    async def _assert_within_ceiling(
        self, actor: str | None, permissions: Iterable[str],
    ) -> None:
        """Refuse a grant that goes beyond what the caller holds.

        Without this, `users.manage` alone is enough to grant yourself the
        admin role: handing "just user management" to a colleague — a
        completely normal delegation — becomes full escalation.
        """
        if actor is None:
            return
        held = set((await self.effective_permissions(actor)).permissions)
        extra = sorted(set(permissions) - held)
        if extra:
            raise PrivilegeEscalationError(
                f"不能授予自己没有的权限: {', '.join(extra)}"
            )

    async def _would_remove_the_last_admin(
        self, username: str, new_roles: tuple[str, ...], disabled: bool,
    ) -> bool:
        """Whether this change would leave nobody holding the admin role.

        The admin role is the escape hatch: once nobody holds it, the whole
        admin surface is unreachable through the API, forever.
        """
        target = await self._repo.get_user(username)
        # A configured admin is an admin even WITHOUT a stored row — that is
        # the bootstrap (see effective_permissions). Only a DISABLED row takes
        # that away, and a disabled row wins over admin_users there too.
        was_admin = (
            not (target is not None and target.disabled)
            and (
                (target is not None and ROLE_ADMIN in target.roles)
                or username in self._admin_users
            )
        )
        if not was_admin:
            return False
        keeps_admin = (
            not disabled
            and (ROLE_ADMIN in new_roles or username in self._admin_users)
        )
        if keeps_admin:
            return False
        for user in await self._repo.list_users():
            if user.username == username or user.disabled:
                continue
            if ROLE_ADMIN in user.roles or user.username in self._admin_users:
                return False
        # A configured admin without a stored row is an admin as well — and
        # without this the scan would refuse a legitimate demotion.
        for other in self._admin_users:
            if other == username:
                continue
            row = await self._repo.get_user(other)
            if row is None or not row.disabled:
                return False
        return True

    # ── resolution ──────────────────────────────────────────────────────
    async def effective_permissions(self, username: str) -> EffectivePermissions:
        """Resolve what `username` may do.

        Resolution order: an explicit user row wins (its roles, or nothing at
        all when the row is disabled); otherwise the default role applies.
        A role name that has no stored row falls back to its built-in
        definition, so a freshly migrated database still resolves `admin`
        correctly.
        """
        if self._cache_ttl > 0:
            with _cache_lock:
                hit = _cache.get(username)
                if hit is not None and hit[0] > time.monotonic():
                    return hit[1]

        user = await self._repo.get_user(username)
        if user is None:
            roles = (DEFAULT_ROLE,)
            disabled = False
        else:
            roles = user.roles or (DEFAULT_ROLE,)
            disabled = user.disabled
        if disabled:
            resolved = EffectivePermissions(username, roles, (), disabled=True)
        else:
            granted: set[str] = set()
            for name in roles:
                granted.update(await self._role_permissions(name))
            if username in self._admin_users:
                granted.update(builtin_permissions(ROLE_ADMIN))
            resolved = EffectivePermissions(username, roles, tuple(sorted(granted)))

        if self._cache_ttl > 0:
            with _cache_lock:
                _cache[username] = (time.monotonic() + self._cache_ttl, resolved)
        return resolved

    async def _role_permissions(self, name: str) -> tuple[str, ...]:
        row = await self._repo.get_role_by_name(name)
        if row is not None:
            return row.permissions
        # No stored row: fall back to the built-in definition, so `admin`
        # still means "everything" on a database that was never seeded.
        return builtin_permissions(name)


__all__ = [
    "BuiltinRoleError",
    "EffectivePermissions",
    "LastAdminError",
    "PermissionUseCases",
    "PrivilegeEscalationError",
    "RoleError",
    "RoleExistsError",
    "RoleInUseError",
    "RoleNotFoundError",
    "UnknownRoleError",
    "invalidate_permission_cache",
]
