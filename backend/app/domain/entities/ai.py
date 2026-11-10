from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal
from urllib.parse import urlparse

ResourceType = Literal["pod", "node", "namespace"]

# The one place plain HTTP is legitimate: a model server on this machine.
# Everything else has to be https://, because api_base decides where the
# provider's API key — and the cluster's log content — is posted.
_LOOPBACK_HOSTS = frozenset({"127.0.0.1", "localhost", "::1"})

# Ceiling for a single completion. Long enough for a log analysis, short
# enough that a typo cannot ask for a 1M-token bill.
MAX_TOKENS_CEILING = 8192


@dataclass(frozen=True, slots=True)
class Favorite:
    id: int | None
    resource_type: ResourceType
    name: str
    namespace: str
    cluster: str
    note: str
    #: The username that owns this favorite. Without it every user's
    #: favorites are everybody's — and anybody's can be deleted by id.
    owner: str = ""
    created_at: datetime | None = None

    def validate(self) -> None:
        if self.resource_type not in ("pod", "node", "namespace"):
            raise ValueError(f"invalid resource_type: {self.resource_type}")
        if not self.name:
            raise ValueError("name required")
        if self.resource_type == "pod" and not self.namespace:
            raise ValueError(f"namespace required for {self.resource_type}")


@dataclass(frozen=True, slots=True)
class AIProviderConfig:
    """Provider-agnostic LLM config; serialized into LiteLLM at runtime."""

    id: int | None
    name: str  # display name
    provider: str  # "openai" | "anthropic" | "azure" | "ollama" | "gemini" | ...
    model: str  # "gpt-4o-mini" | "claude-3-5-sonnet" | ...
    api_key: str  # stored as plaintext for now; rotate to secret store later
    api_base: str | None = None
    temperature: float = 0.2
    max_tokens: int = 1024
    is_default: bool = False
    enabled: bool = True
    extra: dict[str, str] = field(default_factory=dict)

    def validate(self) -> None:
        if not self.name:
            raise ValueError("name required")
        if not self.provider:
            raise ValueError("provider required")
        if not self.model:
            raise ValueError("model required")
        if self.provider != "ollama" and not self.api_key:
            raise ValueError("api_key required for non-ollama provider")
        if not 0 <= self.temperature <= 2:
            raise ValueError("temperature must be in [0,2]")
        if self.max_tokens <= 0:
            raise ValueError("max_tokens must be positive")
        if self.max_tokens > MAX_TOKENS_CEILING:
            raise ValueError(f"max_tokens must be at most {MAX_TOKENS_CEILING}")
        if self.api_base:
            _validate_api_base(self.api_base)
        if self.extra:
            _validate_extra(self.extra)


@dataclass(frozen=True, slots=True)
class AIAnalysisRequest:
    provider_id: int
    pod_ref: "ResourceRef"
    log_lines: list[str]
    question: str = "请分析这些日志的根因、异常点和建议"
    max_lines: int = 200
    # Set for a cluster-level question rather than a log excerpt. The
    # provider picks a different prompt for it: the pod prompt asks for a
    # root cause, the cluster prompt asks a question about the context.
    context: str = ""


@dataclass(frozen=True, slots=True)
class AIAnalysisResult:
    answer: str
    model: str
    input_tokens: int | None = None
    output_tokens: int | None = None
    latency_ms: int | None = None
    raw: dict = field(default_factory=dict)


@dataclass(frozen=True, slots=True)
class DashboardSnapshot:
    total_pods: int
    running: int
    pending: int
    failed: int
    succeeded: int
    warning_events: int
    nodes_total: int
    nodes_ready: int
    namespaces_count: int
    restart_top: tuple[tuple[str, int], ...]


# Avoid circular import at module load
from app.domain.value_objects.primitives import ResourceRef  # noqa: E402


def _validate_api_base(api_base: str) -> None:
    """Reject an api_base that would ship the API key over plain HTTP.

    The api_base is the address the provider's key and the cluster's log
    content are posted to. Plain HTTP to a remote host hands both to
    whoever is on the wire, so only a loopback address may skip TLS —
    that is how a local Ollama is reached.
    """
    parsed = urlparse(api_base)
    host = (parsed.hostname or "").lower()
    if not host:
        raise ValueError("api_base must be an absolute https:// URL")
    if parsed.scheme == "https":
        return
    if parsed.scheme == "http" and host in _LOOPBACK_HOSTS:
        return
    raise ValueError(
        "api_base must use https:// (http:// is allowed only for "
        "127.0.0.1, localhost or ::1)"
    )


# `extra` is merged into the call kwargs LAST, so a key here can override
# the validated fields above — `api_base` most of all: that is the address
# the API key and the cluster's log content go to. These keys are the
# provider's own settings, not passthrough.
_RESERVED_EXTRA_KEYS = (
    "api_base",
    "base_url",
    "api_key",
    "max_tokens",
    "temperature",
    "messages",
    "stream",
    # `model` 同样是目的地的一部分。LiteLLM 用 model 的 provider 前缀
    # 决定往哪儿发（"openai/gpt-4o" → 厂商的公开 API），所以一个
    # extra={"model": "openai/gpt-4o"} 就能绕过已校验的 api_base，
    # 把本该发到内网模型的内容发到厂商那边去 —— 而界面上那个地址
    # 仍然显示着内网地址。model 是 provider 自己的设置，不是透传项。
    "model",
    # The timeout is the guard that stops the server calling (and paying for)
    # a model long after the browser gave up. A passthrough may not set it
    # or widen it.
    "timeout",
)


def _validate_extra(extra: dict[str, str]) -> None:
    """Reject passthrough keys that would bypass a validated field."""
    for key in extra:
        if key in _RESERVED_EXTRA_KEYS:
            raise ValueError(f"extra must not contain '{key}'")
