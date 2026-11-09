"""SQL semantics of the favorites repository."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import update

from app.domain.entities.ai import Favorite
from app.infrastructure.persistence.models.orm import FavoriteRow
from app.infrastructure.persistence.repositories.favorite_repo import SQLFavoriteRepository
from tests.fakes import in_memory_session


def _fav(name: str = "p", owner: str = "alice", **overrides) -> Favorite:
    base = dict(
        id=None, resource_type="pod", name=name, namespace="ns",
        cluster="prod", note="", owner=owner,
    )
    base.update(overrides)
    return Favorite(**base)


async def test_add_round_trips_every_field():
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        saved = await repo.add(_fav(note="look here"))
        assert saved.id is not None
        listed = await repo.list("alice")
        assert len(listed) == 1
        f = listed[0]
        assert (f.resource_type, f.name, f.namespace, f.cluster, f.note) == (
            "pod", "p", "ns", "prod", "look here",
        )
        assert f.owner == "alice"
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
        assert [f.name for f in await repo.list("alice")] == ["newer", "older"]


async def test_list_returns_only_the_owners_favorites():
    """The favorites table is shared by every user of the console."""
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        await repo.add(_fav(name="mine", owner="alice"))
        await repo.add(_fav(name="theirs", owner="bob"))
        assert [f.name for f in await repo.list("alice")] == ["mine"]
        assert [f.name for f in await repo.list("bob")] == ["theirs"]


async def test_remove_only_reaches_the_owners_row():
    """Guessing an id must not reach another user's favorite."""
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        bobs = await repo.add(_fav(name="bobs", owner="bob"))
        assert await repo.remove(bobs.id, "alice") is False
        assert [f.name for f in await repo.list("bob")] == ["bobs"]
        assert await repo.remove(bobs.id, "bob") is True


async def test_remove_reports_whether_a_row_was_deleted():
    async with in_memory_session() as session:
        repo = SQLFavoriteRepository(session)
        saved = await repo.add(_fav())
        assert await repo.remove(saved.id, "alice") is True
        assert await repo.list("alice") == []
        assert await repo.remove(saved.id, "alice") is False
        assert await repo.remove(999, "alice") is False
