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
    return Promise.reject(err)
  },
)
