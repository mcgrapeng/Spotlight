import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  authApi: {
    status: vi.fn(),
    login: vi.fn(),
    chooseCluster: vi.fn(),
    logout: vi.fn(),
  },
}))

/** Teleport-shaped status: password + optional otp fields. */
const baseStatus = {
  configured: true,
  provider: {
    id: 'teleport',
    label: 'Teleport',
    fields: [
      { name: 'password', label: '密码', type: 'password', required: true },
      { name: 'otp', label: 'MFA 一次性码（6 位 TOTP）', type: 'otp', required: false },
    ],
  },
  auth_required: true,
  client_session: false,
  session: null,
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
    expect(store.status?.provider?.id).toBe('teleport')
    expect(store.status?.provider?.fields.map((f) => f.name)).toEqual(['password', 'otp'])
    expect(store.required).toBe(true)
  })

  it('refreshStatus skips login when this client already holds a session', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({
      ...baseStatus,
      client_session: true,
      session: { username: 'alice' },
    })
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.required).toBe(false)
  })

  it('refreshStatus does not require login when server is open', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({
      ...baseStatus, configured: false, provider: null, auth_required: false, client_session: false,
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

  it('login posts {username, fields} and keeps the gate armed until chooseCluster lands', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: true, kube_clusters: ['c1', 'c2'], message: '',
    })
    const store = useAuthStore()
    store.required = true
    const r = await store.login('alice', { password: 'hunter2', otp: '' })
    expect(authApi.login).toHaveBeenCalledWith('alice', { password: 'hunter2', otp: '' })
    expect(r?.kube_clusters).toEqual(['c1', 'c2'])
    expect(store.pendingClusters).toEqual(['c1', 'c2'])
    expect(store.required).toBe(true)
  })

  it('token login (no kube clusters) completes immediately', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: true, kube_clusters: [], message: 'ok',
    })
    const store = useAuthStore()
    store.required = true
    const r = await store.login('svc', { token: 's3cret' })
    expect(authApi.login).toHaveBeenCalledWith('svc', { token: 's3cret' })
    expect(r).not.toBeNull()
    expect(store.required).toBe(false)
    expect(store.error).toBeNull()
  })

  it('login failure surfaces backend message', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: false, kube_clusters: [], message: 'wrong password',
    })
    const store = useAuthStore()
    const r = await store.login('alice', { password: 'wrong', otp: '' })
    expect(r).toBeNull()
    expect(store.error).toBe('wrong password')
  })

  it('login network error captures axios-style string detail', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: { data: { detail: 'bad gateway' } },
      message: 'Request failed',
    })
    const store = useAuthStore()
    const r = await store.login('alice', { password: 'x', otp: '' })
    expect(r).toBeNull()
    expect(store.error).toBe('bad gateway')
  })

  it('login network error unwraps dict detail (mfa_required)', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: { data: { detail: { code: 'mfa_required', message: '需要 MFA 一次性码' } } },
      message: 'Request failed with status code 401',
    })
    const store = useAuthStore()
    const r = await store.login('alice', { password: 'x', otp: '' })
    expect(r).toBeNull()
    expect(store.error).toBe('需要 MFA 一次性码')
  })

  it('chooseCluster posts {cluster} and clears required', async () => {
    vi.mocked(authApi.chooseCluster).mockResolvedValueOnce({
      ok: true, cluster: 'c1', context: 'c1',
    })
    const store = useAuthStore()
    store.required = true
    store.pendingClusters = ['c1', 'c2']
    const ok = await store.chooseCluster('c1')
    expect(authApi.chooseCluster).toHaveBeenCalledWith('c1')
    expect(ok).toBe(true)
    expect(store.required).toBe(false)
    expect(store.pendingClusters).toEqual([])
    expect(store.error).toBeNull()
  })

  it('chooseCluster failure surfaces dict detail', async () => {
    vi.mocked(authApi.chooseCluster).mockRejectedValueOnce({
      response: { data: { detail: { code: 'unavailable', message: 'kubeconfig 写入失败' } } },
      message: 'Request failed',
    })
    const store = useAuthStore()
    store.required = true
    const ok = await store.chooseCluster('c1')
    expect(ok).toBe(false)
    expect(store.error).toBe('kubeconfig 写入失败')
    // gate stays armed so user can retry
    expect(store.required).toBe(true)
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