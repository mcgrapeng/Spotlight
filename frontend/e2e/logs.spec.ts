import { test, expect } from '@playwright/test'

/**
 * Plan F / Task 4 — Pod logs behavior smoke test.
 *
 * Runs against the live dev server (http://127.0.0.1:7003) and the real
 * backend on :8002. No API mocks: the goal is to catch regressions in the
 * "logs tab loads → pause → clear" interaction against the real stack.
 *
 * Requires:
 *   - `npm run dev -- --port 7003` running in /Users/zhangpeng/workspace/liaohe/k8s-viewer/frontend
 *   - Backend on :8002 with the pod `innies-dev/innies-stack-prism-67bc5c4967-ctwzp` reachable
 *
 * Selectors mirror the actual LogViewer.vue markup (see components/log/LogViewer.vue):
 *   - pause button aria-label flips between "暂停" and "继续" based on streaming state
 *   - clear button has aria-label="清空"
 *   - log line rows are children of [role="log"] carrying `border-b` (Tailwind)
 *   - empty state text is "等待日志…" or "没有匹配的行"
 */
test.describe('Pod logs — tab loads, pause toggles, clear empties', () => {
  test.use({ baseURL: 'http://127.0.0.1:7003' })

  const POD_NS = 'innies-dev'
  const POD_NAME = 'innies-stack-prism-67bc5c4967-ctwzp'

  test('loads history, toggles pause/resume, and clears the buffer', async ({ page }) => {
    // 1. Navigate to pod detail. The detail view uses <h1>{{ pod.name }}</h1>
    //    via @/components/common/PageHeader (no `.page-title` class — that's
    //    only set on dashboard/pods/events pages).
    await page.goto(`/pods/${POD_NS}/${POD_NAME}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(POD_NAME)

    // 2. Click Logs tab (YAML is the default selected tab).
    const logsTab = page.getByRole('tab', { name: 'Logs' })
    await expect(logsTab).toBeVisible()
    await logsTab.click()

    // 3. Wait for history to land. The usePodLogs composable fires as soon as
    //    the logs tab mounts; give it up to ~10s (web-first, auto-retries).
    const logRow = page.locator('[role="log"] [class*="border-b"]').first()
    await expect(logRow).toBeVisible({ timeout: 10_000 })

    // Sanity: at least one row is rendered.
    const rowCount = await page.locator('[role="log"] [class*="border-b"]').count()
    expect(rowCount).toBeGreaterThan(0)

    // Brief asked for a 2500ms settle window — keep it as a small buffer so
    // any streaming lines that arrived in the meantime are stable before the
    // assertions below mutate the buffer.
    await page.waitForTimeout(2500)

    // 4. Click the pause button (aria-label="暂停" when streaming is on).
    const pauseBtn = page.getByRole('button', { name: '暂停' })
    await expect(pauseBtn).toBeVisible()
    await pauseBtn.click()

    // 5. Verify it flipped: streaming off → aria-label becomes "继续".
    const resumeBtn = page.getByRole('button', { name: '继续' })
    await expect(resumeBtn).toBeVisible()
    await expect(pauseBtn).toHaveCount(0)

    // 6. Click clear.
    const clearBtn = page.getByRole('button', { name: '清空' })
    await expect(clearBtn).toBeVisible()
    await clearBtn.click()

    // 7. Empty state appears inside the log region.
    await expect(page.locator('[role="log"]')).toContainText(/等待日志|没有匹配/)
  })
})