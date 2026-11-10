# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**主要用户是值班/平台工程师（SRE）**，在凌晨两三点排查线上故障。他们要回答的是「这个 Pod 为什么会这样」，而不是「集群里有什么」。产品被打开的时间点决定了暗色主题不是可选项。

**同一批人手里的只读账号会分发给同事，其中有应用开发**——他们不熟 Kubernetes 术语。这决定了 K8s 术语（`CrashLoopBackOff`、`ImagePullBackOff`、`OOMKilled`、`StatefulSet`）在界面上首次出现时需要给出解释，而不只是一个英文串。集群里内置三个角色：`admin` / `user`（默认）/ `viewer`（发给同事的只读档案，**故意不含 `pods.logs`**——日志是集群读取里敏感的那一半）。

## Product Purpose

Spotlight 是一个自托管的 Kubernetes 控制台。`kubectl` 告诉你**正在发生什么**，Kubernetes Dashboard 告诉你它**在哪里**，Spotlight 告诉你**为什么**。

它存在的理由来自一个具体时刻：一次线上故障排查中，那个 Pod 在崩溃重启，`kubectl logs` 显示 21,320 次重启，而 Dashboard 却在报告它 "Running"——两个都没说为什么，那行 `OOMKilled` 埋在 200 行日志的第 88 行。**只有仪表盘、没有诊断**，是这个产品要补的缺口。

成功 = 值班工程师不用离开这个界面就知道该去看哪个 Pod、为什么、怎么办。

## Positioning

**诊断缺口本身**是竞品抄不走的机制：它不提供更多的列表或更好的图表，而是把 Kubernetes 自己的字段（phase、reason、事件、容器状态）**翻译成"这个对象现在到底怎么样"的判定**，并且在字段会撒谎时（`phase` 对 CrashLoopBackOff 的 Pod 仍然报 `Running`）坚持判定优先于字段。

由此推出的产品性格：**只读**。它不碰集群资源——重启 Pod、扩缩容这些动作被有意排除在范围之外（见 Capabilities and Constraints）。它写的东西只有自己的收藏夹。

## Operating Context

- **内网环境**：产品常在没有外网的机房使用。字体自托管而非走 CDN 就是这个约束的直接后果（内网挂 CDN 是常见的翻车点）。
- **多集群**：kubeconfig 里的每个 context 都在一屏之内，可实时切换，不用重启。
- **AI 模型由使用者自己配置**，可以跑在集群内（Ollama），也可以是外部 SaaS API（界面下拉里是 OpenAI / Anthropic / Azure / Gemini / Ollama / DeepSeek 六家，走 LiteLLM 统一适配）。**产品不对模型部署位置设硬约束。**
- **模型回答要带得上集群的上下文**：问的问题要么是集群级的（"哪个 Pod 在反复重启"），要么是某个 Pod 日志片段级的（"它为什么起不来"）。两种问题的上下文来源不同——前者是一份集群快照，后者是日志片段。

## Capabilities and Constraints

**已确认的能力**

- 多集群实时切换；Pod / 节点 / 事件 / 命名空间浏览；SSE 实时日志流（单 Pod 全容器、保留 ANSI 颜色、自动去重、可下载）；收藏夹；AI 解读（集群级提问 + Pod 日志级分析）；命令面板与键盘优先导航；三档表格行密度；可插拔鉴权（bearer / session / Teleport `tsh` / 自定义插件）；端到端类型安全（Pydantic v2 → OpenAPI → openapi-typescript）。

**已确认的约束**

- **有意只读**：不提供任何对集群资源的写操作（重启 Pod、扩缩容、删资源等一律不做）。这是产品立场，不是待办缺口。收藏夹会写，但它写的是 Spotlight 自己的库。
- **判定优先于字段**：`phase` 会撒谎，所以任何地方显示状态都要经过共享的判定函数（`lib/container.ts`、`lib/restart.ts`），不能直接读字段的当前取值。状态的**外观**由 `lib/chip.ts` 统一（那是样式系统，不是判定）。
- **K8s 术语保留原文**：`CrashLoopBackOff`、`ImagePullBackOff`、`OOMKilled`、`Running` / `Pending` / `Failed` 按 kubectl 的拼写原样显示，因为读者要能复制这些串去搜、去敲 kubectl。界面自己的判断（"失败""就绪""需要人看一眼"）用中文。
- **权限模型**：内置 `admin` / `user` / `viewer` 三档。`viewer` 故意不含 `pods.logs`——日志是敏感的那一半。日志分析接口（`/ai/analyze`）要 **同时** 有 `ai.use` 和 `pods.logs`：它把日志原文发给模型，所以能用它的人本来就该能读日志。这条由后端强制，不依赖内置角色的巧合——自定义角色可以配出任意权限组合。集群级提问（`/ai/ask`）发的是集群概况，只要 `ai.use`。
- **鉴权可插拔**：四种 provider（bearer / session / Teleport / 自定义插件），换一个是一个文件的事。
- **K8s 术语带解释**：界面上的 `CrashLoopBackOff`、`OOMKilled` 这类词可以点开看「是什么 + 怎么办」。主要用户是 SRE，他们不需要；但只读账号会分发给应用开发，他们需要。收录清单在 `lib/k8sTerms.ts`（40 个词），**文案在 i18n 文件里**——界面语言跟随浏览器，英文界面下的解释也必须是英文。
- **数据流向被告知**：AI 面板在提问之前就说清内容发去了哪里，并按当前配置分三种说法（内网自托管 / 外部地址 / LiteLLM 默认路由）。模型部署位置没有硬约束，所以这句话不能写死。

