import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { usePodList } from '@/composables/usePodList'
import { podsApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  podsApi: { list: vi.fn() },
}))

describe('usePodList', () => {
  beforeEach(() => { vi.clearAllMocks() })
  afterEach(() => { vi.restoreAllMocks() })

  it('loads immediately on cluster set', async () => {
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const status = ref('all')
    const search = ref('')
    const { data, loading } = usePodList({ cluster, namespace, status, search })
    // immediate load
    await vi.waitFor(() => expect(loading.value).toBe(false))
    expect(podsApi.list).toHaveBeenCalledTimes(1)
    expect(data.value.total).toBe(0)
  })

  it('skips load when cluster is null', async () => {
    const cluster = ref<string | null>(null)
    const namespace = ref<string | null>('ns')
    const status = ref('all')
    const search = ref('')
    usePodList({ cluster, namespace, status, search })
    await nextTick()
    expect(podsApi.list).not.toHaveBeenCalled()
  })

  it('debounces search changes', async () => {
    vi.useFakeTimers()
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const status = ref('all')
    const search = ref('')
    usePodList({ cluster, namespace, status, search, debounceMs: 100 })

    // initial load fires immediately (no debounce on watcher with immediate: true)
    await vi.runAllTimersAsync()
    const initialCalls = vi.mocked(podsApi.list).mock.calls.length

    search.value = 'a'
    search.value = 'ab'
    search.value = 'abc'
    expect(vi.mocked(podsApi.list).mock.calls.length).toBe(initialCalls) // not yet

    vi.advanceTimersByTime(110)
    await vi.runAllTimersAsync()
    expect(vi.mocked(podsApi.list).mock.calls.length).toBeGreaterThan(initialCalls)

    vi.useRealTimers()
  })

  it('captures error messages', async () => {
    vi.mocked(podsApi.list).mockRejectedValueOnce(new Error('boom'))
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const status = ref('all')
    const search = ref('')
    const { error, loading } = usePodList({ cluster, namespace, status, search })
    await vi.waitFor(() => expect(loading.value).toBe(false))
    expect(error.value).toBe('boom')
  })

  it('reload() re-invokes podsApi.list', async () => {
    vi.mocked(podsApi.list).mockResolvedValue({ total: 1, items: [{ name: 'p1', namespace: 'ns', node: 'n', pod_ip: '', phase: 'Running', reason: null, message: null, restart_count: 1, age: '1d', created_at: null, labels: {}, containers: [], owner_kind: null, owner_name: null }] as any })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const status = ref('all')
    const search = ref('')
    const { data, reload } = usePodList({ cluster, namespace, status, search })
    await vi.waitFor(() => expect(data.value.total).toBeGreaterThanOrEqual(0))
    const before = vi.mocked(podsApi.list).mock.calls.length
    await reload()
    expect(vi.mocked(podsApi.list).mock.calls.length).toBe(before + 1)
  })
})