from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Favorite, get_session
from app.schemas.k8s import FavoriteCreate, FavoriteOut

router = APIRouter()


@router.get("", response_model=list[FavoriteOut], summary="List favorites")
async def list_favs(session: AsyncSession = Depends(get_session)):
    rows = (await session.execute(select(Favorite).order_by(Favorite.created_at.desc()))).scalars().all()
    return rows


@router.post("", response_model=FavoriteOut, status_code=status.HTTP_201_CREATED, summary="Add favorite")
async def add_fav(payload: FavoriteCreate, session: AsyncSession = Depends(get_session)):
    fav = Favorite(**payload.model_dump())
    session.add(fav)
    await session.commit()
    await session.refresh(fav)
    return fav


@router.delete("/{fav_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Remove favorite")
async def remove_fav(fav_id: int, session: AsyncSession = Depends(get_session)):
    fav = await session.get(Favorite, fav_id)
    if not fav:
        raise HTTPException(status_code=404, detail="favorite not found")
    await session.delete(fav)
    await session.commit()
    return None
