import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PodStatusPill from '../PodStatusPill.vue'

describe('PodStatusPill', () => {
  it('renders Running with green dot', () => {
    const wrapper = mount(PodStatusPill, { props: { phase: 'Running' } })
    // accessible name is the visible label — no role/aria-label override
    // (a live region per pill would spam screen readers in 100-row lists)
    expect(wrapper.text()).toContain('Running')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })
  it('renders Failed with red dot', () => {
    const wrapper = mount(PodStatusPill, { props: { phase: 'Failed' } })
    expect(wrapper.find('.bg-error').exists()).toBe(true)
  })
})