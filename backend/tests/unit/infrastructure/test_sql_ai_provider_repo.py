"""SQL semantics of the AI provider repository.

The single-default invariant matters most: two rows claiming `is_default`
would make provider selection ambiguous at analyze time.
"""
from __future__ import annotations

import dataclasses

import pytest

from app.domain.entities.ai import AIProviderConfig
from app.infrastructure.ai.providers.sql_provider import SQLAIProviderRepository
from app.infrastructure.persistence.models.orm import AIProviderRow
from tests.fakes import in_memory_session


def _cfg(**overrides) -> AIProviderConfig:
    base = dict(id=None, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k")
    base.update(overrides)
    return AIProviderConfig(**base)


async def test_adding_a_second_default_clears_the_first():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        a = await repo.add(_cfg(name="A", is_default=True))
        b = await repo.add(_cfg(name="B", is_default=True))
        assert [p.name for p in await repo.list() if p.is_default] == ["B"]
        assert (await repo.get(a.id)).is_default is False
        assert (await repo.get(b.id)).is_default is True


async def test_set_default_moves_the_flag_and_rejects_a_missing_id():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        a = await repo.add(_cfg(name="A", is_default=True))
        b = await repo.add(_cfg(name="B"))
        switched = await repo.set_default(b.id)
        assert switched.is_default is True
        assert (await repo.get(a.id)).is_default is False
        with pytest.raises(LookupError):
            await repo.set_default(999)


async def test_list_puts_the_default_first_then_the_oldest():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        await repo.add(_cfg(name="first"))
        await repo.add(_cfg(name="second"))
        await repo.add(_cfg(name="starred", is_default=True))
        names = [p.name for p in await repo.list()]
        # Second-resolution timestamps can tie, so only the default's pole
        # position is pinned; the rest is membership.
        assert names[0] == "starred"
        assert sorted(names[1:]) == ["first", "second"]


async def test_update_requires_an_id_and_an_existing_row():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        with pytest.raises(ValueError):
            await repo.update(_cfg())  # id=None
        with pytest.raises(LookupError):
            await repo.update(_cfg(id=999))


async def test_update_round_trips_every_field():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        saved = await repo.add(_cfg(extra={"x": "1"}))
        updated = await repo.update(dataclasses.replace(
            saved, name="renamed", api_base="https://llm", temperature=0.7,
            max_tokens=2048, enabled=False, extra={"y": "2"},
        ))
        fetched = await repo.get(saved.id)
        assert (updated.name, updated.api_base, updated.temperature, updated.max_tokens) == (
            "renamed", "https://llm", 0.7, 2048,
        )
        assert fetched.enabled is False
        assert fetched.extra == {"y": "2"}


async def test_remove_reports_whether_a_row_was_deleted():
    async with in_memory_session() as session:
        repo = SQLAIProviderRepository(session)
        saved = await repo.add(_cfg())
        assert await repo.remove(saved.id) is True
        assert await repo.get(saved.id) is None
        assert await repo.remove(saved.id) is False
        assert await repo.remove(999) is False


async def test_a_corrupt_extra_cell_reads_as_no_extra_not_a_crash():
    async with in_memory_session() as session:
        session.add(AIProviderRow(
            name="x", provider="openai", model="m", api_key="k", extra_json="{not json",
        ))
        await session.commit()
        repo = SQLAIProviderRepository(session)
        assert (await repo.list())[0].extra == {}
