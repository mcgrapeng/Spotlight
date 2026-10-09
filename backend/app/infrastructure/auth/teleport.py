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
import pty
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from app.infrastructure.cache.ttl_cache import invalidate_all
from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import get_pool
from app.infrastructure.logging import get_logger

log = get_logger("auth.teleport")


@dataclass(frozen=True)
class LoginResult:
    ok: bool
    proxy: str
    user: str
    cluster: str               # Teleport cluster (== proxy host in most setups)
    kube_clusters: list[str]   # K8s clusters the user has access to post-auth
    message: str = ""
    code: str = ""             # "" | "mfa_required" — machine-readable failure class


@dataclass(frozen=True)
class KubeLoginResult:
    ok: bool
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


def _dec(b: bytes | None) -> str:
    return (b or b"").decode("utf-8", "replace")


def _is_mfa_prompt(text: str) -> bool:
    """True when tsh stopped to ask for an MFA/TOTP code."""
    low = text.lower()
    return any(k in low for k in ("otp", "mfa", "two-factor", "2fa", "totp"))


async def _run_with_pty(cmd: list[str], lines: list[bytes], *,
                          env: dict[str, str] | None = None,
                          timeout: float = 60.0,
                          inter_line_delay: float = 1.0) -> tuple[int, str, str]:
    """Like `_run`, but connects the child's stdin to a real PTY and feeds
    one or more input lines through the master fd.

    `tsh login --auth=local` checks `isatty(stdin)` and bails on a plain pipe
    with "cannot perform password login without a terminal". Attaching a PTY
    slave as the child's stdin makes `isatty(0)` true from its POV; we feed
    the password (and optionally an OTP / MFA token) through the master fd.

    The master fd stays open for the lifetime of the child. Closing it
    early (right after writing) races with the child's read() — by the time
    tsh drains the buffer and reaches its next stdin read (e.g. for OTP),
    the slave may already have hit HUP. Leaving master open until the child
    exits avoids that race; once the child exits the slave fd is reaped by
    the kernel and we just need to close master in cleanup.

    `inter_line_delay` is the pause between successive lines so the child
    has time to consume each one before the next arrives.
    """
    # Ponytail: exactly ONE cleanup block closes master_fd, on every exit
    # path (spawn failure, timeout, crash, success). A nested
    # finally + except-BaseException pair double-closes the fd on exception
    # paths — and after another thread reuses the fd number the second
    # close kills an unrelated connection.
    master_fd, slave_fd = pty.openpty()
    full_env = os.environ.copy()
    if env:
        full_env.update(env)

    loop = asyncio.get_event_loop()
    try:
        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdin=slave_fd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=full_env,
            )
        finally:
            # Always close the slave fd from the parent — child inherited
            # its own copy via fork().
            try:
                os.close(slave_fd)
            except OSError:
                pass

        try:
            await asyncio.wait_for(
                loop.run_in_executor(None, _feed_lines, master_fd, lines, inter_line_delay),
                timeout=max(10.0, inter_line_delay * (len(lines) + 1)),
            )
        except asyncio.TimeoutError:
            proc.kill()
            out_b, err_b = await proc.communicate()
            return (124, _dec(out_b), _dec(err_b) or "timeout")

        # shield() keeps communicate() alive past a timeout so we can still
        # drain what the child printed (e.g. the TOTP prompt) after kill.
        comm = asyncio.ensure_future(proc.communicate())
        try:
            stdout_b, stderr_b = await asyncio.wait_for(asyncio.shield(comm), timeout=timeout)
        except asyncio.TimeoutError:
            proc.kill()
            stdout_b, stderr_b = await comm
            return (124, _dec(stdout_b), _dec(stderr_b) or "timeout")

        return (
            proc.returncode or 0,
            _dec(stdout_b),
            _dec(stderr_b),
        )
    finally:
        try:
            os.close(master_fd)
        except OSError:
            pass


