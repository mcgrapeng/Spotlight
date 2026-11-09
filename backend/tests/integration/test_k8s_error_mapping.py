"""A Kubernetes failure must not become a bare 500.

The list endpoints used to let `ApiException` escape: an RBAC denial, an
apiserver rate limit or a read timeout became `500 Internal Server Error`
with a plain-text body, and the frontend could only show its generic
"加载失败" — the user could not tell "I lack permission" from "the cluster
is down" from "we are being rate-limited".
"""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from kubernetes.client.exceptions import ApiException
from urllib3 import HTTPConnectionPool
from urllib3.exceptions import MaxRetryError, ReadTimeoutError

from app.interface.api.v1.dependencies import k8s_repo
from app.main import app


class RaisingK8s:
    """An adapter whose every call fails the same way."""

    def __init__(self, exc: Exception) -> None:
        self.exc = exc

    async def list_pods(self, *a, **k):
        raise self.exc

    async def list_events(self, *a, **k):
        raise self.exc

    async def list_nodes(self, *a, **k):
        raise self.exc

    async def list_namespaces(self, *a, **k):
        raise self.exc


@pytest.fixture
def client_for():
    def _make(exc: Exception) -> TestClient:
        app.dependency_overrides[k8s_repo] = lambda: RaisingK8s(exc)
        return TestClient(app)
    yield _make
    app.dependency_overrides.clear()


def _api_exception(status: int, headers: dict | None = None) -> ApiException:
    e = ApiException(status=status, reason="boom")
    e.headers = headers or {}
    return e


def test_an_rbac_denial_is_403_not_500(client_for):
    client = client_for(_api_exception(403))
    r = client.get("/api/v1/pods")
    assert r.status_code == 403, r.text
    assert "权限" in r.json()["detail"]


def test_a_rate_limit_is_429_with_retry_after(client_for):
    client = client_for(_api_exception(429, {"Retry-After": "7"}))
    r = client.get("/api/v1/pods")
    assert r.status_code == 429, r.text
    assert r.headers.get("Retry-After") == "7"


def test_a_read_timeout_is_504(client_for):
    client = client_for(ReadTimeoutError(None, "http://127.0.0.1", "read timed out"))
    r = client.get("/api/v1/pods")
    assert r.status_code == 504, r.text


def test_the_error_the_kubernetes_client_really_raises_is_504(client_for):
    """The class the client produces is not the class the mapping caught.

    urllib3 retries a timed-out read and then raises `MaxRetryError`, which
    is a sibling of `ReadTimeoutError`, not a child. Catching only the child
    left the real failure as a bare 500.
    """
    err = MaxRetryError(
        HTTPConnectionPool(host="127.0.0.1", port=6443),
        "https://127.0.0.1:6443/api/v1/namespaces",
        reason=ReadTimeoutError(None, "http://127.0.0.1", "read timed out"),
    )
    client = client_for(err)
    r = client.get("/api/v1/pods")
    assert r.status_code == 504, r.text


def test_an_apiserver_error_is_502(client_for):
    client = client_for(_api_exception(500))
    r = client.get("/api/v1/pods")
    assert r.status_code == 502, r.text


@pytest.mark.parametrize(
    "path", ["/api/v1/pods", "/api/v1/pods/stats", "/api/v1/events", "/api/v1/nodes"],
)
def test_every_list_endpoint_maps_the_failure(client_for, path):
    client = client_for(_api_exception(403))
    r = client.get(path)
    assert r.status_code == 403, f"{path} -> {r.status_code} {r.text}"
