---
name: Spotlight
description: 一个会替你想事情的 Kubernetes 驾驶舱
colors:
  # —— 中性层：石墨（240 色相，几乎无色偏）——
  cockpit-dark: "#131316"
  cockpit-card: "#1B1B1D"
  cockpit-muted: "#27272A"
  cockpit-ink: "#F5F5F5"
  cockpit-ink-dim: "#9F9FA8"
  cockpit-line: "#313135"
  # —— 信号层：状态色只在表达状态时出现 ——
  signal-ok: "#4ACF7B"
  signal-watch: "#F5B13D"
  signal-fault: "#EF6161"
  signal-info: "#5996F7"
  # —— 亮色主题下的同一套语义 ——
  daylight-ground: "#FAFAFA"
  daylight-panel: "#FFFFFF"
  daylight-ink: "#18181B"
  daylight-ink-dim: "#4E4E56"
  daylight-line: "#E4E4E7"
  daylight-ok: "#157E3C"
  daylight-watch: "#986206"
  daylight-fault: "#D32222"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif"
    fontSize: "1.625rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "0em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.333
    letterSpacing: "0em"
rounded:
  sm: "6px"
  md: "8px"
  card: "12px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "16": "64px"
components:
  button-primary:
    backgroundColor: "{colors.cockpit-ink}"
    textColor: "{colors.cockpit-dark}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.cockpit-ink-dim}"
  button-outline:
    backgroundColor: "{colors.cockpit-dark}"
    textColor: "{colors.cockpit-ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  chip-ok:
    backgroundColor: "{colors.cockpit-muted}"
    textColor: "{colors.signal-ok}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  chip-watch:
    backgroundColor: "{colors.cockpit-muted}"
    textColor: "{colors.signal-watch}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  chip-fault:
    backgroundColor: "{colors.cockpit-muted}"
    textColor: "{colors.signal-fault}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  card:
    backgroundColor: "{colors.cockpit-card}"
    textColor: "{colors.cockpit-ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  input:
    backgroundColor: "{colors.cockpit-dark}"
    textColor: "{colors.cockpit-ink}"
    rounded: "{rounded.md}"
    height: "40px"
---

# Design System: Spotlight

## Overview

**Creative North Star: "机舱夜航" (The Night Cockpit)**

这个产品的主要场景是凌晨三点：一个人，一块屏，一堆正在出问题的 Pod。所以视觉系统是按「驾驶舱」而不是「控制台」建的——仪表盘不发��，但该亮的就亮；信息密度高，但每一处密度都换来了一个可扫读的判断。

机舱隐喻决定了三件事。其一，底色是石墨而非纯黑：纯黑在 OLED 上边缘发硬，240 色相的深灰（`#131316`）给了眼睛一个可以停下来的面。其二，前景不是纯白：纯白在暗底上会发光，`#F5F5F5` 是灯照在仪表上的亮度，不是探照灯。其三，**颜色是信号，不是装饰**——石墨层完全不携带色相，只有当某个东西需要被看见时，它才从石墨里亮起来：绿是就绪，琥珀是"需要人看一眼"，红是坏了。琥珀与红的分工尤其克制：琥珀表示"注意但没坏"，红表示"坏了"，两者不共用色相区间，所以扫一眼就分得清。

整个系统因此只有一种"响亮"的声音，而且它被留给了一件事：屏幕上最该被看见的那一个数字。仪表盘把 48px 给一个数字、把其余 700px 给了 12px 的灰色列表——这不是失衡，这是刻意的：机舱里仪表和标签的亮度比是固定的，标签从来不跟仪表抢注意力。

**Key Characteristics:**
- **石墨底 + 极少量信号色**：99% 的像素不带色相，状态色只在表达状态时出现
- **密度优先**：表格、标签页、工具栏都按"每天用八小时"的疲劳度调校，而不是按"截图好看"
- **双语术语**：K8s 专有名词（Pod / Node / CrashLoopBackOff）保留原文，因为那是读者要拿去敲 kubectl 的词汇
- **克制的动效**：动效只在状态变化时发生（值变了、日志到了、面板开了），不做入场编排
- **明暗双主题是等价的**：暗色不是"降级模式"，on-call 才是首要场景