def _feed_lines(fd: int, lines: list[bytes], delay: float) -> None:
    """Write each line (with newline appended) to the PTY master, pausing
    `delay` seconds between lines so the child has time to consume each.
    """
    import time as _time
    for i, line in enumerate(lines):
        os.write(fd, line + b"\n")
        if i < len(lines) - 1:
            _time.sleep(delay)


def _proxy_to_cluster(proxy: str) -> str:
    """Strip the `:port` (and any path) off a proxy URL to get the cluster name.

    `tsh login <cluster>` wants the bare cluster name (matches the proxy's
    hostname for self-hosted setups), not the full proxy URL like
    `host.example.com:443`. Falling back to the proxy string if no host
    can be parsed keeps the error informative rather than silent.
    """
    # Parse as a URL if it looks like one, else fall back to host:port split.
    from urllib.parse import urlparse
    parsed = urlparse(proxy if "://" in proxy else f"//{proxy}")
    host = parsed.hostname
    if host:
        return host
    return proxy.split(":")[0]


async def login(password: str, *, otp: str = "",
                timeout: float = 60.0) -> LoginResult:
    """Run `tsh login --proxy=... --auth=local --user=... <proxy_host>` to
    authenticate against the Teleport proxy and write identity to `~/.tsh/`.

    This is the first of the three-step login — it does NOT touch kubeconfig
    yet. After this returns successfully, the caller should look at
    `kube_clusters` and call `kube_login(cluster)` to fetch kube creds for
    the cluster the user wants to manage.

    `otp` is the optional MFA TOTP code (or empty if the cluster doesn't
    require MFA / the user already has a remembered device). When provided,
    it's fed to tsh on a separate line after the password.
    """
    s = get_settings()
    if not s.teleport_configured:
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           kube_clusters=[], message="teleport_proxy / teleport_user not configured")
    if not tsh_available(s.tsh_binary):
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           kube_clusters=[],
                           message=f"'{s.tsh_binary}' not found in PATH — install teleport tools")

    # The positional <cluster> arg to `tsh login` is the Teleport cluster
    # name (NOT the proxy URL, which is the value of --proxy). For a
    # self-hosted setup they usually match the proxy's hostname — strip
    # the port off the proxy URL to derive it. The legacy TELEPORT_CLUSTER
    # env var is intentionally NOT consulted here — in this codebase it
    # was historically used for the K8s cluster name (passed to
    # `tsh kube login`), which is a different concept.
    tsh_cluster = _proxy_to_cluster(s.teleport_proxy)

    login_cmd = [
        s.tsh_binary, "login",
        f"--proxy={s.teleport_proxy}",
        f"--auth={s.teleport_auth}",
        f"--user={s.teleport_user}",
        tsh_cluster,
    ]
    if s.teleport_insecure:
        login_cmd.append("--insecure")

    # tsh needs a real TTY to do password login — PIPE makes it bail with
    # "cannot perform password login without a terminal". When MFA is also
    # required, the cluster will prompt for a TOTP after the password; we
    # feed the OTP on a second line so the user only types it once in the
    # browser.
    feed_lines: list[bytes] = [password.encode("utf-8")]
    if otp:
        feed_lines.append(otp.encode("ascii"))
    # Without an OTP we may be staring at a TOTP prompt — don't hold the
    # browser for the full minute; fail fast into a clear "mfa_required".
    run_timeout = timeout if otp else min(timeout, 20.0)
    rc, out, err = await _run_with_pty(login_cmd, feed_lines, timeout=run_timeout)
    if rc != 0:
        log.warning("tsh.login.failed", rc=rc, stderr=err.strip())
        if _is_mfa_prompt(f"{out}\n{err}"):
            if otp:
                return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                                   kube_clusters=[], code="bad_otp",
                                   message="一次性码错误或已过期，请重试")
            return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                               kube_clusters=[], code="mfa_required",
                               message="该集群要求 MFA，请输入一次性码后重新登录")
        return LoginResult(False, s.teleport_proxy, s.teleport_user, s.teleport_cluster,
                           kube_clusters=[], code="failed",
                           message=f"tsh login failed: {err.strip() or out.strip() or 'timeout'}")

    # After auth, list the K8s clusters the user has access to so the UI
    # can show a dropdown. Best-effort: if listing fails (older tsh, proxy
    # doesn't expose it), we still consider login successful.
    kube_clusters = await list_kube_clusters(timeout=min(15.0, timeout))

    log.info("tsh.login.ok", user=s.teleport_user,
             tsh_cluster=tsh_cluster, kube_clusters=kube_clusters)
    return LoginResult(True, s.teleport_proxy, s.teleport_user, tsh_cluster,
                       kube_clusters=kube_clusters,
                       message="logged in")


