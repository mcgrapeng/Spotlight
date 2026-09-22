"""Tests for FavoriteUseCases with in-memory repo."""
from dataclasses import replace

import pytest

from app.application.use_cases.favorites import FavoriteUseCases
from app.domain.entities.ai import Favorite


class InMemoryFavRepo:
    def __init__(self) -> None:
        self.store: dict[int, Favorite] = {}
        self._id = 0

    async def list(self) -> list[Favorite]:
        return sorted(self.store.values(), key=lambda f: f.id or 0, reverse=True)

    async def add(self, fav: Favorite) -> Favorite:
        self._id += 1
        saved = replace(fav, id=self._id)
        self.store[self._id] = saved
        return saved

    async def remove(self, fav_id: int) -> bool:
        return self.store.pop(fav_id, None) is not None


@pytest.fixture
def uc():
    return FavoriteUseCases(InMemoryFavRepo())


async def test_add_and_list(uc):
    dto = await uc.add({"resource_type": "pod", "name": "p1", "namespace": "ns", "cluster": "c1"})
    assert dto.id == 1
    items = await uc.list()
    assert len(items) == 1
    assert items[0].name == "p1"


async def test_remove_existing(uc):
    await uc.add({"resource_type": "node", "name": "n1"})
    await uc.remove(1)
    assert await uc.list() == []


async def test_remove_missing_raises(uc):
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as e:
        await uc.remove(999)
    assert e.value.status_code == 404


async def test_add_invalid_resource_type(uc):
    with pytest.raises(ValueError):
        await uc.add({"resource_type": "bogus", "name": "x"})


async def test_add_node_requires_no_namespace(uc):
    dto = await uc.add({"resource_type": "node", "name": "n1"})
    assert dto.namespace == ""
