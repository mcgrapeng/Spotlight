import { defineConfig, devices } from '@playwright/test'
import { loadEnv } from 'vite'
import {
  BACKEND_DIR, BACKEND_PY, FAKE_APISERVER, KUBECONFIG_PATH,
  ensureKubeconfig, FAKE_PROD_PORT, FAKE_STAGING_PORT, BACKEND_PORT,
  backendInterpreterAvailable,
} from './e2e/_cluster-env'

/**
 * E2E configuration.
 *
 * Two kinds of spec share this config:
 *
 * 1. UI specs (smoke, a11y, full-flow, …) mock every `/api/v1/*` call with
 *    `page.route()`, isolating the UI layer.
 * 2. `cluster-switch.spec.ts` runs against the REAL backend and two REAL fake
 *    apiservers, because mocking cannot answer the one question it asks:
 *    does the cluster you pick actually change what gets read? A mocked
 *    fixture answers whatever it is asked for, which is how the
 *    `?context=` / `?cluster=` mismatch survived since `init`.
 *
 * Both work against the preview server because `vite.config.ts` gives
 * `preview` the same `/api` proxy as `dev` (it used to have none, which is
 * what forced everything to mock).
 *
 * No browser is auto-installed in CI; use `npx playwright install chromium`.
 */

// The preview port is resolved once, here. Unlike the dev server it must NOT
// auto-increment: Playwright navigates to `baseURL`, so a silently-shifted
// port would look like every test failing at once. --strictPort makes a busy
// port fail loudly at startup instead. Change it via VITE_PREVIEW_PORT in
// frontend/.env, never by editing the numbers below.
const PREVIEW_PORT = Number(loadEnv('', process.cwd(), '').VITE_PREVIEW_PORT) || 4173
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`

// Generated at config-load time so it exists before the backend boots. See
// e2e/_cluster-env.ts for why these ports are fixed rather than scanned.
ensureKubeconfig()

const hasBackend = backendInterpreterAvailable()
const fakeApi = (short: string, port: number) => ({
  command: `node ${FAKE_APISERVER} ${short} ${port}`,
  url: `http://127.0.0.1:${port}/api/v1/namespaces`,
  reuseExistingServer: false,
  timeout: 30_000,
})

const servers: Parameters<typeof defineConfig>[0]['webServer'] = [
  {
    command: `npm run preview -- --port ${PREVIEW_PORT} --strictPort`,
    url: PREVIEW_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    // Points vite's `preview.proxy` at our backend. Mocked specs never reach
    // it (page.route intercepts first); cluster-switch.spec.ts depends on it.
    env: { VITE_API_PROXY: `http://127.0.0.1:${BACKEND_PORT}` },
  },
]

if (hasBackend) {
  // The backend must see the generated kubeconfig via KUBECONFIG, not
  // KUBECONFIG_PATH: in open mode there is no per-session kubeconfig, so
  // `k8s_repo` passes None down and the SDK reads this variable directly.
  // `no_proxy` is not optional here — the SDK seeds Configuration.proxy from
  // urllib.request.getproxies(), which on macOS reads SYSTEM proxy settings,
  // and a local proxy turns every call to 127.0.0.1 into a 502.
  servers.push(
    fakeApi('prod', FAKE_PROD_PORT),
    fakeApi('staging', FAKE_STAGING_PORT),
    {
      command: `"${BACKEND_PY}" -m app.server --port ${BACKEND_PORT} --host 127.0.0.1 --log-level warning`,
      cwd: BACKEND_DIR,
      url: `http://127.0.0.1:${BACKEND_PORT}/healthz`,
      reuseExistingServer: false,
      timeout: 60_000,
      env: {
        KUBECONFIG: KUBECONFIG_PATH,
        KUBECONFIG_PATH,
        no_proxy: '127.0.0.1,localhost',
        NO_PROXY: '127.0.0.1,localhost',
      },
    },
  )
} else {
  // Fail loudly in CI rather than reporting a mysterious cluster-switch
  // failure; warn locally so the mocked UI specs can still be run. Only a
  // path-shaped value can land here — see `backendInterpreterAvailable`.
  const msg =
    `[e2e] backend interpreter not found at ${BACKEND_PY} (a path). ` +
    `cluster-switch.spec.ts cannot run. Locally: cd backend && ` +
    `python -m venv .venv && pip install -r requirements.txt. ` +
    `In CI: set SPOTLIGHT_BACKEND_PY.`
  if (process.env.CI) {
    throw new Error(msg)
  }
  console.warn(msg)
}

export default defineConfig({
  testDir: './e2e',
  // These target a live dev stack against a real cluster (a real pod, real log
  // lines) and so cannot run here. `logs.spec.ts` has its own config
  // (playwright.dev.config.ts); `zz-*` are local scratch inspectors pinned to a
  // hard-coded dev port, and are gitignored.
  testIgnore: ['**/logs.spec.ts', '**/zz-*.spec.ts'],
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: PREVIEW_URL,
    // Pin the browser locale. `resolveInitialLocale()` falls back to
    // `navigator.language`, and Chromium defaults to en-US — so every spec
    // asserting Chinese copy (总览 / 收藏夹 / AI 模型) failed while the app
    // rendered perfectly correct English. Set the locale the specs assume
    // rather than weakening their assertions.
    locale: 'zh-CN',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: servers,
})
