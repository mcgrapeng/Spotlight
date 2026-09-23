import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Install `page.route()` intercepts for every `/api/v1/*` endpoint.
 *
 * Tests should call this in `beforeEach` to avoid leaking mocks between
 * runs. The intercepts return canned data — the goal is to exercise the UI
 * navigation/filter paths end-to-end, not to validate the backend.
 *
 * Stream (SSE) endpoints deliberately return a 200 with an empty event stream;
 * the UI shows the empty state without crashing.
 *
 * Route specificity matters: Playwright uses the LATEST registered match.
 * We therefore register the more specific paths (`/pods/{ns}/{name}`,
 * `/pods/stats`) AFTER the broad wildcard (`/pods`) so the concrete handler
 * wins.
 */
export async function installApiMocks(page: Page) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  await page.route('**/api/v1/auth/status', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        configured: false, available: false, proxy: '', user: '', cluster: '',
      }),
    }),
  )

  // ── Cluster + namespaces ─────────────────────────────────────────────────
  await page.route((url) => new URL(url).pathname === '/api/v1/clusters', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { name: 'demo-cluster', cluster: 'demo', user: 'admin',
          namespace: 'default', is_current: true },
      ]),
    }),
  )
  await page.route((url) => new URL(url).pathname === '/api/v1/clusters/current', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ name: 'demo-cluster' }) }),
  )
  await page.route((url) => new URL(url).pathname === '/api/v1/namespaces', (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { name: 'default', status: 'Active', labels: {}, age: null },
        { name: 'kube-system', status: 'Active', labels: {}, age: null },
        { name: 'monitoring', status: 'Active', labels: {}, age: null },
      ]),
    }),
  )

  // ── Pods LIST (exact: /api/v1/pods, not /pods/stats or /pods/{ns}/{name}) ──
  // The frontend sends to /api/v1/pods for listing. We pin this to the exact
  // path so it doesn't shadow /pods/stats or /pods/{ns}/{name}.
  await page.route(/\/api\/v1\/pods(\?.*)?$/, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        total: 2,
        items: [
          { name: 'webapp-001', namespace: 'default', node: 'node-a',
            pod_ip: '10.0.0.1', phase: 'Running', reason: null, message: null,
            restart_count: 0, age: '5d', created_at: null, labels: { app: 'web' },
            containers: [{ name: 'web', image: 'nginx:1.27', ready: true, state: 'running',
                           restart_count: 0, reason: null, message: null, started_at: null }],
            owner_kind: 'ReplicaSet', owner_name: 'webapp-001-abc' },
          { name: 'cache-001', namespace: 'default', node: 'node-b',
            pod_ip: '10.0.0.2', phase: 'Running', reason: null, message: null,
            restart_count: 3, age: '12d', created_at: null, labels: { app: 'cache' },
            containers: [{ name: 'redis', image: 'redis:7', ready: true, state: 'running',
                           restart_count: 3, reason: null, message: null, started_at: null }],
            owner_kind: 'StatefulSet', owner_name: 'cache' },
        ],
      }),
    }),
  )

  // ── Dashboard stats ──────────────────────────────────────────────────────
  await page.route((url) => {
    const u = new URL(url)
    return u.pathname === '/api/v1/pods/stats'
  }, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        total_pods: 287, running: 258, pending: 17, failed: 0, succeeded: 12,
        warning_events: 25, nodes_total: 3, nodes_ready: 3, namespaces_count: 44,
        restart_top: [
          { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-5jdr6', restarts: 21302 },
          { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-fp78w', restarts: 21320 },
          { pod: 'monitoring/loki-write-0', restarts: 21320 },
        ],
      }),
    }),
  )

  // ── Pod detail (more specific than /pods) ──────────────────────────────────────────
  // Match any query string — the frontend always sends `?context=<cluster>`.
  await page.route(/\/api\/v1\/pods\/default\/webapp-001(\?|$)/, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        name: 'webapp-001', namespace: 'default', node: 'node-a',
        pod_ip: '10.0.0.1', phase: 'Running', reason: null, message: null,
        restart_count: 0, age: '5d', created_at: null, labels: { app: 'web' },
        containers: [{ name: 'web', image: 'nginx:1.27', ready: true, state: 'running',
                       restart_count: 0, reason: null, message: null, started_at: null }],
        owner_kind: 'ReplicaSet', owner_name: 'webapp-001-abc',
      }),
    }),
  )

  // ── Pod events (involved_name= filter) ──────────────────────────────────────
  await page.route(/\/api\/v1\/events(\?.*)?$/, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { name: 'e1', namespace: 'default', type: 'Warning', reason: 'BackOff',
          message: 'back-off restarting failed container', involved_kind: 'Pod',
          involved_name: 'cache-001', count: 4, first_seen: null,
          last_seen: '2024-01-01T00:00:05Z' },
      ]),
    }),
  )

  // ── Pod history logs ────────────────────────────────────────────────────
  // Match by URL pathname + accept any query string. Playwright regex anchors
  // are subtle; using a function filter is unambiguous.
  await page.route((url) => {
    const u = new URL(url)
    return u.pathname === '/api/v1/pods/default/webapp-001/logs'
  }, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        total: 6,
        items: [
          { timestamp: '2024-01-01T00:00:00Z', content: 'service ready',
            container: 'web', severity: 'info' },
          { timestamp: '2024-01-01T00:00:01Z', content: 'cache miss',
            container: 'web', severity: 'debug' },
          { timestamp: '2024-01-01T00:00:02Z', content: 'connection refused',
            container: 'web', severity: 'error' },
          { timestamp: '2024-01-01T00:00:03Z', content: 'retry failed',
            container: 'web', severity: 'error' },
          { timestamp: '2024-01-01T00:00:04Z', content: 'giving up',
            container: 'web', severity: 'error' },
          { timestamp: '2024-01-01T00:00:05Z', content: 'recovered',
            container: 'web', severity: 'info' },
        ],
      }),
    }),
  )

  // ── SSE stream: 200 + minimal keepalive so EventSource opens & ends cleanly ─
  await page.route(/\/api\/v1\/pods\/.*\/logs\/stream/, (route) =>
    route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      body: ': keepalive\n\n',
    }),
  )

  // ── Favorites ───────────────────────────────────────────────────────────
  await page.route(/\/api\/v1\/favorites(\?.*)?$/, (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 201, contentType: 'application/json',
        body: JSON.stringify({
          id: 1, resource_type: 'pod', name: 'webapp-001', namespace: 'default',
          cluster: 'demo-cluster', note: '', created_at: '2024-01-01T00:00:00Z',
        }),
      })
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })

  // ── AI providers ────────────────────────────────────────────────────────
  await page.route(/\/api\/v1\/ai\/providers(\?.*)?$/, (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 201, contentType: 'application/json',
        body: JSON.stringify({
          id: 1, name: 'OpenAI', provider: 'openai', model: 'gpt-4o-mini',
          api_base: null, temperature: 0.2, max_tokens: 1024,
          is_default: true, enabled: true, extra: {}, api_key_masked: 'sk-***',
        }),
      })
    }
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'OpenAI', provider: 'openai', model: 'gpt-4o-mini',
          api_base: null, temperature: 0.2, max_tokens: 1024,
          is_default: true, enabled: true, extra: {}, api_key_masked: 'sk-***' },
      ]),
    })
  })

  // ── AI analyze ──────────────────────────────────────────────────────────
  await page.route(/\/api\/v1\/ai\/analyze\/.*/, (route) =>
    route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        answer: '检测到 3 次连接重试后放弃，可能存在上游服务不可用。建议增加超时与健康检查。',
        model: 'gpt-4o-mini', latency_ms: 412,
        input_tokens: 312, output_tokens: 84,
      }),
    }),
  )
}

/** Convenience: assert the page navigated to a specific title in the header. */
export async function expectPageHeader(page: Page, text: string | RegExp) {
  await page.locator('.page-title, h1').first().waitFor({ state: 'visible' })
  await expect(page.locator('.page-title, h1').first()).toContainText(text)
}