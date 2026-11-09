"""TeleportPlugin: per-session tsh credentials via the AuthPlugin contract.

We mock the subprocess layer (`_run_with_pty` / `_list_kube_clusters` /
`_current_context`) so the tests stay fast and don't shell out to a real
Teleport proxy. The plugin's job is to assemble the right command/env and
classify the failure mode — that contract is what these tests pin down.
"""
from __future__ import annotations

import os
from pathlib import Path

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
    assert "--mfa-mode=otp" not in captured["cmd"]
    assert captured["env"]["TELEPORT_HOME"] == str(tmp_path / "tsh")
    assert captured["env"]["KUBECONFIG"] == str(tmp_path / "kubeconfig.yaml")
    # The host's Teleport identity must not leak into the session login.
    assert captured["env"]["TELEPORT_KUBE_CLUSTER"] == ""
    assert captured["env"]["TELEPORT_CLUSTER"] == ""
    assert captured["lines"] == [b"pw"]

async def test_login_with_otp_forces_otp_mfa_mode(plugin, tmp_path, monkeypatch):
    """OTP given → tsh must not fall into a webauthn ceremony the code can't answer."""
    captured = {}

    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        captured["cmd"] = cmd
        return 0, "ok", ""

    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._list_kube_clusters",
                        _fake_clusters)
    await plugin.login("bob", {"password": "pw", "otp": "123456"}, tmp_path)
    assert "--mfa-mode=otp" in captured["cmd"]


async def test_login_env_paths_are_absolute(plugin, tmp_path, monkeypatch):
    """`tsh kube login` copies TELEPORT_HOME into the kubeconfig's exec block,
    and the Kubernetes SDK runs that exec with CWD = the kubeconfig's own
    directory. A relative path resolves against the wrong directory, tsh finds
    no profile ("Having problems with relogin"), and every API call 403s.
    """
    captured = {}

    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        captured["env"] = env or {}
        return 0, "ok", ""

    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    monkeypatch.chdir(tmp_path)
    await plugin.login("bob", {"password": "pw", "otp": ""}, Path("rel/session"))
    assert os.path.isabs(captured["env"]["TELEPORT_HOME"])
    assert os.path.isabs(captured["env"]["KUBECONFIG"])


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


async def test_login_reports_the_tsh_error_not_a_wrong_code(plugin, tmp_path, monkeypatch):
    """tsh prints the OTP prompt before it resolves the target cluster.

    A failed login therefore contains "Enter an OTP code" AND a real error.
    Classifying by the prompt alone blames the user's code for it — which is
    exactly how a wrong TELEPORT_CLUSTER looked like a bad one-time code.
    """
    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        return 1, "", (
            "Enter password for Teleport user bob:\n"
            "Enter an OTP code from a device:\n"
            '\x1b[31mERROR: \x1b[0mremote cluster "pvg1s1-cloud" is not found'
        )
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    with pytest.raises(AuthError) as ei:
        await plugin.login("bob", {"password": "pw", "otp": "123456"}, tmp_path)
    assert ei.value.code == "invalid_credentials"
    assert "is not found" in ei.value.message


# Real tsh v18.10.0 output, captured against gt.internal.zhiman.tech on
# 2026-11-03. The order is the point: tsh asks for the one-time code FIRST
# and only then reports the failure, so a classifier that keys on "the output
# mentions an OTP" turns every unrelated error into "wrong code".
TSH_UNKNOWN_REMOTE_CLUSTER = (
    "Enter password for Teleport user zhangpeng:\n"
    "Enter an OTP code from a device:\n"
    '\x1b[31mERROR: \x1b[0mremote cluster "pvg1s1-cloud" is not found'
)
TSH_UNREGISTERED_KUBE_CLUSTER = (
    "Enter password for Teleport user zhangpeng:\n"
    "Enter an OTP code from a device:\n"
    '\x1b[31mERROR: \x1b[0mKubernetes cluster '
    '"gt.internal.zhiman.tech-pvg1s1-cloud" is not registered in this Teleport '
    "cluster; you can list registered Kubernetes clusters using 'tsh kube ls'"
)


@pytest.mark.parametrize(
    "output", [TSH_UNKNOWN_REMOTE_CLUSTER, TSH_UNREGISTERED_KUBE_CLUSTER]
)
async def test_real_tsh_failures_are_not_reported_as_a_wrong_code(
    plugin, tmp_path, monkeypatch, output
):
    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        return 1, "", output
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    with pytest.raises(AuthError) as ei:
        await plugin.login("bob", {"password": "pw", "otp": "123456"}, tmp_path)
    assert ei.value.code == "invalid_credentials"
    assert "一次性码" not in ei.value.message
    # The user sees tsh's own words, not a guess.
    assert "ERROR" not in ei.value.message


async def test_tsh_error_text_is_extracted_without_ansi_codes():
    from app.infrastructure.auth.plugins.teleport import _tsh_error

    assert _tsh_error(TSH_UNKNOWN_REMOTE_CLUSTER) == (
        'remote cluster "pvg1s1-cloud" is not found'
    )
    assert "not registered" in _tsh_error(TSH_UNREGISTERED_KUBE_CLUSTER)
    assert _tsh_error("Enter an OTP code from a device:\n") == ""


async def test_login_still_reports_bad_otp_when_tsh_refuses_the_code(
    plugin, tmp_path, monkeypatch,
):
    async def fake_run(cmd, lines, *, env=None, timeout=60.0):
        return 1, "", "Enter an OTP code from a device:\nERROR: invalid one-time password"
    monkeypatch.setattr("app.infrastructure.auth.plugins.teleport._run_with_pty", fake_run)
    with pytest.raises(AuthError) as ei:
        await plugin.login("bob", {"password": "pw", "otp": "123456"}, tmp_path)
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
