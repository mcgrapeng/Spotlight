# Spotlight 前端 (v6)

## 设计系统

- **shadcn-vue** (Radix Vue + Tailwind CSS) — 所有 UI 原语
- **Appica 黑白色板** — 纯白底 `#FAFAFA` + 纯黑字 `#18181B` + 1px 灰边框 `#E4E4E7`
- **装饰渐变** `#8EC5FF → #EFADF7 → #FFD69B` — **仅** Login 卡片底边 1px
- **Inter** + 中文字体（PingFang SC / Microsoft YaHei）兜底

## 关键决策

| 选择 | 理由 |
| --- | --- |
| shadcn-vue | 组件源码在仓可改；Radix Vue 无障碍原语 |
| Appica 配色 | 纯黑白灰 = 最克制最专业；渐变点睛 |
| Logo 在 Top toolbar 最左 | Linear 风格 |
| Sidebar 仅 6 导航项 + 设置 | 无 Logo/搜索/Workspace 冗余 |
| ⌘K 仅键盘调起 | UI 不显示触发按钮 |
| namespace 用 Combobox | 生产环境 namespace 多，无搜索体验差 |
| 圆角 14px | Appica 标准 |

## 开发

用 **pnpm**（`package.json` 里的 `build` 脚本内部就调用 `pnpm run`，且
`pnpm-lock.yaml` 是仍在维护的 lockfile）。

```bash
pnpm install
pnpm run dev
```

## 构建

```bash
# 注意：build 会先跑 types:check，它需要 18080（或 .env 里 VITE_API_PROXY
# 指定端口）上有后端在跑；只想打包产物就用 pnpm exec vite build
pnpm run build
```

## 测试

```bash
pnpm run test          # Vitest 单元
pnpm run test:e2e      # Playwright E2E
```

E2E 分两类，说明见 [`e2e/README.md`](./e2e/README.md)：

- 大部分 spec 用 `page.route()` mock 掉 `/api`，只测 UI
- `cluster-switch.spec.ts` 跑**真实后端 + 两个假 apiserver**，验证「切换集群
  真的换了数据」。它需要 `../backend/.venv` 存在；CI 里通过
  `SPOTLIGHT_BACKEND_PY` 指定解释器。缺了解释器会直接报错，不会静默跳过。

## 目录结构

```
src/
├── components/
│   ├── ui/        # shadcn-vue 组件
│   ├── layout/    # AppLayout / AppHeader / AppSidebar / MobileDrawer
│   ├── common/    # StatusPill / EmptyState / LoadingState / ErrorState / PageHeader / StatCard
│   ├── pod/       # PodStatusPill
│   ├── dashboard/ # Dashboard 专属
│   ├── log/       # LogViewer
│   └── ai/        # AIProviderForm / LogAnalyzerDrawer
├── views/         # 8 个页面
├── stores/        # Pinia
├── api/           # axios endpoints
└── styles/main.css  # design tokens + Tailwind
```

## 快捷键

- `⌘K` / `Ctrl+K` — 命令面板
- `g d / p / n / e / f / a` — 快速跳转页面（由 composable 提供）