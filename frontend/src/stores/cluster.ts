import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { clustersApi, namespacesApi } from '@/api/endpoints'
import type { ClusterInfo, NamespaceInfo } from '@/domain/types'

const STORAGE_KEY = 'k8s-viewer.selection.v2'

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

  async function loadClusters() {
    clusters.value = await clustersApi.list()
    if (!activeCluster.value) {
      const cur = clusters.value.find((c) => c.is_current) ?? clusters.value[0]
      activeCluster.value = cur?.name ?? null
    }
  }

  async function loadNamespaces() {
    if (!activeCluster.value) return
    namespaces.value = await namespacesApi.list(activeCluster.value)
  }

  async function setCluster(name: string) {
    activeCluster.value = name
    activeNamespace.value = '_all'
    persist()
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
