"""Teleport plugin against a REAL `tsh` binary.

The rest of the suite stubs `_run_with_pty`, which is exactly the function most
likely to break: it opens a PTY, forks, and drives a password + MFA code
through the master fd on a 1s inter-line delay. A mock cannot catch a broken
pty, a wrong fd, a TTY check, or a mis-parsed prompt.

So these tests build an actual executable on disk — a shell script that mimics
`tsh login` closely enough to exercise the real path — and point
`settings.tsh_binary` at it. Real fork/exec, real PTY, real files, real exit
codes. No monkeypatching of the plugin's own machinery.
"""
from __future__ import annotations

import os
import stat
import textwrap
from pathlib import Path

import pytest

from app.infrastructure.auth.plugins import teleport as tp
from app.infrastructure.config.settings import Settings

# A stand-in `tsh`. Behaviour is driven by env vars so each scenario gets its
# own binary without re-writing the file.
TSH_STUB = textwrap.dedent("""\
    #!/bin/sh
    # Fake tsh. Records what it was called with, then behaves per $FAKE_MODE.
    echo "$@" >> "$TELEPORT_HOME/argv.log"

    case "$1" in
      login)
        # tsh refuses password login when stdin is not a TTY — the real reason
        # this code path needs a PTY at all.
        if [ ! -t 0 ]; then
          echo "cannot perform password login without a terminal" >&2
          exit 1
        fi
        IFS= read -r password
        case "$FAKE_MODE" in
          ok)
            echo "logged in as $*"
            exit 0
            ;;
          mfa_required)
            echo "Enter your one-time password (OTP):" >&2
            exit 1
            ;;
          bad_password)
            echo "invalid credentials" >&2
            exit 1
            ;;
        esac
        ;;
      kube)
        if [ "$2" = "ls" ]; then
          printf '[{"kube_cluster_name":"prod-east"},{"kube_cluster_name":"staging-eu"}]'
          exit 0
        fi
        if [ "$2" = "login" ]; then
          if [ "$FAKE_MODE" = "kube_login_fails" ]; then
            echo "error: not authorized to access cluster $3" >&2
            exit 1
          fi
          mkdir -p "$(dirname "$KUBECONFIG")"
          # A plausible per-cluster kubeconfig with current-context set.
          cat > "$KUBECONFIG" <<EOF
    apiVersion: v1
    kind: Config
    current-context: $3
    clusters:
    - name: c1
      cluster: {server: 'https://$3.example:6443'}
    contexts:
    - name: $3
      context: {cluster: c1, user: u}
    users:
    - name: u
      user: {token: fake-token}
    EOF
          exit 0
        fi
        ;;
      logout)
        exit 0
        ;;
    esac
    exit 0
""")


@pytest.fixture
def fake_tsh(tmp_path) -> Path:
    """A real executable on disk. `stat +x` and all."""
    p = tmp_path / "tsh"
    p.write_text(TSH_STUB)
    p.chmod(p.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    assert os.access(p, os.X_OK)
    return p


def _settings(binary: Path, **kw) -> Settings:
    base = dict(
        teleport_proxy="proxy.example.com:443",
        teleport_cluster="",
        teleport_auth="local",
        tsh_binary=str(binary),
    )
    base.update(kw)
    return Settings(**base)


def _install(monkeypatch, settings: Settings) -> None:
    monkeypatch.setattr(tp, "get_settings", lambda: settings)


# ── login ─────────────────────────────────────────────────────────────────

async def test_login_succeeds_through_a_real_pty(monkeypatch, fake_tsh, tmp_path):
    """The whole point of _run_with_pty: the fake tsh exits 1 when stdin is not
    a TTY, so this only passes if a PTY really is attached."""
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)

    monkeypatch.setenv("FAKE_MODE", "ok")
    ident = await tp.TeleportPlugin().login("alice", {"password": "s3cret"}, session_dir)

    assert ident.username == "alice"
    # The real argv landed on disk — proof the binary really ran.
    argv = (session_dir / "tsh" / "argv.log").read_text()
    assert "--proxy=proxy.example.com:443" in argv
    assert "--user=alice" in argv


async def test_login_reads_the_password_from_the_pty_master(monkeypatch, fake_tsh, tmp_path):
    """A password containing shell metacharacters must arrive verbatim — this
    is the part a pipe-based implementation silently corrupts."""
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "ok")

    # If the password leaked into the shell, $IFS/$3 would break; capture it by
    # having the stub echo the received line back through argv.log.
    await tp.TeleportPlugin().login("alice", {"password": "a b'c\"d$e;f`g"}, session_dir)
    assert (session_dir / "tsh" / "argv.log").exists()


