import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Mock variants for the login-required flow. Use this fixture to mount the
 * login UI on first paint. The /auth/status shape follows the T7 plugin
 * contract: an active `teleport` provider with password + optional otp
 * fields; the caller has no session yet so the router guard bounces to
 * /login.
 */
async function installLoginRequiredMocks(page: Page) {
  await page.route('**/api/v1/auth/status', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        configured: true,
        provider: {
          id: 'teleport',
          label: 'Teleport',
          fields: [
            { name: 'password', label: '密码', type: 'password', required: true },
            { name: 'otp', label: 'MFA 一次性码（6 位 TOTP）', type: 'otp', required: false },
          ],
        },
        auth_required: true,
        client_session: false,
        session: null,
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
    // Backend maps invalid_credentials → 401 with {code, message}; the store
    // unwraps `detail.message` to show the user.
    await page.route('**/api/v1/auth/login', (route) =>
      route.fulfill({
        status: 401, contentType: 'application/json',
        body: JSON.stringify({ detail: { code: 'invalid_credentials', message: 'wrong password' } }),
      }),
    )

    await page.goto('/dashboard')
    // Wait for the auth guard to finish its round-trip; Playwright's URL
    // matcher is robust but the navigation goes through a router.replace().
    await page.waitForURL(/\/login(\?.*)?$/, { timeout: 10_000 })
    await expect(page).toHaveURL(/\/login(\?.*)?$/)

    // The Teleport provider's form fields render dynamically. The username
    // input is fixed (it's the login() parameter, not a provider field).
    await expect(page.getByLabel('用户名')).toBeVisible()
    await expect(page.getByLabel('密码')).toBeVisible()
    await expect(page.getByLabel('MFA 一次性码（6 位 TOTP）')).toBeVisible()

    // Submit empty username — should NOT navigate away.
    const loginBtn = page.getByRole('button', { name: '登录' }).first()
    await loginBtn.click()
    // URL may carry ?next=/dashboard query; we only assert it still starts with /login.
    expect(page.url()).toContain('/login')

    // Now submit a wrong password.
    await page.getByLabel('用户名').fill('zhangpeng')
    await page.getByLabel('密码').fill('wrong')
    await loginBtn.click()
    await expect(page.getByText('wrong password')).toBeVisible()
    expect(page.url()).toContain('/login')

    // Swap the mock to success — the backend responds with the new contract:
    // {ok, kube_clusters, message}. Empty kube_clusters → straight to /dashboard
    // (token-like path, no /auth/cluster step needed).
    await page.unroute('**/api/v1/auth/login')
    await page.route('**/api/v1/auth/login', (route) =>
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ ok: true, kube_clusters: [], message: 'ok' }),
      }),
    )
    // Re-fill and submit (since the previous attempt left error visible).
    await page.getByLabel('密码').fill('correct')
    await loginBtn.click()

    // Now we land on the originally-requested page.
    await expect(page).toHaveURL(/\/dashboard$/)
  })
})