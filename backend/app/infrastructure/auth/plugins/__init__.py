"""插件注册表。新增跳板机 = 新建 adapter + 在 REGISTRY 注册一行。"""
from __future__ import annotations

from app.infrastructure.auth.plugins.base import AuthPlugin
from app.infrastructure.auth.plugins.teleport import TeleportPlugin
from app.infrastructure.auth.plugins.token import TokenPlugin

REGISTRY: dict[str, type] = {"token": TokenPlugin, "teleport": TeleportPlugin}


def create_plugin(provider_id: str) -> AuthPlugin:
    cls = REGISTRY.get(provider_id)
    if cls is None:
        raise ValueError(f"unknown auth provider: {provider_id!r}")
    return cls()


def active_plugin() -> AuthPlugin | None:
    from app.infrastructure.config.settings import get_settings
    pid = (get_settings().auth_provider or "").strip()
    return create_plugin(pid) if pid else None
