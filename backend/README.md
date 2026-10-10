# Spotlight · Backend

FastAPI service that powers Spotlight's UI and CLI integrations.
Hexagonal architecture — `application/` (use cases) on top of `domain/` (pure),
with adapters in `infrastructure/` and `interface/`.

## Run

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env              # then edit AI_PROVIDER + key
uvicorn app.main:app --reload --port 8002
```

OpenAPI: <http://127.0.0.1:8002/docs> · JSON spec: `/openapi.json` · health: `/healthz`.

## Test

```bash
pytest -q                       # all unit + integration
pytest --cov=app --cov-report=term-missing
```

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
