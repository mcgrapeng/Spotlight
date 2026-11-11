import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { usePodList } from '@/composables/usePodList'
import { getI18n } from '@/i18n'
import { podsApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  podsApi: { list: vi.fn() },
}))

describe('usePodList', () => {
  beforeEach(() => { vi.clearAllMocks() })
  // Fake timers must never leak: a test that throws before its own cleanup
  // would otherwise leave the next one waiting on timers that never fire.
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks() })

  it('loads immediately on cluster set', async () => {
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { data, loading } = usePodList({ cluster, namespace, search })
    // immediate load
    await vi.waitFor(() => expect(loading.value).toBe(false))
    expect(podsApi.list).toHaveBeenCalledTimes(1)
    expect(data.value.total).toBe(0)
  })

  it('skips load when cluster is null', async () => {
    const cluster = ref<string | null>(null)
    const namespace = ref<string | null>('ns')
    const search = ref('')
    usePodList({ cluster, namespace, search })
    await nextTick()
    expect(podsApi.list).not.toHaveBeenCalled()
  })

  it('keeps the current rows visible while a filter change refetches', async () => {
    // The watcher used to do `data.value = { total: 0, items: [] }` before
    // every load. PodListView's only guard is
    // `loading && data.items.length === 0`, so emptying the data guaranteed
    // the condition — the grid collapsed to a spinner and popped back on
    // every cluster / namespace change.
    const rows = [{ name: 'p1', namespace: 'ns', status: 'Running' }] as any
    vi.mocked(podsApi.list).mockResolvedValue({ total: 1, items: rows })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { data, loading } = usePodList({ cluster, namespace, search })
    await vi.waitFor(() => expect(data.value.items).toHaveLength(1))

    let release!: (v: any) => void
    vi.mocked(podsApi.list).mockReturnValueOnce(
      new Promise((res) => { release = res }) as any,
    )
    namespace.value = 'other'
    await nextTick()
    await Promise.resolve()
    expect(loading.value).toBe(true)
    expect(data.value.items).toHaveLength(1)   // never emptied

    release({ total: 0, items: [] })
    await vi.waitFor(() => expect(loading.value).toBe(false))
    expect(data.value.items).toHaveLength(0)
  })

  it('clears loading when the cluster selection goes away', async () => {
    // `loading` is set in the watch callback before calling load(), but load()
    // bails out early when there is no cluster. The flag then has no owner to
    // reset it and PodListView — whose only two states are
    // `loading && items.length === 0` (spinner) and
    // `!loading && items.length === 0` (empty) — spins forever. Reachable
    // when the clusters list comes back empty, and on logout->login.
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { loading } = usePodList({ cluster, namespace, search })
    await vi.waitFor(() => expect(loading.value).toBe(false))

    cluster.value = null
    await nextTick()
    await Promise.resolve()
    expect(loading.value).toBe(false)
  })

  it('debounces search changes', async () => {
    vi.useFakeTimers()
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    usePodList({ cluster, namespace, search, debounceMs: 100 })

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

  it('shows the backend\'s reason when it gave one, and a localized line when it did not', async () => {
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')

    // The server explained the failure → its words are shown.
    vi.mocked(podsApi.list).mockRejectedValueOnce({
      response: { data: { detail: 'Pod 或容器不存在（可能已经被删除）' } },
    })
    const first = usePodList({ cluster, namespace, search })
    await vi.waitFor(() => expect(first.loading.value).toBe(false))
    expect(first.error.value).toBe('Pod 或容器不存在（可能已经被删除）')

    // It did not → the reader gets the localized line, not axios's English
    // ("Network Error" / "Request failed with status code 500").
    vi.mocked(podsApi.list).mockRejectedValueOnce(new Error('boom'))
    const second = usePodList({ cluster, namespace, search })
    await vi.waitFor(() => expect(second.loading.value).toBe(false))
    expect(second.error.value).toBe(getI18n().global.t('state.error'))
  })

  it('reload() re-invokes podsApi.list', async () => {
    vi.mocked(podsApi.list).mockResolvedValue({ total: 1, items: [{ name: 'p1', namespace: 'ns', node: 'n', pod_ip: '', phase: 'Running', reason: null, message: null, restart_count: 1, age: '1d', created_at: null, labels: {}, containers: [], owner_kind: null, owner_name: null }] as any })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { data, reload } = usePodList({ cluster, namespace, search })
    await vi.waitFor(() => expect(data.value.total).toBeGreaterThanOrEqual(0))
    const before = vi.mocked(podsApi.list).mock.calls.length
    await reload()
    expect(vi.mocked(podsApi.list).mock.calls.length).toBe(before + 1)
  })

  it('reload() cancels the pending debounced search instead of stacking on it', async () => {
    // reload() used to be `load` verbatim, so a search typed a moment earlier
    // still had its debounce timer armed. The manual refresh ran, then the
    // timer fired a second load — the table flickered between two nearly
    // identical result sets on every refresh-while-typing.
    vi.useFakeTimers()
    vi.mocked(podsApi.list).mockResolvedValue({ total: 0, items: [] })
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { reload } = usePodList({ cluster, namespace, search, debounceMs: 150 })
    // the immediate load has to have landed before we can count calls
    await vi.waitFor(() => expect(vi.mocked(podsApi.list)).toHaveBeenCalledTimes(1))
    const before = vi.mocked(podsApi.list).mock.calls.length

    search.value = 'web'                     // arms the debounce
    await nextTick()                         // watcher callbacks flush pre-render
    reload()                                  // user hits refresh
    await vi.advanceTimersByTimeAsync(500)   // the old timer would fire here
    expect(vi.mocked(podsApi.list).mock.calls.length).toBe(before + 1)
  })

  it('a slow response cannot clobber a newer one', async () => {
    let releaseA!: (v: any) => void
    vi.mocked(podsApi.list)
      .mockReturnValueOnce(new Promise((r) => { releaseA = r }) as any)
      .mockResolvedValueOnce({ total: 2, items: [{ name: 'fresh' }] } as any)
    const cluster = ref<string | null>('c1')
    const namespace = ref<string | null>('ns')
    const search = ref('')
    const { data } = usePodList({ cluster, namespace, search })
    await nextTick()
    namespace.value = 'other'                // second load wins
    await vi.waitFor(() => expect(data.value.total).toBe(2))
    releaseA({ total: 99, items: [] })        // stale reply lands late
    await new Promise((r) => setTimeout(r, 5))
    expect(data.value.total).toBe(2)
  })
})
