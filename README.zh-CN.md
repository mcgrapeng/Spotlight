<div align="center">

<img src="docs/banner.svg" alt="Spotlight — 让 Kubernetes 与你对话的驾驶舱。" />

<br/>

**实时 Kubernetes 可观测 &nbsp;·&nbsp; AI 驱动日志分析 &nbsp;·&nbsp; 多集群、多云、一块屏幕。**

<br/>

<a href="https://github.com/anomalyco/Spotlight/blob/master/LICENSE"><img src="https://img.shields.io/github/license/anomalyco/Spotlight?style=for-the-badge&color=18181b&labelColor=18181b" alt="License" /></a>
&nbsp;
<img src="https://img.shields.io/badge/version-2.0.0-18181b?style=for-the-badge&label=version" alt="Version" />
&nbsp;
<img src="https://img.shields.io/badge/python-3.11%2B-326CE5?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
&nbsp;
<img src="https://img.shields.io/badge/node-%E2%89%A520-42b883?style=for-the-badge&logo=node.js&logoColor=white" alt="Node" />
&nbsp;
<img src="https://img.shields.io/badge/license-MIT-18181b?style=for-the-badge" alt="MIT" />

<br/>

<a href="./README.zh-CN.md">简体中文</a> &nbsp;·&nbsp;
<a href="./README.md">English</a>

<br/><br/>

</div>

---

## ✨ 为什么是 Spotlight？

你把东西发上 Kubernetes，看着它跑，然后常常熬到凌晨两点，只为弄明白 **为什么又挂了**。

Spotlight 让这个循环有一个 copilot。

它是一个**有主张的 Kubernetes 驾驶舱**：把你 `kubeconfig` 里所有集群拉到一个界面，实时流式拉取 Pod 日志，再把那些乱七八糟的内容丢给**你自己选的**大模型，要一个即时的、带上下文的解释。它小巧、飞快、端到端强类型，而且**绝不**做云端 SaaS 锁定——你的集群、你的数据、你的模型。

> kubectl 告诉你 **发生了什么**。
> Kubernetes Dashboard 告诉你 **东西在哪**。
> **Spotlight 告诉你 **为什么**。**

<br/>

## 📸 一图概览

<div align="center">
  <img src="docs/screenshots/dashboard.jpeg" alt="Spotlight 仪表盘" width="100%" />
  <br/>
  <sub>默认的 <strong>Overview</strong>——集群健康、资源压力、最近事件，一屏看完。</sub>
</div>

<br/>

## ⚡ 三分钟上手

**Spotlight 是两个进程。跑起来，指向你的 `kubeconfig`，打开 `http://localhost:5173`。**

```bash
# 1. 后端（FastAPI · 端口 8002）
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8002

# 2. 前端（Vue 3 · 端口 5173）——另起一个终端
cd frontend
pnpm install
pnpm dev
```

然后打开 **<http://localhost:5173>**，用任意 `Authorization: Bearer <token>` 登录；只要在 `backend/.env` 里设 `API_TOKEN=<your-token>`——留空则是本地开放模式（启动时会有一条告警，请留意）。

> **用 Teleport？** 在 `.env` 里设 `TELEPORT_PROXY`、`TELEPORT_AUTH`、`TELEPORT_CLUSTER`，Spotlight 就会按会话去签发 `tsh login` 凭证。不需要本地 kubeconfig。

<br/>

## 🔦 核心特性

