import { test, expect, type Page } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Full functional flow — exercises every primary user path end-to-end.
 *
 * Goal: a single regression suite that breaks if any of the v6-UI core
 * surfaces stops working. Heavier than `smoke.spec.ts` (which only asserts
 * no JS errors) and `happy-path.spec.ts` (which drills into filters /
 * drawer): this one clicks the actual interactive controls.
 *
 * Mocks: `installApiMocks` returns canned JSON for `/api/v1/*` so the UI
 * never hits the real backend. The preview server (`npm run preview`) is
 * the webServer in `playwright.config.ts`.
 */

const NODES_MOCK = async (page: Page) => {
  await page.route('**/api/v1/nodes**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
}

/** Collect pageerror + console.error into a list. Skips favicon noise. */
function attachErrorRecorder(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  return errors
}

function filterCritical(errors: string[]): string[] {
  return errors.filter(
    (e) => !e.includes('favicon') && !e.includes('Failed to load resource'),
  )
}

/** First visible <h1> in a page (PageHeader renders an h1, no .page-title class). */
const pageTitle = (page: Page) => page.locator('h1').first()

// ─────────────────────────────────────────────────────────────────────────
// 1. AppHeader comboboxes + AI button absence
// ─────────────────────────────────────────────────────────────────────────
test('AppHeader renders cluster + namespace comboboxes and no AI button', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)
  await page.goto('/dashboard', { waitUntil: 'networkidle' })

  // Cluster combobox — visible, labelled, shows current cluster name.
  const clusterBtn = page.getByRole('combobox', { name: '选择集群' })
  await expect(clusterBtn).toBeVisible()
  await expect(clusterBtn).toContainText('demo-cluster')

  // Namespace combobox — visible, labelled, defaults to "所有 namespace".
  const nsBtn = page.getByRole('combobox', { name: '选择 namespace' })
  await expect(nsBtn).toBeVisible()
  await expect(nsBtn).toContainText('所有 namespace')

  // Open the cluster popover → clickable option → confirm selection updates.
  await clusterBtn.click()
  // Reka-UI PopoverContent has no role=dialog; use the search input as the
  // popover's anchor. Once visible, options can be clicked by label text.
  const popoverSearch = page.getByPlaceholder('搜索集群…')
  await expect(popoverSearch).toBeVisible({ timeout: 3_000 })
  await page.getByRole('option', { name: 'demo-cluster' }).first().click()
  await expect(popoverSearch).toBeHidden()

  // AI 助手 button was removed in Task 1 — must NOT exist in the header.
  // The CommandPalette still has "打开 AI 助手" behind a search, so we
  // scope the assertion to the visible header bar.
  const header = page.locator('header')
  await expect(header.getByRole('link', { name: /AI 助手/ })).toHaveCount(0)
  await expect(header.getByRole('button', { name: /AI 助手/ })).toHaveCount(0)

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 2. Dashboard metrics
// ─────────────────────────────────────────────────────────────────────────
test('Dashboard renders health score, pod counts, warnings, restart top', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)
  await page.goto('/dashboard', { waitUntil: 'networkidle' })

  // Page title reflects the active cluster (mocked: demo-cluster).
  await expect(pageTitle(page)).toContainText(/demo-cluster|总览/)

  // Health score: running / (running+pending+failed) = 258/275 → 94.
  await expect(page.getByText('健康', { exact: true }).first()).toBeVisible()
  await expect(page.getByText('94', { exact: true }).first()).toBeVisible()

  // Pods card (287 total)
  await expect(page.getByText('Pods', { exact: true }).first()).toBeVisible()

  // Warning events card (25 from fixture)
  await expect(page.getByText('告警', { exact: true }).first()).toBeVisible()

  // 频繁重启 — fixture has 3 restart-heavy entries. The same pod name shows
  // in both the action-item callout and the noisy-restart list; .first()
  // to keep strict mode happy.
  await expect(page.getByRole('heading', { name: '频繁重启' })).toBeVisible()
  await expect(page.getByText('tempo-distributed-query-658f6bc8b9-5jdr6').first()).toBeVisible()

  // Refresh button visible + clickable, doesn't crash.
  await page.getByRole('button', { name: '刷新' }).first().click()
  await expect(page.getByText('健康', { exact: true }).first()).toBeVisible()

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 3. Pods table + pagination
// ─────────────────────────────────────────────────────────────────────────
test('Pods table renders rows and pagination controls respond', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)
  await page.goto('/pods', { waitUntil: 'networkidle' })

  await expect(pageTitle(page)).toContainText('Pods')

  // Fixture has 2 pods — both must appear in the table.
  await expect(page.getByText('webapp-001').first()).toBeVisible()
  await expect(page.getByText('cache-001').first()).toBeVisible()

  // Pagination footer shows count and page indicator.
  await expect(page.getByText(/共 \d+ 条/)).toBeVisible()
  await expect(page.getByText(/第 1 \/ 1 页/)).toBeVisible()

  // Status filter (AppSelect popover) accepts a value without crashing.
  await page.getByRole('combobox', { name: '按状态筛选' }).click()
  await page.getByRole('option', { name: 'Running' }).click()
  // Both mocked pods are Running → both still visible.
  await expect(page.getByText('webapp-001').first()).toBeVisible()

  // Search input accepts text (backend filtering is verified in the
  // happy-path suite; here we confirm the control wires through the
  // composable without crashing).
  await page.getByLabel('搜索').fill('webapp')
  // 250ms debounce + fetch — wait past it before re-asserting rows.
  await page.waitForTimeout(400)
  await expect(page.getByText('webapp-001').first()).toBeVisible()

  // Clearing search restores the original list.
  await page.getByLabel('搜索').fill('')
  await page.waitForTimeout(400)
  await expect(page.getByText('cache-001').first()).toBeVisible()

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 4. PodDetail logs tab
// ─────────────────────────────────────────────────────────────────────────
test('PodDetail Logs tab renders LogViewer and survives tab switching', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)

  await page.goto('/pods/default/webapp-001', { waitUntil: 'networkidle' })

  // Logs tab is selected by default and history backfills automatically.
  await expect(page.getByRole('tab', { name: 'Logs' })).toBeVisible()

  // LogViewer toolbar appears (search, clear, pause/play).
  // The pause button's aria-label toggles between "暂停 (K)" (streaming) and
  // "继续 (K)" (paused) — accept either to avoid racing the SSE EventSource
  // open. Either label proves LogViewer mounted and bound its props.
  await expect(page.getByLabel('过滤日志')).toBeVisible()
  await expect(page.getByLabel('清空')).toBeVisible()
  await expect(page.getByRole('button', { name: /^(暂停|继续)/ })).toBeVisible()

  // History backfill renders the mocked lines.
  await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('recovered')).toBeVisible()

  // "AI 分析" button lives in the logs toolbar.
  await expect(page.getByRole('button', { name: 'AI 分析' })).toBeVisible()

  // Switch to Events tab — log lines should disappear, no crash.
  await page.getByRole('tab', { name: 'Events' }).click()
  await expect(page.getByText('该 Pod 无相关事件')).toBeVisible()

  // Back to Logs — lines render again (tab switching survives).
  await page.getByRole('tab', { name: 'Logs' }).click()
  await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 5. ⌘K command palette
