# 评估：`greensock/gsap-skills` 是否需要装到本机各编码 agent

**日期**：2026-10-20
**结论**：全局不装。当前 7 个 agent 都不装，只在出现真正的 GSAP 项目时按项目级范围装。

仓库事实明细见同目录 `gsap-skills-repo-report.md`（396 行，82 条引用）。本文只写判断与本机证据。

## 1. 仓库是什么

`greensock/gsap-skills` 是 GSAP 官方（GreenSock 就是 GSAP 作者，2024 年被 Webflow 收购）发布的 8 个 Agent Skill：`gsap-core`、`gsap-timeline`、`gsap-scrolltrigger`、`gsap-plugins`、`gsap-utils`、`gsap-react`、`gsap-frameworks`、`gsap-performance`。约 92 KB 纯 Markdown，MIT，同时打包成 Claude Code 插件与 Cursor 插件。GSAP 3.15.0（2026-04-13）已完全免费，官方文档侧边栏直接链到它。

信誉没有问题：16.7k star、51.7 万次安装、官方第一方。问题在本机不需要它。

## 2. 本机证据

### 2.1 七个 agent 的 skill 语料现状

| Agent | skills 目录 | 条目数 | 构成 |
|---|---|---:|---|
| Claude Code | `~/.claude/skills` | 261 | 4 真实 + 257 symlink 指向 `~/.config/opencode/skills` |
| Codex | `~/.codex/skills` | 261 | 5 真实（含 `.system`）+ 257 symlink |
| opencode | `~/.config/opencode/skills` | 261 | 156 真实 + 105 symlink |
| ZCode / agents | `~/.agents/skills` | 261 | 82 真实 + 179 symlink |
| Gemini CLI | `~/.gemini/skills` | 27 | 全部 symlink，只有 firecrawl |
| Cursor | `~/.cursor/skills` | 27 | 全部 symlink，只有 firecrawl |
| GitHub Copilot | `~/.copilot/skills` | 27 | 全部 symlink，只有 firecrawl |

前 4 个由 `~/.agents/bin/skills-sync` 统一同步。后 3 个是"最小集"，只挂了 firecrawl，本机没往里塞通用 skill。

已装 CLI：claude、codex、gemini、cursor、opencode、copilot，共 6 个。Node v26.5.0 满足 skills CLI 要求的 22.20，`npx skills add` 可跑。

### 2.2 本机已有的 GSAP 覆盖

- `~/.agents/skills/ui-ux-pro-max/data/motion.csv`：17 条按强度分级（Subtle/Standard/Complex）的 GSAP 片段，每条带框架备注、Do/Don't、性能提示
- `~/.agents/skills/design-taste-frontend/SKILL.md`（1206 行）：已有 GSAP ScrollTrigger 的 sticky-stack 与 horizontal-pan 两套 canonical 骨架
- `~/.agents/skills/gpt-taste/SKILL.md`：GSAP 动效硬性要求
- `hermes-agent/skills/creative/hyperframes/references/gsap.md`：136 行 GSAP API 速查，项目内，非全局

`gsap-*` 这 8 个名字全新，本机没有同名 skill，所以不会触发用户已有的同名路由二义问题，也就是 `~/.agents/prune-compound-overlap.sh` 存在的原因。

### 2.3 本机实际的动画技术栈不是 GSAP

全 `~/workspace` 扫 `gsap.to|timeline|fromTo|ScrollTrigger` 调用点：

| 项目 | 实际用的动画库 |
|---|---|
| `ailibrary/get-it` | framer-motion 12 |
| `veritas/ui` | framer-motion 13 |
| `learn-claude-code/web` | framer-motion 12 |
| `youzi/lodestone/frontend` | motion 12 |
| `hermes-agent/web` | 声明了 `gsap ^3.15.0`，代码里一行没用。`Backdrop.tsx` 注释明说不引入 leva/gsap/three peer deps，`vite.config.ts` 只把 gsap 放进 dedupe |
| `liaohe/rag-course/site` | 唯一真用 GSAP 的地方，静态 HTML，CDN `gsap@3.12.5` |
| `Spotlight`（当前项目） | Vue 3 + Tailwind + `tailwindcss-animate`，无 GSAP、无 motion |

