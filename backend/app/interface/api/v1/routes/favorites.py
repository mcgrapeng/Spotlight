"""Favorite routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, Request, status

from app.application.dto import FavoriteCreate, FavoriteOut
from app.application.use_cases.favorites import FavoriteUseCases
from app.interface.api.v1.dependencies import (
    current_username,
    favorite_uc,
    require_permission,
)

router = APIRouter(tags=["favorites"])


@router.get(
    "/favorites",
    response_model=list[FavoriteOut],
    dependencies=[Depends(require_permission("favorites.read"))],
)
async def list_favs(request: Request, uc: FavoriteUseCases = Depends(favorite_uc)):
    return await uc.list(current_username(request))


@router.post(
    "/favorites",
    response_model=FavoriteOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("favorites.write"))],
)
async def add_fav(
    payload: FavoriteCreate,
    request: Request,
    uc: FavoriteUseCases = Depends(favorite_uc),
):
    try:
        return await uc.add(payload.model_dump(), current_username(request))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.delete(
    "/favorites/{fav_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("favorites.write"))],
)
async def remove_fav(
    request: Request,
    # sqlite INTEGER is int64; beyond it the driver overflows (fuzz-found).
    fav_id: int = Path(ge=1, le=2**63 - 1),
    uc: FavoriteUseCases = Depends(favorite_uc),
):
    await uc.remove(fav_id, current_username(request))
    return None