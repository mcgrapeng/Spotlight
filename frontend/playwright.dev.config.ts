import { defineConfig, devices } from '@playwright/test'

/**
 * Dev-server E2E config — targets the running `npm run dev` instance (the
 * URL/port come from VITE_PORT in frontend/.env) and the live backend.
 * No mocks, no preview server, no build.
 *
 * Usage:  node_modules/.bin/playwright test --config=playwright.dev.config.ts e2e/logs.spec.ts
 *
 * Assumes the dev server is already running.
 */
export default defineConfig({
  testDir: './e2e',
  // logs.spec.ts needs a live cluster; auth-live.spec.ts needs live
  // credentials (it skips without them). functional-live.spec.ts walks
  // every feature against the real cluster. All target the running dev stack.
  testMatch: ['logs.spec.ts', 'auth-live.spec.ts', 'functional-live.spec.ts'],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})