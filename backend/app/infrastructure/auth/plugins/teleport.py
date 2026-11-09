"""Teleport 插件：每个登录会话一个独立 tsh 状态（`$TELEPORT_HOME` + `$KUBECONFIG`）。

设计要点：
- 凭证完全 per-session：会话目录 0700，TELEPORT_HOME/KUBECONFIG 都指向会话
  目录的子路径；不同会话之间互不污染，K8s 客户端池按 session_dir 加载。
- 复用原 `teleport.py` 的子进程/PTY 工程：`_run_with_pty` 带超时排水、
  MFA 提示快速失败（无 OTP 时 20s、有 OTP 时 60s）、OTM 输出分类。
- RBAC 探测与 Teleport 无关，且所有用户都是开发者、看到相同页面，需求上不需要，
  随旧 `rbac.py` 一并删除。
- 启动期自动登录（`startup_login_if_configured`）退役：会话驱动后由前端
  `/auth/login` + `create_session` 接管。
"""
from __future__ import annotations

import asyncio
import os
import pty
import re
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

#: How long `tsh login` may take. With a one-time code in hand it has to wait
#: for a human to type it, so it gets the long budget; without one it gets the
#: short one, because the only thing it is waiting for is an MFA prompt the
#: user cannot answer yet.
_LOGIN_TIMEOUT = 60.0
_MFA_FAIL_FAST_TIMEOUT = 20.0


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


def _is_mfa_prompt(text: str) -> bool:
    """True when tsh stopped to ask for an MFA/TOTP code."""
    low = text.lower()
    return any(k in low for k in ("otp", "mfa", "two-factor", "2fa", "totp"))


_ANSI = re.compile(r"\x1b\[[0-9;]*m")


def _tsh_error(text: str) -> str:
    """The ERROR line tsh printed, if any.

    tsh prints its OTP prompt before it resolves the target cluster, so a
    failed login can contain "Enter an OTP code" AND then fail for an
    unrelated reason. The error line is the only trustworthy signal:
    classifying by the presence of an MFA prompt mislabels every failure as
    "wrong one-time code".
    """
    for line in reversed(text.splitlines()):
        stripped = _ANSI.sub("", line).strip()
        if "ERROR:" in stripped:
            return stripped.split("ERROR:", 1)[1].strip()
    return ""


def _is_otp_rejected(text: str) -> bool:
    """True when tsh's error says the one-time code itself was refused."""
    low = text.lower()
    return bool(
        re.search(r"(invalid|incorrect|wrong|expired|already used)[^\n]{0,40}"
                  r"(otp|one[- ]?time|code|token)", low)
        or re.search(r"(otp|one[- ]?time|code|token)[^\n]{0,40}"
                     r"(invalid|incorrect|wrong|expired)", low)
    )


# tsh asks for the one-time code with wording that varies by release
# ("Enter an OTP code", "Enter your one-time password (OTP)"). Match the code
# wording only — a bare "MFA" also shows up in "MFA required" notices that
# print BEFORE the password prompt, and matching those would push the code
# into the password slot.
_OTP_PROMPT_RE = re.compile(
    r"\b(otp|totp|one[\s-]?time)\b"
    r"|\b(mfa|2fa)\b[^\n]{0,40}\b(code|token)\b",
    re.I,
)


def _write_line(fd: int, line: bytes) -> bool:
    """Write one line to the PTY master. False when the child is already gone.

    A child that exits before we write leaves the PTY slave closed, and the
    write raises EIO. That is routine, not exceptional: the caller's exit-code
    handling decides the answer, and letting the OSError escape would skip the
    output drain and surface as a 500 instead of "wrong code".
    """
    try:
        os.write(fd, line + b"\n")
        return True
    except OSError:
        return False


