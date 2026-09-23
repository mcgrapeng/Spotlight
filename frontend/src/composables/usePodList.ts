import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { podsApi } from '@/api/endpoints'
import type { PodListResponse } from '@/domain/types'

/**
 * Composable that loads pods reactively. Backing store does NOT cache —
 * server-side TTL cache is enough. We debounce user-driven changes (search,
 * filter) so we don't spam the API.
 *
 * Production hardening vs. v1:
 * - **Timer cleanup on unmount** — without `onBeforeUnmount` clearing the
 *   pending setTimeout, navigating away mid-debounce fires `load()` on an
 *   unmounted instance (Vue warns, but more importantly the response can
 *   land on a stale reactive store).
 * - **Reset on input change** — switching cluster/namespace used to show
 *   the previous cluster's data for the roundtrip; we now clear `data`
 *   immediately when an input changes so the table goes to its loading
 *   state instead of flashing stale rows.
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

  let timer: ReturnType<typeof setTimeout> | null = null
  let alive = true

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  async function load() {
    if (!alive || !opts.cluster.value) return
    loading.value = true
    error.value = null
    try {
      data.value = await podsApi.list({
        cluster: opts.cluster.value,
        namespace: opts.namespace.value,
        status: opts.status.value,
        search: opts.search.value || undefined,
      })
    } catch (e: any) {
      error.value = e?.message ?? 'load failed'
    } finally {
      loading.value = false
    }
  }

  function scheduleLoad() {
    if (!alive) return
    clearTimer()
    timer = setTimeout(() => { timer = null; load() }, opts.debounceMs ?? 250)
  }

  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.status.value],
    () => {
      if (!alive) return
      // Clear stale data so the table doesn't briefly show the previous
      // cluster's rows during the fetch roundtrip.
      data.value = { total: 0, items: [] }
      load()
    },
    { immediate: true },
  )
  watch(() => opts.search.value, scheduleLoad)

  onBeforeUnmount(() => {
    alive = false
    clearTimer()
  })

  return { data, loading, error, reload: load }
}