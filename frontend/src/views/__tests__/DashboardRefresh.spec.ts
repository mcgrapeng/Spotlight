import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import DashboardView from '../DashboardView.vue'
import { getI18n } from '@/i18n'
import { podsApi } from '@/api/endpoints'
import { useKeyboardShortcuts, keyboardRegionClaimed } from '@/composables/useKeyboardShortcuts'
import { useLogKeyboardShortcuts } from '@/composables/useLogKeyboardShortcuts'

const stats = {
  total_pods: 287,
  running: 258,
  pending: 17,
  failed: 0,
  succeeded: 12,
  nodes_ready: 3,
  nodes_total: 3,
  warning_events: 25,
  restart_top: [{ pod: 'default/a', restarts: 21320 }],
  recent_warns: [],
}

const clusterState: any = { activeCluster: 'demo-cluster', activeNamespace: '_all' }

vi.mock('@/stores/cluster', () => ({ useClusterStore: () => clusterState }))

vi.mock('@/api/endpoints', () => ({
  podsApi: { stats: vi.fn(async () => structuredClone(stats)) },
}))

const i18n = getI18n()

beforeEach(() => {
  vi.clearAllMocks()
  i18n.global.locale.value = 'zh-CN'
  try { localStorage.clear() } catch { /* no storage */ }
})

function mountDashboard() {
  return mount(DashboardView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
}

describe('DashboardView 后台刷新', () => {
  it('一次失败的后台轮询不会把仪表盘换成错误页', async () => {
    vi.useFakeTimers()
    const mock = podsApi.stats as unknown as ReturnType<typeof vi.fn>
    mock.mockResolvedValue(structuredClone(stats))
    const wrapper = mountDashboard()
    await vi.advanceTimersByTimeAsync(0)
    await flushPromises()
    expect(wrapper.text()).toContain('287')

    // 下一轮轮询失败（apiserver 抖一下）。
    mock.mockRejectedValue(new Error('Network Error'))
    await vi.advanceTimersByTimeAsync(60_000)
    await flushPromises()

    // 快照留在屏幕上。
    expect(wrapper.text()).toContain('287')
    expect(wrapper.text()).not.toContain('加载失败')
    // 刷新失败是一行小字。
    expect(wrapper.text()).toContain('刷新失败')
    vi.useRealTimers()
  })

  it('快照按命名空间取，缓存键也带命名空间', async () => {
    const mock = podsApi.stats as unknown as ReturnType<typeof vi.fn>
    mock.mockResolvedValue(structuredClone(stats))
    mountDashboard()
    await flushPromises()
    expect(mock).toHaveBeenCalledWith('demo-cluster', '_all')
  })
})

describe('全局快捷键 vs 日志面板快捷键', () => {
  it('日志区激活时，全局 g 前缀不劫持下一个键', async () => {
    const navigated: string[] = []
    const jumped: number[] = []
    const paused: number[] = []

    const Harness = defineComponent({
      setup() {
        useKeyboardShortcuts(() => [
          { combo: 'mod+j', handler: () => {} },
          { combo: 'g d', handler: () => navigated.push('g d') },
          { combo: 'g p', handler: () => navigated.push('g p') },
          { combo: 'g n', handler: () => navigated.push('g n') },
          { combo: 'g e', handler: () => navigated.push('g e') },
          { combo: 'g f', handler: () => navigated.push('g f') },
        ])
        const active = ref(true)
        useLogKeyboardShortcuts(
          {
            jumpError: (dir: 1 | -1) => jumped.push(dir),
            togglePause: () => paused.push(1),
            toggleHelp: () => {},
            focusSearch: () => {},
            clear: () => {},
          },
          { active },
        )
        return () => h('div', 'log area')
      },
    })

    const wrapper = mount(Harness)
    await flushPromises()
    const key = (k: string) =>
      document.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))

    key('g')   // 跳到下一条 error
    key('p')   // 想暂停流
    await flushPromises()

    expect(navigated).toEqual([])
    expect(jumped).toEqual([1])
    expect(paused).toEqual([1])
    wrapper.unmount()
  })

  it('日志区没激活时，g 前缀照常导航', async () => {
    const navigated: string[] = []
    const Harness = defineComponent({
      setup() {
        useKeyboardShortcuts(() => [
          { combo: 'g p', handler: () => navigated.push('g p') },
        ])
        const active = ref(false)
        useLogKeyboardShortcuts({}, { active })
        return () => h('div', 'not the log area')
      },
    })
    const wrapper = mount(Harness)
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    await flushPromises()
    expect(navigated).toEqual(['g p'])
    wrapper.unmount()
  })

  it('前缀之后按了一个不匹配的键，那个键不会被吞掉', async () => {
    const single: string[] = []
    const Harness = defineComponent({
      setup() {
        useKeyboardShortcuts(() => [
          { combo: 'g d', handler: () => {} },
          { combo: 'x', handler: () => single.push('x') },
        ])
        return () => h('div')
      },
    })
    const wrapper = mount(Harness)
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    await flushPromises()
    expect(single).toEqual(['x'])
    wrapper.unmount()
  })

  it('日志区中途接管键盘时，已经武装的前缀不会把人导航走', async () => {
    const navigated: string[] = []
    const Harness = defineComponent({
      setup() {
        useKeyboardShortcuts(() => [
          { combo: 'g p', handler: () => navigated.push('g p') },
        ])
        const active = ref(false)
        useLogKeyboardShortcuts({}, { active })
        return () => h('div')
      },
    })
    const wrapper = mount(Harness)
    await flushPromises()
    // The prefix is armed outside the log area…
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }))
    // …then the pointer moves into the log viewer before the second key.
    keyboardRegionClaimed.value = true
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }))
    await flushPromises()
    expect(navigated).toEqual([])
    keyboardRegionClaimed.value = false
    wrapper.unmount()
  })
})
