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
    // "全部" + WARN + ERROR + 未识别 — and NOT "≥ INFO": those three lines
    // are exactly the lines "≥ INFO" would show, so the chip would say the
    // same 3 as 全部 and the row would carry two controls for one thing.
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

  it('does not flash a whole backlog at once', async () => {
    // The reader scrolls away, the panel buffers the backlog, and coming
    // back prepends all of it in one go. That is not "an error just
    // arrived" — flashing every buffered error turns the panel into a
    // screenful of blinking red.
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    const backlog = Array.from({ length: 20 }, (_, i) => line('error', `backlog-${i}`))
    await wrapper.setProps({ lines: [...backlog, old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('animate-log-flash')
  })

  it('under reduced motion, tints the arriving error row statically instead of animating', async () => {
    // 全局的 `animation-duration: 0.01ms` 把 400ms 的闪光压成看不见 ——
    // 「新错误行到达」的反馈整个消失。减少动态效果要去掉运动，不能去掉
    // 状态：换成静态色块，窗口结束同样消失。
    const orig = window.matchMedia
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) =>
      q.includes('reduced-motion')
        ? ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as any)
        : orig.call(window, q),
    )
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    await wrapper.setProps({ lines: [line('error', 'fresh-error'), old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('animate-log-flash')
    expect(wrapper.html()).toContain('bg-error/25')
    vi.restoreAllMocks()
  })

  it('swaps to the static tint when the preference flips mid-flash', async () => {
    // v-memo 缓存的是 class —— 偏好在闪光窗口中途翻转时缓存必须失效，
    // 否则行上留着一个在 0.01ms 里跑完的死动画，反馈又没了。
    let onChange: ((e: { matches: boolean }) => void) | undefined
    const orig = window.matchMedia
    vi.spyOn(window, 'matchMedia').mockImplementation((q: string) =>
      q.includes('reduced-motion')
        ? ({
            matches: false,
            addEventListener: (_: string, cb: any) => { onChange = cb },
            removeEventListener: vi.fn(),
          } as any)
        : orig.call(window, q),
    )
    const old = line('info', 'old-1')
    const wrapper = mountViewer([old])
    await wrapper.setProps({ lines: [line('error', 'fresh-error'), old] })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('animate-log-flash')

    expect(onChange, '组件没挂 reduced-motion 的 change 监听').toBeTruthy()
    onChange!({ matches: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).not.toContain('animate-log-flash')
    expect(wrapper.html()).toContain('bg-error/25')
    vi.restoreAllMocks()
  })
})
