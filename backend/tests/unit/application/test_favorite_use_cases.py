"""Tests for FavoriteUseCases with in-memory repo."""
from dataclasses import replace

import pytest

from app.application.use_cases.favorites import FavoriteUseCases
from app.domain.entities.ai import Favorite


class InMemoryFavRepo:
    def __init__(self) -> None:
        self.store: dict[int, Favorite] = {}
        self._id = 0

    async def list(self, owner: str) -> list[Favorite]:
        return sorted(
            (f for f in self.store.values() if f.owner == owner),
            key=lambda f: f.id or 0, reverse=True,
        )

    async def add(self, fav: Favorite) -> Favorite:
        self._id += 1
        saved = replace(fav, id=self._id)
        self.store[self._id] = saved
        return saved

    async def remove(self, fav_id: int, owner: str) -> bool:
        row = self.store.get(fav_id)
        if row is None or row.owner != owner:
            return False
        del self.store[fav_id]
        return True


@pytest.fixture
def uc():
    return FavoriteUseCases(InMemoryFavRepo())


async def test_add_and_list(uc):
    dto = await uc.add(
        {"resource_type": "pod", "name": "p1", "namespace": "ns", "cluster": "c1"},
        "alice",
    )
    assert dto.id == 1
    items = await uc.list("alice")
    assert len(items) == 1
    assert items[0].name == "p1"


async def test_each_user_sees_only_their_own(uc):
    await uc.add({"resource_type": "pod", "name": "mine", "namespace": "ns"}, "alice")
    await uc.add({"resource_type": "pod", "name": "theirs", "namespace": "ns"}, "bob")
    assert [f.name for f in await uc.list("alice")] == ["mine"]
    assert [f.name for f in await uc.list("bob")] == ["theirs"]


async def test_remove_existing(uc):
    await uc.add({"resource_type": "node", "name": "n1"}, "alice")
    await uc.remove(1, "alice")
    assert await uc.list("alice") == []


async def test_remove_someone_elses_is_a_404(uc):
    await uc.add({"resource_type": "node", "name": "n1"}, "alice")
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as e:
        await uc.remove(1, "bob")
    assert e.value.status_code == 404


async def test_remove_missing_raises(uc):
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as e:
        await uc.remove(999, "alice")
    assert e.value.status_code == 404


async def test_add_invalid_resource_type(uc):
    with pytest.raises(ValueError):
        await uc.add({"resource_type": "bogus", "name": "x"}, "alice")


async def test_add_node_requires_no_namespace(uc):
    dto = await uc.add({"resource_type": "node", "name": "n1"}, "alice")
    assert dto.namespace == ""
