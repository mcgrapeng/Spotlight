import { test, expect } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * The log panel virtualizes its rows with a spacer above and below the
 * rendered window. That only works if the model and the DOM agree on how
 * tall every group is, and the browser audits the agreement through two
 * channels: the total scroll height, and native scroll anchoring, which
 * moves scrollTop on its own when the content above the viewport resizes.
 *
 * These specs assert the four behaviours that define "fixed":
 *
 *   1. every rendered row belongs to a group whose height the model can
 *      see, so no row is invisible to the measurement;
 *   2. scrollTop never walks backwards while the reader scrolls forward;
 *   3. both ends of the log are reachable and fully visible;
 *   4. the content moves by exactly the distance the reader scrolled, so
 *      nothing slides under the cursor.
 *
 * The log renders oldest-first with the tail at the BOTTOM, the way
 * `kubectl logs -f` does, so the panel opens at the newest line and the
 * reader scrolls UP into the history.
 */

// A log that contains every shape that breaks a flat-height model: plain
// text, a folded run of identical lines, JSON payloads, and lines long
// enough to wrap to a different number of lines each.
const WORDS = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel']
const LINES = Array.from({ length: 400 }, (_, i) => {
  const base = {
    timestamp: new Date(Date.UTC(2026, 0, 1, 0, 0, i)).toISOString(),
    container: i % 3 === 0 ? 'app' : '',
    severity: i % 5 === 0 ? 'error' : 'info',
  }
  // The API returns the buffer oldest-first (index 0 is 00:00) and the app
  // reverses it, so the shapes that matter sit at the newest end — which is
  // the BOTTOM of the panel now, and therefore on screen when it opens.
  if (i >= 360) {
    // 40 identical lines: they fold into ONE group.
    return { ...base, content: 'identical heartbeat line' }
  }
  if (i >= 320) {
    // 40 JSON payloads in groups of five. The normalizer maps every number
    // to 'N', so these would all fold together if JSON lines were foldable.
    return {
      ...base,
      content: JSON.stringify({ level: 'info', tag: WORDS[i % WORDS.length], n: i }),
    }
  }
  return {
    ...base,
    content: 'line ' + i + ' ' + 'lorem ipsum dolor sit amet consectetur '.repeat(2 + (i % 3)),
  }
})

async function openLog(page) {
  await installApiMocks(page)
  await page.route(/\/api\/v1\/pods\/default\/webapp-001\/logs(\?|$)/, (route) =>
    route.fulfill({ json: { total: LINES.length, items: LINES } }),
  )
  await page.goto('/pods/default/webapp-001')
  const log = page.locator('[role="log"]')
  await expect(log).toBeVisible()
  await expect
    .poll(async () => log.evaluate((el) => el.scrollHeight > el.clientHeight * 3), { timeout: 15_000 })
    .toBe(true)
  return log
}

/** Put the wheel over the middle of the log panel. */
async function wheelOver(page, log, dy: number) {
  const box = await log.boundingBox()
  if (!box) throw new Error('the log panel has no box')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.wheel(0, dy)
}

