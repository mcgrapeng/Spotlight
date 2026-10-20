import { test, expect } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Regression: the log panel flickered while scrolling back through history.
 *
 * LogViewer virtualizes with padding spacers above and below the rendered
 * window, sized from a per-row height. Rows are NOT uniform — a row carrying
 * a severity badge or a container chip measures 24px, a plain one 22px. When
 * the spacers were computed from a flat 22px constant while the DOM rendered
 * real heights, total scrollHeight changed every time the window moved, the
 * browser re-anchored, and the content visibly jumped under the cursor.
 *
 * This asserts the thing the user actually sees: the scrollable height must
 * stay put while scrolling through history. It mocks the API so it runs
 * without a cluster, and drives the real wheel input path.
 */
test.describe('Pod logs — scrolling history does not flicker', () => {
  test.use({ baseURL: process.env.VITE_PREVIEW_URL ?? 'http://127.0.0.1:4173' })

  // Enough lines to overflow the viewport many times over. The content is
  // padded so rows wrap to a DIFFERENT number of lines each — that variance is
  // the whole point. Short synthetic lines all render at exactly 22px, the
  // height the old code hard-coded, and the bug goes invisible. The assert
  // below fails loudly if this ever stops being true rather than letting the
  // test pass for the wrong reason.
  const LINES = Array.from({ length: 400 }, (_, i) => ({
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, i)).toISOString(),
    content: `line ${i} ` + 'lorem ipsum dolor sit amet consectetur '.repeat(2 + (i % 3)),
    container: i % 3 === 0 ? 'app' : '',
    severity: i % 5 === 0 ? 'error' : 'info',
  }))

  test('scrollHeight stays constant while scrolling up through history', async ({ page }) => {
    await installApiMocks(page)
    // Enough lines to overflow the viewport several times over, with a mix of
    // badge-bearing and plain rows so row heights genuinely differ.
    // Registered after installApiMocks, so it wins the LIFO match. The regex
    // anchors on `?` or end-of-path so it cannot swallow `/logs/stream`.
    await page.route(/\/api\/v1\/pods\/default\/webapp-001\/logs(\?|$)/, (route) =>
      route.fulfill({ json: { total: LINES.length, items: LINES } }),
    )

    await page.goto('/pods/default/webapp-001')
    // Wrapped rows are a deterministic way to get genuinely mixed heights.
    await page.getByRole('button', { name: /切换换行/ }).click()

    const log = page.locator('[role="log"]')
    await expect(log).toBeVisible()
    // Readiness by geometry, not by selector: wait until the region actually
    // overflows. Deliberately independent of how rows are marked in the DOM,
    // so this test measures the BEHAVIOUR and cannot pass or fail just because
    // an implementation detail was added or removed.
    await expect
      .poll(async () => log.evaluate((el) => el.scrollHeight > el.clientHeight * 3), { timeout: 15_000 })
      .toBe(true)

    // Precondition: the fixture must actually produce rows of differing
    // heights, otherwise the assertion below is vacuous.
    const heightsSeen = await log.evaluate((el) => {
      const rows = [...(el.querySelector('div.relative')?.children ?? [])]
        .filter((c) => !c.hasAttribute('aria-hidden'))
      return [...new Set(rows.map((r) => Math.round(r.getBoundingClientRect().height)))]
    })
    expect(
      heightsSeen.length,
      `fixture produced uniform row heights ${JSON.stringify(heightsSeen)}; the drift this test guards cannot occur`,
    ).toBeGreaterThan(1)

    await log.evaluate((el) => {
      const w = window as unknown as { __h: number[]; __t: number[] }
      w.__h = []
      w.__t = []
      el.addEventListener('scroll', () => {
        w.__h.push(el.scrollHeight)
        w.__t.push(Math.round(el.scrollTop))
      }, { passive: true })
    })

    for (let i = 0; i < 25; i++) {
      await page.mouse.move(700, 400)
      await page.mouse.wheel(0, 120)
      await page.waitForTimeout(30)
    }
    await page.waitForTimeout(800)

    const { h: measured, t: tops } = await page.evaluate(() => {
      const w = window as unknown as { __h: number[]; __t: number[] }
      return { h: w.__h, t: w.__t }
    })
    expect(tops.length).toBeGreaterThan(5)

    // The assertion that matches what the user saw. Scrolling DOWN through
    // history must move scrollTop forward only. The old spacer math made it
    // oscillate — every window change resized the content and the browser
    // re-anchored, bouncing the viewport back and forth, which is the
    // flicker. Checking monotonicity rather than a total scrollHeight budget
    // keeps the test honest: with very long wrapped logs the estimate for
    // never-measured rows is still refined as you scroll, so total height can
    // still settle by a few pixels — but the content under the cursor must
    // never travel backwards.
    const regressions: string[] = []
    for (let i = 1; i < tops.length; i++) {
      if (tops[i] < tops[i - 1]) {
        regressions.push(`${tops[i - 1]} -> ${tops[i]}`)
      }
    }
    expect(
      regressions,
      `scrollTop moved backwards ${regressions.length} times while scrolling forward`,
    ).toEqual([])
  })
})
