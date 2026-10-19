import axios from 'axios'

export const http = axios.create({
  baseURL: '/api/v1',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

http.interceptors.response.use(
  (r) => r,
  async (err) => {
    // Session expired / never established: bounce the app back to /login
    // on the next navigation (router guard reads `required`). Login
    // attempts themselves also answer 401 — leave those to the form.
    const url: string = err?.config?.url ?? ''
    if (err?.response?.status === 401 && !url.includes('/auth/login')) {
      const { useAuthStore } = await import('@/stores/auth')
      useAuthStore().requireLogin()
    }
    // 409 = the backend cannot find the context this session is asking for,
    // which almost always means the browser is holding a cluster name from a
    // previous login. Re-listing drops an unresolvable selection and picks a
    // real one, which changes `activeCluster` — and the pages watching it
    // reload themselves. Without this the 409 was a dead end: the detail said
    // "reselect" and nothing did.
    if (err?.response?.status === 409) {
      const { useClusterStore } = await import('@/stores/cluster')
      await useClusterStore().loadClusters().catch(() => {})
    }
    return Promise.reject(err)
  },
)
