"""SQL semantics of the favorites repository."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import update

from app.domain.entities.ai import Favorite
from app.infrastructure.persistence.models.orm import FavoriteRow
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository
from tests.fakes import in_memory_session


def _fav(name: str = "p", **overrides) -> Favorite:
    base = dict(id=None, resource_type="pod", name=name, namespace="ns", cluster="prod", note="")
    base.update(overrides)
    return Favorite(**base)


async def test_add_round_trips_every_field():
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        saved = await repo.add(_fav(note="look here"))
        assert saved.id is not None
        listed = await repo.list()
        assert len(listed) == 1
        f = listed[0]
        assert (f.resource_type, f.name, f.namespace, f.cluster, f.note) == (
            "pod", "p", "ns", "prod", "look here",
        )
        assert f.created_at is not None


async def test_list_puts_the_newest_favorite_first():
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        older = await repo.add(_fav(name="older"))
        await repo.add(_fav(name="newer"))
        # Second-resolution timestamps can tie; pin the ordering input.
        await session.execute(
            update(FavoriteRow).where(FavoriteRow.id == older.id)
            .values(created_at=datetime(2020, 1, 1))
        )
        await session.commit()
        assert [f.name for f in await repo.list()] == ["newer", "older"]


async def test_remove_reports_whether_a_row_was_deleted():
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        saved = await repo.add(_fav())
        assert await repo.remove(saved.id) is True
        assert await repo.list() == []
        assert await repo.remove(saved.id) is False
        assert await repo.remove(999) is False
