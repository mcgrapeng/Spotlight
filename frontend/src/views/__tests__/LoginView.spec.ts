import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  authApi: { status: vi.fn(), login: vi.fn() },
}))

const makeRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', name: 'login', component: { template: '<div/>' } },
    { path: '/dashboard', name: 'dashboard', component: { template: '<div/>' } },
    { path: '/pods', name: 'pods', component: { template: '<div/>' } },
  ],
})

/**
 * Mount the LoginView at /login with the supplied auth-store fixture.
 * Pre-populating `auth.status` lets us skip the network round-trip in
 * onMounted — we explicitly disable refreshStatus().
 */
async function mountLogin(opts: { path?: string; authStatus: any; authError?: string | null; loginResult?: boolean } = { authStatus: null }) {
  setActivePinia(createPinia())
  const auth = useAuthStore()
  // Mock the API before any code can call it.
  vi.mocked(authApi.status).mockResolvedValue(opts.authStatus)
  vi.mocked(authApi.login).mockResolvedValue({
    ok: opts.loginResult ?? true, proxy: 'p', user: 'u', cluster: 'c', message: '',
  })

  const router = makeRouter()
  await router.push(opts.path ?? '/login')
  await router.isReady()

  const wrapper = mount(LoginView, { global: { plugins: [router] } })
  await flushPromises()
  return { wrapper, router, auth }
}

describe('LoginView', () => {
  afterEach(() => { vi.restoreAllMocks() })

  it('renders the form with empty password by default', async () => {
    const { wrapper } = await mountLogin({
      authStatus: { configured: false, available: false, proxy: '', user: '', cluster: '' },
    })
    expect(wrapper.text()).toContain('K8s Viewer')
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('redirects to dashboard when server does not require login', async () => {
    const { router } = await mountLogin({
      authStatus: { configured: false, available: false, proxy: '', user: '', cluster: '' },
    })
    expect(router.currentRoute.value.name).toBe('dashboard')
  })

  it('blocks submit with empty password (no API call)', async () => {
    const { wrapper, router } = await mountLogin({
      authStatus: { configured: true, available: true, proxy: 'p:443', user: 'u', cluster: 'c' },
    })
    const submitBtn = wrapper.findAll('button').find((b) => b.text().includes('登录'))
    expect(submitBtn).toBeDefined()
    await submitBtn!.trigger('click')
    expect(authApi.login).not.toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('submits password via auth.login and navigates on success', async () => {
    const { wrapper, router, auth } = await mountLogin({
      authStatus: { configured: true, available: true, proxy: 'p', user: 'u', cluster: 'c' },
      loginResult: true,
    })
    vi.spyOn(auth, 'login').mockResolvedValue(true)
    const passwordInput = wrapper.find('input[type="password"]')
    await passwordInput.setValue('hunter2')

    const submitBtn = wrapper.findAll('button').find((b) => b.text().includes('登录'))
    await submitBtn!.trigger('click')
    await flushPromises()

    expect(auth.login).toHaveBeenCalledWith('hunter2')
    expect(router.currentRoute.value.path).toBe('/dashboard')
  })

  it('navigates to ?next on success', async () => {
    const { wrapper, router, auth } = await mountLogin({
      path: '/login?next=/pods',
      authStatus: { configured: true, available: true, proxy: 'p', user: 'u', cluster: 'c' },
    })
    vi.spyOn(auth, 'login').mockResolvedValue(true)
    await wrapper.find('input[type="password"]').setValue('hunter2')
    const submitBtn = wrapper.findAll('button').find((b) => b.text().includes('登录'))
    await submitBtn!.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/pods')
  })

  it('shows error banner when login fails', async () => {
    const { wrapper, auth } = await mountLogin({
      authStatus: { configured: true, available: true, proxy: 'p', user: 'u', cluster: 'c' },
    })
    // Use the real store login() (not spied) so the error state propagates.
    vi.mocked(authApi.login).mockResolvedValueOnce({
      ok: false, proxy: '', user: '', cluster: '', message: 'wrong password',
    })
    await wrapper.find('input[type="password"]').setValue('wrong')
    const submitBtn = wrapper.findAll('button').find((b) => b.text().includes('登录'))
    await submitBtn!.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('wrong password')
  })

  it('displays configured proxy in info-strip', async () => {
    const { wrapper } = await mountLogin({
      authStatus: { configured: true, available: true, proxy: 'gt.internal.zhiman.tech:443', user: 'zhangpeng', cluster: 'pvg1s1-cloud' },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('gt.internal.zhiman.tech:443')
    expect(wrapper.text()).toContain('zhangpeng')
    expect(wrapper.text()).toContain('pvg1s1-cloud')
  })
})