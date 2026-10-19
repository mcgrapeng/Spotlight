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

  // Set when the server could not enumerate clusters (as opposed to finding
  // none). Kept separate from `pendingClusters` because the difference decides
  // whether the user may proceed at all.
  const clustersError = ref<string | null>(null)

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
    clustersError.value = null
    try {
      const r = await authApi.login(username, fields)
      if (r.ok) {
        pendingClusters.value = r.kube_clusters ?? []
        clustersError.value = r.clusters_error ?? null
        if (!pendingClusters.value.length && !clustersError.value) {
          // Token login (host-bound deployment) or Teleport with zero
          // accessible clusters — genuinely none, so no kube-cluster step.
          required.value = false
        }
        // else: required stays true until chooseCluster() lands. An
        // enumeration failure also stays here, so the guard keeps the user on
        // this page rather than letting them walk into the host kubeconfig.
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

  /** Re-ask the server which clusters this session can reach.
   *
   * The login response and this endpoint differ in how they fail: `/auth/login`
   * must not turn a listing error into a failed login, so it reports the
   * problem in the body, whereas `/auth/kube-clusters` propagates it as a real
   * HTTP status — which is what a retry wants.
   */
  async function retryClusters(): Promise<boolean> {
    busy.value = true
    clustersError.value = null
    try {
      const list = await authApi.kubeClusters()
      pendingClusters.value = list
      if (!list.length) {
        // This time we really do have none.
        required.value = false
      }
      return true
    } catch (e: any) {
      const d = e?.response?.data?.detail
      clustersError.value =
        typeof d === 'string' ? d : (d?.message ?? e?.message ?? t('login.clustersUnavailable'))
      return false
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
    clustersError.value = null
    error.value = null
    // The server drops the session, but every trace of the previous user's
    // selection and cached cluster data is still in this browser. Left in
    // place, the next person to log in inherits a cluster name their session
    // cannot resolve (409 on every page) and stale namespaces (wrong data,
    // no error). Clear both before the request goes out.
    status.value = null
    useClusterStore().reset()
    // Revoke the server session; ignore network errors (local state is
    // already cleared — the TTL will reap the cookie anyway).
    authApi.logout().catch(() => {})
  }

  return { status, required, busy, error,
           pendingClusters, clustersError,
           refreshStatus, requireLogin, login, retryClusters,
           chooseCluster, logout }
})