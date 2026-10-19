"""Programmatic uvicorn entrypoint.

Exists for exactly one reason: the login rate limiter identifies callers by
`request.client.host`, and behind a reverse proxy that is the *proxy's* IP
unless uvicorn is told to honour X-Forwarded-For. Left alone, every user shares
one bucket and the 11th login in 5 minutes fails for everybody.

`forwarded_allow_ips` is a uvicorn setting, not a FastAPI one, so it cannot be
set from inside the app — this wires it from the same `TRUSTED_PROXY_IPS` env
var as everything else. Run with:

    python -m app.server --port 8002

The plain `uvicorn app.main:app` form still works but ignores TRUSTED_PROXY_IPS;
pass `--proxy-headers --forwarded-allow-ips=<...>` if you use it directly.
"""
from __future__ import annotations

import uvicorn

from app.infrastructure.config.settings import get_settings
from app.infrastructure.logging import get_logger
from app.main import app

log = get_logger("server")


def build_config(**overrides) -> uvicorn.Config:
    """Config with proxy-header trust taken from settings."""
    trusted = get_settings().trusted_proxy_list
    cfg = dict(
        app=app,
        host="0.0.0.0",
        port=8002,
        # Honour X-Forwarded-For, but only from peers we were told to trust.
        # Leaving `forwarded_allow_ips` at uvicorn's default would trust
        # 127.0.0.1 implicitly — which is right for a local sidecar and wrong
        # for anything reachable, where a client can usually open a connection
        # that looks like it came from the proxy's own address.
        proxy_headers=bool(trusted),
        forwarded_allow_ips=trusted or None,
    )
    cfg.update(overrides)
    return uvicorn.Config(**cfg)


def main() -> None:
    import argparse

    p = argparse.ArgumentParser(description="Run the Spotlight API server.")
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--port", type=int, default=8002)
    p.add_argument("--reload", action="store_true")
    p.add_argument(
        "--log-level", default=None,
        help="uvicorn log level (defaults to the app's LOG_LEVEL).",
    )
    args = p.parse_args()

    s = get_settings()
    cfg = build_config(
        host=args.host,
        port=args.port,
        reload=args.reload,
        log_level=(args.log_level or s.log_level).lower(),
    )
    if cfg.proxy_headers:
        log.info(
            "proxy.headers.trusted",
            allow=cfg.forwarded_allow_ips,
            hint="X-Forwarded-For is honoured only from these peers",
        )
    else:
        log.warning(
            "proxy.headers.disabled",
            hint="behind a reverse proxy? set TRUSTED_PROXY_IPS so the login "
                 "rate limiter does not bucket every user together",
        )
    # Server(config) rather than uvicorn.run(config): `run()` re-wraps its first
    # argument in a fresh Config, so a Config instance gets treated as the ASGI
    # app — which swallows --port and breaks the lifespan.
    uvicorn.Server(cfg).run()


if __name__ == "__main__":
    main()
