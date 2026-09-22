import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Mock variants for the login-required flow. Use this fixture to mount the
 * login UI on first paint.
 */
async function installLoginRequiredMocks(page: Page) {
  await page.route('**/api/v1/auth/status', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        configured: true, available: true,
        proxy: 'gt.internal.zhiman.tech:443', user: 'zhangpeng', cluster: 'pvg1s1-cloud',
      }),
    }),
  )
  // Other endpoints can return empty — we won't reach them in the login flow.
  await page.route('**/api/v1/clusters', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/api/v1/namespaces**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/api/v1/pods**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"total":0,"items":[]}' }),
  )
  await page.route('**/api/v1/pods/stats**', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        total_pods: 0, running: 0, pending: 0, failed: 0, succeeded: 0,
        warning_events: 0, nodes_total: 0, nodes_ready: 0, namespaces_count: 0,
        restart_top: [],
      }),
    }),
  )
  await page.route('**/api/v1/events**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/api/v1/favorites**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/api/v1/ai/providers**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
  await page.route('**/api/v1/pods/**/logs/stream**', (route) =>
    route.fulfill({ status: 200, headers: { 'Content-Type': 'text/event-stream' }, body: '' }),
  )
}

test.describe('Login gate (Teleport tsh)', () => {
  test('blocks the dashboard until login succeeds', async ({ page }) => {
    await installLoginRequiredMocks(page)

    // First render — POST /auth/login will fail (wrong password).
    await page.route('**/api/v1/auth/login', (route) =>
      route.fulfill({
        status: 401, contentType: 'application/json',
        body: JSON.stringify({ detail: 'wrong password' }),
      }),
    )

    await page.goto('/dashboard')
    // Wait for the auth guard to finish its round-trip; Playwright's URL
    // matcher is robust but the navigation goes through a router.replace().
    await page.waitForURL(/\/login(\?.*)?$/, { timeout: 10_000 })
    await expect(page).toHaveURL(/\/login(\?.*)?$/)

    // The configured proxy / user show in the info strip.
    await expect(page.locator('.info-strip')).toContainText('zhangpeng')
    await expect(page.locator('.info-strip')).toContainText('gt.internal.zhiman.tech:443')
    await expect(page.locator('.info-strip')).toContainText('pvg1s1-cloud')

    // Submit empty password — should NOT navigate away.
    const loginBtn = page.getByRole('button', { name: '登录' }).first()
    await loginBtn.click()
    await expect(page).toHaveURL(/\/login$/)

    // Now submit a wrong password.
    await page.fill('input[type="password"]', 'wrong')
    await loginBtn.click()
    await expect(page.getByText('wrong password')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)

    // Swap the mock to success.
    await page.unroute('**/api/v1/auth/login')
    await page.route('**/api/v1/auth/login', (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, proxy: 'gt.internal.zhiman.tech:443',
                              user: 'zhangpeng', cluster: 'pvg1s1-cloud', message: '' }),
      }),
    )
    // Re-fill and submit (since the previous attempt left error visible).
    await page.fill('input[type="password"]', 'correct')
    await loginBtn.click()

    // Now we land on the originally-requested page.
    await expect(page).toHaveURL(/\/dashboard$/)
  })
})