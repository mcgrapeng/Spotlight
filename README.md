<div align="center">

<img src="assets/banner.svg" alt="Spotlight — A Kubernetes dashboard that thinks with you." />

<br/>

# Spotlight

**A Kubernetes dashboard that thinks with you.**

<sub>Real-time multi-cluster visibility &nbsp;·&nbsp; AI log explainer &nbsp;·&nbsp; bring-your-own LLM &nbsp;·&nbsp; self-host, no SaaS lock-in</sub>

<br/>

<a href="#-quick-start"><img src="https://img.shields.io/badge/▶_Quick_start-18181B?style=for-the-badge&logoColor=white" alt="Quick start" /></a>&nbsp;
<a href="#-star-history"><img src="https://img.shields.io/badge/★_Star_this_repo-EFADF7?style=for-the-badge&logoColor=18181B" alt="Star" /></a>&nbsp;
<a href="https://github.com/anomalyco/Spotlight/discussions"><img src="https://img.shields.io/badge/💬_Discussions-8EC5FF?style=for-the-badge&logoColor=18181B" alt="Discussions" /></a>&nbsp;
<a href="#-sponsor--funding"><img src="https://img.shields.io/badge/❤_Sponsor-FFD69B?style=for-the-badge&logoColor=18181B" alt="Sponsor" /></a>

<br/>

<a href="./README.md"><b>English</b></a> &nbsp;·&nbsp;
<a href="./README.zh-CN.md">简体中文</a>

</div>

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; The pitch

<p align="center">
  <em><code>kubectl</code> tells you <b>what</b> is happening.</em><br/>
  <em><code>Kubernetes&nbsp;Dashboard</code> tells you <b>where</b> it is.</em><br/>
  <em><code>Spotlight</code> tells you <b><i>why</i></b>.</em>
</p>

<br/>

Spotlight is an opinionated Kubernetes dashboard for the dev who *already* knows `kubectl`. It pulls every cluster in your kubeconfig into one view, streams Pod logs in real time, and hands the messy ones to an LLM **you pick** for a contextual explanation — *no SaaS, no vendor lock, your cluster, your data, your model.*

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; 60-second tour

<table>
<tr>
<td width="25%" valign="top" align="center">

**01 · Log in**

<img src="assets/screenshots/login.jpeg" width="100%" alt="Login" />

<sub>Bearer, Teleport tsh, or session — 30 seconds, no signup.</sub>

</td>
<td width="25%" valign="top" align="center">

**02 · Watch the cluster**

<img src="assets/screenshots/dashboard.jpeg" width="100%" alt="Dashboard" />

<sub>Health, pressure, signals on one screen.</sub>

</td>
<td width="25%" valign="top" align="center">

**03 · Pick the noisy Pod**

<img src="assets/screenshots/pods.jpeg" width="100%" alt="Pods" />

<sub>Live status, restart counts, namespace filter.</sub>

</td>
<td width="25%" valign="top" align="center">

**04 · Let the LLM explain**

<img src="assets/screenshots/ai.jpeg" width="100%" alt="AI Analyzer" />

<sub>Pull the last 200 lines, click *Analyze*.</sub>

</td>
</tr>
</table>

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; What you get

<table>
<tr>
<td width="50%" valign="top">

### 🧭 Multi-cluster, one UI
Switch contexts live — the exact `KUBECONFIG` your shell already respects. No restart.

</td>
<td width="50%" valign="top">

### 📜 Real-time log streaming (SSE)
Multi-pod select, ANSI color preserved, deduplicated, download.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🤖 AI log explainer, any model
Bring your own key — OpenAI · Anthropic · Bedrock · Gemini · Ollama · 100+ via LiteLLM.

</td>
<td width="50%" valign="top">

### ⌨️ Keyboard-first
`⌘K` palette · `g d / p / n / e / f / a` to leap between pages · no mouse needed.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🧱 Pluggable auth
Bearer · session · Teleport tsh · your own plugin (one file).

</td>
<td width="50%" valign="top">

### 🔍 Type-safe, end-to-end
Pydantic v2 → OpenAPI → `openapi-typescript`. Frontend can't drift from backend.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🌑 Appica design language
Pure black `#18181B` on pure white `#FAFAFA` · 1 px borders · one accent gradient.

</td>
<td width="50%" valign="top">

### 🧪 100 % testable
Hexagonal architecture · every port mocked · every adapter tested · e2e covers the critical paths.

</td>
</tr>
</table>

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; vs. the field

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

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; AI in action

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

