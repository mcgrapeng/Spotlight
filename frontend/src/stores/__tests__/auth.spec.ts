import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  authApi: {
    status: vi.fn(),
    login: vi.fn(),
  },
}))

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

  it('refreshStatus marks required when configured', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({
      configured: true, available: true, proxy: 'p:443', user: 'alice', cluster: 'pvg1',
    })
    const store = useAuthStore()
    await store.refreshStatus()
    expect(store.status?.proxy).toBe('p:443')
    expect(store.required).toBe(true)
  })

  it('refreshStatus does not require login when not configured', async () => {
    vi.mocked(authApi.status).mockResolvedValueOnce({
      configured: false, available: false, proxy: '', user: '', cluster: '',
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

  it('login success clears required flag', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: true, proxy: 'p', user: 'u', cluster: 'c', message: '',
    })
    const store = useAuthStore()
    store.required = true
    const ok = await store.login('hunter2')
    expect(ok).toBe(true)
    expect(store.required).toBe(false)
    expect(store.error).toBeNull()
  })

  it('login failure surfaces backend message', async () => {
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: false, proxy: '', user: '', cluster: '', message: 'wrong password',
    })
    const store = useAuthStore()
    const ok = await store.login('wrong')
    expect(ok).toBe(false)
    expect(store.error).toBe('wrong password')
  })

  it('login network error captures axios-style detail', async () => {
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: { data: { detail: 'bad gateway' } },
      message: 'Request failed',
    })
    const store = useAuthStore()
    const ok = await store.login('x')
    expect(ok).toBe(false)
    expect(store.error).toBe('bad gateway')
  })

  it('logout re-arms the gate', () => {
    const store = useAuthStore()
    store.required = false
    store.logout()
    expect(store.required).toBe(true)
  })
})