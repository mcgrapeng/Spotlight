import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/endpoints'

const CACHE_MS = 5 * 60_000

/**
 * Shared RBAC-probe store. Backend runs `kubectl auth can-i` for several
 * common resources (pods, nodes, namespaces, events, services, pv) once
 * per call; this store caches the result so dashboard / nodes / events
 * pages don't each fire their own probe.
 *
 * `nodesBlocked` / similar getters in views read this instead of running
 * their own probe — one HTTP request per cluster-switch instead of one
 * per page.
 */
export const usePermissionsStore = defineStore('permissions', () => {
  const rbac = ref<Record<string, boolean> | null>(null)
  const lastFetched = ref(0)

  async function refresh(force = false) {
    if (!force && rbac.value && Date.now() - lastFetched.value < CACHE_MS) return
    try {
      rbac.value = await authApi.permissions()
      lastFetched.value = Date.now()
    } catch {
      rbac.value = null
    }
  }

  function isBlocked(resource: string): boolean | null {
    if (!rbac.value) return null  // unknown / not yet probed
    return rbac.value[resource] === false
  }

  return { rbac, lastFetched, refresh, isBlocked }
})