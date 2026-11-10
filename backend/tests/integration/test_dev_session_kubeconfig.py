"""The dev session must read the kubeconfig the operator configured.

`KUBECONFIG_PATH` is documented in `.env.example` as "Path to the
kubeconfig the backend reads", and the token plugin honours it
(`plugins/token.py::_host_kubeconfig`). The open-mode path did not: it
passed `None`, so the SDK fell back to `$KUBECONFIG` / `~/.kube/config`
on its own and silently ignored the setting.

The symptom was a backend that answered `403` for namespaces, pods,
nodes and events while `/clusters` still returned 200 — it read the
cluster list off disk and everything else went to a Teleport credential
whose role had no access. An operator who pointed `KUBECONFIG_PATH` at a
different cluster got the old one anyway.
"""
from __future__ import annotations

from pathlib import Path

from app.interface.api.v1.dependencies import k8s_repo
from app.infrastructure.auth import session as session_store


def test_dev_session_uses_the_configured_kubeconfig(monkeypatch, tmp_path: Path):
    """The open-mode dev session must honour KUBECONFIG_PATH."""
    from app.infrastructure.config.settings import get_settings

    configured = tmp_path / "kubeconfig.yaml"
    configured.write_text("apiVersion: v1\n")

    monkeypatch.setenv("KUBECONFIG_PATH", str(configured))
    get_settings.cache_clear()

    dev = session_store.dev_session()
    adapter = k8s_repo(dev)

    assert adapter._kubeconfig_path == str(configured)


def test_dev_session_falls_back_when_nothing_is_configured(monkeypatch, tmp_path: Path):
    """With no KUBECONFIG_PATH, the SDK's own default still applies."""
    from app.infrastructure.config.settings import get_settings

    monkeypatch.setenv("KUBECONFIG_PATH", "")
    get_settings.cache_clear()

    dev = session_store.dev_session()
    adapter = k8s_repo(dev)

    assert adapter._kubeconfig_path is None


def test_dev_session_refuses_a_configured_but_missing_kubeconfig(monkeypatch, tmp_path: Path):
    """A configured path that does not exist must fail loudly.

    Silently falling back is the same bug one level down: the operator
    points KUBECONFIG_PATH at a file (typo, deleted, mount not in place)
    and the backend quietly serves a DIFFERENT cluster — or, as it did
    here, quietly serves one whose role cannot read anything and answers
    403 everywhere. "Configured but not applied" is the hardest class of
    misconfiguration to notice, so it must not be silent.
    """
    import pytest
    from fastapi import HTTPException
    from app.infrastructure.config.settings import get_settings

    monkeypatch.setenv("KUBECONFIG_PATH", str(tmp_path / "nope.yaml"))
    get_settings.cache_clear()

    dev = session_store.dev_session()

    with pytest.raises(HTTPException) as exc:
        k8s_repo(dev)
    assert exc.value.status_code == 500
    assert "不存在" in str(exc.value.detail)