## Colors

整个调色板只有两个家族：石墨中性层和状态信号层。

### Primary

- **夜航墨** (`#F5F5F5` 暗色 / `#18181B` 亮色)：主色不是"品牌色"，是反色填充。亮色主题里它是近黑的按钮底，暗色主题里它反过来是亮的主按钮。同一份 `--primary` token 在两个主题里互换明暗，因为"主操作"在任何主题下都该是画面上最确定的东西。

### Neutral

- **石墨底** (`#131316` 暗色 / `#FAFAFA` 亮色)：页面背景。近黑但不纯黑。
- **石墨面板** (`#1B1B1D` 暗色 / `#FFFFFF` 亮色)：卡片、弹层。
- **石墨次级** (`#27272A` 暗色 / `#F4F4F5` 亮色)：表格斑马纹、内嵌区域、芯片底。
- **石墨字** (`#F5F5F5` 暗色 / `#18181B` 亮色)：正文与标题。
- **石墨次字** (`#9F9FA8` 暗色 / `#4E4E56` 亮色)：次要文字。暗色下是 64% 亮度、亮色下是 32% 亮度，两边都在自己的表面上过 4.5:1。
- **石墨线** (`#313135` 暗色 / `#E4E4E7` 亮色)：所有边框。

### 状态信号

- **就绪绿** (`#4ACF7B` 暗色 / `#157E3C` 亮色)：Ready / Running / 成功。
- **警示琥珀** (`#F5B13D` 暗色 / `#986206` 亮色)：需要人看一眼。**注意**：它不表示"坏了"。琥珀与红的色相被刻意拉开（38° vs 0°），不撞色。
- **故障红** (`#EF6161` 暗色 / `#D32222` 亮色)：失败、被拒绝、需要行动。
- **信息蓝** (`#5996F7` 暗色 / `#0B60EA` 亮色)：中性信息，不带情绪。

### Named Rules

**The Signal Rule.** 状态色只用于表达状态。一个装饰性的琥珀色边框、一块为了"有点颜色"而刷上去的底色，都会稀释信号的稀缺性——当琥珀色出现在不该出现的地方，真正的告警就不再刺眼。

**The One Bright Thing Rule.** 一屏里只有一个元素可以是最亮的：总览页那个 48px 的数字。其余全部让位。机舱里仪表和标签的亮度比是固定的。

**The Phase Is Not The Verdict Rule.** 颜色跟着"这个对象现在怎么样"走，不跟着 Kubernetes 的字段值走。一个 phase 是 Running 但容器在 CrashLoopBackOff 的 Pod，必须显示成红色——phase 会撒谎，判定不会。

这条规则有更硬的一层：**判定本身也不能让位给一个快照**。`containerTone` 曾经第一行就 `if (c.ready) return 'success'`，于是 `ready` 这个 kubelet 异步上报的布尔值压过了 `reason` 这个状态机给出的结论。现在 reason 优先：state 是 `waiting` 就说明容器没在运行，`ready` 不可能比 reason 更权威。同一组事实（状态点、n/n、错误芯片、Pod 列表的判定）必须由同一个函数说出来，否则同一行里会出现两个答案。

## Typography

**Display Font:** Inter（自托管 latin 子集，回退 PingFang SC / Microsoft YaHei）
**Body Font:** Inter（同上）
**Label/Mono Font:** JetBrains Mono（自托管）

