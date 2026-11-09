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

vi.mock('@/stores/cluster', async () => {
  // reactive(): the view watches `cluster.activeCluster`, so a plain object
  // would never fire the watcher and the switch would never happen.
  const { reactive } = await import('vue')
  const reactiveObj = reactive({ activeCluster: 'demo-cluster', activeNamespace: 'default' })
  return { useClusterStore: () => reactiveObj, __cluster: reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  podsApi: { stats: vi.fn(async () => structuredClone(stats)) },
}))

import DashboardView from '../DashboardView.vue'
import { getI18n } from '@/i18n'
import { podsApi } from '@/api/endpoints'

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

  it('does not keep the previous cluster\'s numbers when the switch fails', async () => {
    // Switching to a cluster that cannot be read used to leave cluster A's
    // snapshot on screen under cluster B's name — and the error state never
    // fired, because `stats` was still set.
    const statsMock = (await import('@/api/endpoints')).podsApi.stats as unknown as ReturnType<typeof vi.fn>
    const { __cluster } = await import('@/stores/cluster') as unknown as {
      __cluster: { activeCluster: string; activeNamespace: string }
    }
    statsMock.mockResolvedValue(stats)
    const wrapper = mountDashboard()
    await flushPromises()
    expect(wrapper.text()).toContain('287')

    statsMock.mockRejectedValue({ response: { status: 500 } })
    __cluster.activeCluster = 'cluster-b'
    await flushPromises()

    expect(wrapper.text()).not.toContain('287')
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

  it('paints no phase segment in the colour of the bar\'s own track', async () => {
    // ponytail: 阶段条上「已成功」那一段之前用的是 --muted，而底槽就是
    // bg-muted —— 画出来和底槽一个颜色，等于没画，而 aria-label 里还报着
    // 「Succeeded 12」。
    const wrapper = mountDashboard()
    await flushPromises()
    const bar = wrapper.find('[role="img"]')
    const track = bar.classes().find((c) => c.startsWith('bg-'))
    const segments = bar.findAll('[style*="background"]').map((el) =>
      (el.attributes('style') ?? '').match(/background:\s*([^;]+)/)?.[1]?.trim(),
    )
    expect(segments.length).toBeGreaterThan(1)
    expect(segments).not.toContain('hsl(var(--muted))')
    expect(new Set(segments).size).toBe(segments.length)
    expect(track).toBe('bg-muted')
  })

  it('says how loud the alert is, not only how many there are', async () => {
    // "1 Warning event" answers "how many things are wrong". It does not
    // answer "how loud" — and the real cluster has one alert that has
    // repeated 49,002 times since September. Read alone, "1" sounds like
    // it is over.
    const statsMock = (await import('@/api/endpoints')).podsApi.stats as unknown as ReturnType<typeof vi.fn>
    statsMock.mockResolvedValue({
      ...stats,
      restart_top: [],
      warning_events: 1,
      recent_warns: [
        { name: 'w1', namespace: 'kube-system', type: 'Warning', reason: 'FailedToRetrieveImagePullSecret',
          message: 'x', involved_kind: 'Pod', involved_name: 'p1', count: 49002,
          first_seen: '2026-09-08T16:24:20Z', last_seen: '2026-10-21T11:50:02Z' },
      ],
    })
    const wrapper = mountDashboard()
    await flushPromises()
    const text = wrapper.text()
    expect(text).toContain('1 个 Warning 事件')
    expect(text).toContain('同一告警已重复 49,002 次')
  })
})

describe('DashboardView freshness', () => {
  it('refreshes itself every minute', async () => {
    // The dashboard used to only refresh when you pressed the button. A page
    // left open all shift kept saying "更新于 几秒前" while the numbers
    // underneath it aged — the one freshness signal in the product, and it
    // was frozen.
    vi.useFakeTimers({
      toFake: ['Date', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'setImmediate', 'clearImmediate'],
    })
    try {
      const wrapper = mountDashboard()
      await vi.advanceTimersByTimeAsync(0)
      expect(vi.mocked(podsApi.stats).mock.calls.length).toBe(1)

      await vi.advanceTimersByTimeAsync(60_000)
      await vi.advanceTimersByTimeAsync(0)
      expect(vi.mocked(podsApi.stats).mock.calls.length).toBe(2)

      // A second minute buys a third read.
      await vi.advanceTimersByTimeAsync(60_000)
      await vi.advanceTimersByTimeAsync(0)
      expect(vi.mocked(podsApi.stats).mock.calls.length).toBe(3)

      wrapper.unmount()
      // Unmounting stops the poll: a timer that outlives the page keeps
      // hitting the cluster for a view nobody is looking at.
      const callsBefore = vi.mocked(podsApi.stats).mock.calls.length
      await vi.advanceTimersByTimeAsync(120_000)
      expect(vi.mocked(podsApi.stats).mock.calls.length).toBe(callsBefore)
    } finally {
      vi.useRealTimers()
    }
  })
})