**未决事项**

- 无。目前所有已知的产品问题都归到了「已确认的能力」或「已确认的约束」下面。

## Brand Commitments

- **名字**：Spotlight。副标题「集群驾驶舱」/ "A Kubernetes dashboard that thinks with you"。
- **承诺**：**没有 SaaS，没有厂商锁定。你的集群、你的数据、你的模型。** 这是定位性承诺，未来的工作不能靠引入托管服务来兑现它。
- **人格**：克制、确定。像机舱里的仪表——不发亮，但该亮的就亮。
- **界面语言**：跟随浏览器语言，缺省回落 zh-CN（`zh-*` → zh-CN，其余 → en-US）。英文是对等语言，不是附属品。

## Evidence on Hand

- **真实集群**（当前开发环境可达，本轮对着运行中的后端核过）：289 个 Pod、48 个命名空间、3 个 Ready 节点、570 条事件。其中包含真实的失败案例——`OOMKilled`、`FailedToRetrieveImagePullSecret`、`Unhealthy`。
- **截图**：`assets/screenshots/`（dashboard / pods / ai / login）、`.screenshots/`（多轮迭代的明暗双主题渲染）。
- **历史审计与方向决策**：`docs/audit/` 四篇（OSS 对比、UI/UX 审计、视觉交互审计、测试套件审计）、`docs/design/` 五篇（2026-10-20、10-21、11-10 的三轮方向决策，加上 11-10 的第四轮）。`docs/` 按仓库约定不进版本库，是本地工作笔记——本文件与 `DESIGN.md` 才是进版本库的那两份。
- **视觉规范**：`DESIGN.md` + `.impeccable/design.json`（本轮从代码提取，含 token、组件契约与 Do/Don't 清单）。
- **必须注意的空白**：**没有真实用户反馈**——没有 issue 里的用户原话、没有访谈记录、没有使用数据。评审里任何关于"用户会怎么反应"的推断都是假设，不能写成证据。

## Product Principles

1. **判定优先于字段。** Kubernetes 的字段会撒谎（`phase` 对 CrashLoopBackOff 的 Pod 报 `Running`）。任何地方显示状态都走共享的判定函数；同一个事实的所有表达必须由同一个函数说出来，否则同一行里会出现两个答案。
2. **读不到要说读不到。** 「数据为空」必须能区分三种成因：真的没有 / 没权限读 / 读失败。权限被裁剪时界面必须说"没有权限"，不能说"这个集群没有节点"——后者是关于集群的**假事实**。对运维工具来说，把权限边界说成集群状态，比报错危险得多。
3. **只读是立场。** 不碰集群资源。这不是待办缺口，是产品边界——它决定了 Spotlight 和"带按钮的控制台"是两种不同的产品。
4. **数据流向必须被告知。** 把日志片段或集群快照发给模型时，界面要说清发给了谁。模型部署位置没有硬约束（内网自托管或外部 API 都可能），所以告知必须**按当前配置动态说**，不能写死"第三方"。
5. **为凌晨三点设计。** 暗色是主场景不是可选项；密度按每天用八小时的疲劳度调校；动效只在状态变化时发生。

## Accessibility & Inclusion

- **门禁标准**：axe-core 按 WCAG 2.0 A + AA 规则扫描 7 个页面 × 明暗双主题；任何 `critical` 或 `serious` 违规让 CI 失败。
- **对比度**：token 层按各自表面色标定对比度——状态色在 `--muted` 表面上也要 ≥4.5:1（不是只在白底上）。
- **读屏**：状态不能只靠颜色传达。容器状态点、严重度芯片、故障原因都要带可读的名字（`role="img"` + `aria-label`），日志流状态要区分"实时 / 已暂停 / 连接已断开"三态。
- **中日韩排版**：自托管字体只下 latin 子集，中文回落 PingFang SC；`font-synthesis: none` 关掉合成粗体，否则中文标题会比同级英文标题看着更重。中文不使用 12px 以下的字号。
- **无障碍不是后加的**：键盘优先是核心能力（⌘K 命令面板、`g d/p/n/e/f` 页面跳转、日志区 `f/e/p/c/g/j/k`），所有交互元素有可见焦点环。
