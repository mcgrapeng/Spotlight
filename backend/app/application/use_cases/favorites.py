"""Favorite use cases (CRUD over persistence port). Async-native."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException

from app.application.dto import FavoriteDTO
from app.application.ports.outbound import FavoriteRepositoryPort
from app.domain.entities.ai import Favorite


class FavoriteUseCases:
    def __init__(self, repo: FavoriteRepositoryPort):
        self._repo = repo

    async def list(self) -> list[FavoriteDTO]:
        rows = await self._repo.list()
        now = datetime.now(timezone.utc)
        return [
            FavoriteDTO(
                id=r.id or 0, resource_type=r.resource_type, name=r.name,
                namespace=r.namespace, cluster=r.cluster, note=r.note,
                created_at=r.created_at or now,
            )
            for r in rows
        ]

    async def add(self, payload: dict) -> FavoriteDTO:
        rt = payload["resource_type"]
        if rt not in ("pod", "node", "namespace"):
            raise ValueError(f"invalid resource_type: {rt}")
        fav = Favorite(
            id=None,
            resource_type=rt,  # type: ignore[arg-type]
            name=payload["name"],
            namespace=payload.get("namespace", ""),
            cluster=payload.get("cluster", ""),
            note=payload.get("note", ""),
        )
        fav.validate()
        saved = await self._repo.add(fav)
        return FavoriteDTO(
            id=saved.id or 0, resource_type=saved.resource_type, name=saved.name,
            namespace=saved.namespace, cluster=saved.cluster, note=saved.note,
            created_at=saved.created_at or datetime.now(timezone.utc),
        )

    async def remove(self, fav_id: int) -> None:
        ok = await self._repo.remove(fav_id)
        if not ok:
            raise HTTPException(status_code=404, detail="favorite not found")
