import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import router from '../index'
import { getI18n } from '@/i18n'

// Importing the router module installs the `afterEach` title hook and a
// module-scope `watch` on the locale singleton, so this file asserts against
// those side effects rather than re-implementing them.
const i18n = getI18n()

describe('router document title', () => {
  // `/login` is the only `meta.public` route, so the auth guard returns before
  // touching Pinia and this spec needs no store.
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
