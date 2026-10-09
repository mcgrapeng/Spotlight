"""K8s RBAC 探测：与 Teleport 无关，迁自旧 `teleport.py` 顶替。"""
from __future__ import annotations

import asyncio
import os
from pathlib import Path

from fastapi.concurrency import run_in_threadpool

from app.infrastructure.logging import get_logger

log = get_logger("auth.rbac")


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


async def probe_rbac(kubeconfig_path: str | None,
                     *, timeout: float = 15.0) -> dict[str, bool]:
    """For each common K8s resource, ask `kubectl auth can-i <verb>` and
    return whether the current Teleport role allows it. Lets the frontend
    distinguish "no data because RBAC denied" from "no data because the
    cluster is genuinely empty" without leaking Teleport internals.

    `kubeconfig_path` is the per-session kubeconfig written by
    `TeleportPlugin.acquire()`. We feed it to kubectl via `--kubeconfig=`
    so the probe never reads the host's kubeconfig by accident.

    Ponytail: previous version did 6 sequential subprocess calls (~1.2-3s
    blocking the event loop). Now all 6 fire in parallel via
    `asyncio.gather`; each individual probe runs in the default threadpool
    via `run_in_threadpool` so the event loop stays free. Worst case is
    now max(single probe) ≈ 200-500ms.
    """
    import shutil
    import subprocess

    if not shutil.which("kubectl"):
        return {res: True for res, _ in _RBAC_PROBES}

    kubeconfig = (
        kubeconfig_path
        or os.environ.get("KUBECONFIG")
        or str(Path.home() / "teleport-kubeconfig.yaml")
    )
    if not Path(kubeconfig).exists():
        return {res: False for res, _ in _RBAC_PROBES}

    def run_kubectl(resource: str, verb: str) -> bool:
        """Sync probe — runs in the threadpool."""
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
