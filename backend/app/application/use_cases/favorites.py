"""Favorite use cases (CRUD over persistence port). Async-native."""
from __future__ import annotations

from fastapi import HTTPException

from app.application.dto import FavoriteOut
from app.application.ports.outbound import FavoriteRepositoryPort
from app.domain.entities.ai import Favorite


class FavoriteUseCases:
    def __init__(self, repo: FavoriteRepositoryPort):
        self._repo = repo

    async def list(self) -> list[FavoriteOut]:
        return [FavoriteOut.model_validate(r) for r in await self._repo.list()]

    async def add(self, payload: dict) -> FavoriteOut:
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
        return FavoriteOut.model_validate(await self._repo.add(fav))

    async def remove(self, fav_id: int) -> None:
        ok = await self._repo.remove(fav_id)
        if not ok:
            raise HTTPException(status_code=404, detail="favorite not found")