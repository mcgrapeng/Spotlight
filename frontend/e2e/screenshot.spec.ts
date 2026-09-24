import { test } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Visual snapshot — capture one JPEG per main page at 1440×900 for the v6
 * design system archive in `.screenshots/`.
 *
 * Reuses the same `installApiMocks` fixture the smoke + a11y suites already
 * rely on so the UI renders canned data without a live backend. The route
 * `/ai-settings` in the original brief was a typo — the real path is `/ai`
 * (see `src/router/index.ts`); we use the working route so the screenshot
 * actually shows the page.
 *
 * Output: `../.screenshots/v6-<page>.jpeg` (relative to `frontend/e2e`,
 * resolves to `<repo>/.screenshots/`).
 *
 * Run: `npm run test:e2e -- e2e/screenshot.spec.ts`.
 */
const targets = [
  { path: '/', name: 'v6-dashboard' },
  { path: '/pods', name: 'v6-pods' },
  { path: '/nodes', name: 'v6-nodes' },
  { path: '/events', name: 'v6-events' },
  { path: '/ai', name: 'v6-ai' },
  { path: '/login', name: 'v6-login' },
] as const

for (const t of targets) {
  test(`screenshot ${t.name}`, async ({ page }) => {
    await installApiMocks(page)
    // _fixtures doesn't mock /api/v1/nodes — empty array is enough for NodesView.
    await page.route('**/api/v1/nodes**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    )

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(t.path, { waitUntil: 'networkidle', timeout: 15_000 })

    await page.screenshot({
      path: `../.screenshots/${t.name}.jpeg`,
      fullPage: false,
      type: 'jpeg',
      quality: 85,
    })
  })
}