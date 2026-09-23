# K8s Viewer — 开源对比与设计决策

> 调研日期：2026-09 ｜ 作者：MiniMax-M3 ｜ 目的：在动手前对照开源生态，避免重造轮子。

## 1. 对比对象

| 项目 | Stars | 技术栈 | 核心卖点 | 与本项目关联度 |
|---|---|---|---|---|
| **[Headlamp](https://headlamp.dev)** (kubernetes-sigs) | — | TS + React + Material UI | 官方 SIG UI，**插件架构**最成熟，in-cluster / desktop 双形态 | **极高** |
| **[Lens](https://k8slens.dev)** (Mirantis) | 23.2k | TS + React | 1M+ 用户，最完整 IDE；extension API；已闭源化 | 高 |
| **[HyperDX](https://github.com/hyperdxio/hyperdx)** | 9.9k | TS + ClickHouse | 日志/指标/trace 统一面板，**`level:err` 风格的快速过滤**；CLI 工具 | 中（日志 UI） |
| **[k9s](https://k9scli.io)** | — | Go + TUI | 终端风格极致密度，**快捷键 + Vim** 操作 | 中（UX 取向） |
| **[Monokle](https://monokle.io)** | — | TS + React | 桌面端 KPI / 拓扑图 | 低 |
| **[Argo CD](https://argoproj.github.io/cd/)** | — | Go + TS | 应用层 GitOps 面板 | 入口低 |

## 2. 我们应该学的（借鉴清单）

### 2.1 Headlamp 插件系统（推荐）
- 每个功能模块是独立 JS/TS 包，挂载路由 / sidebar / detail / appBar
- 我们不必一步到位到完整插件机制，但 **端口抽象** 应让"AI 分析""告警""拓扑"等模块独立
- 建议：**保留 Hex 架构 + 在 interface 里新增 `app.modules` 注册点**（轻量级，未来扩展到完整插件无需重构）

### 2.2 HyperDX 日志面板
- **顶部多列布局**：`Search | Live tail | Field facet | Time range`
- 字段语法：`level:err pod_name:webapp service:api`
- **列视图**：把每条日志视为一行表，列可配置（time / level / msg / pod / trace_id）
- 行内 expand 栈追踪（点 + 展开 N 行）
- **彩条 + 行号 + 严重级徽章**
- 借鉴：我们的 LogViewer v2 已经覆盖一部分，可以再进一步把"严重级"做成可点击 facet

### 2.3 k9s UX 哲学
- 单键直达：`p` 跳 pods、`n` namespace、`:` 命令行
- 高密度，零装饰
- 借鉴：前端用 `j/k` vim 风格翻日志、cmd palette 强化

### 2.4 Lens 设计语言
- 深色 + 微玻璃质感（border + 半透明阴影）
- **spacious card + 显式数据层级**
- 大字号数字 + 小字标签
- 借鉴：dashboard KPI 重新排版，主数字更大、标签更小、单位灰色

## 3. 我们应当避开的（反模式）

| 反模式 | 来源 | 我们怎么做 |
|---|---|---|
| 巨型 iframe 套娃（Lens 早期） | Lens | 直接 DOM + 路由 |
| 闭源化（Lens） | Lens | 永远保持依赖完整可移植（这次不再闭源） |
| 全局 CSS 变量 vs styled-components 散乱 | 多家 | **统一 token 文件 + 全用 CSS 变量**（已做到） |
| 自撸 logger、metrics、tracing | 多家 | 全用 OpenTelemetry（如已开） |
| 过度抽象抽象（Polaris） | Shopify | 单一职责，但**别做「理论上可扩展」的过度抽象** |

## 4. 我对 K8s Viewer 的设计方向（基于对比）

### 4.1 信息密度（学 k9s + Lens）
- Dashboard 健康数字放大 36→48px
- 阶段分布改成 horizontal stacked bar（一屏看完）
- 顶部永远可见「当前 cluster · namespace · 用户」

### 4.2 操作效率（学 k9s）
- Cmd palette 全局快捷键 `Cmd+K`（已做）
- Pod list 行级快捷键：`a` 收藏 / `d` 删除（容器）/ `l` 实时跟踪 / `y` 复制 yaml
- 详情页 `1/2/3` 切换 tab

### 4.3 日志核心（学 HyperDX）
- 加 `level:xxx` facet chip 列（在工具栏）
- 顶部 sparkline（5 分钟内错误趋势）
- 列视图切换（time / level / pod / msg）

### 4.4 视觉语言（学 Linear + Vercel）
- 卡片圆角从 6 → 8 px（更柔和）
- 主色从 indigo `#5b8def` → 更现代 `#6E78FF`
- 阴影用 `box-shadow: 0 1px 2px rgba(0,0,0,.4)` 微玻璃
- 数字字体用 `Inter` + `tabular-nums`

## 5. 我不学的东西（节制设计）

| 不做 | 理由 |
|---|---|
| 完整插件系统（运行时动态加载） | 用户没要求，且会过度设计；**用端口抽象 + 注册点替代** |
| 实时 trace / span 瀑布图 | K8s viewer 不做 APM，是 observability 工具的事 |
| 集群拓扑图 / Cytoscape | 信息密度低，KPI 已经够了 |
| 全部 3D / 动画 | 性能 vs 收益不划算 |
| 编辑器嵌入（Monaco） | log viewer 已经有 stack-trace 高亮 |

## 6. 下一步

1. 输出新文件夹结构 + 端口抽象（轻量级"插件感"）
2. 重构 design tokens 为 v3（更大数字、更柔和圆角、新主色）
3. 按顺序重做：DASHBOARD → PODS → PODDETAIL → NODES → EVENTS → LOGIN → FAVORITES → AI
4. 每个页面补一组测试（vitest +e2e）
5. 整体跑：92 → 200+ 测试，e2e 9 → 15+