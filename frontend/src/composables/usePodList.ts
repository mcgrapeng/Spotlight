import { ref, watch, type Ref } from 'vue'
import { podsApi } from '@/api/endpoints'
import type { PodListResponse } from '@/domain/types'

/**
 * Composable that loads pods reactively. Backing store does NOT cache —
 * server-side TTL cache is enough. We debounce user-driven changes (search,
 * filter) so we don't spam the API.
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

  async function load() {
    if (!opts.cluster.value) return
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
    if (timer) clearTimeout(timer)
    timer = setTimeout(load, opts.debounceMs ?? 250)
  }

  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.status.value],
    load,
    { immediate: false },
  )
  watch(() => opts.search.value, scheduleLoad)

  return { data, loading, error, reload: load }
}
