import { onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import { podsApi } from '@/api/endpoints'
import type { PodListOut } from '@/api/types'

/**
 * Reactive pod list loader — production-hardened.
 *
 * Defends against four failures:
 *   1. stale-response overwrite — concurrent fetches race; AbortController plus
 *      a monotonic seq guard discard the loser
 *   2. ghost writes after unmount — the controller aborts in flight, and the seq
 *      guard catches responses that had already left the wire
 *   3. flashing rows on filter change — `data` is NOT cleared while refetching,
 *      because PodListView's only two states are `loading && !items.length`
 *      (spinner) and `!loading && !items.length` (empty); emptying the data
 *      guaranteed the first, so every cluster/namespace/status change collapsed
 *      the grid and popped it back
 *   4. an orphaned `loading` — set in `load()` and cleared in `load()`'s own
 *      `finally`, including the no-cluster bail-out, so no path leaves it true
 *      with nothing in flight to reset it
 */
export function usePodList(opts: {
  cluster: Ref<string | null>
  namespace: Ref<string | null>
  status: Ref<string>
  search: Ref<string>
  debounceMs?: number
}) {
  // ponytail: shallowRef — PodListOut reassigned whole; never mutate inner items
  // individually, so deep reactivity is wasted overhead on every prop of every pod.
  const data = shallowRef<PodListOut>({ total: 0, items: [] })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Single generation counter. `load()` is the only writer of `loading`,
  // `error` and `data` — which is what stops (3) and (4) from regressing into
  // each other. A flag set by the watcher and cleared by a bail-out is a flag
  // with no owner, and that is exactly the permanent-spinner bug.
  let seq = 0
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let activeController: AbortController | null = null
  let alive = true

  function clearDebounce() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  function abortInFlight() {
    if (activeController) {
      activeController.abort()
      activeController = null
    }
  }

  async function load() {
    // Claim the generation before the bail-out, so an early exit still
    // invalidates whatever is in flight, then cancel it: with no cluster there
    // is nothing left to wait for.
    const mySeq = ++seq
    abortInFlight()
    if (!alive || !opts.cluster.value) {
      if (mySeq === seq) {
        loading.value = false
        error.value = null
      }
      return
    }

    const controller = new AbortController()
    activeController = controller

    loading.value = true
    error.value = null

    try {
      const result = await podsApi.list({
        cluster: opts.cluster.value,
        namespace: opts.namespace.value,
        status: opts.status.value,
        search: opts.search.value || undefined,
        signal: controller.signal,
      })

      if (!alive || mySeq !== seq) return
      data.value = result
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return
      if (!alive || mySeq !== seq) return
      error.value = e?.message ?? 'load failed'
    } finally {
      if (mySeq === seq) loading.value = false
    }
  }

  function scheduleLoad() {
    if (!alive) return
    clearDebounce()
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      load()
    }, opts.debounceMs ?? 150)
  }

  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.status.value],
    () => {
      if (!alive) return
      // Do NOT empty `data` here. The table's own guard is
      // `loading && data.items.length === 0`, so emptying the data made every
      // cluster / namespace / status change collapse the grid to a spinner
      // and pop it back — the same flash as the pod log panel. The previous
      // rows stay put until the replacement arrives; `abortInFlight` and the
      // seq guard already stop a slow response from clobbering a newer one.
      //
      // `loading`/`error` are NOT set here either: load() sets both
      // synchronously on its first lines, so setting them in the watcher only
      // mattered for the one path where load() bails out — no cluster yet —
      // and there it orphaned the flag with nobody left to clear it. PodListView
      // renders a spinner whenever `loading && items.length === 0`, so the
      // grid hung forever after a logout->login or an empty cluster list.
      load()
    },
    { immediate: true },
  )

  watch(() => opts.search.value, scheduleLoad)

  // Manual refresh. Cancels a pending debounced search first, otherwise the
  // timer fires a second load moments later and the table flicks between two
  // nearly identical result sets.
  function reload() {
    clearDebounce()
    void load()
  }

  onBeforeUnmount(() => {
    alive = false
    clearDebounce()
    abortInFlight()
  })

  return { data, loading, error, reload }
}
