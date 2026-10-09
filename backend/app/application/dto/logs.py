"""Log DTOs. `LogStreamParams` is the renamed `LogLineOut` so the domain
type no longer leaks "Line/Out" naming from the HTTP layer."""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict


class LogStreamParams(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    timestamp: str
    content: str
    container: str
    severity: str = "unknown"


class LogHistoryOut(BaseModel):
    total: int
    items: list[LogStreamParams]