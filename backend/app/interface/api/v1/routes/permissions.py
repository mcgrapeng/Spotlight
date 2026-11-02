"""Permission routes: the caller's own permissions + the admin screens' CRUD.

  GET    /permissions/me        → what the caller may do right now
  GET    /permissions/catalog    → every permission code the console knows
  GET    /permissions/roles      → roles (roles.manage)
  POST   /permissions/roles      → create a role (roles.manage)
  PUT    /permissions/roles/{id} → update a role (roles.manage)
  DELETE /permissions/roles/{id} → delete a role (roles.manage)
  GET    /permissions/users      → users and their roles (users.manage)
  PUT    /permissions/users/{u}  → assign roles / lock a user (users.manage)

The frontend hides what the caller cannot do (`/permissions/me`); the server
enforces it independently on every route that carries a permission code.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, Request, status

from app.application.dto import (
    MeOut,
    PermissionOut,
    RoleIn,
    RoleOut,
    UserAssignmentIn,
    UserOut,
)
from app.application.use_cases.permissions import (
    BuiltinRoleError,
    PermissionUseCases,
    RoleExistsError,
    RoleInUseError,
    RoleNotFoundError,
    UnknownRoleError,
)
from app.domain.entities.permissions import AppUser, Role
from app.interface.api.v1.dependencies import (
    current_username,
    permission_uc,
    require_permission,
)

router = APIRouter(tags=["permissions"])


def _to_role_out(role: Role) -> RoleOut:
    return RoleOut(
        id=role.id or 0,
        name=role.name,
        description=role.description,
        permissions=list(role.permissions),
        builtin=role.builtin,
        created_at=role.created_at,
    )


async def _to_user_out(uc: PermissionUseCases, user: AppUser) -> UserOut:
    effective = await uc.effective_permissions(user.username)
    return UserOut(
        username=user.username,
        roles=list(user.roles),
        disabled=user.disabled,
        permissions=list(effective.permissions),
        created_at=user.created_at,
    )


# ── the caller's own permissions ───────────────────────────────────────────
@router.get("/permissions/me", response_model=MeOut)
async def get_me(
    request: Request,
    uc: PermissionUseCases = Depends(permission_uc),
) -> MeOut:
    username = current_username(request)
    effective = await uc.effective_permissions(username)
    return MeOut(
        username=effective.username,
        roles=list(effective.roles),
        permissions=list(effective.permissions),
        disabled=effective.disabled,
    )


@router.get("/permissions/catalog", response_model=list[PermissionOut])
async def get_catalog(
    uc: PermissionUseCases = Depends(permission_uc),
) -> list[PermissionOut]:
    return [
        PermissionOut(code=p.code, name=p.name, description=p.description)
        for p in await uc.catalog()
    ]


# ── roles ──────────────────────────────────────────────────────────────────
@router.get(
    "/permissions/roles",
    response_model=list[RoleOut],
    dependencies=[Depends(require_permission("roles.manage"))],
)
async def list_roles(uc: PermissionUseCases = Depends(permission_uc)) -> list[RoleOut]:
    return [_to_role_out(r) for r in await uc.list_roles()]


@router.post(
    "/permissions/roles",
    response_model=RoleOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("roles.manage"))],
)
async def create_role(
    payload: RoleIn,
    uc: PermissionUseCases = Depends(permission_uc),
) -> RoleOut:
    try:
        role = await uc.create_role(payload.name, payload.description, payload.permissions)
    except RoleExistsError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return _to_role_out(role)


@router.put(
    "/permissions/roles/{role_id}",
    response_model=RoleOut,
    dependencies=[Depends(require_permission("roles.manage"))],
)
async def update_role(
    payload: RoleIn,
    # sqlite INTEGER is int64; beyond it the driver overflows (fuzz-found).
    role_id: int = Path(ge=1, le=2**63 - 1),
    uc: PermissionUseCases = Depends(permission_uc),
) -> RoleOut:
    try:
        role = await uc.update_role(
            role_id, payload.name, payload.description, payload.permissions
        )
    except RoleNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e
    except RoleExistsError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except BuiltinRoleError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return _to_role_out(role)


@router.delete(
    "/permissions/roles/{role_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("roles.manage"))],
)
async def delete_role(
    role_id: int = Path(ge=1, le=2**63 - 1),
    uc: PermissionUseCases = Depends(permission_uc),
) -> None:
    try:
        ok = await uc.delete_role(role_id)
    except BuiltinRoleError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    except RoleInUseError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    if not ok:
        raise HTTPException(status_code=404, detail="角色不存在")
    return None


# ── users ──────────────────────────────────────────────────────────────────
@router.get(
    "/permissions/users",
    response_model=list[UserOut],
    dependencies=[Depends(require_permission("users.manage"))],
)
async def list_users(uc: PermissionUseCases = Depends(permission_uc)) -> list[UserOut]:
    return [await _to_user_out(uc, u) for u in await uc.list_users()]


@router.put(
    "/permissions/users/{username}",
    response_model=UserOut,
    dependencies=[Depends(require_permission("users.manage"))],
)
async def assign_roles(
    username: str,
    payload: UserAssignmentIn,
    uc: PermissionUseCases = Depends(permission_uc),
) -> UserOut:
    try:
        user = await uc.assign_roles(username, payload.roles, payload.disabled)
    except UnknownRoleError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    return await _to_user_out(uc, user)
