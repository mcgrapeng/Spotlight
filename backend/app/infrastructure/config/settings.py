"""Application settings (pydantic-settings)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.infrastructure.config.env import sanitize_host_identity

# BEFORE any Settings can exist: pydantic-settings reads the process
# environment when a Settings is constructed, and get_settings() is
# lru_cached — so a stale exported TELEPORT_CLUSTER would be baked into the
# first Settings, and popping it afterwards cannot undo that.
#: The host identity variables that were present when this module loaded.
REMOVED_HOST_IDENTITY: list[str] = sanitize_host_identity()


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

    # Reverse proxies that are allowed to set X-Forwarded-For. Empty (the
    # default) means the header is ignored and every request is attributed to
    # the proxy's own IP — which makes the login rate limiter one shared bucket
    # for the whole user base. Set it to the LB/ingress subnet (e.g. "10.0.0.0/8")
    # in any deployment that sits behind a proxy. Never "*": that lets anyone
    # spoof their source IP and bypass the limiter.
    trusted_proxy_ips: str = ""

    # 活跃认证插件 id（见 infrastructure/auth/plugins/REGISTRY）。空 = 开发开放模式。
    auth_provider: str = ""

    # Comma-separated usernames that always resolve to the admin role.
    # This is the bootstrap: without it the first deployment would have
    # nobody able to grant the admin role to anybody.
    admin_users: str = ""

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/app.db"
    # 逗号分隔的允许来源。留空 = 只答同源请求：前端走 vite 代理
    # （相对路径 /api/v1），浏览器只看到一个源，本来就不需要 CORS。
    # 前端部署在别的源上时才需要显式设置。
    cors_origins: str = ""
    # 可选的来源正则，默认空。以前这里默认放行任意端口的
    # localhost/127.0.0.1 —— 端口不影响 SameSite 的"站点"判定，
    # 所以 localhost:9999 上的页面能带着会话 cookie 读走整个控制台。
    # 需要时再显式打开。
    cors_origin_regex: str = ""

    # Cache TTLs (seconds). 0 disables.
    cache_ttl_pods: int = 5
    cache_ttl_nodes: int = 30
    cache_ttl_events: int = 10
    cache_ttl_namespaces: int = 60

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def trusted_proxy_list(self) -> list[str]:
        """For `ProxyHeadersMiddleware.forwarded_allow_ips`."""
        return [o.strip() for o in self.trusted_proxy_ips.split(",") if o.strip()]

    @property
    def admin_user_list(self) -> list[str]:
        """Usernames that are always granted the admin role."""
        return [u.strip() for u in self.admin_users.split(",") if u.strip()]

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
