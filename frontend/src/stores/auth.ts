import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type AuthStatus, type LoginResult } from '@/api/endpoints'
import { useClusterStore } from './cluster'

/**
 * Auth store — controls the login screen for environments that route K8s
 * access through Teleport. The store now reflects a two-step flow:
 *
 *   step 1: login(password, otp)        — auth only; returns kube clusters
 *   step 2: kubeLogin(cluster)          — fetch kube creds for one cluster
 *
 * `required` only flips to false after BOTH steps succeed.
 */
export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus | null>(null)
  const required = ref(false)        // server requires login
  const busy = ref(false)
  const error = ref<string | null>(null)

  // Set after login() succeeds, before kubeLogin() runs. Cleared once
  // kubeLogin() lands (or fails terminally). UI uses this to show the
  // cluster dropdown.
  const pendingClusters = ref<string[]>([])
  const pendingProxy = ref<string>('')

  async function refreshStatus() {
    try {
      status.value = await authApi.status()
      // "required" means "this browser must log in". The server demands a
      // session (Teleport and/or API_TOKEN configured) and this caller
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

  /** Step 1: `tsh login`. Returns the LoginResult so the caller can decide
   *  what to do next (typically render the cluster dropdown). */
  async function login(password: string, otp = ''): Promise<LoginResult | null> {
    busy.value = true
    error.value = null
    try {
      const r = await authApi.login(password, otp)
      if (r.ok) {
        pendingClusters.value = r.kube_clusters ?? []
        pendingProxy.value = r.proxy
        if (!pendingClusters.value.length) {
          // Token login (host-bound deployment): no kube-cluster step.
          required.value = false
        }
        // else: required stays true until kubeLogin() lands
        return r
      }
      error.value = r.message || '登录失败'
      return null
    } catch (e: any) {
      // detail is either a plain string or {code, message} (mfa_required).
      const d = e?.response?.data?.detail
      error.value = typeof d === 'string' ? d : (d?.message ?? e?.message ?? '登录失败')
      return null
    } finally {
      busy.value = false
    }
  }

  /** Step 2: `tsh kube login <cluster>`. */
  async function kubeLogin(cluster: string): Promise<boolean> {
    busy.value = true
    error.value = null
    try {
      const r = await authApi.kubeLogin(cluster)
      if (r.ok) {
        required.value = false
        pendingClusters.value = []
        // Mark status as known so the router's beforeEach guard doesn't
        // re-fetch /auth/status (which would set `required = auth_required`
        // and immediately bounce us back to /login).
        if (status.value === null) {
          status.value = {
            configured: true,
            available: true,
            proxy: '',
            user: '',
            cluster: '',
            session_valid: true,
            auth_required: true,
            client_session: true,
          }
        }
        // Ponytail: 同步全局 cluster 选中态,否则 LoginView 选完集群跳走
        // 后,UI 顶部的 ClusterCombobox 还是空的(namespace 选不到、PodListView
        // 拿不到 activeCluster)。setCluster 内部会触发 namespaces 重 fetch。
        useClusterStore().setCluster(cluster)
        return true
      }
      error.value = r.message || 'kube login 失败'
      return false
    } catch (e: any) {
      const d = e?.response?.data?.detail
      error.value = typeof d === 'string' ? d : (d?.message ?? e?.message ?? 'kube login 失败')
      return false
    } finally {
      busy.value = false
    }
  }

  function logout() {
    required.value = true
    pendingClusters.value = []
    pendingProxy.value = ''
    // Revoke the server session; ignore network errors (local state is
    // already cleared — the TTL will reap the cookie anyway).
    authApi.logout().catch(() => {})
  }

  return { status, required, busy, error,
           pendingClusters, pendingProxy,
           refreshStatus, requireLogin, login, kubeLogin, logout }
})