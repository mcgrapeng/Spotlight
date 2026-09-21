from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Any

from kubernetes import client, config
from kubernetes.client import ApiClient, CoreV1Api

from app.config import get_settings
from app.core.logging import get_logger

log = get_logger(__name__)


class K8sManager:
    """复用 kubernetes-python-client，按 cluster context 缓存 ApiClient 实例。

    kubeconfig 来自 tsh kube login 写入的 ~/.kube/config 或 KUBECONFIG_PATH。
    """

    def __init__(self) -> None:
        self._clients: dict[str, ApiClient] = {}
        self._configs: list[dict[str, Any]] = []

    def _load_kubeconfig(self) -> None:
        path = get_settings().kubeconfig_path or os.environ.get("KUBECONFIG")
        if path and os.path.exists(path):
            config.load_kube_config(config_file=path)
        else:
            try:
                config.load_kube_config()
            except config.ConfigException:
                config.load_incluster_config()

        contexts, _ = config.list_kube_config_contexts()
        self._configs = [
            {
                "name": c.get("name", ""),
                "cluster": (c.get("context", {}) or {}).get("cluster", ""),
                "user": (c.get("context", {}) or {}).get("user", ""),
                "namespace": (c.get("context", {}) or {}).get("namespace", "default"),
                "is_current": c.get("name") == config.list_kube_config_contexts()[1].get("name", ""),
            }
            for c in contexts
        ]

    @property
    def contexts(self) -> list[dict[str, Any]]:
        if not self._configs:
            self._load_kubeconfig()
        return self._configs

    def get_api(self, context: str | None = None) -> tuple[CoreV1Api, str]:
        """获取 CoreV1Api 实例与当前上下文名。

        切换上下文通过修改 KUBECONFIG 环境变量并重置 ApiClient 池实现。
        """
        if context:
            config.load_kube_config(context=context)
            self._clients.pop(context, None)

        key = context or "default"
        if key not in self._clients:
            api_client = client.ApiClient()
            self._clients[key] = api_client
            log.info("K8s client created for context=%s", key)

        return CoreV1Api(self._clients[key]), key

    def current_context(self) -> str:
        _, current = config.list_kube_config_contexts()
        return current.get("name", "") if current else ""


_manager: K8sManager | None = None


def get_manager() -> K8sManager:
    global _manager
    if _manager is None:
        _manager = K8sManager()
        _manager._load_kubeconfig()
    return _manager


@contextmanager
def k8s_api(context: str | None = None):
    api, _ = get_manager().get_api(context)
    yield api
