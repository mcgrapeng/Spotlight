import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
  // Only ever called from `<script setup>`, so `useI18n()` is available here.
  const { t } = useI18n()
  const data = ref<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Orders concurrent loads, same contract as useCachedFetch.load() and
  // usePodList.load(): a response (or a failure) from a superseded load must
  // not write, and must not clear `loading` out from under a newer one. The
  // watch source here is the cluster / route param, so two loads overlap
  // whenever it changes twice before the first reply lands — fast cluster
  // switching, or pod -> pod navigation where the first is still in the air.
  let seq = 0
  let alive = true

  async function load() {
    // Claim a generation BEFORE the skip check. Bailing out without claiming
    // one left the in-flight load as the current generation, so navigating to
    // a route where `skip()` is true (PodDetailView's `!name.value`) still
    // let the previous pod's response write into the new view.
    const mySeq = ++seq
    if (opts.skip?.()) {
      // Nothing to fetch. Still settle the flags: a caller that skipped must
      // not leave `loading` true with nothing in flight to clear it.
      if (mySeq === seq) {
        loading.value = false
        error.value = null
      }
      return
    }
    loading.value = true
    error.value = null
    try {
      const value = await fetcher()
      if (!alive || mySeq !== seq) return
      data.value = value
    } catch (e: any) {
      if (!alive || mySeq !== seq) return
      error.value = e?.response?.data?.detail ?? e?.message ?? t('state.error')
    } finally {
      if (mySeq === seq) loading.value = false
    }
  }

  // Exactly ONE initial load. These used to be `onMounted(load)` *and*
  // `watch(opts.watch, load, { immediate: true })`, which is two: the
  // immediate watcher fires during setup and onMounted fires again after
  // mount. Every consumer paid it — two requests per view, and because the
  // second one sets `loading = true` after the first already populated
  // `data`, the panel flips to its skeleton and back. On a real cluster,
  // where the request takes ~1s, that is a visible flash.
  if (opts.watch) watch(opts.watch, load, { immediate: true })
  else onMounted(load)

  onBeforeUnmount(() => { alive = false })

  return { data, loading, error, reload: load }
}
