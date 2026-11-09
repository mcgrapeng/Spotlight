"""The database file must not be readable by other accounts on the host.

It holds the AI provider's key in the clear (only the API response is
masked), plus the role assignments. SQLite creates the file with the
process umask — 0644 on a normal umask — so every account on the machine,
every backup and every copied `data/` directory could read it.

The per-session kubeconfig directories are already created 0700; the
database needs the same treatment.
"""
from __future__ import annotations

import stat

from app.infrastructure.persistence.db import _lock_down_data_files


def test_the_database_file_is_only_readable_by_its_owner(tmp_path):
    db = tmp_path / "app.db"
    db.write_text("")
    db.chmod(0o644)

    _lock_down_data_files(str(db))

    assert stat.S_IMODE(db.stat().st_mode) == 0o600
    assert stat.S_IMODE(tmp_path.stat().st_mode) == 0o700


def test_a_database_that_does_not_exist_is_not_an_error(tmp_path):
    _lock_down_data_files(str(tmp_path / "nope.db"))  # must not raise


def test_an_in_memory_database_is_skipped():
    _lock_down_data_files(":memory:")  # must not raise
