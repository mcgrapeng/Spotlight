import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PodStatusPill from '../PodStatusPill.vue'

describe('PodStatusPill', () => {
  it('renders Running with green dot', () => {
    const wrapper = mount(PodStatusPill, { props: { phase: 'Running' } })
    expect(wrapper.text()).toContain('Running')
    expect(wrapper.find('[role="status"]').attributes('aria-label')).toBe('Pod phase: Running')
  })
  it('renders Failed with red dot', () => {
    const wrapper = mount(PodStatusPill, { props: { phase: 'Failed' } })
    expect(wrapper.find('.bg-error').exists()).toBe(true)
  })
})