async def list_kube_clusters(*, timeout: float = 15.0) -> list[str]:
    """Return the K8s cluster names `tsh kube ls -f json` reports for the
    current tsh session. Empty list on any failure — callers should treat
    listing failure as "unknown" rather than a hard error.
    """
    s = get_settings()
    if not tsh_available(s.tsh_binary):
        return []
    rc, out, err = await _run(
        [s.tsh_binary, "kube", "ls", "-f", "json"],
        timeout=timeout,
    )
    if rc != 0:
        log.warning("tsh.kube.ls.failed", rc=rc, stderr=err.strip())
        return []
    # tsh kube ls -f json emits a JSON array; tolerate trailing junk by
    # scanning from the first '[' to the matching ']'.
    start = out.find("[")
    end = out.rfind("]")
    if start < 0 or end < 0 or end <= start:
        return []
    try:
        import json
        rows = json.loads(out[start:end + 1])
    except Exception as e:
        log.warning("tsh.kube.ls.parse_failed", error=str(e))
        return []
    names: list[str] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        # Teleport 18 emits `kube_cluster_name` (the K8s cluster) and
        # `cluster_name` (the Teleport cluster). Both have appeared across
        # versions — prefer the K8s one when present.
        name = row.get("kube_cluster_name") or row.get("name") or row.get("cluster_name")
        if isinstance(name, str) and name:
            names.append(name)
    return names


# Resources we probe for the empty-state UX. `nodes` and `persistentvolumes`
# are the common ones Teleport roles forget to grant — they look like
# "no data" from the dashboard but are actually RBAC denials.
_RBAC_PROBES: tuple[tuple[str, str], ...] = (
    ("pods", "list"),
    ("nodes", "list"),
    ("namespaces", "list"),
    ("events", "list"),
    ("services", "list"),
    ("persistentvolumes", "list"),
)


async def probe_rbac(*, timeout: float = 15.0) -> dict[str, bool]:
    """For each common K8s resource, ask `kubectl auth can-i <verb>` and
    return whether the current Teleport role allows it. Lets the frontend
    distinguish "no data because RBAC denied" from "no data because the
    cluster is genuinely empty" without leaking Teleport internals.

    Ponytail: previous version did 6 sequential subprocess calls (~1.2-3s
    blocking the event loop). Now all 6 fire in parallel via
    `asyncio.gather`; each individual probe runs in the default threadpool
    via `run_in_threadpool` so the event loop stays free. Worst case is
    now max(single probe) ≈ 200-500ms.
    """
    import asyncio
    from fastapi.concurrency import run_in_threadpool

    s = get_settings()
    if not tsh_available("kubectl"):
        return {res: True for res, _ in _RBAC_PROBES}

    kubeconfig = (
        s.kubeconfig_path
        or os.environ.get("KUBECONFIG")
        or str(Path.home() / "teleport-kubeconfig.yaml")
    )
    if not Path(kubeconfig).exists():
        return {res: False for res, _ in _RBAC_PROBES}

    def run_kubectl(resource: str, verb: str) -> bool:
        """Sync probe — runs in the threadpool."""
        import subprocess
        try:
            r = subprocess.run(
                ["kubectl", "auth", "can-i", verb, resource,
                 f"--kubeconfig={kubeconfig}"],
                capture_output=True, text=True, timeout=4.0,
            )
        except Exception:
            return False
        # `kubectl auth can-i` prints "yes" or "no" plus optional warning text
        # on stderr. Treat "yes" anywhere in stdout's first line as allowed.
        return r.returncode == 0 and "yes" in r.stdout.lower().split("\n")[0]

    async def probe_one(resource: str, verb: str) -> bool:
        try:
            return await asyncio.wait_for(
                run_in_threadpool(run_kubectl, resource, verb),
                timeout=5.0,
            )
        except asyncio.TimeoutError:
            return False

    pairs = await asyncio.gather(*(probe_one(r, v) for r, v in _RBAC_PROBES))
    return dict(zip([r for r, _ in _RBAC_PROBES], pairs))


