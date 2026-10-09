"""TeleportPlugin: per-session tsh credentials via the AuthPlugin contract.

We mock the subprocess layer (`_run_with_pty` / `_list_kube_clusters` /
`_current_context`) so the tests stay fast and don't shell out to a real
Teleport proxy. The plugin's job is to assemble the right command/env and
classify the failure mode — that contract is what these tests pin down.
"""
from __future__ import annotations

import pytest

from app.infrastructure.auth.plugins.base import AuthError
from app.infrastructure.auth.plugins.teleport import TeleportPlugin


@pytest.fixture()
def plugin(monkeypatch, tmp_path):
    from app.infrastructure.config.settings import get_settings
    monkeypatch.setenv("TELEPORT_PROXY", "proxy.example:443")
    monkeypatch.setenv("TELEPORT_AUTH", "local")
    get_settings.cache_clear()
    yield TeleportPlugin()
    get_settings.cache_clear()


async def _fake_clusters(env: dict) -> list[str]:
    return ["c1"]


async def test_login_passes_username_and_session_env(plugin, tmp_path, monkeypatch):
    captured = {}

    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        captured["cmd"] = cmd
        captured["env"] = env or {}
        captured["lines"] = lines
        return 0, "ok", ""

    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._list_kube_clusters",
                        _fake_clusters)
    ident = await plugin.login("bob", {"password": "pw", "otp": ""}, tmp_path)
    assert ident.username == "bob"
    assert "--user=bob" in captured["cmd"]
    assert captured["env"]["TELEPORT_HOME"] == str(tmp_path / "tsh")
    assert captured["env"]["KUBECONFIG"] == str(tmp_path / "kubeconfig.yaml")
    assert captured["lines"] == [b"pw"]


async def test_login_maps_mfa_prompt(plugin, tmp_path, monkeypatch):
    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        return 124, "Enter an OTP code from a device:", "timeout"
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    with pytest.raises(AuthError) as ei:
        await plugin.login("bob", {"password": "pw", "otp": ""}, tmp_path)
    assert ei.value.code == "mfa_required"


async def test_login_maps_bad_otp(plugin, tmp_path, monkeypatch):
    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        return 1, "Enter an OTP code from a device:\ninvalid", ""
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    with pytest.raises(AuthError) as ei:
        await plugin.login("bob", {"password": "pw", "otp": "000000"}, tmp_path)
    assert ei.value.code == "bad_otp"


async def test_acquire_runs_kube_login(plugin, tmp_path, monkeypatch):
    captured = {}

    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        captured["cmd"] = cmd
        (tmp_path / "kubeconfig.yaml").write_text("apiVersion: v1\nkind: Config\n")
        return 0, "", ""
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._current_context",
                        lambda session_dir: "c1")
    from app.infrastructure.auth.plugins.base import Identity
    kc = await plugin.acquire(Identity(username="bob"), "c1", tmp_path)
    assert captured["cmd"][:3] == ["tsh", "kube", "login"]
    assert "c1" in captured["cmd"]
    assert kc.yaml.startswith(b"apiVersion")
    assert kc.context == "c1"
