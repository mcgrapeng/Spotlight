/**
 * Login page regressions.
 *
 * Both bugs here were invisible to e2e because every e2e reached /login via
 * the router guard bouncing off a protected page — the exact path that used to
 * populate `auth.status`.
 */
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import LoginView from '@/views/LoginView.vue'
import { authApi } from '@/api/endpoints'
import { useAuthStore } from '@/stores/auth'
import { getI18n } from '@/i18n'

vi.mock('@/api/endpoints', () => ({
  authApi: {
    status: vi.fn(),
    login: vi.fn(),
    chooseCluster: vi.fn(),
    kubeClusters: vi.fn(),
    logout: vi.fn().mockResolvedValue({ ok: true }),
  },
}))

// `next` is read off the route, so the two redirect tests need to vary it.
// A mutable object behind a plain mock keeps the route read reactive.
const routeQuery: { next?: string } = {}
const routerReplace = vi.fn()
vi.mock('vue-router', () => ({
  useRoute: () => ({ query: routeQuery }),
  useRouter: () => ({ replace: routerReplace }),
}))

const teleportStatus = {
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

async function mountLogin(pinia: Pinia) {
  const wrapper = mount(LoginView, {
    global: { plugins: [pinia, getI18n()] },
  })
  await flushPromises()
  return wrapper
}

describe('LoginView', () => {
  let pinia: Pinia

  beforeEach(() => {
    // One instance for both the store the test primes and the component the
    // test mounts — two Pinia instances means the component reads a store the
    // test never wrote to.
    pinia = createPinia()
    setActivePinia(pinia)
    // The i18n singleton resolves from navigator.language, which is en-US under
    // happy-dom. Pin it so the assertions below describe one known locale.
    getI18n().global.locale.value = 'zh-CN'
    routerReplace.mockClear()
    delete routeQuery.next
    vi.clearAllMocks()
    vi.mocked(authApi.logout).mockResolvedValue({ ok: true })
  })

  it('renders the provider credential fields', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    // The username input plus one per provider field.
    const inputs = wrapper.findAll('input')
    const ids = inputs.map((i) => i.attributes('id')).filter(Boolean)
    expect(ids).toContain('login-user')
    expect(ids).toContain('login-password')
    expect(ids).toContain('login-otp')
  })

  it('renders exactly one field for the token plugin', async () => {
    vi.mocked(authApi.status).mockResolvedValue({
      configured: true,
      provider: {
        id: 'token', label: '访问令牌',
        fields: [{ name: 'token', label: '访问令牌', type: 'password', required: true }],
      },
      auth_required: true, client_session: false, session: null,
    } as any)
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    const ids = wrapper.findAll('input').map((i) => i.attributes('id')).filter(Boolean)
    expect(ids).toContain('login-token')
    expect(ids).not.toContain('login-password')
  })

  it('explains the bearer-only mode instead of showing a dead form', async () => {
    // API_TOKEN set but no plugin: there is nothing to type, and submitting
    // used to POST an empty fields object for a 503.
    vi.mocked(authApi.status).mockResolvedValue({
      configured: false, provider: null,
      auth_required: true, client_session: false, session: null,
    } as any)
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    expect(wrapper.text()).toContain('Authorization')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('sends only the fields the provider asked for', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({
      ok: true, kube_clusters: [], message: 'ok', clusters_error: null,
    })
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(authApi.login).toHaveBeenCalledWith('alice', {
      password: 'secret',
      otp: '',          // optional field still sent as an explicit empty string
    })
  })

  it('stays put and offers a retry when cluster enumeration fails', async () => {
    // An empty `kube_clusters` plus `clusters_error` means "we could not ask".
    // Walking through would land the user on the server's own kubeconfig — the
    // admin cluster — while they think it is theirs.
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({
      ok: true, kube_clusters: [], message: 'ok', clusters_error: 'tsh kube ls 失败',
    } as any)
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(routerReplace).not.toHaveBeenCalled()          // did not walk in
    expect(wrapper.text()).toContain('tsh kube ls')
    expect(wrapper.text()).toContain('重试')
    expect(auth.required).toBe(true)                     // guard still armed
  })

  it('proceeds normally when there are genuinely zero clusters', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({
      ok: true, kube_clusters: [], message: 'ok', clusters_error: null,
    } as any)
    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(routerReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('retry recovers and shows the cluster picker', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({
      ok: true, kube_clusters: [], message: 'ok', clusters_error: 'boom',
    } as any)
    vi.mocked(authApi.kubeClusters).mockResolvedValue(['prod-east', 'staging-eu'] as any)

    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)
    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const retry = wrapper.findAll('button').find((b) => b.text().includes('重试'))
    expect(retry).toBeTruthy()
    await retry!.trigger('click')
    await flushPromises()

    expect(auth.clustersError).toBeNull()
    expect(auth.pendingClusters).toEqual(['prod-east', 'staging-eu'])
    expect(wrapper.find('#login-cluster').exists()).toBe(true)
  })

  it('retry that fails again keeps the error visible', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({
      ok: true, kube_clusters: [], message: 'ok', clusters_error: 'boom',
    } as any)
    vi.mocked(authApi.kubeClusters).mockRejectedValue(
      { response: { data: { detail: { message: 'still down' } } } } as any,
    )

    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)
    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    const retry = wrapper.findAll('button').find((b) => b.text().includes('重试'))
    await retry!.trigger('click')
    await flushPromises()

    expect(auth.clustersError).toBe('still down')
    expect(routerReplace).not.toHaveBeenCalled()
  })

  it('ignores a protocol-relative next parameter', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({ ok: true, kube_clusters: [], message: "ok", clusters_error: null })
    routeQuery.next = '//evil.com'

    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(routerReplace).toHaveBeenCalledWith('/dashboard')
  })

  it('honours a same-origin next path', async () => {
    vi.mocked(authApi.status).mockResolvedValue(teleportStatus as any)
    vi.mocked(authApi.login).mockResolvedValue({ ok: true, kube_clusters: [], message: "ok", clusters_error: null })
    routeQuery.next = '/pods'

    const auth = useAuthStore()
    await auth.refreshStatus()
    const wrapper = await mountLogin(pinia)

    await wrapper.find('#login-user').setValue('alice')
    await wrapper.find('#login-password').setValue('secret')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(routerReplace).toHaveBeenCalledWith('/pods')
  })
})
