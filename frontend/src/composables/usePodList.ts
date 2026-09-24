import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { podsApi } from '@/api/endpoints'
import type { PodListResponse } from '@/domain/types'

/**
 * Reactive pod list loader — production-hardened.
 *
 * Defends against three failures:
 *   1. stale-response overwrite (concurrent fetches race; AbortController +
 *      monotonic seq guard discards the loser)
 *   2. ghost writes after unmount (AbortController aborts in-flight on unmount;
 *      the seq guard is the belt-and-suspenders for responses that already left the wire)
 *   3. flashing stale rows on filter change (data + loading cleared synchronously
 *      inside the watch callback, not in the deferred `load()`)
 */
export function usePodList(opts: {
  cluster: Ref<string | null>
  namespace: Ref<string | null>
  status: Ref<string>
  search: Ref<string>
  debounceMs?: number
}) {
  const data = ref<PodListResponse>({ total: 0, items: [] })
  const loading = ref(false)
  const error = ref<string | null>(null)

  let seq = 0
  let issuedSeq = 0
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
    if (!alive || !opts.cluster.value) return

    abortInFlight()

    const controller = new AbortController()
    activeController = controller
    const mySeq = ++seq
    issuedSeq = mySeq

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

      if (!alive || mySeq !== issuedSeq) return
      data.value = result
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return
      if (!alive || mySeq !== issuedSeq) return
      error.value = e?.message ?? 'load failed'
    } finally {
      if (mySeq === issuedSeq) loading.value = false
    }
  }

  function scheduleLoad() {
    if (!alive) return
    clearDebounce()
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      load()
    }, opts.debounceMs ?? 250)
  }

  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.status.value],
    () => {
      if (!alive) return
      data.value = { total: 0, items: [] }
      loading.value = true
      error.value = null
      load()
    },
    { immediate: true },
  )

  watch(() => opts.search.value, scheduleLoad)

  onBeforeUnmount(() => {
    alive = false
    clearDebounce()
    abortInFlight()
  })

  return { data, loading, error, reload: load }
}