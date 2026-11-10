import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/pods' }),
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
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
  localStorage.clear()
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
