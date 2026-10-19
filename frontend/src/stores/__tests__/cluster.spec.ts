import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClusterStore } from '@/stores/cluster'
import { clustersApi, namespacesApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  clustersApi: { list: vi.fn() },
  namespacesApi: { list: vi.fn() },
}))

const STORAGE_KEY = 'spotlight.selection.v2'

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

  it('drops a restored selection the current login cannot see', async () => {
    // Alice picked prod-east and logged out; Bob logs in and only has
    // staging-eu. Keeping prod-east makes every request carry a context his
    // session kubeconfig lacks → 409 on every page.
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cluster: 'prod-east', namespace: 'payments' }))
    vi.mocked(clustersApi.list).mockResolvedValueOnce([
      { name: 'staging-eu', cluster: '', user: '', namespace: '', is_current: true },
    ] as any)
    const store = useClusterStore()
    store.restore()
    expect(store.activeCluster).toBe('prod-east')
    await store.loadClusters()
    expect(store.activeCluster).toBe('staging-eu')   // re-synced, not left stale
    expect(store.activeNamespace).toBe('_all')
  })

  it('rekeys the namespace cache per cluster', async () => {
    // The old setup captured `computed(...).value` once (always "none"), so
    // the second cluster's namespaces came from the first cluster's cache.
    vi.mocked(clustersApi.list).mockResolvedValue([
      { name: 'prod', cluster: '', user: '', namespace: '', is_current: true },
      { name: 'staging', cluster: '', user: '', namespace: '', is_current: false },
    ] as any)
    vi.mocked(namespacesApi.list)
      .mockResolvedValueOnce([{ name: 'prod-only', status: 'Active', labels: {}, age: null }] as any)
      .mockResolvedValueOnce([{ name: 'staging-only', status: 'Active', labels: {}, age: null }] as any)

    const store = useClusterStore()
    await store.loadClusters()
    await store.setCluster('prod')
    expect(store.namespaces.map((n) => n.name)).toEqual(['prod-only'])

    await store.setCluster('staging')
    expect(store.namespaces.map((n) => n.name)).toEqual(['staging-only'])
    // Different key per cluster → the fetcher really ran twice.
    expect(namespacesApi.list).toHaveBeenCalledTimes(2)
  })

  it('reset() clears selection and every cached snapshot', () => {
    const store = useClusterStore()
    store.activeCluster = 'prod'
    store.activeNamespace = 'payments'
    store.setNamespace('payments')
    localStorage.setItem('cached:cache:namespaces:prod', '{"value":["a"],"ts":1}')
    localStorage.setItem('cached:cache:nodes:prod', '{"value":[],"ts":1}')
    localStorage.setItem('spotlight-sidebar-collapsed', '1')   // a user pref, must survive

    store.reset()

    expect(store.activeCluster).toBeNull()
    expect(store.activeNamespace).toBe('_all')
    expect(store.clusters).toEqual([])
    expect(store.namespaces).toEqual([])
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('cached:cache:namespaces:prod')).toBeNull()
    expect(localStorage.getItem('cached:cache:nodes:prod')).toBeNull()
    expect(localStorage.getItem('spotlight-sidebar-collapsed')).toBe('1')
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