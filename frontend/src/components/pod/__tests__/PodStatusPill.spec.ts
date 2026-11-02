import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PodStatusPill from '../PodStatusPill.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  // The initial locale is resolved from the browser, and the test env
  // reports en-US. The bilingual label is asserted in Chinese, so pin it.
  i18n.global.locale.value = 'zh-CN'
})

function mountPill(phase: string) {
  return mount(PodStatusPill, {
    props: { phase },
    global: { plugins: [i18n] },
  })
}

describe('PodStatusPill', () => {
  it('renders Running with green dot', () => {
    const wrapper = mountPill('Running')
    // accessible name is the visible label — no role/aria-label override
    // (a live region per pill would spam screen readers in 100-row lists)
    // The label is bilingual: phase is a K8s API field value and kubectl
    // prints "Running", so the English half is the term the reader will
    // type into kubectl.
    expect(wrapper.text()).toContain('Running')
    expect(wrapper.text()).toContain('运行中')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
  it('renders Failed with red dot', () => {
    const wrapper = mountPill('Failed')
    expect(wrapper.find('.bg-error').exists()).toBe(true)
  })
  it('falls back to Unknown for a phase it does not know', () => {
    const wrapper = mountPill('SomethingNew')
    expect(wrapper.text()).toContain('Unknown')
  })
})
