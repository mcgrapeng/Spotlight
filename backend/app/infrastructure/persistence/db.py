"""Async SQLAlchemy engine + session helpers."""
from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger
from app.infrastructure.persistence.models.orm import Base

log = get_logger("db")

_engine = None
_sessionmaker: async_sessionmaker[AsyncSession] | None = None

# Schema migrations, applied in order and tracked by SQLite's `user_version`.
#
# `Base.metadata.create_all` only creates MISSING tables — it never changes a
# table that already exists. So a new column on an existing table needs this
# list, or the running database keeps the old shape and every query that
# mentions the new column fails with "no such column".
#
# Each entry is (version, table, column). The column is added only when it is
# missing, so the list is safe to run against a fresh database too.
_MIGRATIONS: tuple[tuple[int, str, str], ...] = (
    # v1: favorites belong to a user (see the Favorite entity's `owner`).
    (1, "favorites", "owner"),
)


def _apply_migrations(conn) -> None:
    current = conn.execute(text("PRAGMA user_version")).scalar_one()
    for version, table, column in _MIGRATIONS:
        if version <= current:
            continue
        columns = {row[1] for row in conn.execute(text(f"PRAGMA table_info({table})"))}
        if column not in columns:
            conn.execute(
                text(f"ALTER TABLE {table} ADD COLUMN {column} TEXT NOT NULL DEFAULT ''")
            )
        conn.execute(text(f"PRAGMA user_version = {version}"))


def get_engine():
    global _engine, _sessionmaker
    if _engine is None:
        settings = get_settings()
        _engine = create_async_engine(settings.database_url, echo=False, future=True)
        _sessionmaker = async_sessionmaker(_engine, expire_on_commit=False)
    return _engine


def _lock_down_data_files(db_path: str | None) -> None:
    """Keep the database readable by its owner only.

    It holds the AI provider's `api_key` in the clear (only the API response
    is masked), plus the role assignments. SQLite creates the file with the
    process umask — 0644 on a normal umask — so every account on the host,
    every backup and every copied `data/` directory could read it. The
    per-session kubeconfig directories are already created 0700.
    """
    if not db_path or db_path == ":memory:":
        return
    path = Path(db_path)
    if not path.exists():
        return
    for target, mode in ((path, 0o600), (path.parent, 0o700)):
        try:
            os.chmod(target, mode)
        except OSError:
            # A read-only or foreign-owned file is not worth refusing to
            # start over; the operator has to hear about it, though.
            log.warning("db.chmod_failed", path=str(target))


async def init_db() -> None:
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # create_all only creates missing tables; the migration list is what
        # brings an EXISTING table up to the current shape.
        await conn.run_sync(_apply_migrations)
    _lock_down_data_files(engine.url.database)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    if _sessionmaker is None:
        get_engine()
    async with _sessionmaker() as session:  # type: ignore[misc]
        yield session


@asynccontextmanager
async def session_scope():
    """A session for startup/shutdown work (outside the request DI).

    `get_session` is the request-scoped dependency; this one is for code that
    runs around the application (seeding the built-in roles, for instance).
    """
    if _sessionmaker is None:
        get_engine()
    async with _sessionmaker() as session:  # type: ignore[misc]
        yield session
