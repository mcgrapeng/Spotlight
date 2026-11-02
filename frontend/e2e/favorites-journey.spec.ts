import { test, expect, type Page } from '@playwright/test'
import { installApiMocks } from './_fixtures'

/**
 * Favorites state journey — the one write path the UI owns end to end:
 * a favorite is listed, deleted, and then must be gone.
 *
 * Mocks: `installApiMocks` first (its favorites route only answers the
 * collection URL), then a stateful override that also answers
 * `DELETE /api/v1/favorites/:id` so the journey can actually delete.
 */

const FAVORITES = [
  { id: 1, resource_type: 'pod', name: 'webapp-001', namespace: 'default',
    cluster: 'demo-cluster', note: '', created_at: '2024-01-01T00:00:00Z' },
  { id: 2, resource_type: 'node', name: 'node-1', namespace: '',
    cluster: 'demo-cluster', note: '', created_at: '2024-01-02T00:00:00Z' },
]

async function installFavoriteJourneyMocks(page: Page) {
  const deleted = new Set<number>()
  // Later registrations win in Playwright, so this overrides _fixtures'
  // collection-only route for everything under /favorites.
  await page.route('**/api/v1/favorites**', (route) => {
    const req = route.request()
    const url = new URL(req.url())
    const idMatch = url.pathname.match(/\/favorites\/(\d+)$/)
    if (req.method() === 'DELETE' && idMatch) {
      deleted.add(Number(idMatch[1]))
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
    }
    if (req.method() === 'GET') {
      const body = FAVORITES.filter((f) => !deleted.has(f.id))
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    }
    return route.fulfill({ status: 400, contentType: 'application/json', body: '{}' })
  })
}

test('a deleted favorite disappears from the list', async ({ page }) => {
  await installApiMocks(page)
  await installFavoriteJourneyMocks(page)

  await page.goto('/favorites')
  await expect(page.getByText('webapp-001').first()).toBeVisible()
  await expect(page.getByText('node-1').first()).toBeVisible()

  // The mock's array order is the render order, so the first 删除 button
  // belongs to the webapp-001 card; the assertions below self-check that.
  await page.getByRole('button', { name: '删除' }).first().click()

  // Delete confirmed, gone from the view, the other favorite untouched.
  await expect(page.getByText('已删除收藏')).toBeVisible()
  await expect(page.getByText('webapp-001')).toHaveCount(0)
  await expect(page.getByText('node-1').first()).toBeVisible()
})
