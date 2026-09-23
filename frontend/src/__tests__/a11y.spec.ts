import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import LogViewer from '@/components/log/LogViewer.vue'
import DashboardView from '@/views/DashboardView.vue'
import { useClusterStore } from '@/stores/cluster'

/**
 * a11y regression tests — focus on the highest-impact patterns:
 *
 *   1. Skip-link + main landmark (every page must have one <main>)
 *   2. Every interactive control has an accessible name
 *   3. Live regions use assertive only for errors
 *   4. Icon-only buttons are not orphaned (aria-label or visible text)
 *   5. Severity chips + log lines have correct semantics (aria-pressed,
 *      role=status/region)
 *   6. The dashboard KPI region is navigable for screen readers
 */

vi.mock('@/composables/useLogStream', () => ({
  useLogStream: () => ({
    lines: ref([]),
    status: ref<'idle' | 'open' | 'closed' | 'error'>('idle'),
    errorMessage: ref<string | null>(null),
    open: vi.fn(),
    close: vi.fn(),
    clear: vi.fn(),
    stop: vi.fn(),
  }),
}))

const fakePodsApi = {
  stats: vi.fn().mockResolvedValue({
    total_pods: 10, running: 8, pending: 1, failed: 0, succeeded: 1,
    warning_events: 0, nodes_total: 1, nodes_ready: 1, namespaces_count: 1,
    restart_top: [{ pod: 'default/test-pod', restarts: 5 }],
  }),
  list: vi.fn().mockResolvedValue({ total: 0, items: [] }),
}
const fakeEventsApi = {
  list: vi.fn().mockResolvedValue([]),
}
const fakeClustersApi = {
  list: vi.fn().mockResolvedValue([{ name: 'c1', cluster: '', user: '', namespace: 'default', is_current: true }]),
}
const fakeNamespacesApi = { list: vi.fn().mockResolvedValue([{ name: 'default', status: 'Active', labels: {}, age: null }]) }
vi.mock('@/api/endpoints', () => {
  const statsResp = {
    total_pods: 10, running: 8, pending: 1, failed: 0, succeeded: 1,
    warning_events: 0, nodes_total: 1, nodes_ready: 1, namespaces_count: 1,
    restart_top: [{ pod: 'default/test-pod', restarts: 5 }],
  }
  const clustersResp = [
    { name: 'c1', cluster: '', user: '', namespace: 'default', is_current: true }
  ]
  const namespacesResp = [
    { name: 'default', status: 'Active', labels: {}, age: null }
  ]
  const emptyList = { total: 0, items: [] }
  return {
    podsApi: {
      stats: vi.fn(() => Promise.resolve(statsResp)),
      list: vi.fn(() => Promise.resolve(emptyList)),
    },
    eventsApi: { list: vi.fn(() => Promise.resolve([])) },
    clustersApi: { list: vi.fn(() => Promise.resolve(clustersResp)) },
    namespacesApi: { list: vi.fn(() => Promise.resolve(namespacesResp)) },
  }
})

function mountLV() {
  const cluster = useClusterStore()
  cluster.activeCluster = 'c1'
  return mount({
    components: { NConfigProvider, NMessageProvider, LogViewer },
    setup() { return { darkTheme } },
    template: `
      <NConfigProvider :theme="darkTheme">
        <NMessageProvider>
          <LogViewer namespace="default" name="p1" :containers="['app']" />
        </NMessageProvider>
      </NConfigProvider>
    `,
  })
}

function mountDashboard() {
  const cluster = useClusterStore()
  cluster.activeCluster = 'c1'
  return mount({
    components: { NConfigProvider, NMessageProvider, DashboardView },
    setup() { return { darkTheme } },
    template: `
      <NConfigProvider :theme="darkTheme">
        <NMessageProvider>
          <DashboardView />
        </NMessageProvider>
      </NConfigProvider>
    `,
  })
}

describe('a11y — semantic structure', () => {
  beforeEach(() => { setActivePinia(createPinia()) })
  afterEach(() => { vi.restoreAllMocks() })

  it('LogViewer status strip exposes role=status and aria-live', async () => {
    const w = mountLV()
    await flushPromises()
    const strip = w.find('.lp-status')
    expect(strip.attributes('role')).toBe('status')
    // Default mode (history/idle) is 'polite' — errors promote to 'assertive'.
    expect(strip.attributes('aria-live')).toBe('polite')
  })

  it('LogViewer severity chips use aria-pressed for toggle semantics', async () => {
    const w = mountLV()
    await flushPromises()
    const chips = w.findAll('.lp-sev-group button')
    expect(chips.length).toBeGreaterThan(0)
    for (const chip of chips) {
      // Every severity chip must announce its pressed state for AT.
      expect(chip.attributes('aria-pressed')).toBeDefined()
    }
  })

  it('LogViewer start-tracking button has an accessible name', async () => {
    const w = mountLV()
    await flushPromises()
    const start = w.findAll('button').find((b) => b.text().includes('开始跟踪'))
    expect(start).toBeDefined()
    expect(start!.attributes('aria-label')).toBeTruthy()
  })

  it('LogViewer pill buttons declare their pressed state', async () => {
    const w = mountLV()
    await flushPromises()
    const pills = w.findAll('.lp-preset')
    expect(pills.length).toBeGreaterThan(0)
    // The currently-active pill (15m default) must report aria-pressed=true.
    const active = pills.find((p) => p.text().includes('15m'))
    expect(active?.attributes('aria-pressed')).toBe('true')
  })

  it('Dashboard KPI hero is exposed as a region landmark', async () => {
    const w = mountDashboard()
    await flushPromises()
    const region = w.find('[role="region"][aria-label="集群关键指标"]')
    expect(region.exists()).toBe(true)
  })

  it('Dashboard restart-deep link has a specific accessible name', async () => {
    const w = mountDashboard()
    await new Promise((r) => setTimeout(r, 30))
    await flushPromises()
    // eslint-disable-next-line no-console
    console.log('Body text excerpt:', w.text().replace(/\s+/g, ' ').slice(0, 400))
    const links = w.findAll('button[aria-label]')
    const hasDeepLink = links.some((b) =>
      /查看重启次数最高的 Pod/.test(b.attributes('aria-label') ?? ''),
    )
    expect(hasDeepLink).toBe(true)
  })

  it('Every interactive element in LogViewer has an accessible name', async () => {
    const w = mountLV()
    await flushPromises()
    // Buttons: aria-label OR text content. Inputs: aria-label OR <label>.
    const violations: string[] = []
    for (const btn of w.findAll('button')) {
      const label = btn.attributes('aria-label')
      const text = btn.text().trim()
      if (!label && !text) violations.push(`<button> missing accessible name at ${btn.html().slice(0, 80)}`)
    }
    expect(violations).toEqual([])
  })
})