"""Favorite DTOs."""
from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


class FavoriteCreate(BaseModel):
    resource_type: Literal["pod", "node", "namespace"]
    name: str
    namespace: str = ""
    cluster: str = ""
    note: str = ""


class FavoriteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    resource_type: Literal["pod", "node", "namespace"]
    name: str
    namespace: str
    cluster: str
    note: str
    created_at: Optional[datetime] = None