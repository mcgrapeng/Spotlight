import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clustersApi, namespacesApi } from '@/api/endpoints'
import { useCachedFetch } from '@/composables/useCachedFetch'
import { STORAGE_KEYS } from '@/storage-keys'
import type { ClusterOut, NamespaceOut } from '@/api/types'

const SELECTION_KEY = STORAGE_KEYS.appClusterSelection

export const useClusterStore = defineStore('cluster', () => {
  const clusters = ref<ClusterOut[]>([])
  const namespaces = ref<NamespaceOut[]>([])
  const activeCluster = ref<string | null>(null)
  const activeNamespace = ref<string>('_all')

  const currentCluster = computed(() =>
    clusters.value.find((c) => c.name === activeCluster.value) ?? null,
  )

  function persist() {
    localStorage.setItem(SELECTION_KEY, JSON.stringify({
      cluster: activeCluster.value, namespace: activeNamespace.value,
    }))
  }

  function restore() {
    try {
      const raw = localStorage.getItem(SELECTION_KEY)
      if (!raw) return
      const v = JSON.parse(raw)
      if (v.cluster) activeCluster.value = v.cluster
      if (v.namespace) activeNamespace.value = v.namespace
    } catch { /* ignore */ }
  }

  // ponytail: useCachedFetch wraps the fetchers with a 5-min localStorage
  // hydrate path. App.vue mounts the store on every page load; without
  // caching, each mount re-fetches the cluster list even when nothing
  // changed. With 5-min TTL, the user only sees a real network call
  // when clusters actually change (teleport login).
  const clustersFetch = useCachedFetch<ClusterOut[]>({
    key: 'clusters:list',
    fetcher: () => clustersApi.list(),
    data: clusters as unknown as import('vue').Ref<ClusterOut[] | null>,
    loading: ref(false) as unknown as import('vue').Ref<boolean>,
    error: ref<string | null>(null) as unknown as import('vue').Ref<string | null>,
    ttlMs: 5 * 60_000,
  })

  async function loadClusters() {
    try {
      // loadOrHydrate writes clusters.value via the data ref (side effect).
      // Cache hit returns instantly, miss hits the network and writes through.
      // This collapses 4-5x page-mount fetches to 1 every 5 minutes.
      // We read the ref directly (don't trust the return value) — see
      // the bug history: an earlier version read the return value and
      // `if (Array.isArray(v))` was always false because loadOrHydrate
      // returned void, leaving activeCluster null on first login.
      await clustersFetch.loadOrHydrate()
      // A selection restored from localStorage belongs to whoever used this
      // browser last. If the current login cannot see that cluster, every
      // request carries a context its session kubeconfig does not have and the
      // server answers 409. Drop it and fall through to the default below.
      if (activeCluster.value && !clusters.value.some((c) => c.name === activeCluster.value)) {
        activeCluster.value = null
        activeNamespace.value = '_all'
        persist()
      }
      if (clusters.value.length && !activeCluster.value) {
        const cur = clusters.value.find((c) => c.is_current) ?? clusters.value[0]
        activeCluster.value = cur?.name ?? null
      }
    } catch (e: any) {
      // Silent — clusters endpoint not available (e.g. unauth'd). Router
      // guard will redirect to /login if needed.
    }
  }

  // ponytail: namespaces are scoped to the active cluster, so the cache
  // key includes the cluster name. Hit the same cluster twice within
  // 5 min and the second call returns from localStorage.
  //
  // The key must be read inside loadNamespaces(), not once at store setup: a
  // Pinia setup store body runs exactly once, while activeCluster is still
  // null, so a `nsFetchKey.value` captured here froze at "namespaces:none"
  // and served one cluster's namespaces for every other cluster.
  const nsFetch = useCachedFetch<NamespaceOut[]>({
    key: '',
    fetcher: () => namespacesApi.list(activeCluster.value!),
    data: namespaces as unknown as import('vue').Ref<NamespaceOut[] | null>,
    loading: ref(false) as unknown as import('vue').Ref<boolean>,
    error: ref<string | null>(null) as unknown as import('vue').Ref<string | null>,
    ttlMs: 5 * 60_000,
  })

  async function loadNamespaces() {
    if (!activeCluster.value) return
    nsFetch.rekey(`namespaces:${activeCluster.value}`)
    try {
      const v = await nsFetch.loadOrHydrate()
      if (Array.isArray(v)) namespaces.value = v
    } catch { /* silent */ }
  }

  async function setCluster(name: string) {
    activeCluster.value = name
    activeNamespace.value = '_all'
    persist()
    // Force a fresh fetch — switching cluster always invalidates the
    // namespace cache (key changes anyway but explicit is clearer).
    await loadNamespaces()
  }

  function setNamespace(ns: string) {
    activeNamespace.value = ns
    persist()
  }

  /** Wipe all cluster state, both in memory and in localStorage. Called on
   *  logout so the next login starts from a blank slate. */
  function reset() {
    clusters.value = []
    namespaces.value = []
    activeCluster.value = null
    activeNamespace.value = '_all'
    clustersFetch.rekey('clusters:list')
    nsFetch.rekey('')
    try {
      localStorage.removeItem(SELECTION_KEY)
      // `cached:` is the prefix useCachedFetch writes; everything under it is
      // a snapshot of another user's clusters/namespaces/pods. Iterate by
      // index rather than Object.keys — that returns the method names on a
      // non-standard Storage shim, and misses every real entry.
      const doomed: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        if (k?.startsWith('cached:')) doomed.push(k)
      }
      for (const k of doomed) localStorage.removeItem(k)
    } catch { /* private mode / disabled storage */ }
  }

  return {
    clusters, namespaces, activeCluster, activeNamespace, currentCluster,
    loadClusters, loadNamespaces, setCluster, setNamespace, restore, reset,
  }
})
