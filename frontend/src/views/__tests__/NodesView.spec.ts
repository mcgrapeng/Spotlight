import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/nodes' }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  }
})

vi.mock('@/stores/cluster', async () => {
  // reactive(): the view watches `cluster.activeCluster`, so a plain object
  // would never fire the watcher and the switch would never happen.
  const { reactive } = await import('vue')
  const reactiveObj = reactive({ activeCluster: 'demo-cluster', activeNamespace: 'default' })
  return { useClusterStore: () => reactiveObj, __cluster: reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  nodesApi: { list: vi.fn(async () => []) },
}))

import NodesView from '../NodesView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
  localStorage.clear()
})

describe('NodesView', () => {
  it('renders the empty state when the cluster has no nodes', async () => {
    const wrapper = mount(NodesView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('没有节点')
    expect(wrapper.text()).toContain('Node')
  })

  it('does not show the previous cluster\'s nodes after a switch', async () => {
    // The operator switches cluster A -> cluster B. If A's request resolves
    // after B's, the view rendered A's nodes under B's name — with no
    // error, because the request itself succeeded.
    const { nodesApi } = await import('@/api/endpoints')
    const { __cluster } = await import('@/stores/cluster') as unknown as {
      __cluster: { activeCluster: string; activeNamespace: string }
    }
    const pending: Record<string, (v: any[]) => void> = {}
    ;(nodesApi.list as any).mockImplementation((cluster: string) =>
      new Promise((resolve) => { pending[cluster] = resolve }))

    const wrapper = mount(NodesView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    await flushPromises()

    __cluster.activeCluster = 'cluster-b'
    await flushPromises()

    const node = (name: string) => ({
      name, status: 'Ready', roles: [], kubelet_version: 'v1.30', age: '1d',
      pod_count: 1, cpu_allocatable: '1', cpu_capacity: '2',
      memory_allocatable: '1Gi', memory_capacity: '2Gi',
    })
    pending['cluster-b']([node('node-b')])
    await flushPromises()
    expect(wrapper.text()).toContain('node-b')

    // The stale answer for the cluster we left arrives late.
    pending['demo-cluster']([node('node-a')])
    await flushPromises()

    expect(wrapper.text()).toContain('node-b')
    expect(wrapper.text()).not.toContain('node-a')
  })
})
