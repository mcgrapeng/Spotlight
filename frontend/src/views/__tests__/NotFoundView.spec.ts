import { beforeEach, describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import NotFoundView from '../NotFoundView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  // The i18n singleton outlives each test; rewind for order independence.
  i18n.global.locale.value = 'zh-CN'
})

describe('NotFoundView', () => {
  it('renders the 404 message and a way back', () => {
    const wrapper = mount(NotFoundView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    expect(wrapper.text()).toContain('页面不存在')
    expect(wrapper.text()).toContain('回到总览')
  })
})
