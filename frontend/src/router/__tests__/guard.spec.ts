/**
 * The router guard must resolve the server's auth posture BEFORE deciding
 * anything — including on /login.
 *
 * Regression: `if (to.meta.public) return true` ran first, so a direct visit to
 * /login (bookmark, hard refresh, shared sign-in link) never populated
 * `auth.status`. LoginView renders its credential fields from that payload, so
 * the page showed a username box and a button, submitted an empty `fields`
 * object, and the server answered "wrong password" for a form with no password
 * field. Unrecoverable: every retry did the same thing.
 *
 * No e2e caught it, because every e2e reached /login the other way round — via
 * the guard bouncing off a protected page, which is exactly the path that used
 * to populate the store.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { authApi } from '@/api/endpoints'

const statusMock = vi.fn()
vi.mock('@/api/endpoints', () => ({
  authApi: { status: statusMock },
}))

const TELEPORT = {
  configured: true,
  provider: {
    id: 'teleport',
    label: 'Teleport',
    fields: [
      { name: 'password', label: '密码', type: 'password', required: true },
      { name: 'otp', label: 'MFA 一次性码', type: 'otp', required: false },
    ],
  },
  auth_required: true,
  client_session: false,
  session: null,
}

async function freshRouter() {
  vi.resetModules()
  const { default: router } = await import('@/router')
  const { useAuthStore } = await import('@/stores/auth')
  return { router, useAuthStore }
}

describe('router auth guard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    statusMock.mockReset()
  })

  it('fetches auth status when navigating straight to /login', async () => {
    statusMock.mockResolvedValue(TELEPORT)
    const { router, useAuthStore } = await freshRouter()

    await router.push('/login')

    // The bug: this call never happened on the public-route path.
    expect(statusMock).toHaveBeenCalledTimes(1)
    // And the store therefore carries the provider's field list, which is what
    // LoginView draws its inputs from.
    expect(useAuthStore().status?.provider?.fields).toHaveLength(2)
  })

  it('still bounces an unauthenticated user off a protected route', async () => {
    statusMock.mockResolvedValue(TELEPORT)
    const { router } = await freshRouter()

    await router.push('/pods')

    expect(router.currentRoute.value.name).toBe('login')
    expect(router.currentRoute.value.query.next).toBe('/pods')
  })

  it('lets a logged-in user through to a protected route', async () => {
    statusMock.mockResolvedValue({ ...TELEPORT, client_session: true })
    const { router } = await freshRouter()

    await router.push('/pods')

    expect(router.currentRoute.value.name).toBe('pods')
  })

  it('lets everything through in open mode', async () => {
    statusMock.mockResolvedValue({
      configured: false, provider: null,
      auth_required: false, client_session: false, session: null,
    })
    const { router } = await freshRouter()

    await router.push('/pods')

    expect(router.currentRoute.value.name).toBe('pods')
  })

  it('does not re-fetch status on every navigation', async () => {
    statusMock.mockResolvedValue(TELEPORT)
    const { router } = await freshRouter()

    await router.push('/login')
    await router.push('/nodes')
    await router.push('/events')

    expect(statusMock).toHaveBeenCalledTimes(1)
  })

  it('survives a status endpoint that is unreachable', async () => {
    statusMock.mockRejectedValue(new Error('network down'))
    const { router, useAuthStore } = await freshRouter()

    await expect(router.push('/login')).resolves.not.toThrow()
    // Failed open, matching the server's own is_open_mode() default.
    expect(useAuthStore().required).toBe(false)
  })
})