async def kube_login(cluster: str, *,
                     kubeconfig_path: Optional[Path] = None,
                     timeout: float = 60.0) -> KubeLoginResult:
    """Run `tsh kube login <cluster>` against the existing tsh session and
    reload the in-process kubeconfig so the next K8s request sees fresh creds.

    `kubeconfig_path` defaults to `~/teleport-kubeconfig.yaml` (matching the
    user-supplied flow), or `KUBECONFIG_PATH` from settings, or finally
    `~/.kube/config`. The directory is auto-created.

    We also set the process-wide `KUBECONFIG` env var to that path so the
    K8s client pool's `_resolve_path()` picks it up — without this the
    pool would keep reading whatever kubeconfig it had at startup and
    the user wouldn't see any of the freshly-issued Teleport creds.
    """
    s = get_settings()
    target_kubeconfig = Path(
        kubeconfig_path
        or s.kubeconfig_path
        or (Path.home() / "teleport-kubeconfig.yaml")
    ).resolve()
    target_kubeconfig.parent.mkdir(parents=True, exist_ok=True)
    kubeconfig_env = {"KUBECONFIG": str(target_kubeconfig)}

    rc, _, err = await _run(
        [s.tsh_binary, "kube", "login", cluster],
        env=kubeconfig_env,
        timeout=timeout,
    )
    if rc != 0:
        log.warning("tsh.kube.login.failed", rc=rc, stderr=err.strip())
        return KubeLoginResult(False, cluster,
                               message=f"tsh kube login failed: {err.strip()}")

    # Make the K8s pool read this file. Setting KUBECONFIG in the current
    # process is what `_resolve_path()` consults as its fallback.
    os.environ["KUBECONFIG"] = str(target_kubeconfig)
    try:
        get_pool().reload()
    except Exception as e:
        log.warning("pool.reload.failed", error=str(e))
    # Drop every cached K8s snapshot — otherwise the UI keeps showing the
    # previous cluster's pods/nodes/events for up to a full TTL window.
    invalidate_all()

    log.info("tsh.kube.login.ok", cluster=cluster,
             kubeconfig=str(target_kubeconfig))
    return KubeLoginResult(True, cluster, message="kube credentials refreshed")


async def startup_login_if_configured() -> LoginResult | None:
    """Run at app startup if `TELEPORT_AUTOLOGIN_PASSWORD` is provided.

    Lets operators run unattended deployments in a container orchestrator that
    injects the password as an env var (Vault Agent, sealed secrets, etc.).

    Only runs the auth step (`tsh login`). Kube creds are not fetched here;
    unattended deployments usually target a single cluster, set via
    `TELEPORT_AUTOLOGIN_CLUSTER` and passed to `kube_login` below.
    """
    s = get_settings()
    if not s.teleport_configured:
        return None
    password = os.environ.get("TELEPORT_AUTOLOGIN_PASSWORD")
    if not password:
        return None
    result = await login(password)
    cluster = os.environ.get("TELEPORT_AUTOLOGIN_CLUSTER") or s.teleport_cluster
    if result.ok and cluster:
        await kube_login(cluster)
    return result