import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('@/api/endpoints', () => ({
  eventsApi: { list: vi.fn() },
}))
// ponytail: Pinia 解包 activeCluster 为原始值，mock 必须返回 reactive proxy 而不是 ref
vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'c1', activeNamespace: '_all' }
  return { useClusterStore: () => reactiveObj }
})
vi.mock('vue-router', () => ({
  useRoute: () => ({ path: '/dashboard' }),
}))

import { mount } from '@vue/test-utils'
import { eventsApi } from '@/api/endpoints'
import { getI18n } from '@/i18n'
import AppSidebar from '../AppSidebar.vue'

// Labels are translated now, so every mount needs the i18n plugin. The singleton
// outlives each test — rewind so `mountSidebar` is order-independent.
const i18n = getI18n()
function mountSidebar() {
  i18n.global.locale.value = 'zh-CN'
  return mount(AppSidebar, { global: { plugins: [i18n] } })
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('AppSidebar event badge', () => {
  it('counts distinct Warning entries (matches /events list row count), not sum of count field', async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([
      { type: 'Warning', count: 50, name: 'e1', namespace: 'default', reason: 'BackOff',
        message: 'x', involved_kind: 'Pod', involved_name: 'p1',
        first_seen: null, last_seen: null },
      { type: 'Warning', count: 3, name: 'e2', namespace: 'default', reason: 'FailedMount',
        message: 'x', involved_kind: 'Pod', involved_name: 'p2',
        first_seen: null, last_seen: null },
      { type: 'Normal', count: 1, name: 'e3', namespace: 'default', reason: 'Started',
        message: 'x', involved_kind: 'Pod', involved_name: 'p3',
        first_seen: null, last_seen: null },
    ] as any)

    const wrapper = mountSidebar()
    await vi.waitFor(() => {
      expect(eventsApi.list).toHaveBeenCalled()
    })
    await new Promise(r => setTimeout(r, 10))
    await nextTick()

    const badge = wrapper.find('[class*="bg-warning"]')
    expect(badge.exists()).toBe(true)
    // Badge = 2 Warning entries (NOT 53 = sum of count fields).
    // Per-row ×N 次 separately conveys repetition severity.
    expect(badge.text()).toBe('2')
  })

  it('shows 0 when there are no Warning events', async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([
      { type: 'Normal', count: 1, name: 'e1', namespace: 'default', reason: 'Started',
        message: 'x', involved_kind: 'Pod', involved_name: 'p1',
        first_seen: null, last_seen: null },
    ] as any)

    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    await new Promise(r => setTimeout(r, 10))

    const badge = wrapper.find('[class*="bg-warning"]')
    expect(badge.exists()).toBe(false)
  })

  it('queries events for the active cluster with the all-namespaces scope', async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([])
    mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    const call = vi.mocked(eventsApi.list).mock.calls[0][0]
    expect(call.cluster).toBe('c1')
    expect(call.namespace).toBe('_all')
  })

  it('emits toggle-sidebar when the collapse button is clicked', async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([])
    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    // Read the label out of the messages rather than hard-coding it, so this
    // keeps asserting the wiring instead of pinning one locale's wording.
    const btn = wrapper.find(
      `button[aria-label="${i18n.global.t('nav.collapseSidebar')}"]`,
    )
    expect(btn.exists()).toBe(true)
    await btn.trigger('click')
    expect(wrapper.emitted('toggle-sidebar')).toHaveLength(1)
  })
})