> [!TIP]
> **Swap models without restart.** Change `AI_PROVIDER` in `.env`, save, pick a different model in the UI. The same call routes to OpenAI, Anthropic, Bedrock, Gemini, Ollama, or **any OpenAI-compatible endpoint**.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; How it's built

Hexagonal / Clean Architecture — the **domain knows nothing about Kubernetes, AI, or HTTP**; adapters do.

```mermaid
flowchart TB
  classDef ui    fill:#1A1A24,stroke:#8EC5FF,stroke-width:1.5px,color:#FAFAFA
  classDef api   fill:#1A1A24,stroke:#EFADF7,stroke-width:1.5px,color:#FAFAFA
  classDef app   fill:#1A1A24,stroke:#FFD69B,stroke-width:1.5px,color:#FAFAFA
  classDef dom   fill:#0F0E16,stroke:#8EC5FF,stroke-width:1px,color:#FAFAFA
  classDef port  fill:#0F0E16,stroke:#EFADF7,stroke-width:1px,color:#FAFAFA
  classDef infra fill:#11111A,stroke:#5A5A75,stroke-width:1px,color:#CFCFD8
  classDef store fill:#0F0E16,stroke:#FFD69B,stroke-width:1px,color:#FFD69B

  subgraph Browser["Browser · Vue 3"]
    UI["shadcn-vue · Pinia · Router · Sonner"]:::ui
  end

  subgraph Edge["Interface · HTTP"]
    API["FastAPI routers · deps · CORS"]:::api
  end

  subgraph App["Application · use cases"]
    UC["commands · queries · handlers (CQRS)"]:::app
  end

  subgraph Dom["Domain · pure"]
    ENT["entities · value objects"]:::dom
    PK["port: K8s"]:::port
    PL["port: LLM"]:::port
  end

  subgraph Infra["Infrastructure · adapters"]
    K8S["multi-context k8s pool"]:::infra
    LLM["LiteLLM — any provider"]:::infra
    DB[("SQLite")]:::store
  end

  UI <-->|"axios + OpenAPI · type-safe"| API
  API --> UC
  UC --> ENT
  UC --> PK & PL
  PK -. implemented by .-> K8S
  PL -. implemented by .-> LLM
  K8S --> DB
```

> **Want to add an auth provider, log source, or LLM?** Add an `infrastructure/<thing>/` adapter that implements the matching port, register it. Nothing else moves.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Quick start

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

Open <http://localhost:5173>. Log in with any `Authorization: Bearer <token>` — set `API_TOKEN=<your-token>` in `backend/.env`, **or leave it empty** for local open mode (the app logs a startup warning either way).

> **Have Teleport?** Set `TELEPORT_PROXY` / `TELEPORT_AUTH` / `TELEPORT_CLUSTER` in `.env`. Spotlight issues per-session `tsh login` credentials — no kubeconfig needed.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Stack

**Backend**
<a href="#"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" /></a>
<a href="#"><img src="https://img.shields.io/badge/Pydantic%20v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white" alt="Pydantic" /></a>
<a href="#"><img src="https://img.shields.io/badge/k8s--python-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="kubernetes-python" /></a>
<a href="#"><img src="https://img.shields.io/badge/LiteLLM-1A1A1A?style=for-the-badge" alt="LiteLLM" /></a>
<a href="#"><img src="https://img.shields.io/badge/SQLAlchemy-D71A00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" /></a>

**Frontend**
<a href="#"><img src="https://img.shields.io/badge/Vue%203-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" /></a>
<a href="#"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
<a href="#"><img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" /></a>
<a href="#"><img src="https://img.shields.io/badge/shadcn--vue-18181B?style=for-the-badge" alt="shadcn-vue" /></a>
<a href="#"><img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=18181B" alt="Pinia" /></a>

**Tests**
<a href="#"><img src="https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white" alt="pytest" /></a>
<a href="#"><img src="https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" /></a>
<a href="#"><img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" /></a>
<a href="#"><img src="https://img.shields.io/badge/axe--core-30009F?style=for-the-badge" alt="axe" /></a>

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; AI providers

Powered by **LiteLLM**. One env-var to swap, model picked from the UI.

