"""Event DTO."""
from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, ConfigDict


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    name: str
    namespace: str
    type: str
    reason: str
    message: str
    involved_kind: str
    involved_name: str
    count: int = 0
    first_seen: Optional[str] = None
    last_seen: Optional[str] = None