# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: happy-path.spec.ts >> Happy path — login → dashboard → pods → log filter → AI >> navigate to Pods → Pod detail → log history loads
- Location: e2e/happy-path.spec.ts:30:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('service ready')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('service ready') with timeout 10000ms
  - waiting for getByText('service ready')

```

```yaml
- link "跳转到主内容":
  - /url: "#main-content"
- banner:
  - text: demo-cluster · current
  - img "loading":
    - img
  - text: / 所有 namespace
  - img "loading":
    - img
  - button "AI"
  - button "刷新当前页面"
- complementary "主导航":
  - navigation "主导航":
    - paragraph: 工作区
    - text: K8
    - paragraph: K8s Viewer
    - paragraph: via Teleport · tsh
    - text: demo-cluster
    - paragraph: "ns: _all"
    - button "打开命令面板":
      - img:
        - img
      - text: 搜索… ⌘K
    - paragraph: 导航
    - list:
      - listitem:
        - link "总览":
          - /url: /dashboard
      - listitem:
        - link "Pods":
          - /url: /pods
      - listitem:
        - link "Nodes":
          - /url: /nodes
      - listitem:
        - link "Events":
          - /url: /events
          - text: Events
          - superscript: 3 3 3
      - listitem:
        - link "收藏夹":
          - /url: /favorites
      - listitem:
        - link "AI 模型":
          - /url: /ai