| Provider | `AI_PROVIDER=` | Set in env |
|---|---|---|
| **OpenAI** | `openai` | `OPENAI_API_KEY` |
| **Anthropic** | `anthropic` | `ANTHROPIC_API_KEY` |
| **Azure OpenAI** | `azure` | `AZURE_API_KEY` · `AZURE_API_BASE` · `AZURE_API_VERSION` |
| **AWS Bedrock** | `bedrock` | `AWS_ACCESS_KEY_ID` · `AWS_REGION` |
| **Google Gemini / Vertex** | `gemini` / `vertex` | `GEMINI_API_KEY` / `VERTEX_PROJECT` |
| **Ollama (local)** | `ollama` | `OLLAMA_API_BASE=http://host:11434` |
| **OpenRouter** | `openrouter` | `OPENROUTER_API_KEY` |
| **Any OpenAI-compatible API** | `custom` | `AI_API_BASE` · `AI_API_KEY` |

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Coming next

- [x] <sub>`v2.0`</sub> &nbsp; **Now** — multi-cluster kubeconfig, SSE log streaming, LiteLLM, Appica UI v6, hexagonal backend.
- [ ] <sub>`v2.1`</sub> &nbsp; Helm chart deploy · single-binary mode · SQLite → Postgres migration.
- [ ] <sub>`v2.2`</sub> &nbsp; RBAC-aware views · multi-user session isolation · audit log UI.
- [ ] <sub>`v3.0`</sub> &nbsp; Plugin SDK (third-party LLM analyzers, custom log parsers) · authenticated **public read-only share** links.

> Open a Discussion thread if a feature matters to you — the roadmap is shaped by what people actually use.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Contributing

Any-size contribution is welcome — bug reports, docs, code, AI provider adapters.

```bash
git clone https://github.com/<you>/Spotlight.git && cd Spotlight

cd backend && source .venv/bin/activate
pip install -r requirements.txt
pytest -q

cd ../frontend && pnpm install
pnpm test           # Vitest — unit
pnpm test:e2e       # Playwright — browser
```

> Per-package dev guide: [`backend/README.md`](./backend/README.md) · [`frontend/README.md`](./frontend/README.md)
> Architecture rule: **ports and adapters only** — `app/` never imports `kubernetes` or `litellm` directly.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Project layout

```
Spotlight/
├── backend/                   FastAPI · hexagonal / clean architecture
│   ├── app/
│   │   ├── application/       commands · queries · handlers (use cases)
│   │   ├── domain/            entities · value objects · ports
│   │   ├── infrastructure/    adapters: k8s, db, logging, LLM, auth
│   │   ├── interface/api/     FastAPI routers / DTOs
│   │   └── main.py
│   ├── tests/                 pytest — unit + integration
│   └── requirements.txt
├── frontend/                  Vue 3 + Vite + Tailwind + shadcn-vue
│   ├── src/
│   │   ├── components/        ui/, layout/, common/, pod/, dashboard/, log/, ai/
│   │   ├── views/             8 pages (Login, Dashboard, Pods, PodDetail, Nodes, …)
│   │   ├── stores/            Pinia
│   │   ├── api/               axios + openapi-typescript generated
│   │   └── styles/            design tokens
│   └── package.json
├── assets/                    brand banner / mark / divider / README screenshots
├── LICENSE                    MIT
├── README.md  ·  README.zh-CN.md
└── …                          config + tooling
```

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Sponsor / funding

Spotlight is MIT-licensed, free for everyone. If it saves your team time at 2 a.m. and you'd like to support its development, sponsorship helps.

> **[Sponsor on GitHub](https://github.com/sponsors/anomalyco)** &nbsp;·&nbsp; one-off or monthly, your call.

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; ⭐ Star history

<a href="https://star-history.com/#anomalyco/Spotlight&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Date" />
  </picture>
</a>

<br/>

<p align="center">
  <img src="assets/divider.svg" alt="" width="200" />
</p>

<br/>

## <img src="assets/logo-mark.svg" alt="" width="22" align="absmiddle" /> &nbsp; Licence · Acknowledgements

[MIT](./LICENSE) — do anything, just keep the copyright.

Spotlight rides on **FastAPI**, **Pydantic**, **SQLAlchemy**, **LiteLLM**, **kubernetes-python**, **Vue 3**, **Vite**, **Tailwind CSS**, **shadcn-vue**, **Radix Vue**, **Pinia**, **Lucide**, **Axios**, **Playwright**, **Vitest**, **pytest**, **structlog**.

<br/>

<div align="center">

<img src="assets/logo-mark.svg" alt="" width="44" />

<br/><br/>

<sub>Spotlight · built for the dev who already knows <code>kubectl</code>.</sub>

<br/><br/>

<sub>📚 &nbsp; Docs · 🐛 &nbsp; Issues · 💬 &nbsp; Discussions · 📦 &nbsp; Releases · ❤️ &nbsp; Sponsor</sub>

</div>
