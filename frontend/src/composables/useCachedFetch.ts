import { ref, type Ref } from 'vue'

interface CacheEnvelope<T> {
  value: T
  ts: number
}

export interface CachedFetchOptions<T> {
  key: string
  ttlMs?: number
  fetcher: () => Promise<T>
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
}

export interface CachedFetchHandle<T> {
  load: () => Promise<void>
  refresh: () => Promise<void>
  hydrateFromCache: () => boolean
  loadedAt: Ref<number>
}

const DEFAULT_TTL_MS = 30_000

function storageKey(key: string): string {
  return `cached:${key}`
}

function readCache<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(storageKey(key))
    if (!raw) return null
    const env = JSON.parse(raw) as CacheEnvelope<T>
    if (Date.now() - env.ts > ttl) return null
    return env.value
  } catch {
    return null
  }
}

function writeCache<T>(key: string, value: T, ts: number): void {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify({ value, ts }))
  } catch {
    /* quota or disabled */
  }
}

export function useCachedFetch<T>(opts: CachedFetchOptions<T>): CachedFetchHandle<T> {
  const ttl = opts.ttlMs ?? DEFAULT_TTL_MS
  const loadedAt = ref(0)

  async function load(): Promise<void> {
    opts.loading.value = true
    opts.error.value = null
    try {
      const value = await opts.fetcher()
      opts.data.value = value
      loadedAt.value = Date.now()
      writeCache(opts.key, value, loadedAt.value)
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } }; message?: string }
      opts.error.value = err?.response?.data?.detail ?? err?.message ?? 'load failed'
    } finally {
      opts.loading.value = false
    }
  }

  function hydrateFromCache(): boolean {
    const cached = readCache<T>(opts.key, ttl)
    if (cached === null) return false
    opts.data.value = cached
    loadedAt.value = Date.now()
    return true
  }

  return {
    load,
    refresh: load,
    hydrateFromCache,
    loadedAt,
  }
}