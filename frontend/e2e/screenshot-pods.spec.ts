import { test } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Visual snapshot for the v6 PodListView with pagination (Plan D, Task 3).
 *
 * Captures `/pods` at 1440×900 into `.screenshots/v6-pods-v2.jpeg` so the
 * Plan-D audit trail has a fresh reference of the table + pagination
 * (commit 85f801d3) and the tag-style labels (Task 1) on top of v6 tokens.
 *
 * Reuses `installApiMocks` so the run is hermetic — no live backend needed,
 * same canned pod data as the rest of the e2e suite.
 *
 * Output: `<repo>/.screenshots/v6-pods-v2.jpeg` (gitignored, archive-only).
 * Run: `npm run test:e2e -- e2e/screenshot-pods.spec.ts`.
 */
test('screenshot v6-pods-v2', async ({ page }) => {
  await installApiMocks(page)
  await page.route('**/api/v1/nodes**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/pods', { waitUntil: 'networkidle', timeout: 15_000 })

  await page.screenshot({
    path: '../.screenshots/v6-pods-v2.jpeg',
    fullPage: false,
    type: 'jpeg',
    quality: 85,
  })
})