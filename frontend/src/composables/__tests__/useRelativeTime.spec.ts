import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { getI18n } from '@/i18n'

// Relative time has to move on its own. It used to be computed at render
// time from Date.now(), which is not reactive: a page nobody touched kept
// saying "更新于 几秒前" forever, and the event list's "3 小时前" never
// became "4 小时前". The clock the app shows has to be a clock.
//
// The heartbeat is module-level (one timer for the whole app), so every
// test resets the module registry and imports it fresh — otherwise the
// first test's interval leaks into the next one and vitest's fake timers
// stop seeing it.
//
// Date is faked explicitly: the repo's default fake-timer setup does not
// replace it, and without a clock this test would be asserting on real
// wall time.
const i18n = getI18n()

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
  vi.setSystemTime(new Date('2026-10-21T10:00:00Z'))
  i18n.global.locale.value = 'zh-CN'
})

afterEach(() => {
  vi.useRealTimers()
})

async function mountProbe() {
  vi.resetModules()
  const { useRelativeTime } = await import('../useRelativeTime')
  const Probe = defineComponent({
    setup() {
      const { formatRel } = useRelativeTime()
      const iso = new Date().toISOString()
      return () => h('span', formatRel(iso))
    },
  })
  return mount(Probe, { global: { plugins: [i18n] } })
}

describe('useRelativeTime', () => {
  it('re-renders on its own as the clock moves', async () => {
    const wrapper = await mountProbe()
    expect(wrapper.text()).toBe('几秒前')

    // 61s: the heartbeat fires every 30s, and the memo bucket turns over
    // every 60s — a value only changes once it crosses a minute.
    await vi.advanceTimersByTimeAsync(61_000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toBe('1 分钟前')
  })

  it('keeps the same wording inside one minute', async () => {
    const wrapper = await mountProbe()
    const before = wrapper.text()
    await vi.advanceTimersByTimeAsync(20_000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe(before)
  })

  it('stops its heartbeat when the last user goes away', async () => {
    const wrapper = await mountProbe()
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