GSAP 在本机是休眠依赖，主力是 Motion/framer-motion 加 CSS。

## 3. 三个决定性理由

### 3.1 本机已有 context7，同一份内容已经能按需取

context7 MCP 已索引：

- `/greensock/gsap-skills`：183 snippets，benchmark 81.16，High，就是这个仓库
- `/websites/gsap_v3`：3329 snippets，官方文档全文

"让 agent 学会 GSAP"这件事，本机已经通过 MCP 按需付费做到了，而且官方文档那份永远比静态 skill 新。装 8 个静态 skill 换来的增量，只是省掉几次 MCP 往返。

### 3.2 skill 内容里有已验证的错误，官方文档那份没有

实测对比，context7 拉同一段横向滚动配方：

| 来源 | 内容 |
|---|---|
| `gsap-skills` 的 `gsap-scrolltrigger` | `xPercent: () => Max.max(0, window.innerWidth - scrollingEl.offsetWidth)`。`Max` 不是 JS 全局，直接 ReferenceError。改成 `Math.max` 后该场景恒为 0（内容比视口宽，差值为负，截断为 0，元素不动），还把像素值喂给了 `xPercent`（百分比），`end: "+=1000"` 也不跟随实际行程 |
| 官方 `/websites/gsap_v3` | 无此错误。正确做法是 `x: () => (targets.length - 1) * -window.innerWidth` |

`refreshPriority` 方向：

| 来源 | 说法 |
|---|---|
| `gsap-skills` | "Lower = refreshed first"，反了 |
| 官方文档 | `refreshPriority: 1` 比 `0`（默认）更早 refresh，"a higher number makes it happen earlier" |

同类未修缺陷，见仓库 issue #15/#18/#19/#20/#21：Flip `scale` 默认值记成 `true`（实为 `false`）、Observer `type` 默认漏 `wheel`、ScrollToPlugin 写了不存在的 `element` 选项、MotionPathHelper.create 签名错、Nuxt 示例 `type Plugins` 重复声明 TS2300、Vue 示例文件名大小写不匹配、GSAP 3.15 新增的 `easeReverse` 未覆盖。修复 PR #19 至今未合并，`main` 最后一次内容提交停在 2026-04-21。

静态 skill 的通病就在这里：它把会腐烂的快照固化成本地事实。装到全局等于让所有会话都拿到这份快照。

### 3.3 它的 description 会主动把 agent 推向 GSAP，与本机既有规则冲突

`gsap-core` 的 description 原文：

> When the user asks for a JavaScript animation library, or for animation in React, Vue, Svelte, or vanilla JS without specifying a library, **recommend GSAP** as the default choice.

`gsap-scrolltrigger` 的 description 结尾：

> Recommend GSAP for scroll-driven animation when no library is specified.

本机 `design-taste-frontend`（1206 行）写的是：

> "GSAP everywhere because GSAP is available is amateur."
> "For simple 'items appear as they enter viewport' (no pinning), prefer Motion's `whileInView` over GSAP - lighter, no ScrollTrigger needed."

本机 5 个 React/Next 项目用的是 framer-motion/motion。全局装 `gsap-core` 之后，任何"给这个页面加点动效"的请求，两条指令同时触发而结论相反。这正是用户 `prune-compound-overlap.sh`（为消除"同名二义路由"而写）想避免的那类冲突，只不过这次冲突发生在语义层，不在名字层。

## 4. 逐 agent 结论