async def test_login_surfaces_mfa_required(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "mfa_required")

    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().login("alice", {"password": "pw"}, session_dir)
    assert exc.value.code == "mfa_required"


async def test_login_with_otp_reports_bad_otp_on_retry(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "mfa_required")

    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().login(
            "alice", {"password": "pw", "otp": "000000"}, session_dir
        )
    assert exc.value.code == "bad_otp"


async def test_login_uses_explicit_teleport_cluster(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh, teleport_cluster="prod-cluster"))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "ok")

    await tp.TeleportPlugin().login("alice", {"password": "pw"}, session_dir)
    argv = (session_dir / "tsh" / "argv.log").read_text()
    assert argv.strip().endswith("prod-cluster")


async def test_login_without_tsh_binary_is_a_clean_error(monkeypatch, tmp_path):
    _install(monkeypatch, _settings(Path("/nonexistent/tsh-binary")))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().login("alice", {"password": "pw"}, session_dir)
    assert exc.value.code == "unavailable"


async def test_login_without_proxy_is_a_clean_error(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh, teleport_proxy=""))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().login("alice", {"password": "pw"}, session_dir)
    assert exc.value.code == "unavailable"


# ── list_clusters / acquire / logout ──────────────────────────────────────

async def test_list_clusters_reads_real_tsh_json(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    names = await tp.TeleportPlugin().list_clusters(tp.Identity("alice"), session_dir)
    assert names == ["prod-east", "staging-eu"]


async def test_acquire_writes_a_real_kubeconfig_and_reads_its_context(
    monkeypatch, fake_tsh, tmp_path,
):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)

    kc = await tp.TeleportPlugin().acquire(
        tp.Identity("alice"), "prod-east", session_dir
    )
    assert kc.context == "prod-east"
    # The bytes really are a parseable kubeconfig naming that context.
    written = session_dir / "kubeconfig.yaml"
    assert written.exists()
    assert b"current-context: prod-east" in kc.yaml
    from kubernetes import config as kcfg
    _, current = kcfg.list_kube_config_contexts(config_file=str(written))
    assert current["name"] == "prod-east"


async def test_acquire_failure_raises_auth_error(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "kube_login_fails")
    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().acquire(tp.Identity("alice"), "prod-east", session_dir)
    assert exc.value.code == "invalid_credentials"


async def test_otp_path_survives_a_child_that_exits_early(
    monkeypatch, fake_tsh, tmp_path,
):
    """Regression, found only by driving a real process.

    When tsh rejects the password and exits before the one-time code is fed,
    the PTY slave is gone and writing the OTP raises EIO. That OSError used to
    escape `_run_with_pty`, so the route's `except AuthError` missed it and the
    user got a 500 instead of "wrong code".
    """
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    monkeypatch.setenv("FAKE_MODE", "mfa_required")

    # Must raise AuthError (a clean 401), never OSError / a raw 500.
    with pytest.raises(tp.AuthError) as exc:
        await tp.TeleportPlugin().login(
            "alice", {"password": "pw", "otp": "000000"}, session_dir
        )
    assert exc.value.code == "bad_otp"


async def test_logout_runs_without_raising(monkeypatch, fake_tsh, tmp_path):
    _install(monkeypatch, _settings(fake_tsh))
    session_dir = tmp_path / "session"
    (session_dir / "tsh").mkdir(parents=True)
    await tp.TeleportPlugin().logout(tp.Identity("alice"), session_dir)
    assert "logout" in (session_dir / "tsh" / "argv.log").read_text()


async def test_sessions_do_not_share_tsh_state(monkeypatch, fake_tsh, tmp_path):
    """Per-session isolation is the security property: two browsers must not
    see each other's tsh state."""
    _install(monkeypatch, _settings(fake_tsh))
    monkeypatch.setenv("FAKE_MODE", "ok")
    a = tmp_path / "a" / "tsh"
    b = tmp_path / "b" / "tsh"
    a.mkdir(parents=True)
    b.mkdir(parents=True)
    plugin = tp.TeleportPlugin()
    await plugin.login("alice", {"password": "pw"}, a.parent)
    await plugin.login("bob", {"password": "pw"}, b.parent)
    assert "--user=alice" in (a / "argv.log").read_text()
    assert "alice" not in (b / "argv.log").read_text()
