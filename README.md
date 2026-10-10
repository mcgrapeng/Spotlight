<div align="center">

<img src="assets/banner.svg" alt="Spotlight — A Kubernetes dashboard that thinks with you." />

<br/>

**A Kubernetes dashboard that thinks with you.**

<br/>

<a href="#-quick-start"><img src="https://img.shields.io/badge/▶_Quick_start-18181B?style=for-the-badge&logoColor=white" alt="Quick start" /></a>&nbsp;
<a href="https://github.com/mcgrapeng/Spotlight/discussions"><img src="https://img.shields.io/badge/💬_Discussions-8EC5FF?style=for-the-badge&logoColor=18181B" alt="Discussions" /></a>&nbsp;
<a href="#-sponsor--funding"><img src="https://img.shields.io/badge/❤_Sponsor-FFD69B?style=for-the-badge&logoColor=18181B" alt="Sponsor" /></a>

<br/>

<img src="https://img.shields.io/badge/license-MIT-18181B?style=flat-square" alt="MIT" />
<img src="https://img.shields.io/badge/python-3.11%2B-326CE5?style=flat-square&logo=python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/node-%E2%89%A520-42b883?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
<img src="https://img.shields.io/badge/K8s-1.30%2B-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="K8s" />

<br/>

<a href="./README.md"><b>English</b></a> &nbsp;·&nbsp;
<a href="./README.zh-CN.md">简体中文</a>

</div>

<br/>

## 🛰️ At a glance

Spotlight is the **Kubernetes dashboard for the dev who already knows `kubectl`** — it pulls every cluster in your kubeconfig into one view, streams Pod logs in real time, and hands the messy ones to an LLM **you pick** for an instant, contextual explanation.

- 🧭 **Multi-cluster kubeconfig, one UI** — switch contexts live, no restart
- 📜 **Real-time log streaming (SSE)** — multi-pod select, ANSI preserved, dedup, download
- 🤖 **AI log explainer, any model** — OpenAI · Anthropic · Bedrock · Gemini · Ollama · 100+ via LiteLLM
- ⌨️ **Keyboard-first** — `⌘K` palette, `g d / p / n / e / f / a` page jumps
- 🧱 **Pluggable auth** — bearer · session · Teleport tsh · your own plugin (one file)
- 🔍 **Type-safe end-to-end** — Pydantic v2 → OpenAPI → `openapi-typescript`

<br/>

## 📑 Table of contents

