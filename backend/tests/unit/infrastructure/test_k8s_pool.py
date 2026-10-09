"""Client-pool isolation:
- per-context ApiClients must never share the SDK's process-global Configuration
  (the credential-cross-wiring bug from the audit round).
- per-session isolation: two different session tokens each get their own
  ApiClient for the same context, and drop_session() evicts only that session.
"""
from __future__ import annotations

from kubernetes import client

from app.infrastructure.config.settings import get_settings
from app.infrastructure.k8s.client.pool import KubernetesClientPool

_KUBECONFIG = """
apiVersion: v1
kind: Config
clusters:
- cluster: {server: https://a.example}
  name: c1
- cluster: {server: https://b.example}
  name: c2
contexts:
- context: {cluster: c1, user: u1}
  name: ctx-a
- context: {cluster: c2, user: u1}
  name: ctx-b
current-context: ctx-a
users:
- name: u1
  user: {}
"""


def _pool_for(monkeypatch, tmp_path) -> KubernetesClientPool:
    p = tmp_path / "kubeconfig.yaml"
    p.write_text(_KUBECONFIG)
    monkeypatch.setenv("KUBECONFIG", str(p))
    get_settings.cache_clear()
    return KubernetesClientPool()


def test_clients_have_distinct_configurations(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    api_a, ctx_a = pool.get("s1", path, "ctx-a")
    api_b, ctx_b = pool.get("s1", path, "ctx-b")
    assert (ctx_a, ctx_b) == ("ctx-a", "ctx-b")
    ca = api_a.api_client.configuration
    cb = api_b.api_client.configuration
    assert ca is not cb, "clients must not share a Configuration object"
    assert ca.host == "https://a.example"
    assert cb.host == "https://b.example"


def test_get_is_cached_per_context(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    a1, _ = pool.get("s1", path, "ctx-a")
    a2, _ = pool.get("s1", path, "ctx-a")
    assert a1.api_client is a2.api_client
    assert pool.get("s1", path, "ctx-b")[0].api_client is not a1.api_client


def test_reload_drops_cached_clients(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    before = pool.get("s1", path, "ctx-a")[0].api_client
    pool.reload()
    after = pool.get("s1", path, "ctx-a")[0].api_client
    assert after is not before


def test_current_context_cached(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    assert pool.current(path) == "ctx-a"
    # default get() resolves through the kubeconfig's current context
    _, name = pool.get("s1", path)
    assert name == "ctx-a"
    assert isinstance(pool.get("s1", path)[0], client.CoreV1Api)


def test_sessions_do_not_share_clients(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    a1, _ = pool.get("s1", path, "ctx-a")
    b1, _ = pool.get("s2", path, "ctx-a")
    assert a1.api_client is not b1.api_client
    a2, _ = pool.get("s1", path, "ctx-a")
    assert a2.api_client is a1.api_client


def test_drop_session_evicts_only_that_session(monkeypatch, tmp_path):
    pool = _pool_for(monkeypatch, tmp_path)
    path = str(tmp_path / "kubeconfig.yaml")
    a1, _ = pool.get("s1", path, "ctx-a")
    pool.get("s2", path, "ctx-a")
    pool.drop_session("s1")
    a2, _ = pool.get("s1", path, "ctx-a")
    assert a2.api_client is not a1.api_client
    # s2's client must survive the s1 eviction
    b2, _ = pool.get("s2", path, "ctx-a")
    b1, _ = pool.get("s2", path, "ctx-a")
    assert b2.api_client is b1.api_client
