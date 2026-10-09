"""Application settings (pydantic-settings)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "spotlight"
    log_level: str = "INFO"

    # K8s / kubeconfig
    kubeconfig_path: str = ""
    k8s_request_timeout: int = 15

    # Teleport tsh (optional). The username is now a per-session login field
    # (not a server-wide setting), so only the proxy / auth / cluster knobs
    # remain. Leave empty to use a host-bound kubeconfig (in-cluster config,
    # or env KUBECONFIG).
    teleport_proxy: str = ""           # e.g. "proxy.example.com:443"
    teleport_auth: str = "local"       # local | password | oidc | ...
    teleport_cluster: str = ""         # e.g. "cluster-name"
    teleport_insecure: bool = False
    tsh_binary: str = "tsh"

    # API access. When set, every /api/v1 route (except /auth/status and
    # /auth/login) requires either this bearer token or a session cookie
    # issued by /auth/login. When BOTH api_token and Teleport are unset the
    # API is open (local-dev mode) and the app logs a startup warning.
    api_token: str = ""
    session_ttl_seconds: int = 43200  # 12h

    # 活跃认证插件 id（见 infrastructure/auth/plugins/REGISTRY）。空 = 开发开放模式。
    auth_provider: str = ""

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/app.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Cache TTLs (seconds). 0 disables.
    cache_ttl_pods: int = 5
    cache_ttl_nodes: int = 30
    cache_ttl_events: int = 10
    cache_ttl_namespaces: int = 60

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def teleport_configured(self) -> bool:
        # Per-session username replaced the global `teleport_user`; "configured"
        # now means the proxy endpoint is set.
        return bool(self.teleport_proxy)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


def is_open_mode() -> bool:
    """True when no auth provider plugin AND no static API token are configured.

    In open mode the API falls back to the dev session (no real auth proof),
    matching the legacy single-tenant local-dev behavior. When EITHER is set the
    caller must present a valid session cookie (or, if `api_token` is set,
    a matching Bearer header — handled in `require_auth`).
    """
    s = get_settings()
    return not (s.auth_provider or s.api_token)
