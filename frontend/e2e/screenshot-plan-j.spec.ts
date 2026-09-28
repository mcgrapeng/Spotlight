import { test } from '@playwright/test'

test('screenshot plan-j log viz', async ({ page }) => {
  const NOW = Date.now()
  const isoOffset = (sec: number) => new Date(NOW - sec * 1000).toISOString()
  const TRACE_A = '4bf92f3577b34da6a3ce929d0e0e4736'
  const TRACE_B = '7c9f2d8a1b6e4c3a8f5d2e1b9c7a4f8e'

  await page.route('**/api/v1/auth/me**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ authenticated: true, user: { name: 'demo' } }) }),
  )
  await page.route('**/api/v1/contexts**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ name: 'demo-cluster', current: true }]) }),
  )
  await page.route('**/api/v1/pods**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([
      { name: 'webapp-001', namespace: 'default', node: 'node-a', pod_ip: '10.0.0.1',
        phase: 'Running', reason: null, message: null, restart_count: 0, age: '5d',
        created_at: null, containers: [{ name: 'web', image: 'nginx:1.27', ready: true,
        state: 'running', restart_count: 0, reason: null, message: null, started_at: null }],
        owner_kind: 'ReplicaSet', owner_name: 'webapp-001-abc' },
    ]) }),
  )
  await page.route(/\/api\/v1\/pods\/default\/webapp-001(\?|$)/, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      name: 'webapp-001', namespace: 'default', node: 'node-a', pod_ip: '10.0.0.1',
      phase: 'Running', reason: null, message: null, restart_count: 0, age: '5d',
      created_at: null, labels: { app: 'web' },
      containers: [{ name: 'web', image: 'nginx:1.27', ready: true, state: 'running',
                     restart_count: 0, reason: null, message: null, started_at: null }],
      owner_kind: 'ReplicaSet', owner_name: 'webapp-001-abc',
    }) }),
  )
  await page.route((url) => new URL(url).pathname === '/api/v1/pods/default/webapp-001/logs', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({
      total: 14,
      items: [
        { timestamp: isoOffset(7200), content: `service ready`,                                   container: 'web', severity: 'info' },
        { timestamp: isoOffset(5400), content: `coredns lookup: i/o timeout`,                      container: 'web', severity: 'error' },
        { timestamp: isoOffset(3600), content: `listening on :8080`,                              container: 'web', severity: 'info' },
        { timestamp: isoOffset(2400), content: `pod restarted in 1.2s`,                           container: 'web', severity: 'info' },
        { timestamp: isoOffset(1800), content: `OOM killed, restarting`,                          container: 'web', severity: 'critical' },
        { timestamp: isoOffset(1200), content: `circuit breaker reset`,                           container: 'web', severity: 'info' },
        { timestamp: isoOffset(700),  content: `circuit breaker tripped trace_id=${TRACE_B}`,      container: 'web', severity: 'error' },
        { timestamp: isoOffset(300),  content: `healthcheck ok`,                                  container: 'web', severity: 'debug' },
        { timestamp: isoOffset(150),  content: `cache evicted 412 keys`,                          container: 'web', severity: 'info' },
        { timestamp: isoOffset(90),   content: `connection refused trace_id=${TRACE_B}`,          container: 'web', severity: 'error' },
        { timestamp: isoOffset(60),   content: `request handled in 19ms trace_id=${TRACE_A}`,     container: 'web', severity: 'info' },
        { timestamp: isoOffset(45),   content: `retry attempt 1 trace_id=${TRACE_A}`,            container: 'web', severity: 'warn' },
        { timestamp: isoOffset(20),   content: `upstream timeout trace_id=${TRACE_A}`,         container: 'web', severity: 'warn' },
        { timestamp: isoOffset(2),    content: `request handled in 23ms trace_id=${TRACE_A}`, container: 'web', severity: 'info' },
      ],
    }) }),
  )
  await page.route(/\/api\/v1\/pods\/.*\/logs\/stream/, (route) =>
    route.fulfill({ status: 200, headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }, body: ': keepalive\n\n' }),
  )
  await page.route('**/api/v1/events**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/api/v1/nodes**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/api/v1/favorites**', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/pods/default/webapp-001', { waitUntil: 'networkidle', timeout: 15_000 })
  await page.waitForTimeout(500)

  await page.screenshot({
    path: '../.screenshots/plan-j-log-viz.jpeg',
    fullPage: false,
    type: 'jpeg',
    quality: 90,
  })
})