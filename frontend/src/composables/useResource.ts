import { onMounted, ref, watch, type Ref } from 'vue'

interface Options<T> {
  /** Reactive dependency to watch. When it changes, load() refires. */
  watch?: () => unknown
  /** Run synchronously before each load. If true, no fetch. */
  skip?: () => boolean
}

/**
 * Ponytail: 抽象所有视图的「onMounted + watch + load + loading/error refs」三件套。
 * 原先在 DashboardView / NodesView / EventsView / PodDetailView / FavoritesView /
 * AISettingsView 各自写 ~30 行,总 ~150 行同质代码。统一收口到这里。
 *
 * 用法:
 *   const { data, loading, error, reload } = useResource(
 *     () => nodesApi.list(cluster.activeCluster!),
 *     { watch: () => cluster.activeCluster, skip: () => !cluster.activeCluster },
 *   )
 *
 * - 不接管请求缓存(那是 useCachedFetch 的事)。本组合只管加载状态/重试/响应。
 * - 不强制要求 fetch 是 useCachedFetch 的 fetcher。两者可以组合:
 *     const fetch = useCachedFetch({ ..., fetcher: () => podsApi.list(...) })
 *     const resource = useResource(fetch.refresh, { watch: () => ... })
 */
export function useResource<T>(fetcher: () => Promise<T>, opts: Options<T> = {}) {
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    if (opts.skip?.()) return
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
    } finally {
      loading.value = false
    }
  }

  onMounted(load)
  if (opts.watch) watch(opts.watch, load, { immediate: true })

  return { data, loading, error, reload: load }
}