"""Async SQLAlchemy repository for Favorites."""
from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.ports.outbound import FavoriteRepositoryPort
from app.domain.entities.ai import Favorite
from app.infrastructure.persistence.models.orm import FavoriteRow


class SQLFavoriteRepository(FavoriteRepositoryPort):
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list(self, owner: str) -> list[Favorite]:
        """Only the caller's own favorites — the table is shared by every
        user of the console."""
        result = await self._session.execute(
            select(FavoriteRow)
            .where(FavoriteRow.owner == owner)
            .order_by(FavoriteRow.created_at.desc())
        )
        return [self._to_entity(r) for r in result.scalars().all()]

    async def add(self, fav: Favorite) -> Favorite:
        row = FavoriteRow(
            resource_type=fav.resource_type, name=fav.name,
            namespace=fav.namespace, cluster=fav.cluster, note=fav.note,
            owner=fav.owner,
        )
        self._session.add(row)
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_entity(row)

    async def remove(self, fav_id: int, owner: str) -> bool:
        """Delete by id AND owner: guessing an id must not reach another
        user's row."""
        row = await self._session.get(FavoriteRow, fav_id)
        if row is None or row.owner != owner:
            return False
        await self._session.delete(row)
        await self._session.commit()
        return True

    @staticmethod
    def _to_entity(row: FavoriteRow) -> Favorite:
        return Favorite(
            id=row.id, resource_type=row.resource_type,  # type: ignore[arg-type]
            name=row.name, namespace=row.namespace, cluster=row.cluster, note=row.note,
            owner=row.owner, created_at=row.created_at,
        )