**Character:** 单一无衬线家族承担全部文本角色——这是产品界面，不是品牌页，不需要 display/body 的字体配对。中文回落 PingFang SC，而 PingFang 没有真正的 600 字重，所以 `font-synthesis: none` 关掉了合成粗体，否则中文标题会比同级的英文标题看着更重。等宽字体只给"是字面量"的场合：Pod 名、节点名、IP、容器名、重启次数——这些值在表格里要能上下对齐，而那是按 JetBrains Mono 的度量设计的。

### Hierarchy

- **Display** (700, 3rem/48px 桌面 · 2.75rem/44px 移动, 1.05)：只出现在总览页那个"最该管的一件事"的数字上。`tabular-nums` 让它跳动时不左右晃。
- **Headline** (700, 1.625rem/26px, 1.15)：页面标题（PageHeader 的 h1）与卡片主标题。
- **Title** (600, 0.875rem/14px, 1.5)：小节标题、表格列组标题。
- **Body** (400, 0.875rem/14px, 1.5)：正文、表格内容、事件消息。事件消息用 16px——它是事件页真正要读的内容。
- **Label** (500, 0.75rem/12px, mono)：元数据、时间戳、字面量标识。中文不使用 12px 以下的字号（11px 在中文上笔画粘连）。

### Named Rules

**The Tabular Rule.** 所有会变的数字（重启次数、Pod 数、耗时）用 `tabular-nums`。等宽数字让"21,320 → 3,200"的变化不引起整行的重排。

**The Raw Term Rule.** K8s 专有名词按 kubectl 的拼写原样显示：`CrashLoopBackOff`、`ImagePullBackOff`、`OOMKilled`、`Running` / `Pending` / `Failed`。读者要能复制这些串去搜、去敲 kubectl，翻译会毁掉这个用途。但描述性文字（"失败"、"就绪"、"需要人看一眼"）用中文——`phase` 是 API 字段值，"就绪"是产品自己的判断。

## Layout

**容器：** `max-width: 1400px`，居中，水平 padding 1rem（`2xl` 断点起 1.5rem）。页面纵向 padding 是 1.5rem（移动）/ 2rem（`md` 起）。

**外壳模型：** 顶栏固定高（`h-14` 桌面端），内容区吃掉剩余高度。Pod 详情页是 log-first 布局——它把自己撑到视口高度，日志区拿全部剩余空间，元数据收成一条事实条。顶栏高度通过 `--app-header-h` 变量暴露给页面，值由 AppHeader 用 ResizeObserver 实测写入（移动端顶栏是两行 grid，写死常量会算错）。

**断点：** `sm: 640px` · `md: 768px` · `lg: 1024px` · `xl: 1280px` · `2xl: 1400px`。

**密度：** 表格有三档行密度（紧凑 / 标准 / 宽松），读者可以按当天的工作时长切换，而不是由产品替他决定。

**响应式：** 侧栏在 `md` 以下收进抽屉（顶栏的汉堡按钮打开）；Pod 表格在 `md` 以下从表格变成卡片列表；顶栏在 `md` 以下是 grid 两行（第 1 行菜单+logo，第 2 行集群+命名空间）。

## Elevation & Depth

**色调分层，阴影仅作响应。** 表面在静止时靠底色深浅差分层：页面底（`#131316`）→ 卡片（`#1B1B1D`）→ 内嵌区（`#27272A`）。阴影只在两种时刻出现：浮层离开页面平面时（弹窗、下拉、AI 侧滑面板、移动抽屉），以及元素响应交互时（悬停）。静止的卡片没有阴影——一张永远浮着的卡片会让整个界面看起来像贴纸。

### Shadow Vocabulary

- **xs** (`0 1px 2px 0 rgba(0,0,0,0.04)`)：几乎不可见，用于表头、输入框。
- **sm** (`0 2px 6px -1px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)`)：常规浮层（Popover、Dropdown）。
- **md** (`0 6px 16px -2px rgba(0,0,0,0.06), 0 2px 6px -2px rgba(0,0,0,0.04)`)：对话框与侧滑面板。
- **lg** (`0 12px 24px -4px rgba(0,0,0,0.08)`)：Toast。

