"""Encryption at rest for secrets the operator stores through the UI.

The AI provider's API key is the one secret in this database, and it can
spend money. It used to sit in a plain `String(512)` column: a leaked
backup, a copied db file, or a read-only database user was enough to take
it. Now the column holds `enc:v1:<token>` and the key lives outside the
database.

Two ways to hold the master key, in this order:

1. `SECRET_KEY` in the environment. Any passphrase the operator likes; the
   key is derived from it, so it has to be the same everywhere the
   database is opened.
2. Otherwise a generated key in `data/.secret_key`, mode 0600. That is the
   common case for a self-hosted install: nothing to configure, and the
   file is the thing to back up alongside the database.

The limit, stated once: lose the master key and the stored keys are gone.
There is no recovery path, by design — a recovery path readable by the
same party that leaks the database is not a recovery path.
"""
from __future__ import annotations

import base64
import hashlib
import os
from pathlib import Path

from cryptography.fernet import Fernet, InvalidToken

PREFIX = "enc:v1:"


class SecretBoxError(Exception):
    """A stored secret cannot be read back."""


def _fernet(secret_file: Path) -> Fernet:
    env = os.environ.get("SECRET_KEY", "").strip()
    if env:
        # Any passphrase is fine; derive a stable Fernet key from it so the
        # operator never has to generate a 32-byte base64url key by hand.
        digest = hashlib.sha256(env.encode("utf-8")).digest()
        return Fernet(base64.urlsafe_b64encode(digest))
    secret_file.parent.mkdir(parents=True, exist_ok=True)
    if secret_file.exists():
        key = secret_file.read_bytes().strip()
    else:
        key = Fernet.generate_key()
        secret_file.write_bytes(key + b"\n")
        try:
            os.chmod(secret_file, 0o600)
        except OSError:
            pass
    return Fernet(key)


def seal(plain: str, secret_file: Path) -> str:
    """Encrypt for storage. Idempotent: already-sealed values pass through."""
    if not plain or plain.startswith(PREFIX):
        return plain
    return PREFIX + _fernet(secret_file).encrypt(plain.encode("utf-8")).decode("ascii")


def open_secret(stored: str, secret_file: Path) -> str:
    """Read a stored secret, transparently handling the plaintext legacy form.

    A row written before encryption was introduced is still plaintext. It is
    read as-is and sealed again on the next save, so the store migrates
    itself instead of needing a migration step that a missed deployment
    would skip.
    """
    if not stored or not stored.startswith(PREFIX):
        return stored
    try:
        return _fernet(secret_file).decrypt(stored[len(PREFIX):].encode("ascii")).decode("utf-8")
    except (InvalidToken, ValueError) as e:
        raise SecretBoxError(
            "cannot decrypt a stored secret: the master key is different from "
            "the one that wrote it (SECRET_KEY, or data/.secret_key)"
        ) from e
