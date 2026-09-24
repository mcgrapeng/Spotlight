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

  it('renders gradient variant with span wrapper', () => {
    const wrapper = mount(Button, {
      props: { variant: 'gradient' },
      slots: { default: 'AI' },
    })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.classes().join(' ')).toContain('gradient-glow-border')
  })
})