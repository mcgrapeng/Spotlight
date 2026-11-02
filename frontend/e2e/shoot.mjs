/**
 * Take the round-3 screenshots.
 *
 * Runs against the dev server with the same API mocks the e2e suite uses,
 * so the pages render the same fixture data the audit was written against
 * (287 pods, 258 running, 17 pending, 25 warnings, 21,320 restarts).
 *
 *   node e2e/shoot.mjs [outDir]
 */
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT = resolve(process.argv[2] ?? '.screenshots/round-3')
const BASE = process.env.SHOOT_BASE ?? 'http://127.0.0.1:7003'
mkdirSync(OUT, { recursive: true })

const STATS = {
  total_pods: 287, running: 258, pending: 17, failed: 0, succeeded: 12,
  warning_events: 25, nodes_total: 3, nodes_ready: 3, namespaces_count: 44,
  restart_top: [
    { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-5jdr6', restarts: 21302 },
    { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-fp78w', restarts: 21320 },
    { pod: 'monitoring/loki-write-0', restarts: 21320 },
  ],
  recent_warns: [
    { reason: 'BackOff', namespace: 'default', involved_kind: 'Pod', involved_name: 'cache-001',
      message: 'Back-off restarting failed container', last_seen: '2026-10-21T09:00:00Z', count: 4 },
  ],
}

const PODS = {
  total: 2,
  items: [
    { name: 'webapp-001', namespace: 'default', node: 'node-a', pod_ip: '10.0.0.1',
      phase: 'Running', reason: null, restart_count: 0, age: '5d',
      containers: [{ name: 'web', image: 'nginx:1.27', ready: true, state: 'running', reason: null }],
      owner_kind: 'ReplicaSet', owner_name: 'webapp-001-abc' },
    { name: 'cache-001', namespace: 'default', node: 'node-b', pod_ip: '10.0.0.2',
      phase: 'Running', reason: null, restart_count: 3, age: '12d',
      containers: [{ name: 'redis', image: 'redis:7', ready: true, state: 'running', reason: null }],
      owner_kind: 'StatefulSet', owner_name: 'cache' },
  ],
}

const EVENTS = [
  { name: 'ev1', namespace: 'default', type: 'Warning', reason: 'BackOff',
    involved_kind: 'Pod', involved_name: 'cache-001', count: 4,
    last_seen: '2026-10-21T09:00:00Z',
    message: 'Back-off restarting failed container in pod cache-001. The container redis failed to start because the image pull was rate limited, and the kubelet is backing off before the next attempt.' },
]

async function installMocks(page) {
  const json = (body) => ({
    status: 200, contentType: 'application/json', body: JSON.stringify(body),
  })
  await page.route('**/api/v1/auth/status', (r) => r.fulfill(json({
    configured: false,
    provider: { id: 'token', label: '访问令牌', fields: [{ name: 'token', label: '访问令牌', type: 'password', required: true }] },
    auth_required: false, client_session: true, session: { username: 'dev' },
  })))
  await page.route((u) => new URL(u).pathname === '/api/v1/clusters', (r) => r.fulfill(json([
    { name: 'demo-cluster', cluster: 'demo', user: 'admin', namespace: 'default', is_current: true },
  ])))
  await page.route((u) => new URL(u).pathname === '/api/v1/clusters/current', (r) => r.fulfill(json({ name: 'demo-cluster' })))
  await page.route((u) => new URL(u).pathname === '/api/v1/namespaces', (r) => r.fulfill(json([
    { name: 'default', status: 'Active', labels: {}, age: null },
    { name: 'kube-system', status: 'Active', labels: {}, age: null },
    { name: 'monitoring', status: 'Active', labels: {}, age: null },
  ])))
  await page.route((u) => new URL(u).pathname === '/api/v1/pods/stats', (r) => r.fulfill(json(STATS)))
  await page.route(/\/api\/v1\/pods(\?.*)?$/, (r) => r.fulfill(json(PODS)))
  await page.route((u) => new URL(u).pathname === '/api/v1/events', (r) => r.fulfill(json(EVENTS)))
  await page.route((u) => new URL(u).pathname === '/api/v1/nodes', (r) => r.fulfill(json([
    { name: 'node-a', status: 'Ready', roles: ['control-plane'], kubelet_version: 'v1.31.0',
      age: '12d', pod_count: 96, cpu_allocatable: '4', cpu_capacity: '8',
      memory_allocatable: '16Gi', memory_capacity: '32Gi' },
    { name: 'node-b', status: 'Ready', roles: [], kubelet_version: 'v1.31.0',
      age: '12d', pod_count: 118, cpu_allocatable: '4', cpu_capacity: '8',
      memory_allocatable: '16Gi', memory_capacity: '32Gi' },
  ])))
  await page.route((u) => new URL(u).pathname === '/api/v1/ai/providers', (r) => r.fulfill(json([])))
}

const PAGES = [
  { name: 'dashboard', url: '/dashboard' },
  { name: 'pods', url: '/pods' },
  { name: 'events', url: '/events' },
  { name: 'nodes', url: '/nodes' },
]

const browser = await chromium.launch()
for (const theme of ['light', 'dark']) {
  for (const p of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, colorScheme: theme })
    const page = await ctx.newPage()
    await installMocks(page)
    await page.addInitScript((t) => {
      localStorage.setItem('spotlight.theme-mode', t)
      localStorage.setItem('spotlight.locale', 'zh-CN')
    }, theme)
    await page.goto(BASE + p.url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(700)
    await page.screenshot({ path: `${OUT}/${theme}-${p.name}.png`, fullPage: false })
    await ctx.close()
  }
}
await browser.close()
console.log('shots in', OUT)
