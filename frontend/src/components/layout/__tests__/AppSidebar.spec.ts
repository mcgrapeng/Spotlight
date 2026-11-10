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
import { RouterLinkStub } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { eventsApi } from '@/api/endpoints'
import { getI18n } from '@/i18n'
import AppSidebar from '../AppSidebar.vue'

// Labels are translated now, so every mount needs the i18n plugin. The singleton
// outlives each test — rewind so `mountSidebar` is order-independent.
const i18n = getI18n()
function mountSidebar() {
  i18n.global.locale.value = 'zh-CN'
  // The router plugin is not installed here, so <router-link> would not
  // resolve — register the stub globally instead. Its `to` prop is what a
  // test reads to learn where a nav item points.
  return mount(AppSidebar, {
    global: {
      plugins: [i18n, createPinia()],
      components: { RouterLink: RouterLinkStub },
    },
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

describe('AppSidebar event badge', () => {
  it('counts distinct Warning entries (matches /events list row count), not sum of count field', async () => {
    // The badge counts warnings from the last 5 minutes — the same window
    // the dashboard's alert card uses, so the two never disagree. The
    // fixture therefore needs real timestamps; an event with no last_seen
    // cannot be placed in a window and does not count.
    const now = new Date().toISOString()
    vi.mocked(eventsApi.list).mockResolvedValue([
      { type: 'Warning', count: 50, name: 'e1', namespace: 'default', reason: 'BackOff',
        message: 'x', involved_kind: 'Pod', involved_name: 'p1',
        first_seen: null, last_seen: now },
      { type: 'Warning', count: 3, name: 'e2', namespace: 'default', reason: 'FailedMount',
        message: 'x', involved_kind: 'Pod', involved_name: 'p2',
        first_seen: null, last_seen: now },
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

  it('ignores warnings older than the 5-minute window', async () => {
    // A warning that stopped 20 minutes ago is history, not something to
    // look at now — and counting it would put the badge out of step with
    // the dashboard's "告警 N · 5min 内最近".
    const old = new Date(Date.now() - 20 * 60_000).toISOString()
    const now = new Date().toISOString()
    vi.mocked(eventsApi.list).mockResolvedValue([
      { type: 'Warning', count: 1, name: 'old', namespace: 'default', reason: 'BackOff',
        message: 'x', involved_kind: 'Pod', involved_name: 'p1',
        first_seen: null, last_seen: old },
      { type: 'Warning', count: 1, name: 'fresh', namespace: 'default', reason: 'BackOff',
        message: 'x', involved_kind: 'Pod', involved_name: 'p2',
        first_seen: null, last_seen: now },
    ] as any)

    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    await new Promise(r => setTimeout(r, 10))
    await nextTick()

    const badge = wrapper.find('[class*="bg-warning"]')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('1')
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

  it('sends the badge click straight to the warnings', async () => {
    // The badge says "2 warnings". Clicking it and landing on a list of
    // 500 scheduling notices is a broken promise — the filter travels in
    // the URL, so the page opens on what the badge was counting.
    const now = new Date().toISOString()
    vi.mocked(eventsApi.list).mockResolvedValue([
      { type: 'Warning', count: 49002, name: 'w1', namespace: 'default', reason: 'BackOff',
        message: 'x', involved_kind: 'Pod', involved_name: 'p1',
        first_seen: null, last_seen: now },
    ] as any)

    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    await new Promise(r => setTimeout(r, 10))
    await nextTick()

    const link = wrapper.findAllComponents(RouterLinkStub).find((l) => {
      const to = l.props('to') as { path?: string } | undefined
      return String(to?.path ?? '').includes('/events')
    })
    expect(link).toBeTruthy()
    expect(link!.props('to')).toEqual({ path: '/events', query: { type: 'Warning' } })
  })
})

describe('AppSidebar preferences', () => {
  it('keeps the theme and language switches in the expanded sidebar', async () => {
    vi.mocked(eventsApi.list).mockResolvedValue([])
    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    expect(wrapper.find('[role="group"][aria-label="主题"]').exists()).toBe(true)
    expect(wrapper.find('[role="group"][aria-label="Language / 语言"]').exists()).toBe(true)
  })

  it('drops them when the sidebar is collapsed', async () => {
    // The collapsed sidebar is 64px wide — a 48px content box — and the
    // theme toggle alone is 78px. It was clipped by the aside's
    // overflow-hidden, with the "follow system" button cut off and
    // unclickable. The row is not rendered at all in this state.
    vi.mocked(eventsApi.list).mockResolvedValue([])
    const wrapper = mount(AppSidebar, {
      props: { collapsed: true },
      global: {
        plugins: [i18n, createPinia()],
        components: { RouterLink: RouterLinkStub },
      },
    })
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    expect(wrapper.find('[role="group"][aria-label="主题"]').exists()).toBe(false)
    expect(wrapper.find('[role="group"][aria-label="Language / 语言"]').exists()).toBe(false)
  })
})

describe('AppSidebar AI entry', () => {
  it('exposes a visible "问 AI" button that opens the AI panel', async () => {
    // 这个面板之前只有 ⌘J 和 ⌘K 两个入口，两个都是键盘和弦：新用户
    // 看不到，手机上根本没有和弦键。产品最该被看见的能力，在手机上
    // 是结构性不可达的。
    vi.mocked(eventsApi.list).mockResolvedValue([])
    const wrapper = mountSidebar()
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())

    const btn = wrapper.find(`button[aria-label="${i18n.global.t('nav.askAi')}"]`)
    expect(btn.exists()).toBe(true)
    // It must carry a visible label, not just an icon.
    expect(btn.text()).toContain(i18n.global.t('nav.askAi'))

    const { useAiStore } = await import('@/stores/ai')
    const ai = useAiStore()
    expect(ai.open).toBe(false)
    await btn.trigger('click')
    expect(ai.open).toBe(true)
  })

  it('keeps the button reachable when the sidebar is collapsed', async () => {
    // 折叠态只有 48px 内容盒，文字标签放不下 —— 但按钮不能因此消失，
    // 只收成图标，靠 aria-label 保留名字。
    vi.mocked(eventsApi.list).mockResolvedValue([])
    const wrapper = mount(AppSidebar, {
      props: { collapsed: true },
      global: {
        plugins: [i18n, createPinia()],
        components: { RouterLink: RouterLinkStub },
      },
    })
    await vi.waitFor(() => expect(eventsApi.list).toHaveBeenCalled())
    const btn = wrapper.find(`button[aria-label="${i18n.global.t('nav.askAi')}"]`)
    expect(btn.exists()).toBe(true)
  })
})
