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

  it('does not force a size on the icons inside it', () => {
    // ponytail: base 里原来有 `[&_svg]:size-4`。CSS 规则压过 SVG 的
    // width/height 属性，于是 35 处按钮内图标显式写的 :size="13" / "14"
    // 全部无效，实际渲染 16px —— 日志工具栏那排 13px 图标在 28px 高的
    // 按钮里显得笨重。尺寸由图标自己决定，按钮不越权。
    const wrapper = mount(Button, { slots: { default: 'x' } })
    expect(wrapper.classes().join(' ')).not.toContain('svg]:size-4')
  })

  it('renders the icon slot', () => {
    const wrapper = mount(Button, {
      slots: { icon: '<span class="ico" />', default: 'Refresh' },
    })
    expect(wrapper.find('.ico').exists()).toBe(true)
  })

  it('swaps the icon for a spinner and marks itself busy while loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { icon: '<span class="ico" />', default: 'Refresh' },
    })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.ico').exists()).toBe(false)
    expect(wrapper.find('.animate-spin').exists()).toBe(true)
  })
})
