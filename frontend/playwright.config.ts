import { defineConfig, devices } from '@playwright/test'

/**
 * E2E configuration.
 *
 * Strategy: serve the production build with vite's preview server, and mock
 * every `/api/v1/*` call via `page.route()` from each test. This isolates the
 * UI layer — the same flow runs against a real backend in production.
 *
 * No browser is auto-installed in CI; use `npx playwright install chromium`
 * once before running.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})