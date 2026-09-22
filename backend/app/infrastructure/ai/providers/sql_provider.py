"""SQLAlchemy persistence for AIProviderConfig."""
from __future__ import annotations

import json
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.ai import AIProviderConfig
from app.infrastructure.persistence.models.orm import AIProviderRow


class SQLAIProviderRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def list(self) -> list[AIProviderConfig]:
        result = await self._session.execute(
            select(AIProviderRow).order_by(AIProviderRow.is_default.desc(), AIProviderRow.created_at.asc())
        )
        return [self._to_entity(r) for r in result.scalars().all()]

    async def get(self, provider_id: int) -> AIProviderConfig | None:
        row = await self._session.get(AIProviderRow, provider_id)
        return self._to_entity(row) if row else None

    async def add(self, cfg: AIProviderConfig) -> AIProviderConfig:
        if cfg.is_default:
            await self._unset_defaults()
        row = self._from_entity(cfg)
        self._session.add(row)
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_entity(row)

    async def update(self, cfg: AIProviderConfig) -> AIProviderConfig:
        if cfg.id is None:
            raise ValueError("update requires id")
        if cfg.is_default:
            await self._unset_defaults()
        row = await self._session.get(AIProviderRow, cfg.id)
        if not row:
            raise LookupError(f"ai provider {cfg.id} not found")
        row.name = cfg.name
        row.provider = cfg.provider
        row.model = cfg.model
        row.api_key = cfg.api_key
        row.api_base = cfg.api_base
        row.temperature = cfg.temperature
        row.max_tokens = cfg.max_tokens
        row.is_default = cfg.is_default
        row.enabled = cfg.enabled
        row.extra_json = json.dumps(cfg.extra) if cfg.extra else None
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_entity(row)

    async def remove(self, provider_id: int) -> bool:
        row = await self._session.get(AIProviderRow, provider_id)
        if row is None:
            return False
        await self._session.delete(row)
        await self._session.commit()
        return True

    async def set_default(self, provider_id: int) -> AIProviderConfig:
        await self._unset_defaults()
        row = await self._session.get(AIProviderRow, provider_id)
        if not row:
            raise LookupError(f"ai provider {provider_id} not found")
        row.is_default = True
        await self._session.commit()
        await self._session.refresh(row)
        return self._to_entity(row)

    async def _unset_defaults(self) -> None:
        rows = (await self._session.execute(
            select(AIProviderRow).where(AIProviderRow.is_default.is_(True))
        )).scalars().all()
        for r in rows:
            r.is_default = False

    @staticmethod
    def _to_entity(row: AIProviderRow) -> AIProviderConfig:
        extra: dict[str, str] = {}
        if row.extra_json:
            try:
                extra = json.loads(row.extra_json)
            except json.JSONDecodeError:
                extra = {}
        return AIProviderConfig(
            id=row.id, name=row.name, provider=row.provider, model=row.model,
            api_key=row.api_key, api_base=row.api_base,
            temperature=row.temperature, max_tokens=row.max_tokens,
            is_default=row.is_default, enabled=row.enabled, extra=extra,
        )

    @staticmethod
    def _from_entity(cfg: AIProviderConfig) -> AIProviderRow:
        return AIProviderRow(
            name=cfg.name, provider=cfg.provider, model=cfg.model,
            api_key=cfg.api_key, api_base=cfg.api_base,
            temperature=cfg.temperature, max_tokens=cfg.max_tokens,
            is_default=cfg.is_default, enabled=cfg.enabled,
            extra_json=json.dumps(cfg.extra) if cfg.extra else None,
        )
