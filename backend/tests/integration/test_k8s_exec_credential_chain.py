"""The real chain: session kubeconfig → SDK exec credential plugin → apiserver.

Every other auth test stubs one end of this chain. The bug this file exists
for lived exactly in the middle: the Kubernetes SDK runs a kubeconfig's exec
credential plugin with CWD = the kubeconfig's own directory, so an exec env
pointing at a *relative* path resolves against the wrong directory, the
plugin finds no profile, and every API call answers 403.

Nothing here is mocked: a real subprocess runs, a real HTTP server speaks
Kubernetes JSON, and the real SDK talks to it over a real socket. The
credential plugin is a local script standing in for `tsh kube credentials` —
it reads $TELEPORT_HOME the way tsh does, so it fails the same way.
"""
from __future__ import annotations

import json
import logging
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import pytest
from kubernetes.client.exceptions import UnauthorizedException

from app.infrastructure.k8s.client.pool import KubernetesClientPool

# Stand-in for `tsh kube credentials`. It looks for the tsh profile in
# $TELEPORT_HOME and exits non-zero when it is not there — exactly what tsh
# does, which is what turns a wrong TELEPORT_HOME into a 403 for every
# request instead of a clear error at login time.
CREDENTIAL_SCRIPT = '''#!/usr/bin/env python3
import json, os, sys
home = os.environ.get("TELEPORT_HOME", "")
profile = os.path.join(home, "current-profile") if home else ""
if not home or not os.path.isfile(profile):
    sys.stderr.write(
        "ERROR: Having problems with relogin, please use "
        "'tsh login/tsh kube login' manually\\n"
    )
    sys.exit(1)
print(json.dumps({
    "kind": "ExecCredential",
    "apiVersion": "client.authentication.k8s.io/v1beta1",
    "spec": {"interactive": False},
    "status": {"token": "fake-token"},
}))
'''

NAMESPACE_LIST = {
    "kind": "NamespaceList",
    "apiVersion": "v1",
    "metadata": {"resourceVersion": "1"},
    "items": [
        {
            "metadata": {"name": "prod-ns", "uid": "u-1", "resourceVersion": "1"},
            "spec": {"finalizers": ["kubernetes"]},
            "status": {"phase": "Active"},
        }
    ],
}

# A throwaway self-signed certificate/key pair. The pool only checks that the
# SDK stored *some* credential, so the contents do not have to be valid.
# The newlines are escaped so the generated script stays valid Python.
_FAKE_CERT = "-----BEGIN CERTIFICATE-----\\nZmFrZQ==\\n-----END CERTIFICATE-----\\n"
_FAKE_KEY = "-----BEGIN RSA PRIVATE KEY-----\\nZmFrZQ==\\n-----END RSA PRIVATE KEY-----\\n"


class _ApiHandler(BaseHTTPRequestHandler):
    """A kube-apiserver stand-in that requires the exec plugin's token."""

    def do_GET(self) -> None:  # noqa: N802 — BaseHTTPRequestHandler's name
        if self.headers.get("Authorization") != "Bearer fake-token":
            self.send_response(401)
            self.end_headers()
            return
        body = json.dumps(NAMESPACE_LIST).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args) -> None:  # keep the test output readable
        pass


