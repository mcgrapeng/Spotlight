"""CORS must answer only the origins the operator configured.

The shipped default allowed any localhost port with credentials. Cookies are
SameSite, but a port does not change the *site* — so a page served from
http://localhost:9999 rode the session cookie along, and CORS let it read
the whole console as the logged-in user.

Same-origin needs no CORS at all: the frontend talks to the API through the
vite proxy, so the browser only ever sees one origin. A cross-origin
frontend is a deployment choice and has to be spelled out.
"""
from __future__ import annotations

from fastapi.testclient import TestClient

import app.main as main
from app.infrastructure.config.settings import get_settings
from app.main import create_app


def _app(monkeypatch, **overrides):
    settings = get_settings().model_copy(update=overrides)
    monkeypatch.setattr(main, "_settings", settings)
    return create_app()


def test_the_default_configuration_answers_no_foreign_origin(monkeypatch):
    client = TestClient(_app(monkeypatch))
    r = client.get("/api/v1/clusters", headers={"Origin": "http://localhost:9999"})
    assert "access-control-allow-origin" not in r.headers


def test_a_configured_origin_is_allowed(monkeypatch):
    client = TestClient(_app(monkeypatch, cors_origins="https://console.example"))
    r = client.get(
        "/api/v1/clusters", headers={"Origin": "https://console.example"},
    )
    assert r.headers.get("access-control-allow-origin") == "https://console.example"


def test_an_origin_regex_still_works_when_it_is_asked_for(monkeypatch):
    # The setting is not gone — it just no longer has a permissive default.
    client = TestClient(
        _app(monkeypatch, cors_origin_regex=r"^https?://localhost(:\d+)?$"),
    )
    r = client.get("/api/v1/clusters", headers={"Origin": "http://localhost:9999"})
    assert r.headers.get("access-control-allow-origin") == "http://localhost:9999"
