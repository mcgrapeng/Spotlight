"""AuthPlugin 契约：认证 + 集群凭证产出。K8s 访问层只认 kubeconfig。"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Mapping, Protocol


@dataclass(frozen=True)
class FormField:
    name: str
    label: str
    type: str = "text"          # "text" | "password" | "otp"
    required: bool = True


@dataclass(frozen=True)
class Identity:
    username: str
    extra: dict[str, str] = field(default_factory=dict)


class AuthError(Exception):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code
        self.message = message


@dataclass(frozen=True)
class Kubeconfig:
    yaml: bytes
    context: str


class AuthPlugin(Protocol):
    id: str
    label: str

    def form_fields(self) -> list[FormField]: ...

    async def login(self, username: str, fields: Mapping[str, str], session_dir: Path) -> Identity: ...

    async def list_clusters(self, identity: Identity, session_dir: Path) -> list[str]: ...

    async def acquire(self, identity: Identity, cluster: str, session_dir: Path) -> Kubeconfig: ...

    async def logout(self, identity: Identity, session_dir: Path) -> None: ...
