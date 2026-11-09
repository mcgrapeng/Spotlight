"""Schema migrations: `create_all` never changes a table that already exists.

The favorites table gained an `owner` column after it had already shipped.
On a database created before that, `create_all` does nothing at all — the
table exists, so it is left alone — and every query that mentions the new
column fails with "no such column: owner". The migration list is what closes
that gap.
"""
from __future__ import annotations

from sqlalchemy import create_engine, text

from app.infrastructure.persistence.db import _apply_migrations

# The shape the favorites table had before the owner column existed.
OLD_FAVORITES = (
    "CREATE TABLE favorites ("
    "id INTEGER PRIMARY KEY AUTOINCREMENT, "
    "resource_type VARCHAR(32) NOT NULL, "
    "name VARCHAR(255) NOT NULL, "
    "namespace VARCHAR(255) NOT NULL, "
    "cluster VARCHAR(255) NOT NULL, "
    "note VARCHAR(512) NOT NULL, "
    "created_at DATETIME)"
)


def _engine_with_old_favorites(tmp_path):
    engine = create_engine(f"sqlite:///{tmp_path / 'old.db'}")
    with engine.begin() as conn:
        conn.execute(text(OLD_FAVORITES))
    return engine


def test_the_owner_column_is_added_to_an_existing_table(tmp_path):
    engine = _engine_with_old_favorites(tmp_path)

    with engine.begin() as conn:
        _apply_migrations(conn)
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(favorites)"))}
        version = conn.execute(text("PRAGMA user_version")).scalar_one()

    assert "owner" in columns
    assert version == 1


def test_the_migration_is_idempotent(tmp_path):
    """Running it twice must not raise — the app applies it on every start."""
    engine = _engine_with_old_favorites(tmp_path)

    with engine.begin() as conn:
        _apply_migrations(conn)
        _apply_migrations(conn)
        columns = {row[1] for row in conn.execute(text("PRAGMA table_info(favorites)"))}

    assert "owner" in columns


def test_existing_rows_survive_the_migration(tmp_path):
    engine = _engine_with_old_favorites(tmp_path)
    with engine.begin() as conn:
        conn.execute(
            text(
                "INSERT INTO favorites (resource_type, name, namespace, cluster, note)"
                " VALUES ('pod', 'p1', 'default', 'prod', '')"
            )
        )
        _apply_migrations(conn)
        rows = conn.execute(text("SELECT name, owner FROM favorites")).all()

    assert rows == [("p1", "")]
