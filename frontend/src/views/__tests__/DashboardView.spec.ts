import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

const stats = {
  total_pods: 287,
  running: 258,
  pending: 17,
  failed: 0,
  succeeded: 12,
  nodes_ready: 3,
  nodes_total: 3,
  warning_events: 25,
  restart_top: [
    { pod: 'default/tempo-distributed-query-658f6bc', restarts: 21320 },
    { pod: 'default/tempo-distributed-query-658f6bd', restarts: 21320 },
    { pod: 'default/loki-write-0', restarts: 21320 },
  ],
  recent_warns: [],
}

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'demo-cluster', activeNamespace: 'default' }
  return { useClusterStore: () => reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  podsApi: { stats: vi.fn(async () => structuredClone(stats)) },
}))

import DashboardView from '../DashboardView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  vi.clearAllMocks()
  i18n.global.locale.value = 'zh-CN'
  // useCachedFetch hydrates from localStorage before it hits the network, and
  // the cache outlives a single test — without clearing it the second test
  // would render the first test's stats.
  try { localStorage.clear() } catch { /* no storage in this env */ }
})

function mountDashboard() {
  return mount(DashboardView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
}

describe('DashboardView hero', () => {
  it('puts the number in the 48px slot, not a phrase', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    // 21,320 是这一屏最刺眼的数字，之前它躺在右下角 16px 的表里。
    expect(wrapper.text()).toContain('21,320')
    expect(wrapper.text()).toContain('次重启')
  })

  it('does not repeat the hero item in the action list', async () => {
    const wrapper = mountDashboard()
    await flushPromises()
    const text = wrapper.text()
    // 「3 个 Pod 频繁重启」只出现一次：以前主位和行动卡第一行讲的是同一句
    // 话，中间隔 60px，看的人会当成渲染 bug。
    const occurrences = text.split('3 个 Pod 频繁重启').length - 1
    expect(occurrences).toBe(1)
    // 剩下的那项（25 个 Warning 事件）出现在下面的卡里。
    expect(text).toContain('25 个 Warning 事件')
  })

  it('hides the action card when the hero covers everything', async () => {
    const statsMock = (await import('@/api/endpoints')).podsApi.stats as unknown as ReturnType<typeof vi.fn>
    statsMock.mockResolvedValue({ ...stats, restart_top: [], warning_events: 0 })
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).not.toContain('需要处理')
  })

  it('shows a quiet all-clear when there is nothing to handle', async () => {
    const statsMock = (await import('@/api/endpoints')).podsApi.stats as unknown as ReturnType<typeof vi.fn>
    statsMock.mockResolvedValue({ ...stats, restart_top: [], warning_events: 0 })
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('一切正常')
  })
})
