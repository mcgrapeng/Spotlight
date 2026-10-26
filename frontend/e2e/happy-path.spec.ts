import { test, expect } from '@playwright/test'
import { installApiMocks } from './_fixtures'

test.describe('Happy path — login → dashboard → pods → log filter → AI', () => {
  test.beforeEach(async ({ page }) => {
    await installApiMocks(page)
  })

  test('auth is not required (server reports unconfigured) so we land on /dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.locator('h1').first()).toContainText('总览')
  })

  test('dashboard renders the action hero + restart leaderboard', async ({ page }) => {
    const statsResponse = page.waitForResponse(/api\/v1\/pods\/stats/, { timeout: 10_000 })
    await page.goto('/dashboard')
    const statsRes = await statsResponse
    expect(statsRes.status()).toBe(200)

    // Wait for the stats response body to be parsed and rendered. The mock
    // returns total_pods=287, so 287 must appear after Vue's render cycle.
    await expect(page.getByText('287').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('最该管的一件事', { exact: true }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: '频繁重启', exact: true })).toBeVisible()
  })
test('navigate to Pods → Pod detail → log history loads', async ({ page }) => {
    const podDetailReqs: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/api/v1/pods/')) podDetailReqs.push(req.url())
    })

    await page.goto('/pods')
    await expect(page.locator('h1').first()).toContainText('Pod')

    const webappLink = page.getByRole('link', { name: '查看 webapp-001 详情' })
    await expect(webappLink).toBeVisible()
    await webappLink.click()

    await expect(page).toHaveURL(/\/pods\/default\/webapp-001$/)
    await expect(page.getByText('default · node-a')).toBeVisible()

    // The LogViewer renders its toolbar inside the default-selected "logs" tab.
    await expect(page.getByLabel('过滤日志')).toBeVisible({ timeout: 10_000 })

    // History backfills automatically on mount (no manual "load" button).
    await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('recovered')).toBeVisible()
    // Sanity: the mock saw at least one pod-detail request.
    expect(podDetailReqs.some((u) => /\/pods\/default\/webapp-001(\?|$)/.test(u))).toBe(true)
  })

  test('log severity quick-pick filters to ERROR+', async ({ page }) => {
    await page.goto('/pods/default/webapp-001')
    await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('recovered')).toBeVisible()

    // Click the ERROR severity chip in the toolbar.
    const errorChip = page.locator('button').filter({ hasText: 'ERROR' }).first()
    await errorChip.click()

    // "service ready" is INFO → should disappear.
    await expect(page.getByText('service ready')).toHaveCount(0)
    // "recovered" is also INFO → should disappear.
    await expect(page.getByText('recovered')).toHaveCount(0)
    // An error line stays.
    await expect(page.getByText('connection refused')).toBeVisible()
  })

  test('keyword filter narrows the view', async ({ page }) => {
    await page.goto('/pods/default/webapp-001')
    await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })

    const filterInput = page.getByPlaceholder(/过滤/)
    await filterInput.fill('retry')
    // Only "retry failed" should remain visible (case-insensitive by default).
    await expect(page.getByText('retry failed')).toBeVisible()
    await expect(page.getByText('service ready')).toHaveCount(0)
  })

  test('AI analysis drawer shows the mocked LLM answer', async ({ page }) => {
    await page.goto('/pods/default/webapp-001')
    await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })

    // Open AI drawer via the logs toolbar button.
    await page.getByRole('button', { name: 'AI 分析' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/AI 日志分析/)).toBeVisible()

    // Click "分析".
    await page.getByRole('button', { name: '分析', exact: true }).click()
    // The mocked answer includes this Chinese phrase.
    await expect(page.getByText('检测到 3 次连接重试')).toBeVisible({ timeout: 10_000 })
  })

  test('the global AI panel answers a cluster question', async ({ page }) => {
    await page.goto('/dashboard')
    // ⌘J opens the panel from any page: the AI is something you call up,
    // not a page you go to.
    await page.keyboard.press('Meta+j')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(page.getByText('问 Spotlight')).toBeVisible()

    // The context is a live snapshot of the cluster, not a static blurb.
    // It is shown as a sentence first — the raw snapshot is addressed to the
    // model, not to the reader, so it lives behind a disclosure.
    await expect(page.getByText(/集群 demo-cluster/)).toBeVisible({ timeout: 10_000 })
    await page.getByRole('button', { name: '查看原始上下文' }).click()
    await expect(page.getByText(/total=\d+ running=/)).toBeVisible()

    await page.getByLabel('问题').fill('哪个 Pod 在反复重启？')
    await page.getByRole('button', { name: '提问' }).click()
    await expect(page.getByText('集群级回答')).toBeVisible({ timeout: 10_000 })
  })

  test('AI Settings page surfaces the single-active constraint', async ({ page }) => {
    await page.goto('/ai')
    await expect(page.locator('h1').first()).toContainText('AI 模型')
    await expect(page.getByText(/同时只能启用一个/)).toBeVisible()
    // Fixture provider is enabled — the card shows the 已启用 chip.
    await expect(page.getByText('已启用').first()).toBeVisible()
  })

  test('Events page renders the warning row', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('h1').first()).toContainText('事件')
    await expect(page.getByText('BackOff')).toBeVisible()
    await expect(page.getByText('cache-001')).toBeVisible()
  })
})