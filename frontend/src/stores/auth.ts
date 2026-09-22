import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type AuthStatus } from '@/api/endpoints'

/**
 * Auth store — controls the login screen for environments that route K8s
 * access through Teleport. On hosts where the backend already has a valid
 * kubeconfig (env KUBECONFIG or in-cluster), `auth/configured` will be false
 * and the store is essentially a no-op.
 */
export const useAuthStore = defineStore('auth', () => {
  const status = ref<AuthStatus | null>(null)
  const required = ref(false)        // server requires login
  const busy = ref(false)
  const error = ref<string | null>(null)

  async function refreshStatus() {
    try {
      status.value = await authApi.status()
      required.value = status.value.configured
    } catch {
      status.value = null
      required.value = false
    }
  }

  async function login(password: string) {
    busy.value = true
    error.value = null
    try {
      const r = await authApi.login(password)
      if (r.ok) {
        required.value = false
        return true
      }
      error.value = r.message || '登录失败'
      return false
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? '登录失败'
      return false
    } finally {
      busy.value = false
    }
  }

  function logout() {
    required.value = true
  }

  return { status, required, busy, error, refreshStatus, login, logout }
})