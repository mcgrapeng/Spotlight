"""Pod use cases."""
from __future__ import annotations

from app.application.dto import PodListOut, PodOut
from app.application.ports.outbound import K8sRepositoryPort
from app.domain.value_objects.primitives import LabelSelector, ResourceRef


class PodUseCases:
    def __init__(self, repo: K8sRepositoryPort) -> None:
        self._repo = repo

    async def list_pods(
        self, cluster: str | None, namespace: str | None,
        status: str | None, search: str | None, label_selector: str | None,
    ) -> PodListOut:
        selector = LabelSelector.parse(label_selector)
        pods = await self._repo.list_pods(cluster, namespace, selector, search, status)
        items = sorted(
            (PodOut.model_validate(p) for p in pods),
            key=lambda p: (p.namespace, p.name),
        )
        return PodListOut(total=len(items), items=items)

    async def get_pod(self, ref: ResourceRef) -> PodOut:
        return PodOut.model_validate(await self._repo.get_pod(ref))