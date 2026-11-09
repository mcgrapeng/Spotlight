"""Validation of the provider config that reaches the model call.

`api_base` decides where the provider's API key — and the cluster's log
content — is sent, so an unvalidated free-form URL is an exfiltration
hole: whoever can save a provider decides where the next AI call posts
the key. The rule is https:// everywhere, with http:// kept for a
loopback Ollama, which is the one legitimate plain-HTTP endpoint.
"""
from __future__ import annotations

import pytest

from app.domain.entities.ai import AIProviderConfig


def _cfg(**overrides) -> AIProviderConfig:
    base = dict(id=1, name="OpenAI", provider="openai", model="gpt-4o-mini", api_key="k")
    base.update(overrides)
    return AIProviderConfig(**base)


@pytest.mark.parametrize("api_base", [
    "https://api.openai.com/v1",
    "https://llm.internal.example:8443/v1",
    "https://api.deepseek.com",
    "http://127.0.0.1:11434/v1",
    "http://localhost:11434/v1",
    "http://[::1]:11434/v1",
])
def test_api_base_accepts_https_and_loopback_http(api_base: str):
    _cfg(api_base=api_base).validate()


@pytest.mark.parametrize("api_base", [
    "http://api.openai.com/v1",       # plain HTTP to a remote host
    "http://10.0.0.5:8000/v1",        # plain HTTP to a LAN host
    "http://127.0.0.1.evil.com/v1",   # loopback as a prefix, not a host
    "ftp://api.openai.com/v1",
    "api.openai.com/v1",              # no scheme at all
    "https://",                       # no host
])
def test_api_base_rejects_everything_else(api_base: str):
    with pytest.raises(ValueError):
        _cfg(api_base=api_base).validate()


def test_a_provider_without_an_api_base_is_fine():
    _cfg(api_base=None).validate()
    _cfg(api_base="").validate()


def test_extra_may_not_override_the_validated_fields():
    # `extra` is merged into the call kwargs LAST, so a key here can
    # override the validated api_base — and with it the address the API
    # key and the cluster's log content are posted to. `timeout` is the
    # guard that stops the server calling (and paying for) a model long
    # after the browser gave up: a passthrough may not set it either.
    for key in ("api_base", "base_url", "api_key", "max_tokens",
                "temperature", "messages", "stream", "timeout"):
        with pytest.raises(ValueError):
            _cfg(extra={key: "x"}).validate()


def test_extra_may_carry_provider_specific_settings():
    # The passthrough is still a passthrough for everything else.
    _cfg(extra={"api_version": "2024-02-01"}).validate()


def test_max_tokens_has_a_ceiling():
    _cfg(max_tokens=2048).validate()
    with pytest.raises(ValueError):
        _cfg(max_tokens=100_000).validate()
