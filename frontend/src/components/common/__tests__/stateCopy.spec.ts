import { describe, expect, it } from 'vitest'
import { nextTick, type Component } from 'vue'
import { mount } from '@vue/test-utils'
import { getI18n } from '@/i18n'
import EmptyState from '../EmptyState.vue'
import ErrorState from '../ErrorState.vue'
import LoadingState from '../LoadingState.vue'

// Fallback copy now comes from the active locale, so every mount needs the i18n
// plugin. The singleton outlives each test — rewind so this is order-independent.
const i18n = getI18n()
function mountAs(component: Component, locale: 'zh-CN' | 'en-US', props: Record<string, unknown> = {}) {
  i18n.global.locale.value = locale
  return mount(component, { props, global: { plugins: [i18n] } })
}

describe('localized fallback copy', () => {
  it('renders the empty-state title from the locale message', () => {
    expect(mountAs(EmptyState, 'zh-CN').text()).toContain('暂无数据')
    expect(mountAs(EmptyState, 'en-US').text()).toContain('No data')
  })

  // Guards the one non-mechanical choice in this file: the fallback is a
  // computed, not a prop default. A prop default resolves once at instance
  // creation, so a mounted EmptyState would keep the old language.
  it('re-renders a mounted instance when the locale flips', async () => {
    const wrapper = mountAs(EmptyState, 'zh-CN')
    i18n.global.locale.value = 'en-US'
    await nextTick()
    expect(wrapper.text()).toContain('No data')
  })

  it('lets an explicit prop override the fallback', () => {
    const wrapper = mountAs(EmptyState, 'en-US', { title: '没有节点' })
    expect(wrapper.text()).toContain('没有节点')
    expect(wrapper.text()).not.toContain('No data')
  })

  it('labels the error state retry button in the active locale', async () => {
    const wrapper = mountAs(ErrorState, 'en-US')
    const retry = wrapper.findAll('button')[0]
    expect(retry.text()).toBe('Retry')
    expect(wrapper.text()).toContain('Failed to load')
    await retry.trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('renders the loading message from the locale message', () => {
    expect(mountAs(LoadingState, 'zh-CN').text()).toContain('加载中…')
    expect(mountAs(LoadingState, 'en-US').text()).toContain('Loading…')
  })
})