| | |
|---|---|
| 🧭 **一个 UI，切换多个集群** | 沿用 shell 已有的 `KUBECONFIG`，热切换 context，无需重启。 |
| 📜 **实时日志（SSE 流）** | 多 Pod 选、ANSI 高亮、分组去重、一键下载。 |
| 🤖 **AI 日志分析，模型自选** | 自带 Key——OpenAI · Anthropic · Bedrock · Gemini · Ollama · 通过 **LiteLLM** 支持 100+。 |
| ⌨️ **键盘先行的导航** | `⌘K` 命令面板、`g d / p / n / e / f / a` 跳转页面，给终端手感的人。 |
| 🧱 **可插拔鉴权** | Bearer · Session · Teleport tsh · 你自己的插件（一个文件就够了）。 |
| 🔍 **端到端强类型** | Pydantic v2 → OpenAPI → `openapi-typescript`，前后端不会偷偷漂移。 |
| 🌑 **Appica 设计语言** | 纯黑 `#18181B` · 纯白 `#FAFAFA`，1 px 描边，唯一一道装饰渐变。没有皮噪。 |
| ♿ **默认无障碍** | axe-core 接入 Playwright，键盘可达、屏幕阅读器结构化。 |
| 🧪 **可测到 100 %** | 六边形架构：每个端口可 mock，每个适配器可测，e2e 覆盖关键路径。 |

<br/>

## ⚖️ 和熟悉工具的对比

| | `kubectl` | Kubernetes Dashboard | Lens / OpenLens | **Spotlight** |
|---|---|---|---|---|
| 多集群切换 | `kubectx` | 手动 | ✔ | **✔（实时）** |
| 实时日志流 | `kubectl logs -f` | ✔ | ✔ | **✔（多 Pod + 去重）** |
| AI 日志解读 | ✗ | ✗ | ✗ | **✔（任选模型）** |
| 可插拔鉴权 | ✗ | ✗ | 有限 | **✔（一个文件）** |
| API → UI 强类型 | ✗ | ✗ | ✗ | **✔（Pydantic → TS）** |
| 自托管、无注册 | ✔ | ✔ | 有限 | **✔** |
| 云 / SaaS 锁定 | 无 | 无 | 无 | **无** |
| 有主张、跑得快 | ✗ | ✗ | 有限 | **✔（Appica）** |

> *Spotlight 不会取代 `kubectl`。它是位于其上的那一层——给你看一眼仪表盘、看一眼时间线、看一眼诊断。*

<br/>

## 🖼 截图

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <img src="docs/screenshots/login.jpeg" width="100%" alt="登录" />
        <br/><sub><b>登录</b> · Bearer / Teleport / Session</sub>
      </td>
      <td align="center" width="50%">
        <img src="docs/screenshots/dashboard.jpeg" width="100%" alt="仪表盘" />
        <br/><sub><b>Overview</b> · 集群健康一眼看完</sub>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/screenshots/pods.jpeg" width="100%" alt="Pods" />
        <br/><sub><b>Pods</b> · 实时状态、重启计数、命名空间筛选</sub>
      </td>
      <td align="center">
        <img src="docs/screenshots/ai.jpeg" width="100%" alt="AI 分析器" />
        <br/><sub><b>AI 分析器</b> · 喂最后 200 行，挑个模型</sub>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="docs/screenshots/nodes.jpeg" width="100%" alt="节点" />
        <br/><sub><b>Nodes</b> · 容量、压力、可分配</sub>
      </td>
      <td align="center">
        <img src="docs/screenshots/events.jpeg" width="100%" alt="事件" />
        <br/><sub><b>Events</b> · 警告 / 普通时间线</sub>
      </td>
    </tr>
    <tr>
      <td align="center" colspan="2">
        <img src="docs/screenshots/settings.jpeg" width="100%" alt="设置" />
        <br/><sub><b>设置</b> · AI 提供商、日志偏好、kubeconfig 来源</sub>
      </td>
    </tr>
  </table>
</div>

<br/>

## 🧬 架构

Spotlight 是**六边形 / Clean Architecture** 服务。Domain 不知道 Kubernetes、AI 或 HTTP 这些事；那是适配器的事。

