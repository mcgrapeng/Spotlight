from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Literal

ResourceType = Literal["pod", "node", "namespace"]


@dataclass(frozen=True, slots=True)
class Favorite:
    id: int | None
    resource_type: ResourceType
    name: str
    namespace: str
    cluster: str
    note: str
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


@dataclass(frozen=True, slots=True)
class AIAnalysisRequest:
    provider_id: int
    pod_ref: "ResourceRef"
    log_lines: list[str]
    question: str = "请分析这些日志的根因、异常点和建议"
    max_lines: int = 200


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
