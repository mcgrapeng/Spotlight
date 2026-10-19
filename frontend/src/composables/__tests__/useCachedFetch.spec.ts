import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'
import { useCachedFetch } from '@/composables/useCachedFetch'

function handle(fetcher: () => Promise<any>, key = 'k') {
  return useCachedFetch<any>({
    key,
    fetcher,
    data: ref<any>(null),
    loading: ref(false),
    error: ref<string | null>(null),
    ttlMs: 60_000,
  })
}

describe('useCachedFetch.rekey', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('reads from the new slot after rekey, not the old one', async () => {
    // Regression: a handle whose key was captured at setup served one target's
    // data for every other target.
    localStorage.setItem('cached:a', JSON.stringify({ value: 'from-A', ts: Date.now() }))
    localStorage.setItem('cached:b', JSON.stringify({ value: 'from-B', ts: Date.now() }))

    const data = ref<any>(null)
    const h = useCachedFetch<any>({
      key: 'a', fetcher: async () => 'network',
      data, loading: ref(false), error: ref<string | null>(null), ttlMs: 60_000,
    })

    await h.loadOrHydrate()
    expect(data.value).toBe('from-A')

    h.rekey('b')
    await h.loadOrHydrate()
    expect(data.value).toBe('from-B')
  })

  it('rekey alone does not fetch — the caller decides', async () => {
    const fetcher = vi.fn().mockResolvedValue('net')
    const h = handle(fetcher)
    h.rekey('other')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('writes to the current key', async () => {
    const h = handle(async () => 'value')
    h.rekey('written-under')
    await h.load()
    expect(JSON.parse(localStorage.getItem('cached:written-under')!).value).toBe('value')
  })

  it('a stale loadedAt cannot hydrate the previous slot', async () => {
    localStorage.setItem('cached:old', JSON.stringify({ value: 'stale', ts: Date.now() }))
    const data = ref<any>(null)
    const h = useCachedFetch<any>({
      key: 'old', fetcher: async () => 'fresh',
      data, loading: ref(false), error: ref<string | null>(null), ttlMs: 60_000,
    })
    h.rekey('brand-new')
    expect(h.hydrateFromCache()).toBe(false)
    expect(data.value).toBeNull()
  })

  it('rekeying to the same key is a no-op', async () => {
    const h = handle(async () => 'v')
    h.rekey('same')
    expect(h.loadedAt.value).toBe(0)
  })

  it('discards a response that lands after a rekey', async () => {
    // The bug this guards: `load()` used to read the mutable `key` AFTER the
    // await, so a request for A that resolved after the user switched to B
    // wrote A's data under B's slot — where it then served the wrong target
    // for a full TTL with no error anywhere.
    const gate: Array<() => void> = []
    const data = ref<any>(null)
    const h = useCachedFetch<any>({
      key: 'nodes:clusterA',
      fetcher: () => new Promise<string>((res) => { gate.push(() => res('DATA-FROM-A')) }),
      data, loading: ref(false), error: ref<string | null>(null), ttlMs: 60_000,
    })

    const inflight = h.load()      // in flight for A
    h.rekey('nodes:clusterB')      // user switches to B
    gate[0]()                      // A's response arrives late
    await inflight

    expect(localStorage.getItem('cached:nodes:clusterB')).toBeNull()
    expect(data.value).toBeNull()
    expect(h.loadedAt.value).toBe(0)
  })

  it('lets the newest load win when two overlap on the same key', async () => {
    const gate: Record<string, () => void> = {}
    let calls = 0
    const data = ref<any>(null)
    const loading = ref(false)
    const h = useCachedFetch<any>({
      key: 'k',
      fetcher: () => new Promise<string>((res) => {
        const label = String(calls++)
        gate[label] = () => res(`call-${label}`)
      }),
      data, loading, error: ref<string | null>(null), ttlMs: 60_000,
    })

    const first = h.load()                       // stale, resolves second
    const second = h.load()                      // authoritative
    gate['1']()                                  // newest resolves first
    await second
    gate['0']()                                  // stale lands late
    await first

    expect(JSON.parse(localStorage.getItem('cached:k')!).value).toBe('call-1')
    expect(data.value).toBe('call-1')
    expect(loading.value).toBe(false)
  })
})
