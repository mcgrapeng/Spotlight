"""AI provider + analyze DTOs."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


class AIProviderIn(BaseModel):
    name: str
    provider: str
    model: str
    api_key: str = ""
    api_base: Optional[str] = None
    temperature: float = 0.2
    max_tokens: int = 1024
    is_default: bool = False
    enabled: bool = True
    extra: dict[str, str] = Field(default_factory=dict)


class AIProviderOut(BaseModel):
    id: int
    name: str
    provider: str
    model: str
    api_base: Optional[str] = None
    temperature: float
    max_tokens: int
    is_default: bool
    enabled: bool
    extra: dict[str, str] = Field(default_factory=dict)
    api_key_masked: str  # never expose the secret back to UI


class AIAnalyzeIn(BaseModel):
    provider_id: int
    question: str = "请分析这些日志的根因、异常点和建议"
    log_lines: list[str] = Field(default_factory=list, max_length=2000)


class AIAnalyzeOut(BaseModel):
    answer: str
    model: str
    latency_ms: int
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None