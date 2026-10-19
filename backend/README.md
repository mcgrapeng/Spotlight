# Spotlight · Backend

FastAPI service that powers Spotlight's UI and CLI integrations.
Hexagonal architecture — `application/` (use cases) on top of `domain/` (pure),
with adapters in `infrastructure/` and `interface/`.

## Run

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env              # then edit AI_PROVIDER + key
python -m app.server --reload --port 8002
```

OpenAPI: <http://127.0.0.1:8002/docs> · JSON spec: `/openapi.json` · health: `/healthz`.

`python -m app.server` rather than `uvicorn app.main:app`: `TRUSTED_PROXY_IPS` is
a **uvicorn** setting (`forwarded_allow_ips`), so only the bundled entrypoint can
apply it. Behind a reverse proxy, the bare uvicorn form silently ignores it and
the login rate limiter buckets every user into one.

## Test

```bash
pytest -q                       # all unit + integration
pytest --cov=app --cov-report=term-missing
```

Some tests are not mocks: `test_teleport_real_binary.py` builds an executable
and drives it through a real PTY, `test_client_ip_real.py` starts a real uvicorn
behind a real proxy, and `test_stale_context_live.py` serves over a real socket.
They need no cluster and no network beyond `127.0.0.1`.

## CI

`.github/workflows/ci.yml` runs three jobs: backend tests, frontend
unit + typecheck, and e2e (real Chromium against a live backend and two fake
apiservers, see `frontend/e2e/README.md`).

## Layout

```
app/
├── application/      commands · queries · handlers · CQRS dispatch
├── domain/           entities · value objects · port interfaces
├── infrastructure/   adapters: k8s, db, logging, LLM, auth plugins
├── interface/api/    FastAPI routers, DTOs, deps, middleware
└── main.py           app factory + lifespan
```

> **Architectural rule:** `app/` never imports `kubernetes` or `litellm` directly.
> Everything crosses a port defined in `domain/`. To add a new auth provider,
> LLM, or log source — implement the matching adapter and register it.