### Named Rules

**The Flat-By-Default Rule.** 表面在静止时是平的。阴影是状态，不是装饰——它回答"这个东西离开了页面平面吗"。

## Shapes

**圆角三档，组件按体量选档，不按装饰选档：** `rounded-sm` 6px（徽章、kbd、芯片的 xs 档）、`rounded-md` 8px（按钮、输入框、下拉、标签页、芯片的 sm 档）、`rounded-card` 12px（卡片、面板、浮层）。

**边框 1px，颜色取 `--border`。** 卡片和列表项上不使用 >1px 的彩色左边框——3px 的彩色边撞上 12px 圆角会读成"贴了根胶条"，而且它和圆角在几何上互相别扭。告警的身份由图标、芯片和背景色承担。日志行的 severity 轨是例外：那一列编码的是每一行的严重度，不是一个可点的卡片。

**所有圆形指示点用同一个尺寸**（状态点 6px、图标 12/14/16/20px），描边宽度统一 1.75。

## Components

### Buttons

- **Shape:** 圆角 `md`（8px）。高度三档：`xs` 28px / `sm` 36px / `default` 40px / `icon` 40×40 / `icon-sm` 36×36 / `icon-xs` 28×28。
- **Primary:** 反色填充（暗色下 `bg-primary` = 浅色文字底）。用于每屏至多一个主操作。
- **Hover / Focus:** 悬停变主色 90% 透明度；焦点是 2px `--ring` 环 + 2px 偏移。过渡只走颜色、背景、边框、transform 四项（`transition-[color,background-color,border-color,transform]`），120ms。
- **按下:** `active:scale-[0.98)`——触觉反馈，但不位移。
- **Secondary / Ghost / Outline:** outline 是描边按钮（工具栏、卡片里），ghost 无描边（图标按钮），secondary 是次级填充。

### Chips

- **Style:** 芯片是一个组件系统（`lib/chip.ts`），不是各处手写的样式。四种语气（success / warning / error / neutral）× 三种变体（soft 淡底 / solid 实底 / bare 纯文字）× 两种尺寸。圆角跟着尺寸走：sm 档 8px（`rounded-md`），xs 档 6px（`rounded-sm`）——更小的芯片配更紧的圆角，否则它读成一颗糖豆而不是徽章。
- **状态:** soft 是默认；bare 保留语气色但去掉底色（用于表格里的密集行）；solid 用于需要强分隔的地方。
- **永不折行**（`whitespace-nowrap`）：状态列被挤窄时，徽章折行会读成两个标签。

### Cards / Containers

- **Corner Style:** 12px（`rounded-card`）。
- **Background:** 暗色下 `#1B1B1D`，亮色下 `#FFFFFF`。
- **Shadow Strategy:** 无阴影（见 Elevation）。深度来自与页面底的色差。
- **Border:** 1px `--border`。
- **Internal Padding:** 表格类卡片是 `p-0`（内容自己排版，16 处）；内容型卡片 16px（`p-4`）到 20px（`p-5`）。

### Inputs / Fields

- **Style:** 1px `--input` 描边 + `--background` 底 + 8px 圆角。高度 40px（`h-10`）。
- **Focus:** 2px `--ring` 环 + 2px 偏移。
- **Error / Disabled:** 禁用态改成中性表面色（`bg-muted`），不靠降透明度——"按不了"这件事用形状说。

### Navigation

- **Style:** 左侧栏 200px（折叠 64px），文字 14px。激活项不反色（夜里 3 点，一块纯黑药丸比一段文字重得多），而是"更深的字 + 一条 2px 竖线"。
- **Default / Hover / Active:** 默认次字色，悬停是极淡的 `--sidebar-accent` 底，激活是最深的字重 + 竖线标记。
- **Mobile:** 侧栏收进左侧抽屉。抽屉里第一个元素是"问 AI"按钮——它是产品最重要的能力，不该藏在两个和弦键后面。

