import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LogViewer from '../LogViewer.vue'
import type { LogLineOut } from '@/api/types'

function line(severity: LogLineOut['severity'], content = `msg-${severity}`, container = 'main'): LogLineOut {
  return {
    timestamp: '2026-01-01T00:00:00Z',
    severity,
    container,
    content,
  }
}

function makeLines(n: number): LogLineOut[] {
  const sevs: LogLineOut['severity'][] = ['info', 'warn', 'error', 'debug']
  return Array.from({ length: n }, (_, i) => line(sevs[i % sevs.length]!, `m-${i}`))
}

describe('LogViewer', () => {
  it('renders 4 severity chip buckets (ERROR/WARN/INFO/DEBUG)', () => {
    const wrapper = mount(LogViewer, {
      props: { lines: makeLines(20), unreadCount: 0 },
    })
    const chips = wrapper.findAll('button[aria-pressed]')
    // "全部" + 4 buckets = 5
    expect(chips.length).toBeGreaterThanOrEqual(5)
    const labels = chips.map((c) => c.text().toLowerCase()).join('|')
    expect(labels).toMatch(/error/)
    expect(labels).toMatch(/warn/)
    expect(labels).toMatch(/info/)
    expect(labels).toMatch(/debug/)
  })

  it('hides the unread pill when unreadCount is 0', () => {
    const wrapper = mount(LogViewer, {
      props: { lines: makeLines(5), unreadCount: 0 },
    })
    expect(wrapper.text()).not.toContain('跳转')
  })

  it('renders ANSI-colored content as spans (pod-supplied colors preserved)', () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: [line('error', '\x1b[31mboom\x1b[0m rest')],
        unreadCount: 0,
      },
    })
    // The row content should include a span wrapping "boom" with red class
    const html = wrapper.html()
    expect(html).toContain('class="text-red-500"')
    expect(html).toContain('boom')
    // Plain text content is also present, escapes are dropped
    expect(html).toContain(' rest')
  })

  it('emits consume-unread when the user clicks the auto-follow toggle (off → on)', async () => {
    const wrapper = mount(LogViewer, {
      props: { lines: makeLines(5), unreadCount: 3 },
    })
    // First click: autoFollow is true → flips to false (no emit, the user is
    // opting out of follow).
    const toggleBtn = wrapper.findAll('button').find((b) =>
      b.attributes('aria-label')?.includes('自动跟随'),
    )
    expect(toggleBtn).toBeTruthy()
    await toggleBtn!.trigger('click')
    expect(wrapper.emitted('consume-unread')).toBeUndefined()
    // Second click: autoFollow is false → flips to true, emit consume-unread.
    await toggleBtn!.trigger('click')
    expect(wrapper.emitted('consume-unread')).toBeTruthy()
  })

  it('keeps all public emits / props intact', () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: makeLines(3),
        streaming: true,
        unreadCount: 0,
        containers: ['a', 'b'],
      },
    })
    // component emits (declared) — we just verify no thrown error with the full
    // prop shape; if props drift the test catches type errors at compile time.
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.props('streaming')).toBe(true)
    expect(wrapper.props('containers')).toEqual(['a', 'b'])
  })

  it('paints per-severity row tint + 3px left bar (fatal/error/warn/info/debug)', () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: [
          line('critical', 'c'),
          line('error', 'e'),
          line('warn', 'w'),
          line('info', 'i'),
          line('debug', 'd'),
        ],
        unreadCount: 0,
      },
    })
    // Each row is the first-level div with the 88/72/1fr grid template
    const rows = wrapper.findAll('div.grid.grid-cols-\\[88px_72px_1fr\\]')
    expect(rows.length).toBeGreaterThanOrEqual(5)
    const classOf = (i: number) => rows[i]!.attributes('class') ?? ''
    // critical: deeper red bg + full-opacity red 3px bar
    expect(classOf(0)).toContain('bg-red-500/10')
    expect(classOf(0)).toContain('border-l-[3px]')
    expect(classOf(0)).toContain('border-l-red-500')
    // error: lighter red bg + 70% red bar
    expect(classOf(1)).toContain('bg-red-500/5')
    expect(classOf(1)).toContain('border-l-[3px]')
    expect(classOf(1)).toContain('border-l-red-500/70')
    // warn: amber tint + 60% amber bar
    expect(classOf(2)).toContain('bg-amber-500/5')
    expect(classOf(2)).toContain('border-l-amber-500/60')
    // info: no bg, faint blue 30% bar
    expect(classOf(3)).not.toContain('bg-amber-500')
    expect(classOf(3)).toContain('border-l-blue-500/30')
    // debug: transparent bar (badge carries the signal)
    expect(classOf(4)).toContain('border-l-transparent')
  })
})
