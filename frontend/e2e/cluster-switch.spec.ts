/**
 * Multi-cluster switching, end to end, against two REAL backends.
 *
 * This is the one flow a mocked spec cannot cover. Every other e2e intercepts
 * `/api/*` with `page.route()`, so it answers whatever it is asked for — which
 * is precisely why the `?context=` (backend) vs `?cluster=` (frontend) mismatch
 * went unnoticed from the initial commit: with a mock, requesting the wrong
 * cluster still returns plausible pods.
 *
 * Here each fake apiserver serves one context and stamps its own name into
 * every object it returns (`prod-pod-a` vs `staging-pod-a`), so the selected
 * cluster is decided by the DATA. Reverting the backend routes to the old
 * `?cluster=` parameter makes this fail with
 * "staging-pod-a never rendered — selection dropped".
 *
 * No authentication: the backend runs in open mode, so this exercises the K8s
 * plumbing rather than the login flow.
 */
import { test, expect } from '@playwright/test'
import {
  PROD_CONTEXT, STAGING_CONTEXT, PROD_POD, STAGING_POD,
} from './_cluster-env'

/** Drive the real cluster combobox (ClusterCombobox.vue). */
async function pickCluster(page, name: string) {
  const trigger = page.locator('button[role=combobox]').first()
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()
  const option = page.locator(`[role=option]:has-text("${name}")`).first()
  await expect(option).toBeVisible()
  await option.click()
  await expect(trigger).toContainText(name)
}

test.describe('cluster switching reads the cluster you selected', () => {
  test('the kubeconfig current-context is what loads first', async ({ page }) => {
    await page.goto('/pods', { waitUntil: 'networkidle' })
    // The generated kubeconfig's current-context is prod-cluster, so this is
    // the default path rather than anything the UI chose.
    await expect(page.locator('button[role=combobox]').first()).toContainText(PROD_CONTEXT)
    await expect(page.getByText(PROD_POD).first()).toBeVisible()
    await expect(page.getByText(STAGING_POD)).toHaveCount(0)
  })

  test('every K8s request carries the selected context', async ({ page }) => {
    const seen: string[] = []
    page.on('request', (r) => seen.push(r.url()))
    await page.goto('/pods', { waitUntil: 'networkidle' })
    await expect(page.getByText(PROD_POD).first()).toBeVisible()

    const podCalls = seen.filter((u) => u.includes('/api/v1/pods'))
    expect(podCalls.length).toBeGreaterThan(0)
    // If the parameter name drifted again, this is where it shows: the request
    // would go out with no context and the backend would silently answer from
    // current-context.
    expect(seen.some((u) => u.includes(`context=${PROD_CONTEXT}`))).toBe(true)
  })

  test('switching clusters switches the data', async ({ page }) => {
    await page.goto('/pods', { waitUntil: 'networkidle' })
    await expect(page.getByText(PROD_POD).first()).toBeVisible()

    await pickCluster(page, STAGING_CONTEXT)

    await expect(page.getByText(STAGING_POD).first()).toBeVisible()
    await expect(page.getByText(PROD_POD)).toHaveCount(0)
  })

  test('switching back returns the original data', async ({ page }) => {
    await page.goto('/pods', { waitUntil: 'networkidle' })
    await pickCluster(page, STAGING_CONTEXT)
    await expect(page.getByText(STAGING_POD).first()).toBeVisible()

    await pickCluster(page, PROD_CONTEXT)

    await expect(page.getByText(PROD_POD).first()).toBeVisible()
    await expect(page.getByText(STAGING_POD)).toHaveCount(0)
  })

  test('a cluster that does not exist is refused, not silently ignored', async ({ page }) => {
    await page.goto('/pods', { waitUntil: 'networkidle' })
    // What a stale localStorage selection looks like after someone else logs
    // in: a context this session's kubeconfig does not contain. The backend
    // answers 409 so the UI can re-sync, instead of a 500 or, worse, quietly
    // serving the host kubeconfig.
    const res = await page.request.get(`/api/v1/pods?context=no-such-cluster`)
    expect(res.status()).toBe(409)
  })
})