### Status Dot

- **Shape:** 6px 圆点，无边框。
- **语义:** 绿 = 容器就绪；琥珀 = **起来了但不提供服务**（就绪探针没过）；红 = 容器坏了（CrashLoopBackOff / ImagePullBackOff / OOMKilled 等）；灰 = 还在调度或拉镜像（正常，不是信号）。
- **琥珀不是「还在起步」:** 早期版本把每个 waiting 的容器都染成琥珀，于是琥珀同时意味着「正常，还在启动」和「需要注意」——和旁边的琥珀色行动卡撞了意思。现在琥珀专供「在跑但没就绪」：真实集群里有一个 Pod 的就绪探针挂了 62 天，phase 还是 Running，它以前是灰的，而灰在这套颜色里意味着「正常，不是信号」——一个假阴性。
- **判定优先于 phase:** 状态胶囊（`PodStatusPill`）的**色调**跟着容器的判定走，标签仍然是 phase。phase=Running 的 Pod 可能一塌糊涂——phase 只说「至少一个容器在跑」。凌晨三点扫这一列是最高频的动作，它必须承载判定。
- **可访问性:** 一组状态点必须带一个能说清状态的名字（`role="img"` + `aria-label`，例如 `redis: waiting (ImagePullBackOff)`）。纯靠颜色传达的状态对读屏用户等于没有。

### Term Explanation Chip

- **Style:** K8s 的 `reason` 芯片**本身可点**（`ReasonChip.vue`）。收录了的词点开是一张弹层：是什么 + 怎么办。没收录的词照常显示，不假装解释得了。
- **为什么不另加一个 ⓘ:** Pod 详情页的标题区只剩 111px 宽（判定芯片本身 127px），再放一个图标就没地方放标题了——而标题是读者正在读的那个标识符。让芯片自己可点，不占额外宽度。
- **解释挂在芯片上，不挂在芯片旁边:** 同一个词出现在几个地方，解释入口必须在同一个相对位置（WCAG 2.2 A 对重复出现的帮助机制的要求）。统一是「这个词的芯片」，不是「芯片旁边的图标」。
- **按钮就是芯片:** `ReasonChip` 直接用 `chipClasses` 渲染那枚按钮，不套一层 `StatusChip`。套一层的话 `class` 只能落在其中一层（落在芯片上时颜色不生效于 trigger，落在 trigger 上时又不生效于芯片），而且按钮的行盒会把芯片自己的外边距算进去，无声地多出一截宽度。
- **可访问性:** 触发器是 `<button>`，`aria-label` 带三段：这个词属于谁 · 这个词是什么 · 「点击看这个术语的含义」。**前两段不能省**——列表里几十行都可能是 `OOMKilled`，按钮名全一样的话读屏用户没法分辨是哪一条。
- **弹层里不放可点的链接:** 放进去的话弹层一打开焦点就落在那个链接上，读者按 Enter（习惯性的确认键）会直接跳走——他点芯片是为了读解释，结果解释没读到就被丢到另一个页面去了。弹层只放解释文字。
- **清单在代码里，文案在 i18n 里:** `lib/k8sTerms.ts` 只列收录了哪些词（40 个），解释的文案在 `i18n/locales/{zh-CN,en}.ts` 的 `term.explain.<Term>`。**界面语言跟着浏览器走，英文界面下弹出来的解释也必须是英文**——否则这个解释对一半的用户等于没有。有一个测试守着这个：每个词在两种语言下都必须有解释，英文文案里不许混进中文。
- **K8s 自己的大小写不统一**（`OOMKilled` / `CrashLoopBackOff`），按原样匹配、不归一化。
- **词典里只有 reason，没有 phase**——phase 由 `PodStatusPill` 显示成「运行中 Running」，本来就双语；而且 `Failed` 一词两义，作为 phase 和作为事件 reason 是两句完全不同的话，混在一起会给读者一个错的解释，而错的解释比没有解释更糟。

