import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClusterStore } from '@/stores/cluster'
import { clustersApi, namespacesApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  clustersApi: { list: vi.fn() },
  namespacesApi: { list: vi.fn() },
}))

const STORAGE_KEY = 'k8s-viewer.selection.v2'

describe('cluster store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()
  })
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('loads clusters and picks the current one', async () => {
    vi.mocked(clustersApi.list).mockResolvedValueOnce([
      { name: 'a', cluster: '', user: '', namespace: '', is_current: false },
      { name: 'b', cluster: '', user: '', namespace: '', is_current: true },
    ] as any)
    const store = useClusterStore()
    await store.loadClusters()
    expect(store.activeCluster).toBe('b')
  })

  it('falls back to first cluster when none is_current', async () => {
    vi.mocked(clustersApi.list).mockResolvedValueOnce([
      { name: 'a', cluster: '', user: '', namespace: '', is_current: false },
      { name: 'b', cluster: '', user: '', namespace: '', is_current: false },
    ] as any)
    const store = useClusterStore()
    await store.loadClusters()
    expect(store.activeCluster).toBe('a')
  })

  it('preserves existing selection when reloading clusters', async () => {
    vi.mocked(clustersApi.list).mockResolvedValueOnce([
      { name: 'a', cluster: '', user: '', namespace: '', is_current: false },
      { name: 'b', cluster: '', user: '', namespace: '', is_current: true },
    ] as any)
    const store = useClusterStore()
    store.activeCluster = 'a'
    await store.loadClusters()
    expect(store.activeCluster).toBe('a')  // kept the user's choice
  })

  it('setNamespace persists to localStorage', () => {
    const store = useClusterStore()
    store.activeCluster = 'c'
    store.setNamespace('kube-system')
    expect(store.activeNamespace).toBe('kube-system')
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toEqual({ cluster: 'c', namespace: 'kube-system' })
  })

  it('setCluster forces namespace back to _all and reloads namespaces', async () => {
    vi.mocked(namespacesApi.list).mockResolvedValueOnce([
      { name: 'ns-a', status: 'Active', labels: {}, age: null },
    ] as any)
    const store = useClusterStore()
    store.activeNamespace = 'stale'
    await store.setCluster('c')
    expect(store.activeNamespace).toBe('_all')
    expect(store.namespaces[0].name).toBe('ns-a')
  })

  it('restore() loads from localStorage when present', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cluster: 'restored', namespace: 'ns' }))
    const store = useClusterStore()
    store.restore()
    expect(store.activeCluster).toBe('restored')
    expect(store.activeNamespace).toBe('ns')
  })

  it('restore() tolerates corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json{')
    const store = useClusterStore()
    expect(() => store.restore()).not.toThrow()
    expect(store.activeCluster).toBeNull()
  })
})