"""GET /clusters with an unusable kubeconfig is a 503, not a 500.

Found by API fuzzing: an empty kubeconfig (KUBECONFIG=/dev/null) made
`pool.list_contexts` raise a raw kubernetes ConfigException that surfaced
as a bare 500. An unusable dependency is unavailability, not a server bug.
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from kubernetes.config import ConfigException

from app.interface.api.v1.dependencies import cluster_uc
from app.main import app


class _BrokenClusterUc:
    async def list_clusters(self):
        raise ConfigException("Invalid kube-config. /dev/null file is empty")


@pytest.fixture
def client():
    app.dependency_overrides[cluster_uc] = lambda: _BrokenClusterUc()
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_invalid_kubeconfig_is_a_503_not_a_500(client):
    r = client.get("/api/v1/clusters")
    assert r.status_code == 503
    assert "kubeconfig" in r.json()["detail"]