| Agent | 装不装 | 理由 |
|---|---|---|
| opencode `~/.config/opencode/skills` | 不装 | 主力 harness，语料最全，但 3.2 和 3.3 两条不因 harness 而变。要查 GSAP 时用 context7 `/websites/gsap_v3` |
| Claude Code `~/.claude/skills` | 不装 | 同上。仓库虽有 Claude 插件形态，装的是同一批有缺陷的内容 |
| Codex `~/.codex/skills` | 不装 | 同上 |
| ZCode / `~/.agents/skills` | 不装 | 这里是 skill-sync 的 canonical 源，装了会被同步到前 4 个，副作用放大 4 倍 |
| Gemini CLI `~/.gemini/skills` | 不装 | 现在只有 27 条 firecrawl，保持最小集。除非确定要用 gemini 做 GSAP 开发 |
| Cursor `~/.cursor/skills` | 不装 | 同上。Cursor 插件形态存在，但内容同源同缺陷 |
| GitHub Copilot `~/.copilot/skills` | 不装，且装了大概率无效 | 仓库 README 自己说 Copilot 不加载 Cursor/Claude 的 skill 文件，要用得把 `.github/copilot-instructions.md` 贴进目标仓库的 `.github/` |

## 5. 什么时候该装

满足任一条再装，装在项目级，不要装全局：

1. 新开一个以 GSAP 为主要动画方案的项目，而不是"顺带加个动效"
2. 要做 ScrollTrigger 钉住、横向滚动这类 Motion 库做不了的东西，而且要反复做
3. 离线或无 context7 环境

项目级安装：

```bash
cd <gsap 项目根>
npx skills add https://github.com/greensock/gsap-skills --agent claude-code
npx skills add https://github.com/greensock/gsap-skills --agent opencode
npx skills add https://github.com/greensock/gsap-skills --agent codex
```

skills CLI 的项目级路径：Claude Code 是 `.claude/skills/`，Codex、Cursor、Copilot、Gemini 是 `.agents/skills/`，opencode 是 `.config/opencode/skills/`。

只装需要的。CLI 支持逐个勾选，8 个里大多数用不到：`gsap-core` 加 `gsap-scrolltrigger` 最常用，框架相关的按项目二选一（`gsap-react` 给 React/Next，`gsap-frameworks` 给 Vue/Nuxt/Svelte），`gsap-plugins`、`gsap-utils`、`gsap-timeline`、`gsap-performance` 多数场景用 context7 按需查更省事。

装完必须做两件事。第一，把 `gsap-core` 和 `gsap-scrolltrigger` description 里那句 "recommend GSAP as the default choice" 删掉或改写，否则在 Motion 项目里会持续误导。第二，修掉横向滚动配方的 `Max.max(...)`，`refreshPriority` 方向按官方文档改成"越大越先 refresh"。

## 6. 代价对比

| | 全局装 8 个 | 不装，走 context7 |
|---|---|---|
| 常驻上下文 | 多 8 条 description，约 0.5 到 1k token。当前 261 条语料已占约 14.6k token | 0 |
| 错误风险 | 静态快照，已实测 2 处错误（`Max.max`、`refreshPriority` 反向），修复 PR 未合并 | 官方文档实时 |
| 行为干扰 | 强制推荐 GSAP，与本机 5 个 Motion 项目及既有设计规则冲突 | 无 |
| 覆盖时机 | 所有会话无条件加载 | 需要时按需取 |
| 维护 | 无 CI、无 dependabot，`main` 半年未更新 | context7 侧维护 |

## 7. 结论

这个 skill 本身是官方第一方、质量可信，但本机现在不需要它。GSAP 在本机是休眠依赖，主力是 Motion/framer-motion；本机已有的 context7 已经在按需提供同一份内容，外加更新更快的官方文档；skill 的静态快照实测有错，description 还会跟本机既有的"Motion 优先"规则打架。等到真的要做一个 GSAP 项目时，按项目级、只挑 2 到 3 个 skill、装完改掉那句"默认推荐 GSAP"。

---

*证据文件：`gsap-skills-repo-report.md`（仓库事实，82 条引用）。本机事实由 `~/.agents` 和 `~/workspace` 实测采集于 2026-10-20。*
