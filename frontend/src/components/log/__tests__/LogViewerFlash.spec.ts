import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LogViewer from '../LogViewer.vue'
import type { LogLineOut } from '@/api/types'
import { getI18n } from '@/i18n'

const i18n = getI18n()

function line(severity: string, content: string): LogLineOut {
  return {
    timestamp: '2026-01-01T00:00:00Z',
    severity,
    container: 'main',
    content,
  }
}

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.useRealTimers()
})

function mountViewer(lines: LogLineOut[]) {
  return mount(LogViewer, {
    props: { lines, unreadCount: 0 },
    global: { plugins: [i18n] },
  })
}

describe('LogViewer severity filter icons', () => {
  it('draws the severity chips with real icons, not ASCII glyphs', () => {
    const wrapper = mountViewer([line('error', 'boom'), line('warn', 'meh'), line('info', 'ok')])
    const chips = wrapper.findAll('button[aria-pressed]')
    // "全部" + INFO + WARN + ERROR
    expect(chips.length).toBe(4)
    // The ASCII stand-ins were `i`, `!` and `▲` rendered as monospace text.
    // A Lucide icon is an <svg>; a glyph is a text node.
    for (const chip of chips) {
      expect(chip.find('svg').exists()).toBe(true)
    }
    expect(chips.map((c) => c.text()).join('|')).not.toContain('▲')
  })
})

describe('LogViewer arrival flash', () => {
  it('flashes a row when a new error line arrives', async () => {
    // The SSE layer prepends the new batch and keeps the old line objects,
    // so the flash detection keys off object identity — the test has to
    // model that, not rebuild the history.
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    await wrapper.setProps({ lines: [line('error', 'fresh-error'), old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('animate-log-flash')
  })

  it('does not flash a row for a new info line', async () => {
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    await wrapper.setProps({ lines: [line('info', 'fresh-info'), old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('animate-log-flash')
  })

  it('stops flashing after the flash window', async () => {
    vi.useFakeTimers()
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    await wrapper.setProps({ lines: [line('error', 'fresh-error'), old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('animate-log-flash')
    vi.advanceTimersByTime(600)
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('animate-log-flash')
    vi.useRealTimers()
  })
})
