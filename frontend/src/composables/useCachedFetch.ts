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
  /**
   * Message for a failure the server did not describe.
   *
   * The default is the raw axios text ("Network Error", "Request failed
   * with status code 500"), which is English in a Chinese interface. A
   * caller that shows this to a reader passes its own localized string.
   */
  errorFallback?: string
}

export interface CachedFetchHandle<T> {
  /**
   * Fetch and write into the bound data ref.
   *
   * `silent` keeps a failure OUT of `error`, for background refreshes: a
   * failed poll must not replace a good snapshot with an error page. The
   * snapshot on screen is still the last truth, and the caller reports the
   * failure in its own words (usually "the data is N minutes old").
   *
   * Returns whether the fetch succeeded. A superseded load (the user
   * switched cluster mid-flight) counts as a failure: its data was
   * discarded, so the caller must not treat it as fresh.
   */
  load: (silent?: boolean) => Promise<boolean>
  refresh: (silent?: boolean) => Promise<boolean>
  /**
   * Point this handle at a different cache slot. Callers whose key depends on
   * reactive state (a selected cluster, say) must rekey before reading —
   * reading `computed(...).value` once at setup captures the initial value
   * and silently serves one target's data for every other target.
   */
  rekey: (key: string) => void
  /**
   * Smart loader: returns cached value if fresh, otherwise hits the
   * network. Use this for on-mount / page-entry fetches where stale data
   * is acceptable when the network is slow. Returns the resolved data
   * (or null if a write happened) so callers don't have to re-read the
   * passed-in data ref.
   */
  loadOrHydrate: () => Promise<T | null>
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
  // Mutable rather than a captured `opts.key`: opts is a plain object literal
  // at the call site, so reassigning opts.key would be invisible here.
  let key = opts.key
  // Orders concurrent loads. A slow fetch that lands after a newer one has
  // already resolved must not overwrite it, so every write is gated on being
  // the most recent request as well as the right slot.
  let seq = 0

  function rekey(next: string): void {
    if (next !== key) {
      key = next
      loadedAt.value = 0
    }
  }

  async function load(silent = false): Promise<boolean> {
    // Snapshot the slot BEFORE awaiting. `key` is mutable, so a rekey() that
    // lands while the fetcher is in flight (the user switches cluster) would
    // otherwise store this target's response under the NEW slot — where it
    // then serves the wrong cluster for a full TTL, silently.
    const target = key
    const mine = ++seq
    opts.loading.value = true
    opts.error.value = null
    try {
      const value = await opts.fetcher()
      if (target !== key || mine !== seq) return false   // superseded — discard
      opts.data.value = value
      loadedAt.value = Date.now()
      writeCache(target, value, loadedAt.value)
      return true
    } catch (e: unknown) {
      // ponytail: silent = "this is a background poll, don't tear the page
      // down". The error text still goes to `error` for a normal load.
      if (target === key && mine === seq && !silent) {
        const err = e as { response?: { data?: { detail?: string } }; message?: string }
        opts.error.value = err?.response?.data?.detail
          ?? opts.errorFallback
          ?? err?.message
          ?? 'load failed'
      }
      return false
    } finally {
      // Only the newest load owns the flag; a discarded one must not clear it
      // out from under a request that is still running.
      if (mine === seq) opts.loading.value = false
    }
  }

  function hydrateFromCache(): boolean {
    const cached = readCache<T>(key, ttl)
    if (cached === null) return false
    opts.data.value = cached
    loadedAt.value = Date.now()
    return true
  }

  async function loadOrHydrate(): Promise<T | null> {
    // Fast path: fresh cache means no network round-trip.
    if (hydrateFromCache()) return opts.data.value
    // A failed load must not report the previous value as if it were fresh —
    // the caller would then stamp "updated just now" onto stale data.
    const ok = await load()
    return ok ? opts.data.value : null
  }

  return {
    load,
    refresh: load,
    rekey,
    loadOrHydrate,
    hydrateFromCache,
    loadedAt,
  }
}