test.describe('Pod logs — the virtual model matches the DOM', () => {
  test('no rendered row escapes the measurement', async ({ page }) => {
    const log = await openLog(page)

    // Open a fold and a JSON panel: these are the two shapes that used to
    // add DOM the model could not see. A folded run added one row per
    // folded line inside a display:contents wrapper that carried no key,
    // and a JSON panel was a sibling of the row rather than part of it.
    const fold = log.locator('div[role="button"]').first()
    await expect(fold).toHaveAttribute('aria-expanded', 'false')
    await fold.click()
    await page.waitForTimeout(400)
    const jsonChip = log.getByRole('button', { name: /JSON/i }).first()
    await jsonChip.click()
    await page.waitForTimeout(400)
    // Clicking the JSON chip scrolls the reader UP to it, which is exactly
    // what a reader does too, and it breaks the follow. Go back to the
    // tail so the expanded fold is inside the window this report measures.
    await log.evaluate(
      (el) => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' as ScrollBehavior }),
    )
    await page.waitForTimeout(600)

    const report = await log.evaluate((el) => {
      const ROW = 'div[class*="min-h-[22px]"]'
      const wrap = el.querySelector('div.relative')!
      const groups = [...wrap.querySelectorAll('[data-gkey]')]
      const allRows = [...wrap.querySelectorAll(ROW)]
      // Every rendered row must live inside a group wrapper, and the
      // wrapper must be at least as tall as the rows it contains.
      const orphans = allRows.filter((r) => !r.closest('[data-gkey]'))
      const tooShort = groups
        .map((g) => {
          const inner = [...g.querySelectorAll(ROW)].reduce(
            (a, r) => a + r.getBoundingClientRect().height,
            0,
          )
          return {
            key: (g as HTMLElement).dataset.gkey,
            h: g.getBoundingClientRect().height,
            inner,
          }
        })
        .filter((g) => g.inner > g.h + 1)
      return {
        groupCount: groups.length,
        rowCount: allRows.length,
        foldCount: wrap.querySelectorAll('div[role="button"]').length,
        jsonCount: [...wrap.querySelectorAll('button')].filter((b) =>
          /JSON/i.test(b.textContent || ''),
        ).length,
        orphanRows: orphans.length,
        tooShort: tooShort.slice(0, 3),
      }
    })

    expect(report.orphanRows, 'every rendered row must belong to a measured group').toBe(0)
    expect(report.tooShort, 'a group wrapper must be as tall as the rows it holds').toEqual([])
    // The fixture has to actually contain the shapes, or the assertions
    // above are vacuous. The panel opens at the tail, where the folded run
    // and the JSON payloads live.
    expect(report.foldCount, 'the fixture must render a folded run').toBeGreaterThan(0)
    expect(report.jsonCount, 'the fixture must render JSON payloads').toBeGreaterThan(0)
  })

  test('scrollTop never moves backwards while scrolling forward', async ({ page }) => {
    const log = await openLog(page)
    await page.getByRole('button', { name: /切换换行/ }).click()
    await page.waitForTimeout(400)
    // The panel opens at the tail, so scroll forward means scrolling DOWN
    // from here — which is a no-op at the bottom. Start at the top of the
    // history and scroll down into it.
    await log.evaluate(
      (el) => el.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }),
    )
    await page.waitForTimeout(600)

    await log.evaluate((el) => {
      const w = window as unknown as { __t: number[] }
      w.__t = []
      el.addEventListener('scroll', () => w.__t.push(Math.round(el.scrollTop)), { passive: true })
    })
    for (let i = 0; i < 25; i++) {
      await wheelOver(page, log, 120)
      await page.waitForTimeout(30)
    }
    await page.waitForTimeout(800)

    const tops = await page.evaluate(() => (window as unknown as { __t: number[] }).__t)
    expect(tops.length).toBeGreaterThan(5)
    const regressions: string[] = []
    for (let i = 1; i < tops.length; i++) {
      if (tops[i] < tops[i - 1]) regressions.push(tops[i - 1] + ' -> ' + tops[i])
    }
    expect(regressions, 'scrollTop moved backwards ' + regressions.length + ' times').toEqual([])
  })

  test('both ends of the log are reachable and fully visible', async ({ page }) => {
    const log = await openLog(page)
    for (const wrap of [false, true]) {
      if (wrap) {
        await page.getByRole('button', { name: /切换换行/ }).click()
        await page.waitForTimeout(500)
      }
      // The bottom is the tail now: the newest line has to be on screen.
      await log.evaluate(
        (el) => el.scrollTo({ top: el.scrollHeight, behavior: 'instant' as ScrollBehavior }),
      )
      await page.waitForTimeout(700)
      const end = await log.evaluate((el) => {
        const wrap = el.querySelector('div.relative')!
        const rows = [...wrap.querySelectorAll('div[class*="min-h-[22px]"]')]
        const last = rows[rows.length - 1]
        const lb = last?.getBoundingClientRect()
        const eb = el.getBoundingClientRect()
        return {
          scrollTop: Math.round(el.scrollTop),
          maxScroll: Math.round(el.scrollHeight - el.clientHeight),
          lastRowText: (last?.innerText || '').replace(/\s+/g, ' ').slice(0, 40),
          visible: lb ? lb.bottom <= eb.bottom + 2 && lb.top >= eb.top - 2 : false,
        }
      })
      expect(end.scrollTop, 'wrap=' + wrap + ': the reader must be able to reach the end').toBe(
        end.maxScroll,
      )
      expect(end.visible, 'wrap=' + wrap + ': the newest line must be fully visible').toBe(true)
      expect(
        end.lastRowText,
        'wrap=' + wrap + ': the newest line must be the one on screen',
      ).toContain('identical heartbeat')

      // And the oldest line is at the top.
      await log.evaluate(
        (el) => el.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }),
      )
      await page.waitForTimeout(700)
      const start = await log.evaluate((el) => {
        const wrap = el.querySelector('div.relative')!
        const rows = [...wrap.querySelectorAll('div[class*="min-h-[22px]"]')]
        const first = rows[0]
        const fb = first?.getBoundingClientRect()
        const eb = el.getBoundingClientRect()
        return {
          scrollTop: Math.round(el.scrollTop),
          firstRowText: (first?.innerText || '').replace(/\s+/g, ' ').slice(0, 40),
          visible: fb ? fb.bottom <= eb.bottom + 2 && fb.top >= eb.top - 2 : false,
        }
      })
      expect(start.scrollTop, 'wrap=' + wrap + ': the reader must be able to reach the start').toBe(0)
      expect(start.visible, 'wrap=' + wrap + ': the oldest line must be fully visible').toBe(true)
      expect(
        start.firstRowText,
        'wrap=' + wrap + ': the oldest line must be the one on screen',
      ).toContain('line 0 ')
    }
  })

  test('the content moves by exactly the distance the reader scrolled', async ({ page }) => {
    const log = await openLog(page)
    await page.getByRole('button', { name: /切换换行/ }).click()
    await page.waitForTimeout(500)
    await log.evaluate(
      (el) => el.scrollTo({ top: 1200, behavior: 'instant' as ScrollBehavior }),
    )
    await page.waitForTimeout(600)

    const before = await log.evaluate((el) => {
      const wrap = el.querySelector('div.relative')!
      const map: Record<string, number> = {}
      for (const g of wrap.querySelectorAll('[data-gkey]')) {
        map[(g as HTMLElement).dataset.gkey!] = g.getBoundingClientRect().top
      }
      return { top: Math.round(el.scrollTop), map }
    })

    await wheelOver(page, log, 120)
    await page.waitForTimeout(500)

    const after = await log.evaluate((el) => {
      const wrap = el.querySelector('div.relative')!
      const map: Record<string, number> = {}
      for (const g of wrap.querySelectorAll('[data-gkey]')) {
        map[(g as HTMLElement).dataset.gkey!] = g.getBoundingClientRect().top
      }
      return { top: Math.round(el.scrollTop), map }
    })

    const scrollDelta = after.top - before.top
    expect(scrollDelta, 'the scroll must have moved forward').toBeGreaterThan(0)

    // A row that is on screen in both snapshots must have moved by exactly
    // the scroll delta, in the opposite direction: scrolling down moves the
    // content up. Anything else means the model and the DOM disagreed about
    // where the content is, which is the flicker.
    const drift: string[] = []
    for (const [key, topBefore] of Object.entries(before.map)) {
      const topAfter = after.map[key]
      if (topAfter === undefined) continue
      const moved = topAfter - topBefore
      if (Math.abs(moved + scrollDelta) > 1.5) {
        drift.push(key + ': moved ' + moved.toFixed(1) + 'px, scrolled ' + scrollDelta + 'px')
      }
    }
    expect(drift, 'content drifted under the cursor:\n' + drift.join('\n')).toEqual([])
  })
})
