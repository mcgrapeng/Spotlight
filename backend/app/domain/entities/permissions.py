"""Permission domain entities: roles and the users they are assigned to.

A `Role` is a named set of permission codes. An `AppUser` is a *username*
(the identity the auth plugin vouches for) plus the roles granted to it —
there is no password or credential here: authentication stays the auth
plugin's job, this layer only answers "what may this identity do inside
Spotlight".
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime

from app.domain.value_objects.permissions import is_known_permission

# Role names end up in URLs and in a JSON column, so they are restricted to a
# boring, safe alphabet: lowercase, digits, dash, underscore.
ROLE_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,31}$")


@dataclass(frozen=True, slots=True)
class Role:
    id: int | None
    name: str
    description: str = ""
    permissions: tuple[str, ...] = field(default_factory=tuple)
    builtin: bool = False
    created_at: datetime | None = None

    def validate(self) -> None:
        if not ROLE_NAME_RE.match(self.name):
            raise ValueError(
                f"invalid role name: {self.name!r} "
                "(lowercase letters, digits, '-' and '_', max 32 chars)"
            )
        unknown = [p for p in self.permissions if not is_known_permission(p)]
        if unknown:
            raise ValueError(f"unknown permission(s): {', '.join(sorted(unknown))}")


@dataclass(frozen=True, slots=True)
class AppUser:
    id: int | None
    username: str
    roles: tuple[str, ...] = field(default_factory=tuple)
    disabled: bool = False
    created_at: datetime | None = None

    def validate(self) -> None:
        if not self.username or not self.username.strip():
            raise ValueError("username required")
        if not self.roles:
            raise ValueError(
                "at least one role required (use disabled=True to lock a user out)"
            )


__all__ = ["ROLE_NAME_RE", "AppUser", "Role"]
