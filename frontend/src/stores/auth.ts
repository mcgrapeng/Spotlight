import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type AuthStatus, type LoginResult } from '@/api/endpoints'
import { getI18n } from '@/i18n'
import { useClusterStore } from './cluster'

// A Pinia setup store runs outside any component instance, so `useI18n()` is
// unavailable here — the global composer is the only safe accessor, same as in
// `router/index.ts`. Resolved lazily per call so it always reads the live locale.
const t = (key: string) => getI18n().global.t(key)

/**
 * Auth store — drives the login screen for environments that route K8s
 * access through an AuthPlugin (token / teleport / …).
 *
 *   step 1: login(username, fields)   — plugin-backed auth + create session
 *   step 2: chooseCluster(cluster)    — write per-session kubeconfig
 *
 * `required` only flips to false after BOTH steps succeed.
 */
export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus | null>(null)
  const required = ref(false)        // server requires login
  const busy = ref(false)
  const error = ref<string | null>(null)

  // Set after login() succeeds, before chooseCluster() runs. Cleared once
  // chooseCluster() lands (or fails terminally). UI uses this to show the
  // cluster dropdown.
  const pendingClusters = ref<string[]>([])

  async function refreshStatus() {
    try {
      status.value = await authApi.status()
      // "required" means "this browser must log in". The server demands a
      // session (plugin and/or API_TOKEN configured) and this caller
      // doesn't hold one yet.
      required.value = status.value.auth_required && !status.value.client_session
    } catch {
      status.value = null
      required.value = false
    }
  }

  /** Called by the HTTP layer on 401 — session gone mid-flight. */
  function requireLogin() {
    required.value = true
  }

  /** Step 1: plugin.login → create_session + cookie. Returns LoginResult so
   *  the caller can decide what to do next (auto-connect, show cluster
   *  dropdown, redirect). */
  async function login(username: string, fields: Record<string, string>): Promise<LoginResult | null> {
    busy.value = true
    error.value = null
    try {
      const r = await authApi.login(username, fields)
      if (r.ok) {
        pendingClusters.value = r.kube_clusters ?? []
        if (!pendingClusters.value.length) {
          // Token login (host-bound deployment) or Teleport with zero
          // accessible clusters — no kube-cluster step needed.
          required.value = false
        }
        // else: required stays true until chooseCluster() lands
        return r
      }
      error.value = r.message || t('login.failed')
      return null
    } catch (e: any) {
      // detail is either a plain string or {code, message} (mfa_required
      // / invalid_credentials / bad_otp / unavailable).
      const d = e?.response?.data?.detail
      error.value = typeof d === 'string' ? d : (d?.message ?? e?.message ?? t('login.failed'))
      return null
    } finally {
      busy.value = false
    }
  }

  /** Step 2: plugin.acquire → write session kubeconfig + drop pool. */
  async function chooseCluster(cluster: string): Promise<boolean> {
    busy.value = true
    error.value = null
    try {
      const r = await authApi.chooseCluster(cluster)
      if (r.ok) {
        required.value = false
        pendingClusters.value = []
        // Mark status as known so the router's beforeEach guard doesn't
        // re-fetch /auth/status (which would set `required = auth_required`
        // and immediately bounce us back to /login).
        if (status.value === null) {
          status.value = {
            configured: true,
            provider: null,
            auth_required: true,
            client_session: true,
            session: null,
          }
        }
        // Ponytail: 同步全局 cluster 选中态,否则 LoginView 选完集群跳走
        // 后,UI 顶部的 ClusterCombobox 还是空的(namespace 选不到、
        // PodListView 拿不到 activeCluster)。setCluster 内部会触发
        // namespaces 重 fetch。
        useClusterStore().setCluster(r.cluster)
        return true
      }
      error.value = t('login.clusterFailed')
      return false
    } catch (e: any) {
      const d = e?.response?.data?.detail
      error.value = typeof d === 'string' ? d : (d?.message ?? e?.message ?? t('login.clusterFailed'))
      return false
    } finally {
      busy.value = false
    }
  }

  function logout() {
    required.value = true
    pendingClusters.value = []
    // Revoke the server session; ignore network errors (local state is
    // already cleared — the TTL will reap the cookie anyway).
    authApi.logout().catch(() => {})
  }

  return { status, required, busy, error,
           pendingClusters,
           refreshStatus, requireLogin, login, chooseCluster, logout }
})