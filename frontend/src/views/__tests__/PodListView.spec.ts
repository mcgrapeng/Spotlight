import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

// 深链（?status=）驱动的测试要能换 query —— 用一个共享的路由状态。
const routeState = vi.hoisted(() => ({ query: {} as Record<string, string>, path: '/pods' }))

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => routeState,
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  }
})

vi.mock('@/stores/cluster', async () => {
  const { reactive } = await import('vue')
  const reactiveObj = reactive({ activeCluster: 'demo-cluster', activeNamespace: '_all' })
  return { useClusterStore: () => reactiveObj, __cluster: reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  podsApi: { list: vi.fn(async () => ({ total: 0, items: [] })) },
  favoritesApi: { list: vi.fn(async () => []) },
}))

import PodListView from '../PodListView.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
  localStorage.clear()
  routeState.query = {}
})

/**
 * 没权限读 Pod 列表，是一种状态，不是「这里是空的」。
 *
 * 「0 个 Pod」是关于集群的**假事实**：值班的人会以为集群是空的，转头
 * 去做别的检查。所以副标题也不能写「0 个」，也不能配「重试」按钮
 * （重试不会授予权限）。
 */
async function mountWithDeniedPods() {
  const { podsApi } = await import('@/api/endpoints')
  ;(podsApi.list as any).mockRejectedValue({
    response: {
      status: 403,
      data: { detail: { code: 'forbidden', permission: 'pods.read', message: '没有权限：pods.read' } },
    },
  })
  const wrapper = mount(PodListView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
  await flushPromises()
  return wrapper
}

describe('PodListView — 权限不足', () => {
  it('says it is a permission problem', async () => {
    const wrapper = await mountWithDeniedPods()
    expect(wrapper.text()).toContain('没有权限查看 Pod 列表')
    expect(wrapper.text()).toContain('pods.read')
  })

  it('does not claim the cluster has zero pods', async () => {
    const wrapper = await mountWithDeniedPods()
    // 副标题也不能说「0 个」——那还是关于集群的假事实。
    expect(wrapper.text()).not.toContain('0 个')
    expect(wrapper.text()).toContain('Pod 列表不可读')
  })

  it('offers no retry button — retrying does not grant permission', async () => {
    const wrapper = await mountWithDeniedPods()
    const retry = wrapper.findAll('button').find((b) => b.text().includes('重试'))
    expect(retry).toBeFalsy()
  })

  it('does not print the raw permission payload', async () => {
    // 后端的 detail 在权限拒绝时是一个对象 —— 直接塞进界面会渲染出 JSON。
    const wrapper = await mountWithDeniedPods()
    expect(wrapper.text()).not.toContain('forbidden')
    expect(wrapper.text()).not.toContain('[object Object]')
  })

  it('still shows the generic error state for other failures', async () => {
    const { podsApi } = await import('@/api/endpoints')
    ;(podsApi.list as any).mockRejectedValue({
      response: { status: 500, data: { detail: '查询 Pod：K8s API 请求失败' } },
    })
    const wrapper = mount(PodListView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('查询 Pod：K8s API 请求失败')
    const retry = wrapper.findAll('button').find((b) => b.text().includes('重试'))
    expect(retry).toBeTruthy()
  })
})

describe('PodListView — 只看待处理', () => {
  const PODS = [
    { name: 'healthy', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.1', phase: 'Running', reason: null, message: null, restart_count: 0, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: true, state: 'running', reason: null, restart_count: 0 }] },
    { name: 'not-ready', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.2', phase: 'Running', reason: 'ContainersNotReady', message: null, restart_count: 0, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: false, state: 'running', reason: null, restart_count: 0 }] },
    { name: 'broken', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.3', phase: 'Running', reason: null, message: null, restart_count: 5, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: false, state: 'waiting', reason: 'CrashLoopBackOff', restart_count: 5 }] },
  ]

  async function mountWith() {
    const { podsApi } = await import('@/api/endpoints')
    ;(podsApi.list as any).mockResolvedValue({ total: 3, items: PODS })
    const w = mount(PodListView, { global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] } })
    await flushPromises()
    return w
  }

  it('shows every pod by default', async () => {
    const w = await mountWith()
    expect(w.text()).toContain('healthy')
    expect(w.text()).toContain('not-ready')
    expect(w.text()).toContain('broken')
  })

  it('keeps only the pods that need a look when the toggle is on', async () => {
    const w = await mountWith()
    const toggle = w.findAll('button').find((b) => b.text().includes('只看待处理'))
    expect(toggle, '找不到开关').toBeTruthy()
    await toggle!.trigger('click')
    expect(w.text()).not.toContain('healthy')
    expect(w.text()).toContain('not-ready')
    expect(w.text()).toContain('broken')
  })
})

describe('PodListView — 状态筛选按判定', () => {
  // P1：289 个 Pod 里 273 个是 Running，唯一坏掉的那个也在 Running 里。
  // 按 phase 筛「失败」得 0 条 —— 筛选必须走判定（podTone），phase 只是标签。
  const PODS = [
    { name: 'healthy', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.1', phase: 'Running', reason: null, message: null, restart_count: 0, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: true, state: 'running', reason: null, restart_count: 0 }] },
    { name: 'not-ready', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.2', phase: 'Running', reason: 'ContainersNotReady', message: null, restart_count: 0, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: false, state: 'running', reason: null, restart_count: 0 }] },
    { name: 'broken', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.3', phase: 'Running', reason: null, message: null, restart_count: 5, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: false, state: 'waiting', reason: 'CrashLoopBackOff', restart_count: 5 }] },
    { name: 'failed-one', namespace: 'ns', node: 'n1', pod_ip: '1.1.1.4', phase: 'Failed', reason: null, message: null, restart_count: 0, age: '1d', labels: {}, owner_kind: 'Deployment', owner_name: 'd', containers: [{ name: 'c', image: 'i', ready: false, state: 'terminated', reason: 'Error', restart_count: 0 }] },
  ]

  async function mountWithQuery(query: Record<string, string>) {
    routeState.query = query
    const { podsApi } = await import('@/api/endpoints')
    ;(podsApi.list as any).mockResolvedValue({ total: PODS.length, items: PODS })
    const w = mount(PodListView, { global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] } })
    await flushPromises()
    return w
  }

  it('下拉给的是判定桶，不是 phase', async () => {
    const w = await mountWithQuery({})
    const options = w.findComponent(AppSelect).props('options') as Array<{ value: string; label: string }>
    expect(options.map((o) => o.value)).toEqual(['all', 'error', 'warning', 'ok'])
    expect(options.map((o) => o.label)).toEqual(['全部', '坏了', '需要人看一眼', '正常'])
  })

  it('「坏了」能筛到 phase 还是 Running 的坏 Pod', async () => {
    const w = await mountWithQuery({ status: 'error' })
    // broken 的 phase 是 Running —— 按 phase 筛永远筛不到它。failed-one
    // 判定也是 error（terminated: Error），两个都该在。
    expect(w.text()).toContain('broken')
    expect(w.text()).toContain('failed-one')
    expect(w.text()).not.toContain('healthy')
    expect(w.text()).not.toContain('not-ready')
  })

  it('「需要人看一眼」只留没就绪的', async () => {
    const w = await mountWithQuery({ status: 'warning' })
    expect(w.text()).toContain('not-ready')
    expect(w.text()).not.toContain('broken')
    expect(w.text()).not.toContain('healthy')
  })

  it('「正常」留健康的', async () => {
    const w = await mountWithQuery({ status: 'ok' })
    expect(w.text()).toContain('healthy')
    expect(w.text()).not.toContain('broken')
    expect(w.text()).not.toContain('not-ready')
    expect(w.text()).not.toContain('failed-one')
  })

  it('Dashboard 深链 ?status=Failed 仍按 phase 生效，下拉显示它筛的是什么', async () => {
    const w = await mountWithQuery({ status: 'Failed' })
    expect(w.text()).toContain('failed-one')
    expect(w.text()).not.toContain('broken')
    const options = w.findComponent(AppSelect).props('options') as Array<{ value: string; label: string }>
    expect(options.map((o) => o.value)).toContain('Failed')
    expect(options.find((o) => o.value === 'Failed')!.label).toContain('Failed')
  })

  it('不认识的 ?status= 不筛出一个空列表', async () => {
    const w = await mountWithQuery({ status: 'Garbage' })
    expect(w.text()).toContain('healthy')
    expect(w.text()).toContain('broken')
  })

  it('筛选清空列表时分页条不显示「第 1–0 条」', async () => {
    // 行被筛空时表格换成空态 —— 底下不能再挂一条自相矛盾的
    // 「第 1–0 条 / 共 0 条」。
    routeState.query = { status: 'error' }
    const { podsApi } = await import('@/api/endpoints')
    ;(podsApi.list as any).mockResolvedValue({ total: 1, items: [PODS[0]] })
    const w = mount(PodListView, { global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] } })
    await flushPromises()
    expect(w.text()).toContain('没有「坏了」的 Pod')
    expect(w.text()).not.toContain('第 1–')
  })
})
