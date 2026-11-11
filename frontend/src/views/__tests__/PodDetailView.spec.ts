import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

const routerMock = vi.hoisted(() => ({ replace: vi.fn(), push: vi.fn() }))

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/pods/cache-001', params: { name: 'cache-001', namespace: 'default' } }),
    useRouter: () => routerMock,
  }
})

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'demo-cluster', activeNamespace: 'default' }
  return { useClusterStore: () => reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  podsApi: {
    get: vi.fn(async () => ({
      name: 'cache-001', namespace: 'default', phase: 'Running', node: 'node-1',
      pod_ip: '10.0.0.1', age_seconds: 60, created_at: '2026-01-01T00:00:00Z',
      reason: null, message: null, labels: {}, restart_count: 2,
      owner_kind: 'ReplicaSet', owner_name: 'rs-1',
      containers: [{ name: 'app', image: 'img:1', ready: true, state: 'running', reason: null }],
      cluster: 'demo-cluster',
    })),
  },
  eventsApi: { list: vi.fn(async () => []) },
  aiApi: { listProviders: vi.fn(async () => []) },
  favoritesApi: {
    list: vi.fn(async () => []),
    add: vi.fn(async (payload: any) => ({ id: 7, ...payload })),
    remove: vi.fn(async () => undefined),
  },
}))

vi.mock('@/composables/usePodLogs', async () => {
  const { ref } = await import('vue')
  return {
    usePodLogs: () => ({
      lines: ref([]), streaming: ref(false), error: ref(null), unreadCount: ref(0),
      start: vi.fn(), close: vi.fn(), clear: vi.fn(),
    }),
  }
})

import PodDetailView from '../PodDetailView.vue'
import { createPinia } from 'pinia'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
})

describe('PodDetailView', () => {
  it('renders the pod it fetched', async () => {
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('cache-001')
    expect(wrapper.text()).toContain('返回 Pod 列表')
    expect(wrapper.text()).toContain('node-1')
  })

  it('labels the log section as a second-level heading', async () => {
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()
    // The pod name is the page's h1 (PageHeader). The section labels were
    // h3, so a screen reader's heading list skipped a level: h1 → h3.
    const levels = wrapper.findAll('h1, h2, h3, h4').map((h) => h.element.tagName)
    expect(levels).toEqual(['H1', 'H2'])
  })

  it('adds the pod to the favorites', async () => {
    const { favoritesApi } = await import('@/api/endpoints')
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()

    const star = wrapper.find('button[aria-label="收藏"]')
    expect(star.exists()).toBe(true)
    await star.trigger('click')
    await flushPromises()

    expect(favoritesApi.add).toHaveBeenCalledWith(expect.objectContaining({
      resource_type: 'pod', name: 'cache-001', namespace: 'default',
    }))
  })

  it('gives the pod name a two-line, monospace treatment so it cannot eat the log', async () => {
    // 390px 下 Pod 名折 5 行，日志只剩 3 行 —— 这个页面是 log-first 的，
    // 标题区必须让位。名字是字面量（读者要拿去敲 kubectl），按
    // DESIGN.md 用等宽；两行截断是兜底（超长名字不至于顶掉日志区）。
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.classes()).toContain('font-mono')
    expect(h1.classes()).toContain('line-clamp-2')
  })
})

