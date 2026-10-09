"""Teleport 插件：每个登录会话一个独立 tsh 状态（`$TELEPORT_HOME` + `$KUBECONFIG`）。

设计要点：
- 凭证完全 per-session：会话目录 0700，TELEPORT_HOME/KUBECONFIG 都指向会话
  目录的子路径；不同会话之间互不污染，K8s 客户端池按 session_dir 加载。
- 复用原 `teleport.py` 的子进程/PTY 工程：`_run_with_pty` 带 shield 排水、
  MFA 提示快速失败（无 OTP 时 20s、有 OTP 时 60s）、OTM 输出分类。
- `probe_rbac` 与 Teleport 无关，迁到 `rbac.py`。
- 启动期自动登录（`startup_login_if_configured`）退役：会话驱动后由前端
  `/auth/login` + `create_session` 接管。
"""
from __future__ import annotations

import asyncio
import os
import pty
import shutil
from pathlib import Path
from typing import Mapping

from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger
from app.infrastructure.auth.plugins.base import (
    AuthError,
    FormField,
    Identity,
    Kubeconfig,
)

log = get_logger("auth.teleport")


# ── 二进制检测 ──────────────────────────────────────────────────────────


def tsh_available(binary: str = "tsh") -> bool:
    return shutil.which(binary) is not None


# ── 子进程 + PTY 工具（自 teleport.py 原样迁入） ─────────────────────────


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
    from urllib.parse import urlparse
    parsed = urlparse(proxy if "://" in proxy else f"//{proxy}")
    host = parsed.hostname
    if host:
        return host
    return proxy.split(":")[0]


# ── 迁移后的私有辅助 ────────────────────────────────────────────────────


async def _list_kube_clusters(env: dict[str, str]) -> list[str]:
    """Return the K8s cluster names `tsh kube ls -f json` reports for the
    current tsh session. Empty list on any failure — callers should treat
    listing failure as "unknown" rather than a hard error.

    `env` injects the per-session `TELEPORT_HOME` + `KUBECONFIG` so this
    reads the calling session's tsh state, not whatever's on the host.
    """
    s = get_settings()
    if not tsh_available(s.tsh_binary):
        return []
    rc, out, err = await _run(
        [s.tsh_binary, "kube", "ls", "-f", "json"],
        env=env,
        timeout=15.0,
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


def _current_context(session_dir: Path) -> str | None:
    """Read `current-context` from the per-session kubeconfig. Returns
    `None` if the file is missing or unparseable — caller falls back to
    the cluster name the user asked for.
    """
    path = session_dir / "kubeconfig.yaml"
    if not path.exists():
        return None
    try:
        from kubernetes import config as _kconfig
        _, active = _kconfig.list_kube_config_contexts(config_file=str(path))
    except Exception:
        return None
    if isinstance(active, dict):
        name = active.get("name")
        return name if isinstance(name, str) and name else None
    return None


# ── 插件主体 ────────────────────────────────────────────────────────────


class TeleportPlugin:
    id = "teleport"
    label = "Teleport"

    def form_fields(self) -> list[FormField]:
        return [
            FormField(name="password", label="密码", type="password"),
            FormField(name="otp", label="MFA 一次性码（6 位 TOTP）", type="otp", required=False),
        ]

    @staticmethod
    def _env(session_dir: Path) -> dict[str, str]:
        return {
            "TELEPORT_HOME": str(session_dir / "tsh"),
            "KUBECONFIG": str(session_dir / "kubeconfig.yaml"),
        }

    async def login(self, username: str, fields: Mapping[str, str], session_dir: Path) -> Identity:
        s = get_settings()
        if not s.teleport_proxy:
            raise AuthError("unavailable", "服务端未配置 Teleport")
        if not tsh_available(s.tsh_binary):
            raise AuthError("unavailable", f"'{s.tsh_binary}' 不在 PATH")
        password = fields.get("password", "")
        otp = fields.get("otp", "")
        if not password:
            raise AuthError("invalid_credentials", "用户名或密码错误")
        cmd = [s.tsh_binary, "login", f"--proxy={s.teleport_proxy}",
               f"--auth={s.teleport_auth}", f"--user={username}",
               _proxy_to_cluster(s.teleport_proxy)]
        if s.teleport_insecure:
            cmd.append("--insecure")
        lines = [password.encode("utf-8")] + ([otp.encode("ascii")] if otp else [])
        run_timeout = 60.0 if otp else 20.0          # 无 OTP：MFA 提示前快速失败
        rc, out, err = await _run_with_pty(cmd, lines, env=self._env(session_dir), timeout=run_timeout)
        if rc != 0:
            if _is_mfa_prompt(f"{out}\n{err}"):
                if otp:
                    raise AuthError("bad_otp", "一次性码错误或已过期，请重试")
                raise AuthError("mfa_required", "该集群要求 MFA，请输入一次性码后重新登录")
            log.warning("tsh.login.failed", rc=rc, stderr=err.strip())
            raise AuthError("invalid_credentials", "用户名或密码错误")
        return Identity(username=username, extra={"proxy": s.teleport_proxy})

    async def list_clusters(self, identity: Identity, session_dir: Path) -> list[str]:
        return await _list_kube_clusters(self._env(session_dir))

    async def acquire(self, identity: Identity, cluster: str, session_dir: Path) -> Kubeconfig:
        s = get_settings()
        rc, _out, err = await _run_with_pty(
            [s.tsh_binary, "kube", "login", cluster], [],
            env=self._env(session_dir), timeout=30.0)
        if rc != 0:
            log.warning("tsh.kube.login.failed", rc=rc, stderr=err.strip())
            raise AuthError("invalid_credentials", "kube login 失败，请重新登录后再试")
        path = session_dir / "kubeconfig.yaml"
        return Kubeconfig(yaml=path.read_bytes(), context=_current_context(session_dir) or cluster)

    async def logout(self, identity: Identity, session_dir: Path) -> None:
        s = get_settings()
        try:
            await _run_with_pty([s.tsh_binary, "logout"], [], env=self._env(session_dir), timeout=10.0)
        except Exception:
            pass