@pytest.fixture
def apiserver_url() -> str:
    server = ThreadingHTTPServer(("127.0.0.1", 0), _ApiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


def _pool() -> KubernetesClientPool:
    """A pool of this test's own.

    The application's pool is a process-wide singleton, and clients cached in
    it outlive the test that made them — which is how one test can break
    another's expectations about what is cached.
    """
    return KubernetesClientPool()


def _write_credential_script(tmp_path: Path, mode: str = "token") -> Path:
    script = tmp_path / f"fake-tsh-credentials-{mode}.py"
    if mode == "cert":
        # The shape `tsh kube credentials` really returns: a client
        # certificate, not a token.
        script.write_text(
            CREDENTIAL_SCRIPT.replace(
                '"status": {"token": "fake-token"},',
                '"status": {'
                '"clientCertificateData": "' + _FAKE_CERT + '",'
                '"clientKeyData": "' + _FAKE_KEY + '"},',
            )
        )
    else:
        script.write_text(CREDENTIAL_SCRIPT)
    script.chmod(0o755)
    return script


def _write_kubeconfig(
    path: Path, server: str, teleport_home: str, script: Path
) -> Path:
    # JSON is valid YAML, so json.dumps quotes the paths safely.
    path.write_text(
        "apiVersion: v1\n"
        "kind: Config\n"
        "current-context: ctx\n"
        "clusters:\n"
        "- name: c1\n"
        f"  cluster: {{server: {json.dumps(server)}}}\n"
        "contexts:\n"
        "- name: ctx\n"
        "  context: {cluster: c1, user: u}\n"
        "users:\n"
        "- name: u\n"
        "  user:\n"
        "    exec:\n"
        "      apiVersion: client.authentication.k8s.io/v1beta1\n"
        f"      command: {json.dumps(sys.executable)}\n"
        f"      args: [{json.dumps(str(script))}]\n"
        "      env:\n"
        "      - name: TELEPORT_HOME\n"
        f"        value: {json.dumps(teleport_home)}\n"
    )
    return path


def _session_profile(tmp_path: Path) -> Path:
    home = tmp_path / "session" / "tsh"
    home.mkdir(parents=True, exist_ok=True)
    (home / "current-profile").write_text("zhangpeng\n")
    return home


def test_exec_credential_plugin_reaches_the_apiserver(tmp_path, apiserver_url):
    """Absolute TELEPORT_HOME → the plugin resolves the profile → the SDK
    authenticates → the API answers with real data."""
    home = _session_profile(tmp_path)
    script = _write_credential_script(tmp_path)
    kubeconfig = _write_kubeconfig(
        tmp_path / "kubeconfig.yaml", apiserver_url, str(home), script
    )

    api, _ctx = _pool().get("exec-ok", str(kubeconfig), "ctx")
    namespaces = api.list_namespace(_request_timeout=10).items

    assert [n.metadata.name for n in namespaces] == ["prod-ns"]


def test_certificate_credentials_are_recognised_as_credentials(tmp_path, apiserver_url):
    """`tsh kube credentials` returns a client CERTIFICATE, not a token.

    The pool's check must accept that shape too — otherwise every Teleport
    session would be reported as having no credentials.
    """
    home = _session_profile(tmp_path)
    script = _write_credential_script(tmp_path, mode="cert")
    kubeconfig = _write_kubeconfig(
        tmp_path / "kubeconfig.yaml", apiserver_url, str(home), script
    )

    # The apiserver here checks for the token, so the request itself is
    # expected to be rejected — what matters is that the pool got far enough
    # to send it, i.e. it did not decide the credentials were missing.
    api, _ctx = _pool().get("exec-cert", str(kubeconfig), "ctx")
    with pytest.raises(Exception):
        api.list_namespace(_request_timeout=10)


def test_relative_teleport_home_breaks_the_credential_plugin(
    tmp_path, apiserver_url, caplog
):
    """The failure this file exists for.

    The SDK runs the exec plugin with CWD = the kubeconfig's directory, so a
    relative TELEPORT_HOME resolves against THAT directory and the plugin
    finds no profile. The pool names that cause instead of letting the
    request go out unauthenticated and come back as a bare 403.
    """
    from app.infrastructure.k8s.client.pool import CredentialUnavailableError

    home = _session_profile(tmp_path)
    script = _write_credential_script(tmp_path)
    # A relative path — the shape `tsh kube login` writes when it was given a
    # relative TELEPORT_HOME, and the shape that broke every request.
    kubeconfig = _write_kubeconfig(
        tmp_path / "kubeconfig.yaml", apiserver_url, "data/sessions/x/tsh", script
    )

    with caplog.at_level(logging.ERROR):
        with pytest.raises(CredentialUnavailableError):
            _pool().get("exec-relative", str(kubeconfig), "ctx")

    # The plugin's own error is in the log — it is the only clue there is.
    assert "relogin" in caplog.text
    # Sanity: the profile really does exist — only the path was wrong.
    assert (home / "current-profile").exists()


def test_without_the_pool_check_the_sdk_sends_an_unauthenticated_request(
    tmp_path, apiserver_url, caplog
):
    """Why the pool checks at all.

    The SDK runs the plugin while loading the kubeconfig and swallows its
    failure — it only logs it — then sends the request with no credentials.
    The cluster answers 401/403 and the real cause is nowhere in sight.
    """
    from kubernetes import client, config as kcfg

    home = _session_profile(tmp_path)
    script = _write_credential_script(tmp_path)
    kubeconfig = _write_kubeconfig(
        tmp_path / "kubeconfig.yaml", apiserver_url, "data/sessions/x/tsh", script
    )

    cfg = client.Configuration()
    kcfg.load_kube_config(
        config_file=str(kubeconfig), context="ctx", client_configuration=cfg
    )
    api = client.CoreV1Api(client.ApiClient(configuration=cfg))
    with caplog.at_level(logging.ERROR):
        with pytest.raises(UnauthorizedException):
            api.list_namespace(_request_timeout=10)

    assert "relogin" in caplog.text


def test_pool_reports_a_broken_credential_plugin_instead_of_a_bare_403(
    tmp_path, apiserver_url,
):
    """The pool must name the cause while it still knows it.

    Without this check the user sees "403 Forbidden" from the cluster and has
    no way to learn that the session's tsh profile was unreachable.
    """
    from app.infrastructure.k8s.client.pool import CredentialUnavailableError

    home = _session_profile(tmp_path)
    script = _write_credential_script(tmp_path)
    kubeconfig = _write_kubeconfig(
        tmp_path / "kubeconfig.yaml", apiserver_url, "data/sessions/x/tsh", script
    )

    with pytest.raises(CredentialUnavailableError):
        _pool().get("exec-detect", str(kubeconfig), "ctx")