describe('PodDetailView failure reporting', () => {
  /**
   * phase 会撒谎：CrashLoopBackOff 的 Pod，phase 仍然是 Running。
   * 详情页是读者被总览页指过来之后唯一能看的真相 —— 如果这里只显示
   * phase，他看到的是一片绿，然后关掉标签页去怪总览。
   */
  const CRASH_LOOPING = {
    name: 'cache-001', namespace: 'default', phase: 'Running', node: 'node-1',
    pod_ip: '10.0.0.1', age: '12d', reason: null, message: null, labels: {},
    restart_count: 3, owner_kind: 'StatefulSet', owner_name: 'cache',
    containers: [
      { name: 'redis', image: 'redis:7', ready: false, state: 'waiting', reason: 'CrashLoopBackOff' },
    ],
    cluster: 'demo-cluster',
  }

  async function mountWith(pod: Record<string, unknown>) {
    const { podsApi } = await import('@/api/endpoints')
    vi.mocked(podsApi.get).mockResolvedValue(pod as any)
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()
    return wrapper
  }

  it('names the broken container reason next to the phase', async () => {
    const wrapper = await mountWith(CRASH_LOOPING)
    // The phase chip still says Running — that is the truth about the
    // Pod. The error chip is the truth about the container.
    expect(wrapper.text()).toContain('CrashLoopBackOff')
  })

  it('does not claim a broken container is ready', async () => {
    const wrapper = await mountWith(CRASH_LOOPING)
    // The fact bar counted `c.ready`, which is a K8s snapshot that has
    // not flipped yet — it said 1/1 while the dot next to it was red.
    expect(wrapper.text()).not.toContain('1/1')
    expect(wrapper.text()).toContain('0/1')
  })

  it('announces the container state and reason to screen readers', async () => {
    const wrapper = await mountWith(CRASH_LOOPING)
    // The dots were aria-hidden, so the group announced only "容器 1/1" —
    // a crash-looping container read as a healthy one.
    const group = wrapper.find('[role="img"]')
    expect(group.exists()).toBe(true)
    expect(group.attributes('aria-label')).toContain('CrashLoopBackOff')
  })

  it('puts the failure verdict in the title bar, not the phase', async () => {
    // phase 会撒谎：一个 CrashLoopBackOff 的 Pod，phase 仍然是 Running。
    // 标题区的右上角是读者第一眼看到的东西，它不能是一片绿。
    //
    // 标签不带容器名：390px 上「redis · CrashLoopBackOff」是 165px，
    // 加上两个 40px 的按钮就把标题挤成 0 宽（实测过）。哪个容器坏了
    // 由事实条的容器组说。
    const wrapper = await mountWith(CRASH_LOOPING)
    const header = wrapper.find('header')
    expect(header.exists()).toBe(true)
    expect(header.text()).toContain('CrashLoopBackOff')
    // The phase pill is replaced, not joined by a green "Running".
    expect(header.text()).not.toContain('运行中')
    // No container name in the headline chip — that is what made it 165px.
    // 芯片是那枚 button 本身（ReasonChip 直接用 chipClasses 渲染它），
    // 所以找 button 而不是 span。
    const chip = header.findAll('button').find((b) => b.text() === 'CrashLoopBackOff')
    expect(chip).toBeTruthy()
    expect(chip!.text()).not.toContain('redis')
  })

  it('surfaces the pod-level reason separately from the container verdict', async () => {
    // Pod 自己的 reason（Evicted）和容器的原因（CrashLoopBackOff）是两件
    // 不同的事。两个都坏的时候两个都要说 —— 但它们各归其位：容器判定在
    // 标题区，Pod 级 reason 留在事实条。
    const wrapper = await mountWith({ ...CRASH_LOOPING, reason: 'Evicted' })
    expect(wrapper.text()).toContain('Evicted')
    expect(wrapper.text()).toContain('CrashLoopBackOff')
  })

  it('shows no error chip for a healthy pod', async () => {
    const wrapper = await mountWith({
      ...CRASH_LOOPING,
      containers: [{ name: 'redis', image: 'redis:7', ready: true, state: 'running', reason: null }],
    })
    expect(wrapper.text()).not.toContain('CrashLoopBackOff')
    expect(wrapper.text()).toContain('1/1')
  })
})

describe('PodDetailView — 已删掉的 Pod', () => {
  // 书签里的 Pod 被重建了（ReplicaSet 滚动会换哈希后缀）—— 404 不是
  // 「加载失败」，是「它没了」。重试复活不了它，但人得有个去处。
  async function mountWith404() {
    const { podsApi } = await import('@/api/endpoints')
    ;(podsApi.get as any).mockRejectedValue({
      response: { status: 404, data: { detail: 'Pod 或容器不存在（可能已经被删除）' } },
    })
    const wrapper = mount(PodDetailView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n, createPinia()] },
    })
    await flushPromises()
    return wrapper
  }

  it('不给「重试」—— 重试复活不了被删掉的 Pod', async () => {
    const wrapper = await mountWith404()
    expect(wrapper.text()).toContain('Pod 不存在或已被删除')
    const retry = wrapper.findAll('button').find((b) => b.text().includes('重试'))
    expect(retry, '给了一个永远不会成功的按钮').toBeFalsy()
  })

  it('给出路：回到列表，或按名字前缀去找重建后的那个', async () => {
    const wrapper = await mountWith404()
    const back = wrapper.findAll('button').find((b) => b.text().includes('返回 Pod 列表'))
    expect(back, '没有回到列表的出口').toBeTruthy()
    const search = wrapper.findAll('button').find((b) => b.text().includes('按名字找'))
    expect(search, '没有按名字找的出口').toBeTruthy()
    await search!.trigger('click')
    expect(routerMock.push).toHaveBeenCalledWith(
      expect.objectContaining({ query: expect.objectContaining({ search: 'cache-001' }) }),
    )
  })
})
