import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clustersApi, namespacesApi } from '@/api/endpoints'
import { useCachedFetch } from '@/composables/useCachedFetch'
import type { ClusterInfo, NamespaceInfo } from '@/domain/types'

const STORAGE_KEY = 'spotlight.selection.v2'

export const useClusterStore = defineStore('cluster', () => {
  const clusters = ref<ClusterInfo[]>([])
  const namespaces = ref<NamespaceInfo[]>([])
  const activeCluster = ref<string | null>(null)
  const activeNamespace = ref<string>('_all')

  const currentCluster = computed(() =>
    clusters.value.find((c) => c.name === activeCluster.value) ?? null,
  )

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cluster: activeCluster.value, namespace: activeNamespace.value,
    }))
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
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
  const clustersFetch = useCachedFetch<ClusterInfo[]>({
    key: 'clusters:list',
    fetcher: () => clustersApi.list(),
    data: clusters as unknown as import('vue').Ref<ClusterInfo[] | null>,
    loading: ref(false) as unknown as import('vue').Ref<boolean>,
    error: ref<string | null>(null) as unknown as import('vue').Ref<string | null>,
    ttlMs: 5 * 60_000,
  })

  async function loadClusters() {
    try {
      // loadOrHydrate: cache hit returns instantly, miss hits the network
      // and writes through. This collapses 4-5x page-mount fetches to 1
      // every 5 minutes.
      const v = await clustersFetch.loadOrHydrate()
      if (Array.isArray(v)) {
        clusters.value = v
        if (!activeCluster.value) {
          const cur = v.find((c) => c.is_current) ?? v[0]
          activeCluster.value = cur?.name ?? null
        }
      }
    } catch (e: any) {
      // Silent — clusters endpoint not available (e.g. unauth'd). Router
      // guard will redirect to /login if needed.
    }
  }

  // ponytail: namespaces are scoped to the active cluster, so the cache
  // key includes the cluster name. Hit the same cluster twice within
  // 5 min and the second call returns from localStorage.
  const nsFetchKey = computed(() => `namespaces:${activeCluster.value ?? 'none'}`)
  const nsFetch = useCachedFetch<NamespaceInfo[]>({
    key: nsFetchKey.value,
    fetcher: () => namespacesApi.list(activeCluster.value!),
    data: namespaces as unknown as import('vue').Ref<NamespaceInfo[] | null>,
    loading: ref(false) as unknown as import('vue').Ref<boolean>,
    error: ref<string | null>(null) as unknown as import('vue').Ref<string | null>,
    ttlMs: 5 * 60_000,
  })

  async function loadNamespaces() {
    if (!activeCluster.value) return
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

  return {
    clusters, namespaces, activeCluster, activeNamespace, currentCluster,
    loadClusters, loadNamespaces, setCluster, setNamespace, restore,
  }
})
