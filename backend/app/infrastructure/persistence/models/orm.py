from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Integer, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class FavoriteRow(Base):
    __tablename__ = "favorites"

    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True, autoincrement=True)
    resource_type: Mapped[str] = mapped_column(String(32), index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    namespace: Mapped[str] = mapped_column(String(255), default="", index=True)
    cluster: Mapped[str] = mapped_column(String(255), default="", index=True)
    note: Mapped[str] = mapped_column(String(512), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class AIProviderRow(Base):
    __tablename__ = "ai_providers"

    id: Mapped[Optional[int]] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), index=True)
    provider: Mapped[str] = mapped_column(String(32))
    model: Mapped[str] = mapped_column(String(128))
    api_key: Mapped[str] = mapped_column(String(512))
    api_base: Mapped[Optional[str]] = mapped_column(String(255), default=None)
    temperature: Mapped[float] = mapped_column(default=0.2)
    max_tokens: Mapped[int] = mapped_column(default=1024)
    is_default: Mapped[bool] = mapped_column(default=False, index=True)
    enabled: Mapped[bool] = mapped_column(default=True)
    extra_json: Mapped[Optional[str]] = mapped_column(String(1024), default=None)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
