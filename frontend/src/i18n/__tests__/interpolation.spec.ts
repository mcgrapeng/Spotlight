import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { getI18n } from '@/i18n'

// The three views that need a styled value *inside* a sentence — LoginView's
// "已通过 <b>user</b> 验证身份", EventsView's namespace banner and
// AISettingsView's delete confirmation — use `<i18n-t>` rather than string
// concatenation, so the monospace/font styling survives translation. This pins
// the two things that would break silently: the slot lands inline (no stray
// whitespace, which the old hand-written markup relied on), and the whole node
// re-renders on a locale switch.
const Probe = defineComponent({
  template: `
    <i18n-t keypath="login.verifiedAs" tag="div">
      <template #user><span class="mono">{{ user }}</span></template>
    </i18n-t>`,
  setup() {
    return { user: 'alice' }
  },
})

function mountProbe() {
  const i18n = getI18n()
  i18n.global.locale.value = 'zh-CN'
  return mount(Probe, { global: { plugins: [i18n] } })
}

describe('<i18n-t> interpolation', () => {
  it('renders the slot inline with the original Chinese wording', () => {
    const w = mountProbe()
    expect(w.find('div').text()).toBe('已通过 alice 验证身份')
    expect(w.find('span.mono').exists()).toBe(true)
  })

  it('re-renders in English when the locale changes', async () => {
    const w = mountProbe()
    getI18n().global.locale.value = 'en-US'
    await w.vm.$nextTick()
    expect(w.find('div').text()).toBe('Authenticated as alice')
  })
})