- main:
  - button "返回"
  - heading "webapp-001" [level=1]
  - paragraph: namespace · default
  - text: Running ReplicaSet/webapp-001-abc
  - button "AI 分析"
  - button "收藏":
    - img:
      - img
    - text: 收藏
  - button "刷新":
    - img:
      - img
  - term: Node
  - definition: node-a
  - term: Pod IP
  - definition: 10.0.0.1
  - term: Age
  - definition: 5d
  - term: Restarts
  - definition: "0"
  - heading "Containers" [level=3]
  - text: 1 web
  - code: nginx:1.27
  - text: running
  - heading "Labels" [level=3]
  - text: 1 app = web 日志 Events 1
  - combobox "Container":
    - option "web" [selected]
  - textbox "过滤关键字":
    - /placeholder: 过滤关键字（支持正则）
  - group "最低严重级":
    - button "ALL" [pressed]
    - button "TRACE"
    - button "DEBUG"
    - button "INFO"
    - button "NOTICE"
    - button "WARN+"
    - button "ERROR+"
    - button "CRITICAL+"
    - button "FATAL"
  - checkbox "正则"
  - text: 正则
  - checkbox "Aa" [checked]
  - text: Aa
  - switch [checked]
  - button "返回实时模式":
    - img:
      - img
    - text: 回到实时
  - button "清空日志":
    - img:
      - img
  - text: 历史区间
  - group "预设时间区间":
    - button "5m"
    - button "15m" [pressed]
    - button "1h"
    - button "3h"
    - button "1d"
    - button "7d"
  - button "载入历史":
    - img:
      - img
    - text: 载入历史
  - text: 空闲 | 缓冲 0 | 显示 0
  - code: default
  - code: webapp-001
  - log "Pod 日志":
    - img
    - text: 暂无日志 — 点击「实时跟踪」或「载入历史」
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | import { installApiMocks } from './_fixtures'
  3   | 
  4   | test.describe('Happy path — login → dashboard → pods → log filter → AI', () => {
  5   |   test.beforeEach(async ({ page }) => {
  6   |     await installApiMocks(page)
  7   |   })
  8   | 
  9   |   test('auth is not required (server reports unconfigured) so we land on /dashboard', async ({ page }) => {
  10  |     await page.goto('/')
  11  |     await expect(page).toHaveURL(/\/dashboard$/)
  12  |     await expect(page.locator('.page-title')).toContainText('总览')
  13  |   })
  14  | 
  15  |   test('dashboard renders health hero + restart leaderboard', async ({ page }) => {
  16  |     // Wait for the stats fetch to resolve before asserting on rendered values.
  17  |     const statsResponse = page.waitForResponse(/api\/v1\/pods\/stats/, { timeout: 10_000 })
  18  |     await page.goto('/dashboard')
  19  |     await statsResponse
  20  | 
  21  |     await expect(page.getByText('集群健康度')).toBeVisible()
  22  |     await expect(page.getByText('运行中 Pod 比例')).toBeVisible()
  23  |     await expect(page.getByText('重启 Top 10')).toBeVisible()
  24  |     // Mock returns 21302 restarts on the top pod — that exact number must
  25  |     // appear on the leaderboard (formatted with thousands separator).
  26  |     await expect(page.locator('code', { hasText: 'tempo-distributed-query' }).first()).toBeVisible()
  27  |     await expect(page.getByText('21,302').first()).toBeVisible()
  28  |   })
  29  | 
  30  |   test('navigate to Pods → Pod detail → log history loads', async ({ page }) => {
  31  |     const podDetailReqs: string[] = []
  32  |     page.on('request', (req) => {
  33  |       if (req.url().includes('/api/v1/pods/')) podDetailReqs.push(req.url())
  34  |     })
  35  |     page.on('response', (res) => {
  36  |       if (res.url().includes('/api/v1/pods/')) {
  37  |         console.log(`POD RES ${res.status()} ${res.url()}`)
  38  |       }
  39  |     })
  40  |     page.on('console', (msg) => {
  41  |       if (msg.type() === 'error') console.log('PAGE ERR:', msg.text())
  42  |     })
  43  | 
  44  |     await page.goto('/pods')
  45  |     await expect(page.locator('.page-title')).toContainText('Pods')
  46  | 
  47  |     const webappLink = page.getByRole('link', { name: '查看 webapp-001 详情' })
  48  |     await expect(webappLink).toBeVisible()
  49  |     await webappLink.click()
  50  | 
  51  |     await expect(page).toHaveURL(/\/pods\/default\/webapp-001$/)
  52  |     await expect(page.getByText('namespace · default')).toBeVisible()
  53  |     await expect(page.getByText('历史区间')).toBeVisible({ timeout: 10_000 })
  54  | 
  55  |     await page.getByRole('button', { name: '载入历史' }).click()
  56  |     // Wait for the response to come back, then flush Vue's queue.
  57  |     await page.waitForResponse(/\/pods\/default\/webapp-001\/logs/, { timeout: 5000 }).catch(() => {})
  58  |     await page.waitForTimeout(800)
  59  |     try {
> 60  |       await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })
      |                                                     ^ Error: expect(locator).toBeVisible() failed
  61  |     } catch (err) {
  62  |       console.log('REQ URLS:', podDetailReqs)
  63  |       // Dump body so we can see what's actually rendered.
  64  |       const html = await page.locator('body').innerHTML()
  65  |       const idx = html.indexOf('lp-body')
  66  |       console.log('LP-BODY CONTEXT:', idx > 0 ? html.slice(idx, idx + 4000) : 'not found')
  67  |       throw err
  68  |     }
  69  |     await expect(page.getByText('recovered')).toBeVisible()
  70  |     expect(podDetailReqs.some((u) => /\/pods\/default\/webapp-001(\?|$)/.test(u))).toBe(true)
  71  |   })
  72  | 
  73  |   test('log severity quick-pick filters to ERROR+', async ({ page }) => {
  74  |     await page.goto('/pods/default/webapp-001')
  75  |     await page.getByRole('button', { name: '载入历史' }).click()
  76  |     await expect(page.getByText('service ready')).toBeVisible()
  77  |     await expect(page.getByText('recovered')).toBeVisible()
  78  | 
  79  |     // Click the ERROR severity chip in the toolbar.
  80  |     const errorChip = page.locator('.lp-sev-group button').filter({ hasText: 'ERROR' }).first()
  81  |     await errorChip.click()
  82  | 
  83  |     // "service ready" is INFO → should disappear.
  84  |     await expect(page.getByText('service ready')).toHaveCount(0)
  85  |     // "recovered" is also INFO → should disappear.
  86  |     await expect(page.getByText('recovered')).toHaveCount(0)
  87  |     // An error line stays.
  88  |     await expect(page.getByText('connection refused')).toBeVisible()
  89  |   })
  90  | 
  91  |   test('keyword filter narrows the view', async ({ page }) => {
  92  |     await page.goto('/pods/default/webapp-001')
  93  |     await page.getByRole('button', { name: '载入历史' }).click()
  94  |     await expect(page.getByText('service ready')).toBeVisible()
  95  | 
  96  |     const filterInput = page.getByPlaceholder(/过滤关键字/)
  97  |     await filterInput.fill('retry')
  98  |     // Only "retry failed" should remain visible (case-insensitive by default).
  99  |     await expect(page.getByText('retry failed')).toBeVisible()
  100 |     await expect(page.getByText('service ready')).toHaveCount(0)
  101 |   })
  102 | 
  103 |   test('AI analysis drawer shows the mocked LLM answer', async ({ page }) => {
  104 |     await page.goto('/pods/default/webapp-001')
  105 |     await page.getByRole('button', { name: '载入历史' }).click()
  106 |     await expect(page.getByText('service ready')).toBeVisible()
  107 | 
  108 |     // Open AI drawer via toolbar button.
  109 |     await page.getByRole('button', { name: 'AI 分析' }).click()
  110 |     await expect(page.getByRole('dialog', { name: /AI 分析 · webapp-001/ })).toBeVisible()
  111 | 
  112 |     // Click "运行分析".
  113 |     await page.getByRole('button', { name: '运行分析' }).click()
  114 |     // The mocked answer includes this Chinese phrase.
  115 |     await expect(page.getByText('检测到 3 次连接重试')).toBeVisible()
  116 |     await expect(page.getByText('gpt-4o-mini')).toBeVisible()
  117 |     await expect(page.getByText('412 ms')).toBeVisible()
  118 |   })
  119 | 
  120 |   test('AI Settings page surfaces the single-active constraint', async ({ page }) => {
  121 |     await page.goto('/ai')
  122 |     await expect(page.locator('.page-title')).toContainText('AI 模型')
  123 |     await expect(page.getByText(/同时只能启用一个/)).toBeVisible()
  124 |     await expect(page.getByText('OpenAI')).toBeVisible()
  125 |     await expect(page.getByText('已启用')).toBeVisible()
  126 |   })
  127 | 
  128 |   test('Events page renders the warning row', async ({ page }) => {
  129 |     await page.goto('/events')
  130 |     await expect(page.locator('.page-title')).toContainText('Events')
  131 |     await expect(page.getByText('BackOff')).toBeVisible()
  132 |     await expect(page.getByText('cache-001')).toBeVisible()
  133 |   })
  134 | })
```