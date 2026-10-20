import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '../button'

describe('Button', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders the slot content without a wrapper element', () => {
    const wrapper = mount(Button, {
      slots: { default: 'AI' },
    })
    expect(wrapper.find('span').exists()).toBe(false)
    expect(wrapper.text()).toBe('AI')
  })

  it('exposes exactly three button heights', () => {
    // ponytail: 高度收成 28 / 36 / 40 三档（xs / sm / default）。
    // 之前是 24 / 28 / 36 / 40 / 44 五种，44 那档全站没有一处调用。
    const heights = ['h-7', 'h-9', 'h-10']
    for (const size of ['xs', 'sm', 'default'] as const) {
      const wrapper = mount(Button, { props: { size }, slots: { default: 'x' } })
      expect(heights.some((h) => wrapper.classes().includes(h))).toBe(true)
    }
  })
})