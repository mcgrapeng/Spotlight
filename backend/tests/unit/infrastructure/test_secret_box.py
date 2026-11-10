"""Secrets at rest.

The AI provider's API key used to sit in a plain column. A leaked backup
or a copied database file was enough to take a key that spends money.
"""
from __future__ import annotations

from pathlib import Path

import pytest

from app.infrastructure.crypto.secret_box import (
    PREFIX,
    SecretBoxError,
    open_secret,
    seal,
)


def test_a_sealed_secret_is_not_the_plain_text(tmp_path: Path):
    key = tmp_path / ".secret_key"
    stored = seal("sk-live-abc123", key)
    assert stored.startswith(PREFIX)
    assert "sk-live-abc123" not in stored
    assert open_secret(stored, key) == "sk-live-abc123"


def test_sealing_is_idempotent(tmp_path: Path):
    key = tmp_path / ".secret_key"
    once = seal("sk-1", key)
    assert seal(once, key) == once


def test_a_legacy_plaintext_row_still_reads(tmp_path: Path):
    """Rows written before this change are plaintext. They read as-is and get
    sealed on the next save, so no migration step is needed."""
    key = tmp_path / ".secret_key"
    assert open_secret("sk-legacy", key) == "sk-legacy"


def test_the_key_file_is_only_readable_by_the_owner(tmp_path: Path):
    key = tmp_path / ".secret_key"
    seal("sk-1", key)
    assert oct(key.stat().st_mode & 0o777) == "0o600"


def test_a_different_master_key_cannot_read_it(tmp_path: Path):
    key = tmp_path / ".secret_key"
    stored = seal("sk-1", key)
    other = tmp_path / "other" / ".secret_key"
    with pytest.raises(SecretBoxError):
        open_secret(stored, other)


def test_an_environment_passphrase_stands_in_for_the_file(tmp_path: Path, monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "operator-passphrase")
    key = tmp_path / ".secret_key"
    stored = seal("sk-1", key)
    assert not key.exists(), "no file when the environment carries the key"
    assert open_secret(stored, key) == "sk-1"