### Data Flow Disclosure

- **位置:** AI 面板的标题正下方、输入框之上。读者点「提问」之前就该看到内容要去哪，而不是答完才知道。
- **按配置说话:** 模型部署位置没有硬约束（内网自托管或外部 SaaS 都可能），所以这句话分三种：本机 / 内网、外部地址（**要带上地址本身**）、LiteLLM 默认路由。写死「第三方」在自托管场景下是假的，写死「都在内网」在 SaaS 场景下是危险的。
- **判定的是地址的形状，不是事实:** split-horizon DNS、跨网段的私网 IP 都是反例。所以措辞是「看起来在……」，不是断言。
- **按 provider 的类型判定，不按使用者给它起的名字:** 名字是随便写的——一个叫「本地模型」的 openai provider 照样连的是厂商 API。
- **两种模式说不同的话:** 日志分析模式发的是日志原文（敏感的那一半），提问模式发的是你的问题和集群概况。文案要区分。
- **语气:** 告知，不是警告。产品承诺是「你的集群、你的数据、你的模型」——模型是使用者自己配的，界面要告诉他它在哪，而不是替他做安全判断。
- **后端也要拦:** `extra` 是透传项，它在调用参数里最后合并，所以一个 `extra={"model": "openai/gpt-4o"}` 就能改掉目的地，让内容发到厂商那边而界面还显示着内网地址。`model` 和 `api_base` 一样是保留键。

### Log Stream Status

- **三态，不是两态:** 绿色圆点 + 「实时」= 流开着；琥珀色「已暂停」= 读者自己按了暂停；红色圆点 + 「连接已断开」= 流断了。
- **为什么是三态:** 「已暂停」暗示读者按了暂停，而流断的时候他没按。事故时读者正是靠这行字判断「是我暂停的」还是「工具断了」——把两者混为一谈，等于让读者在错误的分支上继续排查。
- **同一块面板不能同时说两种状态:** 底部状态、正文消息、工具栏的播放/暂停图标三者必须说同一件事。

### Phase Bar
- **Style:** 总览页的 Pod 阶段分布条。分段的填充色是状态色，轨道是 `--muted`。
- **可访问性:** 每个分段的颜色必须有非颜色的区分（数字标签），不能只靠色块。

## Do's and Don'ts

### Do:

- **Do** 用语义 token（`--error`、`--warning`、`--muted-foreground`），不要写死颜色值。
- **Do** 让状态色出现在"这个对象怎么样"的场合，且**只**出现在那里。
- **Do** 用 `tabular-nums` 渲染会变的数字。
- **Do** 用 `lib/chip.ts` 的芯片，不要手写状态徽章——五个调用点各写一遍时，radius、padding、描边和边框色都漂过。
- **Do** 用 `lib/container.ts` 判定容器状态，不要在组件里另写一套 `reason` 判断。
- **Do** 让显示 phase 的地方，**色调**跟着判定走（`PodStatusPill` 的 `toneOverride`）。phase 只当标签。
- **Do** 让每个交互元素都有 hover / focus-visible / active / disabled 四态，键盘焦点必须可见（2px `--ring` 环）。
- **Do** 在中文界面里把 K8s 字段值（`CrashLoopBackOff`、`Running`）按原文显示，把自己的判断（"失败"、"就绪"）用中文。
- **Do** 让可访问性状态和视觉状态一致：颜色变了，读屏读到的事实也得变。
- **Do** 用 `text-wrap: balance` 处理标题，用 `tabular-nums` 处理数字。
- **Do** 让 K8s 术语在出现的地方可点开看解释（`ReasonChip`），解释给两句话：是什么、怎么办。
- **Do** 给同一页里同词的多个入口不同的无障碍名称——带上那个词属于谁（容器名、Pod 名、事件的对象）。
- **Do** 在把内容发给模型之前说清发去了哪里，并按当前配置动态说（`modelEndpoint`）。