async def _run_with_pty(cmd: list[str], lines: list[bytes], *,
                        env: dict[str, str] | None = None,
                        timeout: float = 60.0) -> tuple[int, str, str]:
    """Like `_run`, but connects the child's stdin to a real PTY and feeds
    input lines through the master fd.

    `tsh login --auth=local` checks `isatty(stdin)` and bails on a plain pipe
    with "cannot perform password login without a terminal". Attaching a PTY
    slave as the child's stdin makes `isatty(0)` true from its POV.

    The first line (the password) is written right away. Any later line (the
    one-time code) is written only once the child actually asks for a code.
    Feeding it blind on a timer races the prompt: the bytes can arrive before
    the prompt exists, and a prompt that discards typeahead then consumes the
    code as the password — which surfaces as a mysterious "wrong code".

    The master fd stays open for the lifetime of the child: closing it early
    races the child's read() — by the time tsh drains the buffer and reaches
    its next stdin read, the slave may already have hit HUP.

    Returns (rc, stdout, stderr).
    """
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

        out: list[str] = []
        err: list[str] = []

        async def _drain(stream: asyncio.StreamReader, sink: list[str]) -> None:
            while True:
                chunk = await stream.read(4096)
                if not chunk:
                    return
                sink.append(chunk.decode("utf-8", "replace"))

        out_task = asyncio.create_task(_drain(proc.stdout, out))
        err_task = asyncio.create_task(_drain(proc.stderr, err))

        deadline = loop.time() + timeout
        pending = list(lines)
        if pending:
            _write_line(master_fd, pending.pop(0))
        while pending:
            if loop.time() > deadline:
                break
            if _OTP_PROMPT_RE.search("".join(out) + "".join(err)):
                _write_line(master_fd, pending.pop(0))
                continue
            if proc.returncode is not None:
                # The child exited before asking for a code — no prompt will
                # ever come. Waiting out the whole timeout would stall a
                # plain wrong-password login for a full minute.
                break
            await asyncio.sleep(0.2)

        timed_out = False
        # `asyncio.wait` leaves what it waits on alone when the timeout
        # expires; `wait_for` cancels it. Re-gathering those cancelled tasks
        # raises CancelledError — a BaseException that escapes the login
        # handler and turns the MFA path into a 500.
        _done, still_running = await asyncio.wait(
            {out_task, err_task},
            timeout=max(0.5, deadline - loop.time()),
        )
        if still_running:
            timed_out = True
            proc.kill()
            # The child is dead now, so the drains reach EOF and finish on
            # their own. What they collected is what tells the caller why
            # the child never answered.
            await asyncio.wait(still_running, timeout=5)
        rc = await proc.wait()
        if timed_out:
            return (124, "".join(out), "".join(err) or "timeout")
        return (
            rc or 0,
            "".join(out),
            "".join(err),
        )
    finally:
        try:
            os.close(master_fd)
        except OSError:
            pass


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
        # Absolute paths on purpose: `tsh kube login` copies TELEPORT_HOME
        # into the kubeconfig's exec credential block, and the Kubernetes SDK
        # runs that exec with CWD = the kubeconfig's own directory. A relative
        # path resolves against the wrong directory, tsh finds no profile
        # ("Having problems with relogin"), and every API call answers 403.
        base = session_dir.resolve()
        return {
            "TELEPORT_HOME": str(base / "tsh"),
            "KUBECONFIG": str(base / "kubeconfig.yaml"),
            # The host's Teleport identity must not leak into a session login.
            # TELEPORT_KUBE_CLUSTER makes tsh log into that Kubernetes cluster
            # by name — the value people have exported is a kubeconfig
            # *context* name ("<proxy>-<cluster>"), not a registered cluster
            # name, so the login dies with "Kubernetes cluster ... is not
            # registered in this Teleport cluster". The session picks its
            # cluster explicitly (positional arg / `tsh kube login`).
            "TELEPORT_KUBE_CLUSTER": "",
            "TELEPORT_CLUSTER": "",
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
        # `tsh login <cluster>` wants the Teleport cluster name. Only fall back to
        # the proxy hostname when the operator did not name one explicitly —
        # on multi-cluster proxies the hostname is often not the cluster.
        cluster = s.teleport_cluster.strip() or _proxy_to_cluster(s.teleport_proxy)
        cmd = [s.tsh_binary, "login", f"--proxy={s.teleport_proxy}",
               f"--auth={s.teleport_auth}", f"--user={username}"]
        if otp:
            # preferred_local_mfa=webauthn proxies otherwise start a security-key
            # ceremony and the piped TOTP code is never consumed (surfaces as bad_otp).
            cmd.append("--mfa-mode=otp")
        cmd.append(cluster)
        if s.teleport_insecure:
            cmd.append("--insecure")
        lines = [password.encode("utf-8")] + ([otp.encode("ascii")] if otp else [])
        run_timeout = _LOGIN_TIMEOUT if otp else _MFA_FAIL_FAST_TIMEOUT
        rc, out, err = await _run_with_pty(cmd, lines, env=self._env(session_dir), timeout=run_timeout)
        if rc != 0:
            # Log what tsh actually said: "bad code" and "we never got a code
            # into the prompt" look identical from the outside.
            log.warning("tsh.login.rejected", rc=rc,
                        stdout=out.strip()[:400], stderr=err.strip()[:400])
            text = f"{out}\n{err}"
            error = _tsh_error(text)
            if error and not _is_otp_rejected(error):
                # A real tsh failure (unknown cluster, TLS problem, …) — do
                # not blame the one-time code for it.
                raise AuthError("invalid_credentials", f"登录失败：{error}")
            if _is_mfa_prompt(text):
                if otp:
                    raise AuthError("bad_otp", "一次性码错误或已过期，请重试")
                raise AuthError("mfa_required", "该集群要求 MFA，请输入一次性码后重新登录")
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
