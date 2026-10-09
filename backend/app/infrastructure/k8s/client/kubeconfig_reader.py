"""kubeconfig 只读工具：列 context 名。"""
from __future__ import annotations

from pathlib import Path

from kubernetes import config


def list_context_names(path: str | Path | None) -> list[str]:
    contexts, _ = config.list_kube_config_contexts(config_file=str(path) if path else None)
    return [c.get("name", "") for c in contexts if c.get("name")]
