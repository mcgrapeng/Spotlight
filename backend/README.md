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

## Permissions

Spotlight gates its own features with a small RBAC model: a **permission** is
a code (`pods.read`, `pods.logs`, `ai.use`, `users.manage`, …), a
**role** is a named set of codes, and a **user** is an auth-plugin username
plus the roles granted to it. The codes are about *Spotlight*, not about the
cluster behind it — the K8s side is already limited by each session's own
kubeconfig credentials.

- Catalog: `app/domain/value_objects/permissions.py` — the codes that exist.
- Built-in roles: `admin` (everything), `user` (everything but the admin
  surface), `viewer` (read-only). Seeded on startup; `admin` is immutable.
- A username nobody assigned a role to keeps today's behaviour: the `user`
  role. Locking somebody out is an explicit act (`disabled`).
- `ADMIN_USERS=alice,bob` in `.env` grants the admin role to those
  usernames — the bootstrap, since otherwise the first deployment would have
  nobody able to grant the admin role to anybody.

| Endpoint (under `/api/v1`) | Needs |
|---|---|
| `GET /permissions/me` | any signed-in caller — the codes the UI should honour |
| `GET /permissions/catalog` | any signed-in caller |
| `GET`/`POST` `/permissions/roles`, `PUT`/`DELETE` `/permissions/roles/{id}` | `roles.manage` |
| `GET /permissions/users`, `PUT /permissions/users/{username}` | `users.manage` |

`GET /auth/status` also carries the caller's `permissions`, so the frontend
needs one call on boot instead of two. The server enforces the same codes on
the routes that already existed (`/clusters`, `/pods`, `/pods/{ns}/{name}/logs`,
`/nodes`, `/events`, `/favorites`, `/ai/*`); the frontend only uses them
to hide what the caller cannot do.

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