### Don't:

- **Don't** 在卡片、列表项上用 >1px 的彩色左边框（`border-l-[3px]`）。它撞圆角、读成胶条，并且稀释真正的告警信号。告警身份交给图标 + 芯片 + 背景色。（日志行的 severity 轨是另一回事：它编码的是每一行的严重度，靠 3px 的粗细和颜色一起说，且行不是圆角卡片。）
- **Don't** 用 `opacity` 做文字层级。透明度会把对比度一起拉下去——曾经 `opacity-60` 的"×4 次"在暗色下只有 3.2:1，低于 AA 的 4.5:1。层级用颜色深浅表达。（整块容器在刷新时降透明度是另一回事：那是"这份数据是旧的"的提示，不是文字层级。）
- **Don't** 用状态色做装饰。琥珀色出现在不该出现的地方，真正的告警就不刺眼了。
- **Don't** 把"读不到"渲染成"没有"。节点列表被访问控制裁掉时，界面必须说"没有权限"，不能说"这个集群尚未注册任何 Node"——后者是关于集群的假事实。同一条规则适用于 Pod 列表、事件页、日志面板和 AI 面板：403 有它自己的样子（`PermissionDenied`），副标题不说「0 个」，也不给「重试」按钮——重试不会授予权限。
- **Don't** 给权限类错误配"重试"按钮。重试不会授予权限。
- **Don't** 让同一块面板同时说两种状态。日志流断了的时候，底部不能还写着"实时"；也不能写"已暂停"——"暂停"是读者自己按的，而这里是他没按但流断了。三种状态（实时 / 已暂停 / 连接已断开）要分得清。
- **Don't** 让标题层级跳级（h1 直接到 h3）。页面标题是 h1，下一级内容是 h2，列表项的名字不是标题。
- **Don't** 给纯黑（`#000`）或纯白（`#fff`）做表面与前景：纯黑在 OLED 上边缘发硬，纯白在暗底上会发光。
- **Don't** 做入场编排动画。产品是每天用八小时的工具，动效只该在状态变化时发生。
- **Don't** 把一个 `reason` 塞进灰色正文里。故障原因要成为一枚芯片。
- **Don't** 用 `role="tab"` 描述一个不是标签页的控件。三个过滤按钮挂着 `role="tab"` 而页面里没有 `role="tabpanel"`，读屏于是承诺了不存在的方向键导航。过滤按钮用 `aria-pressed`。
- **Don't** 让一排链接念起来一模一样。列表里三个"查看详情"，读屏用户不知道各自指向谁——每个链接要带上目标的名字。
- **Don't** 让帮助面板教不存在的操作。快捷键面板是这个产品唯一的帮助界面，它列的键必须真的能按：只在日志面板内生效的键要分组标注。
- **Don't** 界面上只留一个英文术语串就完事。主要用户是 SRE，但只读账号会分发给不熟 K8s 的同事——他们看到的 `CrashLoopBackOff` 需要一句解释。
- **Don't** 把数据流向写死成「第三方」或「都在内网」。模型是使用者自己配的，界面按当前配置说他自己的话。
- **Don't** 在解释弹层里放可点的链接。弹层一打开焦点就落在那个链接上，读者按 Enter（习惯性的确认键）就被弹到别的页面去了——他点芯片是为了读解释。
- **Don't** 按使用者给 provider 起的名字判断模型在哪儿。名字是随便写的：一个叫「本地模型」的 openai provider 照样连的是厂商 API。

---

`docs/design/2026-10-20-ui-direction.md` 和 `docs/design/2026-10-21-ui-round-2.md` 记的是**方向决策**（这个界面要往哪走）；本文件记的是**当前实现**（它现在长什么样）。两者不冲突：前者是为什么，后者是怎么。当实现漂移时，先改实现，再回来更新这份文件——不要反过来用文档去覆盖已经验证过的实现。
