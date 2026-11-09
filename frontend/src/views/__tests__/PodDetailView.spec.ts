import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/pods/cache-001', params: { name: 'cache-001', namespace: 'default' } }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
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
})
