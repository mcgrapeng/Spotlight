"""Application settings (pydantic-settings)."""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "k8s-viewer"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = True
    log_level: str = "INFO"

    # K8s / kubeconfig
    kubeconfig_path: str = ""
    k8s_request_timeout: int = 15

    # Teleport tsh (optional). When enabled, the backend can authenticate against a
    # Teleport proxy at startup so kubeconfig is already populated when the UI opens.
    # Leave empty to use a host-bound kubeconfig (in-cluster config, or env KUBECONFIG).
    teleport_proxy: str = ""           # e.g. "gt.internal.zhiman.tech:443"
    teleport_user: str = ""            # e.g. "zhangpeng"
    teleport_auth: str = "local"       # local | password | oidc | ...
    teleport_cluster: str = ""         # e.g. "pvg1s1-cloud"
    teleport_insecure: bool = False
    tsh_binary: str = "tsh"

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/app.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    # Cache TTLs (seconds). 0 disables.
    cache_ttl_pods: int = 5
    cache_ttl_nodes: int = 30
    cache_ttl_events: int = 10
    cache_ttl_namespaces: int = 60

    # Logs
    log_max_lines_buffer: int = 5000  # safety cap

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def data_dir(self) -> Path:
        p = Path("./data")
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def teleport_configured(self) -> bool:
        return bool(self.teleport_proxy and self.teleport_user)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
