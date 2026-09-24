import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../StatCard.vue'

describe('StatCard', () => {
  it('renders label, value, and hint', () => {
    const wrapper = mount(StatCard, {
      props: { label: '集群健康度', value: '94%', hint: 'Node 3/3' },
    })
    expect(wrapper.text()).toContain('集群健康度')
    expect(wrapper.text()).toContain('94%')
    expect(wrapper.text()).toContain('Node 3/3')
  })

  it('hides hint when not provided', () => {
    const wrapper = mount(StatCard, {
      props: { label: 'Pods', value: 288 },
    })
    expect(wrapper.text()).toContain('288')
    expect(wrapper.text()).not.toContain('Node')
  })

  it('accepts numeric values', () => {
    const wrapper = mount(StatCard, {
      props: { label: 'Pods', value: 288 },
    })
    expect(wrapper.text()).toContain('288')
  })
})