import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LocaleSwitcher from '@/i18n/LocaleSwitcher.vue'
import { getI18n } from '@/i18n'

// `setLocale` writes through the `getI18n()` singleton, so the component and the
// switch must share one instance — exactly what `main.ts` installs. A locally
// created i18n here would leave `aria-pressed` bound to an instance that nothing
// ever mutates, and the click would silently not register.
function mountSwitcher() {
  const i18n = getI18n()
  // The singleton outlives each test; rewind so `mountSwitcher` is order-independent.
  i18n.global.locale.value = 'zh-CN'
  return mount(LocaleSwitcher, { global: { plugins: [i18n] } })
}

describe('LocaleSwitcher', () => {
  it('renders both language options', () => {
    const w = mountSwitcher()
    expect(w.text()).toContain('中文')
    expect(w.text()).toContain('EN')
  })

  it('marks the active language with aria-pressed', async () => {
    const w = mountSwitcher()
    const [zh, enBtn] = w.findAll('button')
    expect(zh.attributes('aria-pressed')).toBe('true')
    expect(enBtn.attributes('aria-pressed')).toBe('false')
    await enBtn.trigger('click')
    await w.vm.$nextTick()
    expect(w.findAll('button')[1].attributes('aria-pressed')).toBe('true')
  })

  it('exposes an accessible name on the group', () => {
    const w = mountSwitcher()
    expect(w.find('[role="group"]').attributes('aria-label')).toBeTruthy()
  })
})