| Section | |
|---|---|
| [The pitch](#-the-pitch) | The one-liner that explains everything |
| [Why we built this](#-why-we-built-this) | The origin story |
| [60-second tour](#-60-second-tour) | Screenshots of every key screen |
| [What you get](#-what-you-get) | Feature grid |
| [vs. the field](#-vs-the-field) | Spotlight vs kubectl / Dashboard / Lens |
| [AI in action](#-ai-in-action) | Real output shape from the AI analyzer |
| [How it's built](#-how-its-built) | Hexagonal architecture diagram |
| [Quick start](#-quick-start) | 3 commands to run |
| [Stack](#-stack) | Tech stack badges |
| [AI providers](#-ai-providers) | How to add / swap an LLM |
| [Coming next](#-coming-next) | Roadmap |
| [Contributing](#-contributing) | How to help |
| [Project layout](#-project-layout) | Repo structure |
| [FAQ](#-faq) | Frequently asked questions |
| [Development](#-development) | Local dev setup |
| [Community](#-community) | Discussions, issues, chat |
| [Sponsor / funding](#-sponsor) | Support the project |
| [⭐ Star history](#-star-history) | Growth chart |
| [License · Acknowledgements](#-license) | MIT + credits |

<br/>

## 🎯 The pitch

> `kubectl` tells you **what** is happening.
> `Kubernetes Dashboard` tells you **where** it is.
> **Spotlight** tells you ***why***.

<br/>

## 🕰️ Why we built this

> *We were debugging a production incident at 2 a.m. The pod was crash-looping. `kubectl logs` showed 21,320 restarts. The Dashboard showed the pod was "Running". Neither told us **why**. We spent 40 minutes grepping through logs before finding an OOMKilled line buried at position 88. That was the moment we decided: the tool that shows you the dashboard should also show you the diagnosis.*

Every AI team eventually hits the same wall: **kubectl gives you the what, the Dashboard gives you the where, but nobody gives you the why.** Logs are scattered across pods, restarts, and events. The answer is always there — buried in a 200-line log dump that no human wants to read at 2 a.m.

Spotlight is the layer on top that connects the dots. It pulls every cluster into one view, streams logs in real time, and hands the messy ones to an LLM **you pick** for a contextual explanation. No SaaS, no vendor lock, your cluster, your data, your model.

<br/>

## 📸 60-second tour

| | |
|---|---|
| **01 · Log in**<br/><img src="assets/screenshots/login.jpeg" width="100%" alt="Login" /><br/><sub>Bearer, Teleport tsh, or session — 30 seconds, no signup.</sub> | **02 · Watch the cluster**<br/><img src="assets/screenshots/dashboard.jpeg" width="100%" alt="Dashboard" /><br/><sub>Health, pressure, signals on one screen.</sub> |
| **03 · Pick the noisy Pod**<br/><img src="assets/screenshots/pods.jpeg" width="100%" alt="Pods" /><br/><sub>Live status, restart counts, namespace filter.</sub> | **04 · Let the LLM explain**<br/><img src="assets/screenshots/ai.jpeg" width="100%" alt="AI Analyzer" /><br/><sub>Pull the last 200 lines, click <em>Analyze</em>.</sub> |

<br/>

## ✅ What you get

- **🧭 Multi-cluster, one UI** — switch contexts live, the exact `KUBECONFIG` your shell already respects. No restart.
- **📜 Real-time log streaming (SSE)** — multi-pod select, ANSI color preserved, deduplicated, download.
- **🤖 AI log explainer, any model** — bring your own key; OpenAI · Anthropic · Bedrock · Gemini · Ollama · 100+ via LiteLLM.
- **⌨️ Keyboard-first** — `⌘K` palette · `g d / p / n / e / f / a` to leap between pages · no mouse needed.
- **🧱 Pluggable auth** — bearer · session · Teleport tsh · your own plugin (one file).
- **🔍 Type-safe, end-to-end** — Pydantic v2 → OpenAPI → `openapi-typescript`. Frontend can't drift from backend.
- **🧪 Hexagonal / clean architecture** — every port mocked, every adapter tested, e2e covers the critical paths.

<br/>

## ⚖️ vs. the field

| &nbsp; | `kubectl` | Dashboard | Lens | **Spotlight** |
|---|---|---|---|---|
| Multi-cluster switch | `kubectx` | manual | ✔ | **✔ live** |
| Real-time log stream | `kubectl logs -f` | ✔ | ✔ | **✔ multi-pod + dedup** |
| AI log explainer | ✗ | ✗ | ✗ | **✔ any LLM** |
| Pluggable auth | ✗ | ✗ | partial | **✔ one file** |
| Type-safe API → UI | ✗ | ✗ | ✗ | **✔ Pydantic → TS** |
| Self-host, no signup | ✔ | ✔ | partial | **✔** |

> Spotlight does not replace `kubectl`. It sits *on top* — gives you the dashboard, the trail, and the diagnosis, fast.

<br/>

## 🤖 AI in action

> Pull up to 200 lines from any pod, click *Analyze*, pick a model — real output shape:

```text
▸ AI · claude-3-5-sonnet · 1.42s · tokens 412 in / 286 out

  Root cause
    The pod is being OOMKilled. Container RSS hit the 512 MiB limit at
    17:42:08; the kernel sent SIGKILL (exit 137); Kubernetes restarted
    the container 21,320 times in the last 5 minutes.

  Evidence
    L17  "oom score adj = 950"
    L23  "memory.peak = 512MiB / limit 512MiB"
    L88  "loki-write: signal SIGKILL, exit code 137"

  Suggested fix
    • Raise memory.limit to 768 MiB in the Helm values, or
    • Drop WAL retention from 24h → 6h in the ingester config, or
    • Shard the tenant — split by labels across 3 replicas.
```

<br/>

## 🏗️ How it's built

Hexagonal / Clean Architecture — **domain and application know nothing about Kubernetes, AI, or HTTP**; the infrastructure adapters do.

```mermaid
flowchart TB
  classDef ui    fill:#1A1A24,stroke:#8EC5FF,stroke-width:1.5px,color:#FAFAFA
  classDef api   fill:#1A1A24,stroke:#EFADF7,stroke-width:1.5px,color:#FAFAFA
  classDef app   fill:#1A1A24,stroke:#FFD69B,stroke-width:1.5px,color:#FAFAFA
  classDef port  fill:#0F0E16,stroke:#EFADF7,stroke-width:1px,color:#FAFAFA
  classDef dom   fill:#0F0E16,stroke:#8EC5FF,stroke-width:1px,color:#FAFAFA
  classDef infra fill:#11111A,stroke:#5A5A75,stroke-width:1px,color:#CFCFD8
  classDef store fill:#0F0E16,stroke:#FFD69B,stroke-width:1px,color:#FFD69B

  subgraph Browser["Browser · Vue 3"]
    UI["shadcn-vue · Pinia · Router · Sonner"]:::ui
  end

  subgraph Edge["Interface · HTTP + SSE"]
    API["FastAPI routers · deps · CORS"]:::api
    SSE["SSE routes · log streaming"]:::api
  end

  subgraph App["Application · use cases"]
    UC["commands · queries · handlers"]:::app
    PK["port: K8s"]:::port
    PL["port: LLM"]:::port
  end

  subgraph Dom["Domain · pure"]
    ENT["entities · value objects · services"]:::dom
  end

  subgraph Infra["Infrastructure · adapters"]
    K8S["multi-context k8s pool"]:::infra
    LLM["LiteLLM — any provider"]:::infra
    DB[("SQLite")]:::store
  end

  UI <-->|"axios + OpenAPI · type-safe"| API
  UI <-->|SSE| SSE
  API --> UC
  SSE --> UC
  UC --> ENT
  UC --> PK & PL
  PK -. implemented by .-> K8S
  PL -. implemented by .-> LLM
  K8S --> DB
  LLM --> DB
```

> **Want to add an auth provider, log source, or LLM?** Add an `infrastructure/<thing>/` adapter that implements the matching port, register it. Nothing else moves.

<br/>

## 🚀 Quick start

**Spotlight is two processes. Run them, point them at your kubeconfig, open `http://localhost:5173`.**

```bash
# 1. Backend — FastAPI on :8002
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8002

# 2. Frontend — Vue 3 on :5173, in a second terminal
cd frontend
pnpm install
pnpm dev
```

Open <http://localhost:5173>. Log in with any `Authorization: Bearer <token>` — set `API_TOKEN=<your-token>` in `backend/.env`. **For local dev, leave `API_TOKEN` and `TELEPORT_*` unset** — the app starts with the API open and logs a startup warning.

> **Have Teleport?** Set `TELEPORT_PROXY` / `TELEPORT_AUTH` / `TELEPORT_CLUSTER` in `.env`. Spotlight issues per-session `tsh login` credentials — no kubeconfig needed.

<br/>

## 🧱 Stack

**Backend** — FastAPI · Pydantic v2 · kubernetes-python · LiteLLM · SQLAlchemy (async + aiosqlite) · structlog

**Frontend** — Vue 3 · Vite · Tailwind CSS · reka-ui / shadcn-vue · Pinia · vue-sonner · axios · openapi-typescript

**Tests** — pytest · Vitest · Playwright · axe-core

<br/>

## 🔌 AI providers

Powered by **LiteLLM**. Provider configs are **stored in SQLite (`ai_providers` table) and managed in the UI** — **Settings → AI**. Add OpenAI, Anthropic, Bedrock, Gemini, Ollama, or any OpenAI-compatible endpoint by pasting your key, picking the model, and saving.

> **No `AI_PROVIDER` env var.** Switching providers is a UI action — pick a different row, no restart, no rebuild. LiteLLM routes the same call shape to whatever you saved.

The `SQLAIProviderRepository` (in `backend/app/infrastructure/ai/providers/sql_provider.py`) is the only source of truth; `LiteLLMAIRepository` consumes it per call.

<br/>

## 🛣️ Coming next

- [x] <sub>`v2.0`</sub> &nbsp; **Now** — multi-cluster kubeconfig, SSE log streaming, LiteLLM, Spotlight UI v6, hexagonal backend.
- [ ] <sub>`v2.1`</sub> &nbsp; Helm chart deploy · single-binary mode · SQLite → Postgres migration.
- [ ] <sub>`v2.2`</sub> &nbsp; RBAC-aware views · multi-user session isolation · audit log UI.
- [ ] <sub>`v3.0`</sub> &nbsp; Plugin SDK (third-party LLM analyzers, custom log parsers) · authenticated **public read-only share** links.

> Open a Discussion thread if a feature matters to you — the roadmap is shaped by what people actually use.

<br/>

## 🤝 Contributing

Any-size contribution is welcome — bug reports, docs, code, AI provider adapters.

```bash
git clone https://github.com/mcgrapeng/Spotlight.git && cd Spotlight

cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
pytest -q

cd ../frontend && pnpm install
pnpm test           # Vitest — unit
pnpm test:e2e       # Playwright — browser
```

> Per-package dev guide: [`backend/README.md`](./backend/README.md) · [`frontend/README.md`](./frontend/README.md)
>
> Architecture rule: `domain/` and `application/` never import `kubernetes` or `litellm` directly — they cross the ports declared in `application/ports/`. To add a new auth provider, LLM, or log source — implement the matching adapter in `infrastructure/` and wire it through DI.

<br/>

## 🗂️ Project layout

```
Spotlight/
├── backend/                   FastAPI · hexagonal / clean architecture
│   ├── app/
│   │   ├── application/       use cases + ports (outbound interfaces)
│   │   ├── domain/            entities · value objects · services
│   │   ├── infrastructure/    adapters: ai, auth, cache, config, k8s, logging, persistence
│   │   ├── interface/         api/ (routers · DTOs) + sse/ (event streams)
│   │   └── main.py
│   ├── tests/                 pytest — unit + integration
│   └── requirements.txt
├── frontend/                  Vue 3 + Vite + Tailwind + shadcn-vue
│   ├── src/
│   │   ├── components/        ui/, layout/, common/, pod/, dashboard/, log/, ai/
│   │   ├── views/             9 pages (Login, Dashboard, Pods, PodDetail, Nodes, Events, Favorites, AISettings, Settings)
│   │   ├── stores/            Pinia
│   │   ├── api/               axios + openapi-typescript generated
│   │   └── styles/            design tokens
│   └── package.json
├── assets/                    banner, divider, logo, README screenshots
├── LICENSE                    MIT
├── README.md  ·  README.zh-CN.md
└── …                          config + tooling
```

<br/>

## ❓ FAQ

<details>
<summary><b>Is Spotlight production-ready?</b></summary>

Yes. v2.0 ships with hexagonal architecture, typed API contracts, SSE log streaming, and a test suite that covers the critical ports. The AI analyzer is the only feature that depends on an external LLM — everything else runs entirely offline.

</details>

<details>
<summary><b>How does Spotlight compare to Lens or k9s?</b></summary>

Lens is a full IDE for Kubernetes — great for exploring resources, but it doesn't do AI log analysis. k9s is a terminal UI — fast and minimal, but no web dashboard. Spotlight sits between them: a web dashboard with AI-powered log diagnosis. See the [comparison table](#-vs-the-field) above.

</details>

<details>
<summary><b>Can I use my own LLM endpoint?</b></summary>

Yes. Open **Settings → AI**, click **Add provider**, pick `custom`, and paste the base URL of any OpenAI-compatible endpoint (Ollama, vLLM, LM Studio, etc.). The model name comes from the same form. The row is saved to SQLite and used on the next call — no restart.

</details>

<details>
<summary><b>Does Spotlight store my cluster credentials?</b></summary>

No. Spotlight reads your `KUBECONFIG` at runtime and never persists cluster credentials. The `API_TOKEN` for login is stored in `backend/.env` (gitignored). Teleport sessions are per-session and expire.

</details>

<details>
<summary><b>How do I add a new auth provider?</b></summary>

Implement the `AuthPlugin` interface in `backend/app/infrastructure/auth/plugins/`, register it in the plugin `REGISTRY` (`backend/app/infrastructure/auth/plugins/__init__.py`), and set `AUTH_PROVIDER=<your-plugin-id>` in `.env`. The login form auto-adapts to the plugin's `form_fields()`.

</details>

<details>
<summary><b>Is there a Docker image?</b></summary>

Not yet — v2.1 roadmap includes a Helm chart and single-binary mode. For now, run the two processes directly (see [Quick start](#-quick-start)).

</details>

<br/>

## 🛠️ Development

### Prerequisites

- Python 3.11+ · Node.js 20+ · pnpm
- A `kubeconfig` with at least one context (any cluster, including `minikube` / `kind`)

### Local dev

```bash
# Backend (port 8002, hot-reload)
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8002

# Frontend (port 5173, hot-reload)
cd frontend && pnpm dev
```

### Tests

```bash
# Backend — unit + integration
cd backend && pytest -q

# Frontend — unit (Vitest)
cd frontend && pnpm test

# Frontend — E2E (Playwright, headless Chromium)
cd frontend && pnpm test:e2e
```

### Type checking

```bash
# Backend must be running on :8002 — the script reads /openapi.json
cd frontend && pnpm types:check
```

> **Architecture rule:** `domain/` and `application/` never import `kubernetes` or `litellm` directly. Everything crosses a port declared in `application/ports/`. To add a new auth provider, LLM, or log source — implement the matching adapter and register it.

<br/>

## 💬 Community

- 💬 **[Discussions](https://github.com/mcgrapeng/Spotlight/discussions)** — ask questions, share use cases, propose features
- 🐛 **[Issues](https://github.com/mcgrapeng/Spotlight/issues)** — bug reports and feature requests
- 📖 **[Contributing guide](#-contributing)** — how to get started
- 📦 **[Releases](https://github.com/mcgrapeng/Spotlight/releases)** — changelog and version history

<br/>

## ❤ Sponsor / funding

Spotlight is MIT-licensed, free for everyone. If it saved your team at 2 a.m., a sponsorship keeps the build moving.

<a href="https://github.com/sponsors/mcgrapeng">💖 Sponsor on GitHub</a>

<br/>

## ⭐ Star history

<a href="https://star-history.com/#mcgrapeng/Spotlight&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=mcgrapeng/Spotlight&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=mcgrapeng/Spotlight&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=mcgrapeng/Spotlight&type=Date" />
  </picture>
</a>

<br/>

## 📄 License · Acknowledgements

[MIT](./LICENSE) — do anything, just keep the copyright.

Spotlight rides on **FastAPI**, **Pydantic**, **SQLAlchemy**, **LiteLLM**, **kubernetes-python**, **Vue 3**, **Vite**, **Tailwind CSS**, **shadcn-vue**, **reka-ui**, **Pinia**, **vue-sonner**, **axios**, **Playwright**, **Vitest**, **pytest**, **structlog**.

<br/>

<div align="center" style="padding: 40px 0 16px;">

<sub>Spotlight · built for the dev who already knows <code>kubectl</code>.</sub>

<br/>

<a href="https://github.com/mcgrapeng/Spotlight/issues"><b>🐛 Issues</b></a> · 
<a href="https://github.com/mcgrapeng/Spotlight/discussions"><b>💬 Discussions</b></a> · 
<a href="https://github.com/mcgrapeng/Spotlight/releases"><b>📦 Releases</b></a> · 
<a href="https://github.com/sponsors/mcgrapeng"><b>❤ Sponsor</b></a>

</div>