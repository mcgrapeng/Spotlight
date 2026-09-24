import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { installApiMocks } from './_fixtures'

/**
 * Accessibility audit — axe-core sweep over the 6 main pages of the SPA.
 *
 * Strategy: serve the production build, mock `/api/v1/*` so the UI never
 * touches a real backend, then run axe-core with WCAG 2.0 A + AA rules on
 * each page. Any `critical` or `serious` violation fails the test; minor
 * and moderate issues are logged so we can fix them in Plan C follow-up
 * but do not block CI.
 *
 * Why mock? Same reason as the smoke spec — we want to audit the rendered
 * DOM and ARIA semantics of the view layer, not the backend contract.
 *
 * Note on route paths: the brief lists `/ai-settings`, but the actual route
 * in `src/router/index.ts` is `/ai` (named `ai`, title "AI 模型"). We use
 * the real path so the test exercises the real code.
 */

const pages = [
  { path: '/', name: '总览' },
  { path: '/pods', name: 'Pods' },
  { path: '/nodes', name: 'Nodes' },
  { path: '/events', name: 'Events' },
  { path: '/ai', name: 'AI 模型' },
  { path: '/login', name: '登录' },
] as const

for (const p of pages) {
  test(`a11y: ${p.name} (${p.path}) has no critical/serious axe violations`, async ({ page }) => {
    await installApiMocks(page)
    await page.route('**/api/v1/nodes**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    )

    await page.goto(p.path, { waitUntil: 'networkidle', timeout: 15_000 })
    await expect(page.locator('.page-title, h1').first()).toBeVisible({ timeout: 5_000 })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    )
    const advisory = results.violations.filter(
      (v) => v.impact === 'moderate' || v.impact === 'minor',
    )

    if (advisory.length > 0) {
      console.log(`[a11y] ${p.path} — ${advisory.length} advisory violation(s):`)
      for (const v of advisory) {
        console.log(`  · [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`)
      }
    }

    expect(
      blocking,
      blocking.length === 0
        ? ''
        : `${blocking.length} critical/serious axe violation(s) on ${p.path}:\n` +
          blocking
            .map(
              (v) =>
                `  [${v.impact}] ${v.id}: ${v.help}\n` +
                v.nodes
                  .map((n) => `    → ${n.target.join(' ')} — ${(n.failureMessage ?? '').slice(0, 200)}`)
                  .join('\n'),
            )
            .join('\n'),
    ).toEqual([])
  })
}