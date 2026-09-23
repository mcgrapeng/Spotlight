import { test, expect } from '@playwright/test'
import { installApiMocks } from './_fixtures'

test.describe('Happy path — login → dashboard → pods → log filter → AI', () => {
  test.beforeEach(async ({ page }) => {
    await installApiMocks(page)
  })

  test('auth is not required (server reports unconfigured) so we land on /dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.locator('.page-title')).toContainText('总览')
  })

  test('dashboard renders health hero + restart leaderboard', async ({ page }) => {
    const statsResponse = page.waitForResponse(/api\/v1\/pods\/stats/, { timeout: 10_000 })
    await page.goto('/dashboard')
    const statsRes = await statsResponse
    expect(statsRes.status()).toBe(200)

    // Wait for the stats response body to be parsed and rendered. The mock
    // returns total_pods=287, so 287 must appear after Vue's render cycle.
    await expect(page.getByText('287').first()).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('集群健康度')).toBeVisible()
    await expect(page.getByText('运行中 Pod 比例')).toBeVisible()
    await expect(page.getByText('重启 Top 10')).toBeVisible()
  })
test('navigate to Pods → Pod detail → log history loads', async ({ page }) => {
    const podDetailReqs: string[] = []
    page.on('request', (req) => {
      if (req.url().includes('/api/v1/pods/')) podDetailReqs.push(req.url())
    })

    await page.goto('/pods')
    await expect(page.locator('.page-title')).toContainText('Pods')

    const webappLink = page.getByRole('link', { name: '查看 webapp-001 详情' })
    await expect(webappLink).toBeVisible()
    await webappLink.click()

    await expect(page).toHaveURL(/\/pods\/default\/webapp-001$/)
    await expect(page.getByText('namespace · default')).toBeVisible()

    // The LogViewer renders its toolbar inside the default-selected "logs" tab.
    await expect(page.getByText('历史区间')).toBeVisible({ timeout: 10_000 })

    // Trigger history loader, then wait for the mock response.
    const historyResponse = page.waitForResponse(
      /\/api\/v1\/pods\/default\/webapp-001\/logs/, { timeout: 5000 },
    )
    await page.getByRole('button', { name: '载入历史' }).click()
    await historyResponse

    await expect(page.getByText('service ready')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('recovered')).toBeVisible()
    // Sanity: the mock saw at least one pod-detail request.
    expect(podDetailReqs.some((u) => /\/pods\/default\/webapp-001(\?|$)/.test(u))).toBe(true)
  })

  test('log severity quick-pick filters to ERROR+', async ({ page }) => {
    await page.goto('/pods/default/webapp-001')
    await page.getByRole('button', { name: '载入历史' }).click()
    await expect(page.getByText('service ready')).toBeVisible()
    await expect(page.getByText('recovered')).toBeVisible()

    // Click the ERROR severity chip in the toolbar.
    const errorChip = page.locator('.lp-sev-group button').filter({ hasText: 'ERROR' }).first()
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
    await page.getByRole('button', { name: '载入历史' }).click()
    await expect(page.getByText('service ready')).toBeVisible()

    const filterInput = page.getByPlaceholder(/过滤关键字/)
    await filterInput.fill('retry')
    // Only "retry failed" should remain visible (case-insensitive by default).
    await expect(page.getByText('retry failed')).toBeVisible()
    await expect(page.getByText('service ready')).toHaveCount(0)
  })

  test('AI analysis drawer shows the mocked LLM answer', async ({ page }) => {
    await page.goto('/pods/default/webapp-001')
    await page.getByRole('button', { name: '载入历史' }).click()
    await expect(page.getByText('service ready')).toBeVisible()

    // Open AI drawer via toolbar button.
    await page.getByRole('button', { name: 'AI 分析' }).click()
    // Naive UI's drawer uses role=dialog; the title contains the pod name.
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText(/AI 分析 · webapp-001/)).toBeVisible()

    // Click "运行分析".
    await page.getByRole('button', { name: '运行分析' }).click()
    // The mocked answer includes this Chinese phrase.
    await expect(page.getByText('检测到 3 次连接重试')).toBeVisible()
    await expect(page.getByText('412 ms')).toBeVisible()
    // "gpt-4o-mini" appears twice (active-model chip + result tag); just
    // assert at least one is present.
    await expect(page.getByText('gpt-4o-mini').first()).toBeVisible()
  })

  test('AI Settings page surfaces the single-active constraint', async ({ page }) => {
    await page.goto('/ai')
    await expect(page.locator('.page-title')).toContainText('AI 模型')
    await expect(page.getByText(/同时只能启用一个/)).toBeVisible()
    // "OpenAI" matches multiple elements (sub + status + table + chip); use the
    // dedicated active-provider chip in the top callout for an unambiguous check.
    await expect(page.locator('.ai-callout code').first()).toContainText('OpenAI')
    await expect(page.getByText('已启用').first()).toBeVisible()
  })

  test('Events page renders the warning row', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('.page-title')).toContainText('Events')
    await expect(page.getByText('BackOff')).toBeVisible()
    await expect(page.getByText('cache-001')).toBeVisible()
  })
})