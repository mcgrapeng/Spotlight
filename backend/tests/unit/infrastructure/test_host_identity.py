"""The host's Teleport identity must not decide which cluster we talk to.

The server is usually started from a shell that already holds a Teleport
session. Those exported variables describe the HOST's identity, and every
child process inherits them — including the Kubernetes SDK's exec credential
plugin, which runs `tsh kube credentials` for every request.
"""
from __future__ import annotations

import os

from app.infrastructure.config.env import HOST_IDENTITY_VARS, sanitize_host_identity


def test_sanitize_removes_the_inherited_identity(monkeypatch):
    monkeypatch.setenv("TELEPORT_KUBE_CLUSTER", "gt.internal.zhiman.tech-pvg1s1-cloud")
    monkeypatch.setenv("TELEPORT_CLUSTER", "pvg1s1-cloud")

    removed = sanitize_host_identity()

    assert set(removed) == {"TELEPORT_KUBE_CLUSTER", "TELEPORT_CLUSTER"}
    assert "TELEPORT_KUBE_CLUSTER" not in os.environ
    assert "TELEPORT_CLUSTER" not in os.environ


def test_sanitize_keeps_the_settings_that_are_not_identity(monkeypatch):
    """KUBECONFIG and TELEPORT_PROXY/USER describe the deployment, not a
    session — the server still needs them."""
    monkeypatch.setenv("KUBECONFIG", "/tmp/some-kubeconfig.yaml")
    monkeypatch.setenv("TELEPORT_PROXY", "proxy.example:443")
    monkeypatch.setenv("TELEPORT_USER", "alice")

    sanitize_host_identity()

    assert os.environ["KUBECONFIG"] == "/tmp/some-kubeconfig.yaml"
    assert os.environ["TELEPORT_PROXY"] == "proxy.example:443"
    assert os.environ["TELEPORT_USER"] == "alice"


def test_sanitize_is_idempotent(monkeypatch):
    monkeypatch.setenv("TELEPORT_KUBE_CLUSTER", "x")

    assert sanitize_host_identity() == ["TELEPORT_KUBE_CLUSTER"]
    assert sanitize_host_identity() == []


def test_only_identity_vars_are_listed():
    assert HOST_IDENTITY_VARS == ("TELEPORT_KUBE_CLUSTER", "TELEPORT_CLUSTER")
