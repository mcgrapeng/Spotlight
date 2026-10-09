import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  authApi: {
    status: vi.fn(),
    login: vi.fn(),
    kubeLogin: vi.fn(),
    logout: vi.fn(),
  },
}))

const baseStatus = {
  configured: true, available: true, proxy: 'p:443', user: 'alice', cluster: 'pvg1',
  session_valid: true, auth_required: true, client_session: false,
}

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts unrequired and empty', () => {
    const store = useAuthStore()
    expect(store.required).toBe(false)
    expect(store.status).toBeNull()
    expect(store.busy).toBe(false)
  })

  it('refreshStatus marks required when auth demanded but no client session', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce(baseStatus)
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.status?.proxy).toBe('p:443')
    expect(store.required).toBe(true)
  })

  it('refreshStatus skips login when this client already holds a session', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({ ...baseStatus, client_session: true })
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.required).toBe(false)
  })

  it('refreshStatus does not require login when server is open', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({
      ...baseStatus, configured: false, auth_required: false, client_session: false,
    })
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.required).toBe(false)
  })

  it('refreshStatus swallows network errors gracefully', async () => {
    vi.mocked(authApi.status).mockRejectedValueOnce(new Error('network'))
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.status).toBeNull()
    expect(store.required).toBe(false)
  })

  it('token login (no kube clusters) completes immediately', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: true, proxy: '', user: '', cluster: '', kube_clusters: [], message: 'ok',
    })
    const store = useAuthStore()
    store.required = true
    const r = await store.login('s3cret')
    expect(r).not.toBeNull()
    expect(store.required).toBe(false)
    expect(store.error).toBeNull()
  })

  it('teleport login keeps the gate armed until kubeLogin lands', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: true, proxy: 'p', user: 'u', cluster: 'c', kube_clusters: ['c1', 'c2'], message: '',
    })
    const store = useAuthStore()
    store.required = true
    const r = await store.login('hunter2')
    expect(r?.kube_clusters).toEqual(['c1', 'c2'])
    expect(store.pendingClusters).toEqual(['c1', 'c2'])
    expect(store.required).toBe(true)
  })

  it('login failure surfaces backend message', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: false, proxy: '', user: '', cluster: '', kube_clusters: [], message: 'wrong password',
    })
    const store = useAuthStore()
    const r = await store.login('wrong')
    expect(r).toBeNull()
    expect(store.error).toBe('wrong password')
  })

  it('login network error captures axios-style detail', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: { data: { detail: 'bad gateway' } },
      message: 'Request failed',
    })
    const store = useAuthStore()
    const r = await store.login('x')
    expect(r).toBeNull()
    expect(store.error).toBe('bad gateway')
  })

  it('logout re-arms the gate and revokes the server session', () => {
    vi.mocked(authApi.logout).mockResolvedValueOnce({ ok: true })
    const store = useAuthStore()
    store.required = false
    store.logout()
    expect(store.required).toBe(true)
    expect(authApi.logout).toHaveBeenCalledOnce()
  })
})
