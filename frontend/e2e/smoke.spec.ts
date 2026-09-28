import { test, expect } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Smoke test — every page in the SPA must render without throwing JS errors.
 *
 * Run the same way the happy-path suite does: `npm run test:e2e -- e2e/smoke.spec.ts`.
 * The `webServer` block in `playwright.config.ts` boots `vite preview` on :4173,
 * and `installApiMocks` returns canned JSON for `/api/v1/*` so the UI never
 * hits the real backend.
 *
 * What this catches: any uncaught throw, broken import, missing route, or
 * runtime exception during first paint of a view. It's a sanity net, not a
 * behavioral check — the deeper assertions live in `happy-path.spec.ts`.
 */

/**
 * Per-page expected title regex. Matches the first `.page-title` or `h1`.
 * - Dashboard renders `cluster.activeCluster` (defaults to '总览' when empty).
 * - Events appends the cluster name: `Events · demo-cluster`.
 * - LoginView uses a plain `<h1>` (no PageHeader) — title text is "Fathom".
 */
const pages = [
  { path: '/', name: '总览', expectTitle: /demo-cluster|总览/ },
  { path: '/pods', name: 'Pods', expectTitle: /^Pods$/ },
  { path: '/pods/default/webapp-001', name: 'Pod 详情', expectTitle: /webapp-001/ },
  { path: '/nodes', name: 'Nodes', expectTitle: /^Nodes$/ },
  { path: '/events', name: 'Events', expectTitle: /^Events ·/ },
  { path: '/favorites', name: '收藏夹', expectTitle: /^收藏夹$/ },
  { path: '/ai', name: 'AI 模型', expectTitle: /^AI 模型$/ },
  { path: '/login', name: '登录', expectTitle: /^Fathom$/ },
] as const

for (const p of pages) {
  test(`renders ${p.name} page (${p.path}) without JS errors`, async ({ page }) => {
    await installApiMocks(page)
    // NodesView calls /api/v1/nodes — _fixtures doesn't cover it. Empty array
    // is enough; the page shows the empty state instead of crashing.
    await page.route('**/api/v1/nodes**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    )

    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.goto(p.path, { waitUntil: 'networkidle', timeout: 15_000 })

    // Sanity: every page has a page-title or h1 element visible with the
    // expected text. The dashboard URL is `/` but it renders `/dashboard`,
    // so we don't assert on URL here — title check is enough.
    const title = page.locator('.page-title, h1').first()
    await expect(title).toBeVisible({ timeout: 5_000 })
    await expect(title).toHaveText(p.expectTitle)

    const criticalErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('Failed to load resource'),
    )
    expect(
      criticalErrors,
      `JS errors on ${p.path}: ${criticalErrors.join(' | ')}`,
    ).toHaveLength(0)
  })
}

test('⌘K opens the command palette', async ({ page }) => {
  await installApiMocks(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // The CommandDialog is mounted but invisible until ⌘K. The input has the
  // placeholder "输入命令、页面或操作…" — wait for it to appear.
  await page.keyboard.press('Meta+K')
  await expect(page.getByPlaceholder('输入命令、页面或操作…')).toBeVisible({ timeout: 3_000 })
})