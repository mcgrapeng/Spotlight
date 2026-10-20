"""The permission catalog: codes, built-in roles, their relationships."""
from __future__ import annotations

import re

from app.domain.value_objects.permissions import (
    ADMIN_ONLY,
    BUILTIN_ROLES,
    DEFAULT_ROLE,
    PERMISSIONS,
    PERMISSION_CODES,
    ROLE_ADMIN,
    ROLE_USER,
    ROLE_VIEWER,
    builtin_permissions,
    is_known_permission,
)

_CODE_RE = re.compile(r"^[a-z][a-z0-9]*\.[a-z][a-z0-9]*$")


def test_codes_are_unique_and_well_formed():
    codes = [p.code for p in PERMISSIONS]
    assert len(codes) == len(set(codes))
    for code in codes:
        assert _CODE_RE.match(code), code


def test_every_permission_has_a_label():
    for p in PERMISSIONS:
        assert p.name
        assert p.description


def test_admin_holds_every_permission():
    assert set(builtin_permissions(ROLE_ADMIN)) == PERMISSION_CODES


def test_default_role_cannot_touch_the_admin_surface():
    admin_only = set(builtin_permissions(ROLE_ADMIN)) - set(builtin_permissions(ROLE_USER))
    assert admin_only == ADMIN_ONLY
    assert DEFAULT_ROLE == ROLE_USER


def test_viewer_is_read_only():
    viewer = set(builtin_permissions(ROLE_VIEWER))
    assert viewer == {
        "clusters.read", "namespaces.read", "pods.read",
        "nodes.read", "events.read", "favorites.read",
    }
    # A viewer must not be able to read logs, use AI or change anything.
    assert "pods.logs" not in viewer
    assert "ai.use" not in viewer
    assert not any(p.endswith(".write") for p in viewer)
    assert not any(p.endswith(".manage") for p in viewer)


def test_user_role_is_a_superset_of_viewer():
    assert set(builtin_permissions(ROLE_VIEWER)) <= set(builtin_permissions(ROLE_USER))


def test_unknown_permission_is_not_known():
    assert not is_known_permission("pods.delete")
    assert is_known_permission("pods.read")


def test_builtin_roles_cover_the_whole_catalog():
    assert set(BUILTIN_ROLES) == {ROLE_ADMIN, ROLE_USER, ROLE_VIEWER}
    assert set(BUILTIN_ROLES[ROLE_ADMIN]) == PERMISSION_CODES
