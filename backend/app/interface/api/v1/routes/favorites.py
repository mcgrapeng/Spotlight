"""Favorite routes."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.application.use_cases.favorites import FavoriteUseCases
from app.interface.api.v1.dependencies import favorite_uc
from app.interface.api.v1.schemas import FavoriteCreate, FavoriteOut

router = APIRouter(tags=["favorites"])


@router.get("/favorites", response_model=list[FavoriteOut])
async def list_favs(uc: FavoriteUseCases = Depends(favorite_uc)):
    return await uc.list()


@router.post("/favorites", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED)
async def add_fav(
    payload: FavoriteCreate,
    uc: FavoriteUseCases = Depends(favorite_uc),
):
    try:
        return await uc.add(payload.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.delete("/favorites/{fav_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_fav(fav_id: int, uc: FavoriteUseCases = Depends(favorite_uc)):
    await uc.remove(fav_id)
    return None
