"""未知 context 必须变成 409，而不是 500。

场景：Alice 选了 prod-east 退出，Bob 登录后只有 staging-eu。浏览器里存的
`activeCluster` 还是 prod-east，于是每个 K8s 请求都带一个该会话 kubeconfig
里不存在的 context。旧代码让 ConfigException 直接冒泡 → HTTP 500，用户看到
一屏红且无从判断原因；前端侧已改为在登出时清选择、在拿到集群列表时校验，
服务端这层是兜底。
"""
from __future__ import annotations

import os
import textwrap

import pytest
from kubernetes import config

from app.infrastructure.k8s.client import pool as pool_mod
from app.infrastructure.k8s.client.pool import KubernetesClientPool, UnknownContextError

KUBECONFIG = textwrap.dedent("""
    apiVersion: v1
    kind: Config
    current-context: staging-eu
    clusters:
    - name: staging
      cluster: {server: 'https://staging.example:6443'}
    contexts:
    - name: staging-eu
      context: {cluster: staging, user: u}
    users:
    - name: u
      user: {token: t}
""")


@pytest.fixture
def kubeconfig(tmp_path):
    p = tmp_path / "kubeconfig.yaml"
    p.write_text(KUBECONFIG)
    return str(p)


def test_stale_context_raises_unknown_context_not_config_exception(kubeconfig):
    pool = KubernetesClientPool()
    with pytest.raises(UnknownContextError):
        pool.get("sess-token", kubeconfig, "prod-east")


def test_context_present_in_kubeconfig_still_builds(kubeconfig):
    pool = KubernetesClientPool()
    api, ctx = pool.get("sess-token", kubeconfig, "staging-eu")
    assert ctx == "staging-eu"
    assert api is not None


def test_failed_build_does_not_poison_the_pool(kubeconfig):
    """建客户端失败时不能把半成品塞进缓存，否则后续请求一直拿到坏对象。"""
    pool = KubernetesClientPool()
    with pytest.raises(UnknownContextError):
        pool.get("sess-token", kubeconfig, "prod-east")
    api, ctx = pool.get("sess-token", kubeconfig, "staging-eu")
    assert ctx == "staging-eu"


# ── the host-kubeconfig branch ─────────────────────────────────────────────
#
# The first four tests all pass an explicit `kubeconfig_path`, i.e. the
# per-session file a Teleport login writes. Open mode has no such file: the
# adapter passes None and the SDK falls back to $KUBECONFIG. That second branch
# was originally unguarded, so a stale context in direct mode surfaced as an
# uncaught ConfigException (500) — found by the browser e2e, not here.

def test_unknown_context_via_env_kubeconfig_raises_not_config_exception(
    kubeconfig, monkeypatch,
):
    monkeypatch.setenv("KUBECONFIG", kubeconfig)
    pool = KubernetesClientPool()
    with pytest.raises(UnknownContextError):
        pool.get("sess-token", None, "prod-east")


def test_unknown_context_in_a_colon_separated_kubeconfig_list(
    kubeconfig, tmp_path, monkeypatch,
):
    """KUBECONFIG may legally be a `:`-separated list; treating it as one path
    would make us think there is no config and fall through to in-cluster."""
    other = tmp_path / "other.yaml"
    other.write_text(KUBECONFIG)
    monkeypatch.setenv("KUBECONFIG", f"{tmp_path / 'missing.yaml'}{os.pathsep}{other}")
    pool = KubernetesClientPool()
    with pytest.raises(UnknownContextError):
        pool.get("sess-token", None, "prod-east")


def test_absent_kubeconfig_still_falls_back_to_in_cluster(monkeypatch, tmp_path):
    """With no kubeconfig anywhere, in-cluster is the correct answer and the
    caller must not be told the context is merely unknown."""
    monkeypatch.setenv("KUBECONFIG", str(tmp_path / "definitely-not-here.yaml"))
    monkeypatch.setattr(pool_mod.os.path, "expanduser",
                        lambda p: str(tmp_path / "no-home"))
    with pytest.raises(config.ConfigException):
        # In-cluster config also fails here (no service account), but it must
        # fail as a config problem, not as UnknownContextError.
        pool_mod.KubernetesClientPool().get("sess-token", None, "anything")


def test_host_kubeconfig_detection(monkeypatch, tmp_path):
    from app.infrastructure.k8s.client.pool import _host_kubeconfig_exists

    real = tmp_path / "config"
    real.write_text(KUBECONFIG)
    monkeypatch.setenv("KUBECONFIG", str(real))
    assert _host_kubeconfig_exists() is True

    monkeypatch.setenv("KUBECONFIG", str(tmp_path / "nope"))
    assert _host_kubeconfig_exists() is False

    monkeypatch.delenv("KUBECONFIG", raising=False)
    monkeypatch.setattr(pool_mod.os.path, "expanduser",
                        lambda p: str(tmp_path))
    assert _host_kubeconfig_exists() is False
    (tmp_path / ".kube").mkdir()
    (tmp_path / ".kube" / "config").write_text(KUBECONFIG)
    assert _host_kubeconfig_exists() is True
