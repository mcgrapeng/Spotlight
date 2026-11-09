"""Process-level guard: the host's Teleport identity must not leak in.

The server is usually started from a shell that already holds a Teleport
session, and `tsh login` exports identity variables into that shell. Those
variables describe the HOST's identity, not the session Spotlight is about to
create — but every child process inherits them, including the Kubernetes
SDK's exec credential plugin, which runs `tsh kube credentials` on behalf of
each request.

Two of them are actively harmful:

- ``TELEPORT_KUBE_CLUSTER`` names the Kubernetes cluster ``tsh`` logs into.
  The value people export is a kubeconfig *context* name
  ("<proxy>-<cluster>"), not a registered cluster name, so ``tsh login``
  fails with "Kubernetes cluster ... is not registered in this Teleport
  cluster" — and the plugin used to report that as "wrong one-time code".
- ``TELEPORT_CLUSTER`` names the Teleport cluster ``tsh`` talks to.
  pydantic-settings gives the process environment priority over
  ``backend/.env``, so a stale exported value silently overrides the
  configured one.

Clearing them once at startup turns "the host's identity never decides which
cluster we talk to" into a process-level guarantee, instead of a rule every
call site has to remember.
"""
from __future__ import annotations

import os

#: Teleport identity variables inherited from the host shell.
HOST_IDENTITY_VARS: tuple[str, ...] = ("TELEPORT_KUBE_CLUSTER", "TELEPORT_CLUSTER")


def sanitize_host_identity() -> list[str]:
    """Remove the inherited Teleport identity vars from this process.

    Returns the names that were actually present, so the caller can log
    them. Safe to call more than once.
    """
    removed: list[str] = []
    for var in HOST_IDENTITY_VARS:
        value = os.environ.pop(var, None)
        # An empty value is as good as unset (tsh treats "" as unset), so it
        # is cleared but not reported — the log line is for real surprises.
        if value:
            removed.append(var)
    return removed
