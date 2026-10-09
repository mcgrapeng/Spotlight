"""静态令牌插件：脚本/单机通道。共享凭证（宿主 kubeconfig），天然不隔离。"""
from __future__ import annotations

from pathlib import Path
from typing import Mapping

from app.infrastructure.auth.plugins.base import AuthError, FormField, Identity, Kubeconfig


class TokenPlugin:
    id = "token"
    label = "访问令牌"

    def form_fields(self) -> list[FormField]:
        return [FormField(name="token", label="访问令牌", type="password")]

    async def login(self, username: str, fields: Mapping[str, str], session_dir: Path) -> Identity:
        import secrets as _secrets
        from app.infrastructure.config.settings import get_settings
        expected = get_settings().api_token
        if not expected:
            raise AuthError("unavailable", "服务端未配置访问令牌")
        if not _secrets.compare_digest(fields.get("token", ""), expected):
            raise AuthError("invalid_credentials", "用户名或密码错误")
        return Identity(username=username)

    async def list_clusters(self, identity: Identity, session_dir: Path) -> list[str]:
        from app.infrastructure.k8s.client import kubeconfig_reader as kr
        return kr.list_context_names(self._host_kubeconfig())

    async def acquire(self, identity: Identity, cluster: str, session_dir: Path) -> Kubeconfig:
        path = self._host_kubeconfig()
        return Kubeconfig(yaml=path.read_bytes(), context=cluster)

    @staticmethod
    def _host_kubeconfig() -> Path:
        import os
        from app.infrastructure.config.settings import get_settings
        s = get_settings()
        p = Path(s.kubeconfig_path or os.environ.get("KUBECONFIG") or Path.home() / ".kube" / "config")
        if not p.exists():
            raise AuthError("unavailable", "服务端 kubeconfig 不可用")
        return p

    async def logout(self, identity: Identity, session_dir: Path) -> None:
        return None
