import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type AuthStatus, type LoginResult } from '@/api/endpoints'

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
      // "required" means "the user needs to log in". Login is needed when:
      //  - Teleport auth is configured on the server, AND
      //  - we don't have a working kubeconfig / tsh session yet.
      // Without the session check, a page refresh would bounce the user
      // back to /login even though they're already authenticated.
      required.value = status.value.configured && !status.value.session_valid
    } catch {
      status.value = null
      required.value = false
    }
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
        // required stays true until kubeLogin() lands
        return r
      }
      error.value = r.message || '登录失败'
      return null
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? '登录失败'
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
        // re-fetch /auth/status (which would set `required = configured`
        // and immediately bounce us back to /login).
        if (status.value === null) {
          status.value = {
            configured: true,
            available: true,
            proxy: '',
            user: '',
            cluster: '',
          }
        }
        return true
      }
      error.value = r.message || 'kube login 失败'
      return false
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? 'kube login 失败'
      return false
    } finally {
      busy.value = false
    }
  }

  function logout() {
    required.value = true
    pendingClusters.value = []
    pendingProxy.value = ''
  }

  return { status, required, busy, error,
           pendingClusters, pendingProxy,
           refreshStatus, login, kubeLogin, logout }
})