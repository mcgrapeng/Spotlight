import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

// The route's query is what decides the filter, and the reader's choice is
// written back into it — so it has to be a mutable object behind the mock.
const routeState: { query: Record<string, string>; path: string } = { query: {}, path: '/events' }
const routerReplace = vi.fn()

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => routeState,
    useRouter: () => ({ replace: routerReplace, push: vi.fn() }),
  }
})

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'demo-cluster', activeNamespace: '_all' }
  return { useClusterStore: () => reactiveObj }
})

const events = [
  { name: 'w1', namespace: 'default', type: 'Warning', reason: 'BackOff',
    involved_kind: 'Pod', involved_name: 'cache-001', count: 49002,
    last_seen: '2026-10-21T09:00:00Z', message: 'the image pull failed' },
  { name: 'n1', namespace: 'default', type: 'Normal', reason: 'Started',
    involved_kind: 'Pod', involved_name: 'web-001', count: 1,
    last_seen: '2026-10-21T09:00:00Z', message: 'started' },
  { name: 'n2', namespace: 'default', type: 'Normal', reason: 'Completed',
    involved_kind: 'Job', involved_name: 'job-001', count: 1,
    last_seen: '2026-10-21T09:00:00Z', message: 'completed' },
]

vi.mock('@/api/endpoints', () => ({
  eventsApi: { list: vi.fn(async () => events) },
}))

import EventsView from '../EventsView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  vi.clearAllMocks()
  i18n.global.locale.value = 'zh-CN'
  routeState.query = {}
})

function mountEvents() {
  return mount(EventsView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
}

function selectedTab(wrapper: ReturnType<typeof mountEvents>): string {
  const btn = wrapper.findAll('[role="tab"]').find((b) => b.attributes('aria-selected') === 'true')
  return btn?.text() ?? ''
}

describe('EventsView default filter', () => {
  it('lands on the warnings when the cluster has some', async () => {
    // The real cluster: 500 events, 498 Normal, 2 Warning. Defaulting to
    // "all" buried the two warnings under hundreds of scheduling notices —
    // and the reason to open the Events page is to see whether something is
    // broken.
    const wrapper = mountEvents()
    await flushPromises()
    expect(selectedTab(wrapper)).toContain('Warning')
    // Only the warning row is listed; the two Normal ones are behind the tab.
    expect(wrapper.text()).toContain('the image pull failed')
    expect(wrapper.text()).not.toContain('job-001')
  })

  it('shows everything when there is nothing to warn about', async () => {
    const api = await import('@/api/endpoints')
    vi.mocked(api.eventsApi.list).mockResolvedValue(events.filter(e => e.type === 'Normal') as any)
    const wrapper = mountEvents()
    await flushPromises()
    expect(selectedTab(wrapper)).toContain('全部')
    expect(wrapper.text()).toContain('job-001')
  })

  it('obeys ?type=all — the reader\'s own choice survives', async () => {
    routeState.query = { type: 'all' }
    const wrapper = mountEvents()
    await flushPromises()
    expect(selectedTab(wrapper)).toContain('全部')
    expect(wrapper.text()).toContain('job-001')
  })

  it('obeys ?type=Warning — the sidebar badge links straight here', async () => {
    routeState.query = { type: 'Warning' }
    const wrapper = mountEvents()
    await flushPromises()
    expect(selectedTab(wrapper)).toContain('Warning')
    expect(wrapper.text()).not.toContain('job-001')
  })

  it('writes the choice into the URL, so "all" is not stolen back', async () => {
    const wrapper = mountEvents()
    await flushPromises()
    const allTab = wrapper.findAll('[role="tab"]').find((b) => b.text().includes('全部'))
    expect(allTab).toBeTruthy()
    await allTab!.trigger('click')
    await flushPromises()
    expect(routerReplace).toHaveBeenCalled()
    const arg = routerReplace.mock.calls[0][0] as { query: Record<string, string> }
    expect(arg.query.type).toBe('all')
  })
})
