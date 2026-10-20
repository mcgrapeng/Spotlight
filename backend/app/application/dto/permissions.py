"""Permission DTOs — the shapes the HTTP layer exchanges.

The frontend reads `MeOut.permissions` to decide which menu entries and
buttons to render; the admin screens read `RoleOut` / `UserOut`.
"""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PermissionOut(BaseModel):
    """One entry of the permission catalog."""

    code: str
    name: str
    description: str = ""


class RoleIn(BaseModel):
    """Role payload (create / update)."""

    name: str = Field(min_length=1, max_length=32, pattern=r"^[a-z0-9][a-z0-9_-]{0,31}$")
    description: str = Field(default="", max_length=255)
    # The catalog holds a dozen codes; the bound keeps a fat list from
    # overflowing the column it is stored in.
    permissions: list[str] = Field(default_factory=list, max_length=64)


class RoleOut(BaseModel):
    id: int
    name: str
    description: str = ""
    permissions: list[str] = Field(default_factory=list)
    builtin: bool = False
    created_at: datetime | None = None


class UserAssignmentIn(BaseModel):
    """Grant a set of roles to a user (and optionally lock them out)."""

    roles: list[str] = Field(min_length=1, max_length=16)
    disabled: bool = False


class UserOut(BaseModel):
    """A user row with the permissions it resolves to."""

    username: str
    roles: list[str] = Field(default_factory=list)
    disabled: bool = False
    permissions: list[str] = Field(default_factory=list)
    created_at: datetime | None = None


class MeOut(BaseModel):
    """The caller's own effective permissions."""

    username: str
    roles: list[str] = Field(default_factory=list)
    permissions: list[str] = Field(default_factory=list)
    disabled: bool = False


__all__ = [
    "MeOut",
    "PermissionOut",
    "RoleIn",
    "RoleOut",
    "UserAssignmentIn",
    "UserOut",
]
