"""静态令牌插件：脚本/单机通道。共享凭证（宿主 kubeconfig），天然不隔离。"""
from __future__ import annotations

from pathlib import Path
from typing import Mapping

from app.infrastructure.auth.plugins.base import FormField, Identity, Kubeconfig


class TokenPlugin:
    id = "token"
    label = "访问令牌"

    def form_fields(self) -> list[FormField]:
        return [FormField(name="token", label="访问令牌", type="password")]

    async def login(self, username: str, fields: Mapping[str, str], session_dir: Path) -> Identity:
        raise NotImplementedError

    async def list_clusters(self, identity: Identity, session_dir: Path) -> list[str]:
        raise NotImplementedError

    async def acquire(self, identity: Identity, cluster: str, session_dir: Path) -> Kubeconfig:
        raise NotImplementedError

    async def logout(self, identity: Identity, session_dir: Path) -> None:
        return None
