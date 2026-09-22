"""Teleport `tsh` integration.

Lets the backend log in to a Teleport proxy at startup or via a `/auth/login`
endpoint, so the kubeconfig at `$KUBECONFIG` (or the path configured by the
admin) is populated with fresh, signed certificates. The K8s client pool then
picks those up automatically — no manual `tsh login` / `tsh kube login` required
by operators.

We deliberately shell out to `tsh` instead of talking to the Teleport API
directly — `tsh` is the supported, audited binary and gives us a single command
surface (cert refresh, cluster selection, proxy trust) without re-implementing it.
"""
from __future__ import annotations

import asyncio
import os
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.logging import get_logger

log = get_logger("auth.teleport")


@dataclass(frozen=True)
class LoginResult:
    ok: bool
    proxy: str
    user: str
    cluster: str
    message: str = ""


def tsh_available(binary: str = "tsh") -> bool:
    return shutil.which(binary) is not None


async def _run(cmd: list[str], *, stdin: bytes | None = None,
               env: dict[str, str] | None = None,
               timeout: float = 60.0) -> tuple[int, str, str]:
    """Run a subprocess with optional stdin payload and env override.

    Returns (rc, stdout, stderr). stdout/stderr are decoded as utf-8 with errors
    replaced so unexpected bytes from the proxy don't crash parsing.
    """
    full_env = os.environ.copy()
    if env:
        full_env.update(env)
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdin=asyncio.subprocess.PIPE if stdin is not None else asyncio.subprocess.DEVNULL,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
        env=full_env,
    )
    try:
        stdout_b, stderr_b = await asyncio.wait_for(
            proc.communicate(stdin), timeout=timeout,
        )
    except asyncio.TimeoutError:
        proc.kill()
        await proc.wait()
        return (124, "", "timeout")
    return (
        proc.returncode or 0,
        stdout_b.decode("utf-8", "replace"),
        stderr_b.decode("utf-8", "replace"),
    )


async def login(password: str, *, kubeconfig_path: Optional[Path] = None,
                timeout: float = 60.0) -> LoginResult:
    """Run `tsh login` + `tsh kube login` and reload the in-process kubeconfig.

    `kubeconfig_path` defaults to the settings-resolved path so the same file the
    K8s pool reads from is the one tsh writes to.
    """
    s = get_settings()
    if not s.teleport_configured:
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           message="teleport_proxy / teleport_user not configured")
    if not tsh_available(s.tsh_binary):
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           message=f"'{s.tsh_binary}' not found in PATH — install teleport tools")

    target_kubeconfig = Path(kubeconfig_path or s.kubeconfig_path or os.environ.get("KUBECONFIG")
                              or (Path.home() / ".kube" / "config"))
    target_kubeconfig.parent.mkdir(parents=True, exist_ok=True)
    kubeconfig_env = {"KUBECONFIG": str(target_kubeconfig)}

    login_cmd = [
        s.tsh_binary, "login",
        f"--proxy={s.teleport_proxy}",
        f"--auth={s.teleport_auth}",
        f"--user={s.teleport_user}",
        s.teleport_proxy,
    ]
    if s.teleport_insecure:
        login_cmd.append("--insecure")

    rc, out, err = await _run(login_cmd, stdin=password.encode("utf-8") + b"\n",
                              timeout=timeout)
    if rc != 0:
        log.warning("tsh.login.failed", rc=rc, stderr=err.strip())
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           message=f"tsh login failed: {err.strip() or out.strip()}")

    cluster = s.teleport_cluster
    if cluster:
        rc2, _, err2 = await _run(
            [s.tsh_binary, "kube", "login", cluster], env=kubeconfig_env, timeout=timeout,
        )
        if rc2 != 0:
            log.warning("tsh.kube.login.failed", rc=rc2, stderr=err2.strip())
            return LoginResult(False, s.teleport_proxy, s.teleport_user, cluster,
                               message=f"tsh kube login failed: {err2.strip()}")

    # Make sure the K8s pool reads the freshly-written kubeconfig next request.
    try:
        get_pool().reload()
    except Exception as e:
        log.warning("pool.reload.failed", error=str(e))

    log.info("tsh.login.ok", user=s.teleport_user, cluster=cluster)
    return LoginResult(True, s.teleport_proxy, s.teleport_user, cluster,
                       message="logged in")


async def startup_login_if_configured() -> LoginResult | None:
    """Run at app startup if `TELEPORT_AUTOLOGIN_PASSWORD` is provided.

    Lets operators run unattended deployments in a container orchestrator that
    injects the password as an env var (Vault Agent, sealed secrets, etc.).
    """
    s = get_settings()
    if not s.teleport_configured:
        return None
    password = os.environ.get("TELEPORT_AUTOLOGIN_PASSWORD")
    if not password:
        return None
    return await login(password)