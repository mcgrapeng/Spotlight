# k8s-viewer

可视化的 Kubernetes Pod 日志 / 状态查看器。专为通过 **Teleport (`tsh`)** 访问受限 K8s 集群的场景设计。

后端读 `~/.kube/config`（由 `tsh kube login` 写入），前端直接复用 Naive UI / Tailwind，无任何重造轮子。

## 功能

- 🛰️ 多集群：自动枚举 kubeconfig 上下文，顶部切换 cluster + namespace
- 📊 Dashboard：核心指标、Pod 状态分布、最近告警、重启 Top 10
- 📋 Pod 列表：状态 / 重启次数 / 节点过滤、搜索
- 📜 Pod 详情：元数据 + Container 状态 + 实时日志（SSE 流式 tail）+ Events
- 🛰️ Events：跨 namespace 全局告警
- 🖥️ Nodes：节点列表 + CPU 分配率
- ⭐ 收藏夹：关注的 Pod 一键收藏（SQLite 持久化）

## 技术栈

**Backend** — FastAPI · kubernetes-python-client · SQLAlchemy 2 (async) · SQLite · sse-starlette · Pydantic v2
**Frontend** — Vue 3 + TypeScript + Vite · Naive UI · Tailwind CSS · Pinia · Vue Router · Axios · Day.js

## 前置

```bash
tsh login --proxy=gt.internal.zhiman.tech:443 --auth=local --user=zhangpeng gt.internal.zhiman.tech
tsh kube login pvg1s1-cloud
```

`tsh` 会自动写入 `~/.kube/config`。Backend 启动时读取它。

## 启动

### 方式一：Docker Compose（推荐）

```bash
make up
# UI: http://localhost:5173
# API: http://localhost:8000/docs
```

### 方式二：本地开发

```bash
make install

# 终端 1: 后端
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# 终端 2: 前端
cd frontend && npm run dev
```

## 设计要点

1. **零轮子**：
   - K8s 调用 → `kubernetes` 官方客户端
   - UI 组件 → Naive UI（克制、完整）
   - 流式日志 → `sse-starlette` SSE + 浏览器原生 `EventSource`
   - 数据校验 → Pydantic v2
   - DB → SQLAlchemy 2 + SQLite（仅收藏夹，K8s 数据不落库）

2. **优雅 / 简约**：
   - 深色为主，zinc/indigo 调色板
   - Inter + JetBrains Mono
   - 大量留白，统一 8px 圆角
   - 状态色语义化（绿 Running / 黄 Pending / 红 Failed）
   - 左侧固定 240px 侧边栏 + 顶部 56px 顶栏 + 主内容 max-width 1440px

3. **最小可扩展**：
   - 所有路由前缀 `/api/v1`，加 v2 不破坏
   - Pydantic schemas 与 K8s 对象解耦 → 切换 K8s client 实现零成本
   - Pinia stores 单独可测 → 加 RBAC / 多租户时只换 store
   - 日志流改 WebSocket 只需替换 `logsApi.streamUrl`

## 文件结构

```
k8s-viewer/
├── backend/                    FastAPI 后端
│   ├── app/
│   │   ├── main.py             入口
│   │   ├── config.py           Settings (pydantic-settings)
│   │   ├── core/
│   │   │   ├── k8s_client.py   复用官方 K8s client
│   │   │   └── logging.py
│   │   ├── api/v1/             REST 路由
│   │   ├── schemas/k8s.py      Pydantic 模型
│   │   ├── services/k8s_service.py  业务逻辑 + 日志流生成器
│   │   └── db/base.py          SQLAlchemy 模型 (仅 favorites)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                   Vue 3 SPA
│   ├── src/
│   │   ├── main.ts / App.vue
│   │   ├── router/             Vue Router
│   │   ├── stores/             Pinia (cluster / ui)
│   │   ├── api/                Axios + 类型化接口
│   │   ├── components/
│   │   │   ├── layout/         Header / Sidebar / Layout
│   │   │   ├── common/         StatCard / PodStatusBadge
│   │   │   └── log/            LogViewer (SSE + 过滤)
│   │   ├── views/              Dashboard / PodList / PodDetail / Nodes / Events / Favorites
│   │   ├── styles/main.css
│   │   └── types/
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
└── Makefile
```

## API 概览

| Method | Path | 说明 |
|---|---|---|
| GET | `/api/v1/clusters` | kubeconfig 上下文列表 |
| GET | `/api/v1/namespaces` | 命名空间 |
| GET | `/api/v1/pods` | Pod 列表 (支持 status / search / namespace 过滤) |
| GET | `/api/v1/pods/stats` | Dashboard 聚合 |
| GET | `/api/v1/pods/{ns}/{name}` | Pod 详情 |
| GET | `/api/v1/pods/{ns}/{name}/logs` | 历史日志 |
| GET | `/api/v1/pods/{ns}/{name}/logs/stream` | **SSE** 实时日志 |
| GET | `/api/v1/events` | K8s Events |
| GET | `/api/v1/nodes` | Nodes |
| GET/POST/DELETE | `/api/v1/favorites` | 收藏夹 |

OpenAPI 文档：`http://localhost:8000/docs`

## 数据库模式（最小）

只一张表 — `favorites`：

```sql
CREATE TABLE favorites (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  resource_type VARCHAR(32) NOT NULL,  -- 'pod' | 'node' | 'namespace'
  name          VARCHAR(255) NOT NULL,
  namespace     VARCHAR(255) DEFAULT '',
  cluster       VARCHAR(255) DEFAULT '',
  note          VARCHAR(512) DEFAULT '',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

K8s 资源元数据**不落库** — 实时查询 K8s API，避免数据陈旧。

## 故障排查

- **`load_kube_config` 报错** → 确认 `~/.kube/config` 存在且当前 context 可用：`tsh status`
- **SSE 一直 idle** → 检查 nginx/proxy 的 `proxy_buffering off`
- **CORS** → 修改 backend `.env` 的 `CORS_ORIGINS`
