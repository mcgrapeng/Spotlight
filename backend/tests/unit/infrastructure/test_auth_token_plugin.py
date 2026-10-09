"""TokenPlugin: 共享凭证令牌，宿主 kubeconfig 直读。"""
from __future__ import annotations

from pathlib import Path

import pytest

from app.infrastructure.auth.plugins.base import AuthError, Identity
from app.infrastructure.auth.plugins.token import TokenPlugin

_KUBECONFIG = """
apiVersion: v1
kind: Config
clusters:
- cluster: {server: https://k8s.example}
  name: c1
contexts:
- context: {cluster: c1, user: u1}
  name: ctx-a
current-context: ctx-a
users:
- name: u1
  user: {}
"""


@pytest.fixture()
def plugin(monkeypatch, tmp_path):
    from app.infrastructure.config.settings import get_settings
    kc = tmp_path / "kubeconfig.yaml"
    kc.write_text(_KUBECONFIG)
    monkeypatch.setenv("API_TOKEN", "s3cret")
    monkeypatch.setenv("KUBECONFIG_PATH", str(kc))
    get_settings.cache_clear()
    yield TokenPlugin()
    get_settings.cache_clear()


async def test_login_accepts_token(plugin, tmp_path):
    ident = await plugin.login("alice", {"token": "s3cret"}, tmp_path)
    assert ident.username == "alice"


async def test_login_rejects_bad_token(plugin, tmp_path):
    with pytest.raises(AuthError) as ei:
        await plugin.login("alice", {"token": "wrong"}, tmp_path)
    assert ei.value.code == "invalid_credentials"


async def test_acquire_returns_host_kubeconfig(plugin, tmp_path):
    ident = Identity(username="alice")
    kc = await plugin.acquire(ident, "ctx-a", tmp_path)
    assert b"server: https://k8s.example" in kc.yaml
    assert kc.context == "ctx-a"
    assert await plugin.list_clusters(ident, tmp_path) == ["ctx-a"]