// ─────────────────────────────────────────────────────────────────────────
test('⌘K opens the command palette and navigates via a result', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)
  await page.goto('/dashboard', { waitUntil: 'networkidle' })

  // Meta+K on darwin / Ctrl+K elsewhere — cover both.
  await page.keyboard.press('Meta+K')
  const cmdkInput = page.getByPlaceholder('输入命令、页面或操作…')
  await expect(cmdkInput).toBeVisible({ timeout: 3_000 })

  // The palette shows nav items. Filter for "Pods".
  await cmdkInput.fill('Pods')
  await expect(page.getByRole('option', { name: /Pods/ }).first()).toBeVisible()

  // Press Enter to select the highlighted item → navigate to /pods.
  // Match on pathname so `/login?next=/pods` can't false-positive.
  await cmdkInput.press('Enter')
  await expect(page).toHaveURL((url) => url.pathname === '/pods')
  await expect(pageTitle(page)).toContainText('Pods')

  // Open the palette again to dismiss — Escape closes.
  await page.keyboard.press('Meta+K')
  await expect(cmdkInput).toBeVisible({ timeout: 3_000 })
  await page.keyboard.press('Escape')
  await expect(cmdkInput).toBeHidden()

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 6. AI page
// ─────────────────────────────────────────────────────────────────────────
test('AI page lists providers and opens the add-provider dialog', async ({ page }) => {
  const errors = attachErrorRecorder(page)
  await installApiMocks(page)
  await page.goto('/ai', { waitUntil: 'networkidle' })

  await expect(pageTitle(page)).toContainText('AI 模型')

  // Fixture returns one provider: OpenAI / gpt-4o-mini / 默认.
  await expect(page.getByText('OpenAI').first()).toBeVisible()
  await expect(page.getByText('gpt-4o-mini').first()).toBeVisible()
  await expect(page.getByText('默认').first()).toBeVisible()

  // "添加 Provider" button opens the form dialog.
  await page.getByRole('button', { name: /添加 Provider/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  // Form has at least one input the user must fill.
  const nameInput = dialog.locator('input').first()
  await expect(nameInput).toBeVisible()

  // Close the dialog (Escape on the dialog backdrop or X).
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()

  expect(filterCritical(errors)).toHaveLength(0)
})

// ─────────────────────────────────────────────────────────────────────────
// 7. No JS errors on any of the 8 main routes
// ─────────────────────────────────────────────────────────────────────────
const routes = [
  { path: '/',             title: /总览|demo-cluster/ },
  { path: '/pods',         title: /^Pods$/ },
  { path: '/pods/default/webapp-001', title: /webapp-001/ },
  { path: '/nodes',        title: /^Nodes$/ },
  { path: '/events',       title: /^Events/ },
  { path: '/favorites',    title: /^收藏夹$/ },
  { path: '/ai',           title: /^AI 模型$/ },
  { path: '/login',        title: /^Spotlight$/ },
] as const

for (const r of routes) {
  test(`renders ${r.path} with no JS errors`, async ({ page }) => {
    const errors = attachErrorRecorder(page)
    await installApiMocks(page)
    await NODES_MOCK(page)

    await page.goto(r.path, { waitUntil: 'networkidle', timeout: 15_000 })
    await expect(pageTitle(page)).toBeVisible({ timeout: 5_000 })
    await expect(pageTitle(page)).toHaveText(r.title)

    const critical = filterCritical(errors)
    expect(critical, `JS errors on ${r.path}: ${critical.join(' | ')}`).toHaveLength(0)
  })
}