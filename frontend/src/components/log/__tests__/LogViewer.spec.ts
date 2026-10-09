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
    expect(html).toContain('class="text-red-600"')
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

  it('clicking the trace-id bar sets search to trace:<uuid>', async () => {
    const tid = '11111111-2222-3333-4444-555555555555'
    const wrapper = mount(LogViewer, {
      props: {
        lines: [line('info', `started request ${tid}`), line('info', 'unrelated')],
        unreadCount: 0,
      },
    })
    // The trace bar is the button with aria-label="按 trace_id <uuid> 过滤"
    const traceBtn = wrapper.find(`button[aria-label="按 trace_id ${tid} 过滤"]`)
    expect(traceBtn.exists()).toBe(true)
    await traceBtn.trigger('click')
    // The first <input> is the search box
    const searchInput = wrapper.find('input[aria-label="过滤日志"]')
    expect((searchInput.element as HTMLInputElement).value).toBe(`trace:${tid}`)
    // Clicking again clears the trace filter (toggle)
    await wrapper.find(`button[aria-label="按 trace_id ${tid} 过滤"]`).trigger('click')
    expect((searchInput.element as HTMLInputElement).value).toBe('')
  })

  it('shows the empty state with "暂无日志 / 等待容器输出…" when no lines arrive and streaming is true', () => {
    const wrapper = mount(LogViewer, {
      props: { lines: [], streaming: true, unreadCount: 0 },
    })
    expect(wrapper.text()).toContain('暂无日志')
    expect(wrapper.text()).toContain('等待容器输出')
  })

  it('shows "日志已暂停" empty state when paused with no lines', () => {
    const wrapper = mount(LogViewer, {
      props: { lines: [], streaming: false, unreadCount: 0 },
    })
    expect(wrapper.text()).toContain('暂无日志')
    expect(wrapper.text()).toContain('日志已暂停')
  })

  it('shows "当前过滤无匹配" + a clear button when filter hides all lines', async () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: [line('debug', 'noisy debug message')],
        streaming: true,
        unreadCount: 0,
      },
    })
    const searchInput = wrapper.find('input[aria-label="过滤日志"]')
    await searchInput.setValue('zzz_no_match_zzz')
    expect(wrapper.text()).toContain('当前过滤无匹配')
    const clearBtn = wrapper.findAll('button').find((b) => b.text().includes('清空过滤'))
    expect(clearBtn).toBeTruthy()
    await clearBtn!.trigger('click')
    expect((wrapper.find('input[aria-label="过滤日志"]').element as HTMLInputElement).value).toBe('')
  })

  it('renders an error banner with retry when error prop is set', async () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: [line('info', 'partial line that came through')],
        streaming: false,
        unreadCount: 0,
        error: '日志连接中断',
      },
    })
    expect(wrapper.text()).toContain('日志连接中断')
    const retry = wrapper.find('button[aria-label="重试"]')
    expect(retry.exists()).toBe(true)
    await retry.trigger('click')
    // retry event is emitted, not a callback prop — parent wires it up
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('renders the download button (disabled when filtered set is empty)', () => {
    const wrapper = mount(LogViewer, {
      props: { lines: makeLines(3), unreadCount: 0, podName: 'demo', namespace: 'ns' },
    })
    const dl = wrapper.find('button[aria-label="下载日志"]')
    expect(dl.exists()).toBe(true)
    expect(dl.attributes('disabled')).toBeUndefined()
  })

  it('displays the keyboard help popover when the help button is clicked', async () => {
    const wrapper = mount(LogViewer, {
      props: { lines: makeLines(3), unreadCount: 0 },
      attachTo: document.body,
    })
    const helpBtn = wrapper.find('button[aria-label="快捷键帮助 (?)"]')
    expect(helpBtn.exists()).toBe(true)
    await helpBtn.trigger('click')
    await wrapper.vm.$nextTick()
    // ponytail: popover content teleports to body — check document.body
    const bodyText = document.body.textContent ?? ''
    expect(bodyText).toContain('快捷键')
    expect(bodyText).toContain('聚焦搜索')
    expect(bodyText).toContain('仅显示 error')
  })

  it('fold group header shows a large ×N badge with severity tint', () => {
    const wrapper = mount(LogViewer, {
      props: {
        lines: Array.from({ length: 12 }, () => line('error', 'same repeated message')),
        unreadCount: 0,
      },
    })
    // The badge is a span containing ×N. Find it by text and assert its class includes
    // the severity tint (border-l-red-500/70 for error).
    const all = wrapper.findAll('span')
    const badge = all.find((s) => /^×\d+$/.test(s.text().trim()))
    expect(badge).toBeTruthy()
    const cls = badge!.attributes('class') ?? ''
    // error → border-l-red-500/70 from severityBorderFor()
    expect(cls).toMatch(/border-l-red-500/)
  })
})