```
                ┌─────────────────────────────────────────────────┐
                │                   Browser (Vue 3)               │
                │  shadcn-vue · Pinia · Vue Router · vue-sonner   │
                └─────────────┬──────────────────────┬────────────┘
                              │  axios + OpenAPI      │  SSE
                              │  （强类型）           │  （实时）
                              ▼                      ▼
        ┌──────────────────────────────────────────────────────────┐
        │                  Interface（HTTP 入口）                   │
        │            FastAPI 路由 · 中间件 · CORS · 依赖注入         │
        └──────────────────────────┬───────────────────────────────┘
                                   ▼
        ┌──────────────────────────────────────────────────────────┐
        │                 Application（用例层）                     │
        │         commands · queries · handlers · CQRS 派发          │
        └──────────────────────────┬───────────────────────────────┘
                                   ▼
        ┌──────────────────────────────────────────────────────────┐
        │                     Domain（纯域）                        │
        │            实体 · 值对象 · 域服务 · 端口定义                │
        └────────────┬──────────────────────────┬──────────────────┘
                     ▼                          ▼
        ┌────────────────────────┐  ┌─────────────────────────────┐
        │   K8s 适配器端口       │  │   LLM 适配器端口            │
        │  （kubernetes-python） │  │  （LiteLLM — 任选 provider）│
        └────────────────────────┘  └─────────────────────────────┘
                     │                          │
                     ▼                          ▼
        ┌────────────────────────┐  ┌─────────────────────────────┐
        │  多上下文连接池        │  │  OpenAI · Anthropic · Bedrock│
        │  kubeconfig 热加载    │  │  Gemini · Ollama · +100 …   │
        └────────────────────────┘  └─────────────────────────────┘
```

> **想加一种新的鉴权方式、日志源或 LLM？** 在 `infrastructure/<thing>/` 加一个实现端口的适配器，注册到注册表，其它啥都不用动。

<br/>

## 🤖 AI 提供商，即插即用

底层是 **LiteLLM**——一个环境变量就能切。

| 提供商 | `AI_PROVIDER=` | 额外配置 |
|---|---|---|
| **OpenAI** | `openai` | `OPENAI_API_KEY` |
| **Anthropic** | `anthropic` | `ANTHROPIC_API_KEY` |
| **Azure OpenAI** | `azure` | `AZURE_API_KEY` · `AZURE_API_BASE` · `AZURE_API_VERSION` |
| **AWS Bedrock** | `bedrock` | `AWS_ACCESS_KEY_ID` · `AWS_REGION` |
| **Google Gemini / Vertex** | `gemini` / `vertex` | `GEMINI_API_KEY` / `VERTEX_PROJECT` |
| **Ollama（本地）** | `ollama` | `OLLAMA_API_BASE=http://host:11434` |
| **OpenRouter** | `openrouter` | `OPENROUTER_API_KEY` |
| **其它任何兼容 OpenAI 的服务** | `custom` | `AI_API_BASE` · `AI_API_KEY` |

**模型** 在 UI 里切换——不需要重启。

<br/>

## 🛠 技术栈

<table>
  <tr>
    <td><b>后端</b></td>
    <td>
      <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
      <img src="https://img.shields.io/badge/Pydantic%20v2-E92063?style=for-the-badge&logo=pydantic&logoColor=white" alt="Pydantic" />
      <img src="https://img.shields.io/badge/k8s%20client-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="k8s" />
      <img src="https://img.shields.io/badge/LiteLLM-1A1A1A?style=for-the-badge" alt="LiteLLM" />
      <img src="https://img.shields.io/badge/SQLAlchemy-D71A00?style=for-the-badge&logo=sqlalchemy&logoColor=white" alt="SQLAlchemy" />
      <img src="https://img.shields.io/badge/structlog-2E2E2E?style=for-the-badge" alt="structlog" />
    </td>
  </tr>
  <tr>
    <td><b>前端</b></td>
    <td>
      <img src="https://img.shields.io/badge/Vue%203-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
      <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
      <img src="https://img.shields.io/badge/shadcn--vue-18181B?style=for-the-badge" alt="shadcn-vue" />
      <img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=18181B" alt="Pinia" />
      <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
    </td>
  </tr>
  <tr>
    <td><b>测试</b></td>
    <td>
      <img src="https://img.shields.io/badge/pytest-0A9EDC?style=for-the-badge&logo=pytest&logoColor=white" alt="pytest" />
      <img src="https://img.shields.io/badge/Vitest-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
      <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
      <img src="https://img.shields.io/badge/axe--core-30009F?style=for-the-badge" alt="axe" />
    </td>
  </tr>
  <tr>
    <td><b>基础设施</b></td>
    <td>
      <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
      <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
      <img src="https://img.shields.io/badge/SSE-2E2E2E?style=for-the-badge" alt="SSE" />
    </td>
  </tr>
