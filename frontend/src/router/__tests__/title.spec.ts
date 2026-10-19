import { beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { getI18n } from '@/i18n'

// The guard resolves the server's auth posture before it decides anything,
// including on /login — LoginView renders its credential fields from that
// payload, so skipping it on public routes left the form with zero inputs.
vi.mock('@/api/endpoints', () => ({
  authApi: { status: vi.fn().mockResolvedValue({
    configured: false, provider: null,
    auth_required: false, client_session: true, session: null,
  }) },
}))

const { default: router } = await import('../index')

// Importing the router module installs the `afterEach` title hook and a
// module-scope `watch` on the locale singleton, so this file asserts against
// those side effects rather than re-implementing them.
const i18n = getI18n()

describe('router document title', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
  })

  async function gotoLogin(locale: 'zh-CN' | 'en-US') {
    i18n.global.locale.value = locale
    await router.push('/login')
  }

  it('renders the localized title and lang on navigation', async () => {
    await gotoLogin('zh-CN')
    expect(document.title).toBe('登录 · Spotlight')
    expect(document.documentElement.lang).toBe('zh-CN')
  })

  it('recomputes the title when the locale switches', async () => {
    await gotoLogin('zh-CN')
    i18n.global.locale.value = 'en-US'
    await nextTick()
    expect(document.title).toBe('Sign in · Spotlight')
    expect(document.documentElement.lang).toBe('en-US')
  })
})