</table>

<br/>

## 🗺 路线图

- [x] **v2.0** — 多集群 kubeconfig、SSE 实时日志、LiteLLM AI、Appica UI v6、六边形后端。
- [ ] **v2.1** — Helm chart 部署、单二进制模式、SQLite 平滑迁移到 Postgres。
- [ ] **v2.2** — RBAC 视图、多用户会话隔离、审计日志 UI。
- [ ] **v3.0** — 插件 SDK（第三方 LLM 分析器、自定义日志解析器）、**只读公开分享**链接。

> 如果某条对你重要，开个 Discussion——路线图是按真实使用塑形的。

<br/>

## 🧑‍💻 参与贡献

任何规模的贡献都欢迎——bug 报告、文档、代码、AI 提供商适配器。

```bash
# Fork 之后：
git clone https://github.com/<you>/Spotlight.git && cd Spotlight

# 后端测试
cd backend && source .venv/bin/activate
pytest -q

# 前端测试（Vitest + Playwright）
cd ../frontend && pnpm install
pnpm test           # 单元
pnpm test:e2e       # 浏览器
```

> 各包的开发指南见 [`backend/README.md`](./backend/README.md) 与 [`frontend/README.md`](./frontend/README.md)。架构规则——一句话：**只用端口与适配器**，`app/` 里不许漏出 `kubernetes`、`litellm` 这种具体类型。

<br/>

## 🩻 健康检查

Spotlight 暴露了一个 `/healthz`，探针或仪表盘都可以用：

```
GET /healthz
{ "status": "ok" }
```

OpenAPI 规范在 `GET /openapi.json`，Swagger UI 在 `/docs`。

<br/>

## 📐 仓库布局

```
Spotlight/
├── backend/                  # FastAPI 应用 — 六边形 / 整洁架构
│   ├── app/
│   │   ├── application/      # commands、queries、handlers（用例）
│   │   ├── domain/           # 纯实体、值对象、端口
│   │   ├── infrastructure/   # 适配器：k8s、db、日志、LLM、auth
│   │   ├── interface/api/    # FastAPI 路由 / DTO
│   │   └── main.py
│   ├── tests/                # pytest —— 单元 + 集成
│   └── requirements.txt
├── frontend/                 # Vue 3 + Vite + Tailwind + shadcn-vue
│   ├── src/
│   │   ├── components/       # ui/、layout/、common/、pod/、dashboard/、log/、ai/
│   │   ├── views/            # Login、Dashboard、Pods、PodDetail、Nodes、Events、AI、Settings、Favorites
│   │   ├── stores/           # Pinia
│   │   ├── api/              # axios + openapi-typescript 生成的客户端
│   │   └── styles/           # 设计 token
│   └── package.json
├── docs/                     # 架构、截图资源、本 README
├── banner.svg / logo.svg     # 品牌资产
└── README.md / README.zh-CN.md
```

<br/>

## ⭐ Star 历史

<a href="https://star-history.com/#anomalyco/Spotlight&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Timeline&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Timeline" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=anomalyco/Spotlight&type=Timeline" />
  </picture>
</a>

<br/>

## 📝 许可证

[MIT](./LICENSE)——随便用，保留版权就行。

<br/>

## 🙏 致谢

Spotlight 站在一个巨大的开源生态肩上。依赖图里出现最多的名字：**FastAPI**、**Pydantic**、**SQLAlchemy**、**LiteLLM**、**kubernetes-python**、**Vue 3**、**Vite**、**Tailwind CSS**、**shadcn-vue**、**Radix Vue**、**Pinia**、**Lucide**、**Axios**、**Playwright**、**Vitest**、**pytest**、**structlog**。

<br/>

<div align="center">

<sub>Spotlight · 给已经会 kubectl 的人。</sub>

<br/>

<a href="#-为什么是-spotlight">⇡ 回到顶部</a>

</div>
