import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LogViewer from '../LogViewer.vue'
import type { LogLineOut } from '@/api/types'
import { getI18n } from '@/i18n'

// The panel virtualizes its rows with a spacer above and below the rendered
// window, and the model that sizes those spacers is only correct if it can
// see every rendered group. These tests cover the shapes that used to be
// invisible to it.
const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
})

afterEach(() => {
  vi.useRealTimers()
})

function line(content: string, severity: LogLineOut['severity'] = 'info'): LogLineOut {
  return {
    timestamp: '2026-01-01T00:00:00Z',
    severity,
    container: 'main',
    content,
  }
}

function mountViewer(lines: LogLineOut[], extra: Record<string, unknown> = {}) {
  return mount(LogViewer, {
    props: { lines, namespace: 'ns', podName: 'pod', autoFollow: true, streaming: true, ...extra },
    global: { plugins: [i18n] },
    attachTo: document.body,
  })
}

describe('LogViewer virtual model', () => {
  it('folds identical text lines into one group', () => {
    const w = mountViewer([line('same text'), line('same text'), line('same text')])
    const folds = w.findAll('[role="log"] [role="button"]')
    expect(folds.length).toBe(1)
    expect(w.text()).toContain('×3')
  })

  it('does NOT fold JSON payloads, however alike they look', () => {
    // normalize() maps every number to 'N', so these five payloads normalize
    // to the same string. Folding them hid four of them behind a JSON button
    // whose state nothing rendered.
    const payloads = Array.from(
      { length: 5 },
      (_, i) => line(JSON.stringify({ level: 'info', n: i })),
    )
    const w = mountViewer(payloads)
    const folds = w.findAll('[role="log"] [role="button"]')
    expect(folds.length, 'JSON payloads must not fold').toBe(0)
    const jsonChips = w.findAll('[role="log"] button').filter((b) => b.text().includes('JSON'))
    expect(jsonChips.length, 'every payload keeps its own expander').toBe(5)
  })

  it('renders every row inside a group wrapper the measurement can see', () => {
    const w = mountViewer([
      line('same text'),
      line('same text'),
      line('same text'),
      line(JSON.stringify({ a: 1 })),
      line('plain'),
    ])
    const groups = w.findAll('[role="log"] [data-gkey]')
    expect(groups.length).toBeGreaterThan(0)
    const rows = w.findAll('[role="log"] div[class*="min-h-[22px]"]')
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      expect(row.element.closest('[data-gkey]'), 'every row belongs to a measured group').toBeTruthy()
    }
  })

  it('leaves the scroll position to the app: no CSS smooth scrolling, no native anchoring', () => {
    const w = mountViewer([line('hello')])
    const scroller = w.find('[role="log"]')
    expect(scroller.classes()).not.toContain('scroll-smooth')
    expect(scroller.classes()).toContain('log-scroll')
  })

  it('keeps the error banner out of the scrollable region', () => {
    const w = mountViewer([line('hello')], { error: 'boom' })
    const banner = w.find('[role="alert"]')
    expect(banner.exists()).toBe(true)
    expect(banner.element.closest('[role="log"]')).toBeFalsy()
  })

  it('does not announce the whole virtualized window to a screen reader', () => {
    const w = mountViewer([line('hello')])
    expect(w.find('[role="log"]').attributes('aria-live')).toBe('off')
    const live = w.findAll('[aria-live="polite"]')
    expect(live.length).toBe(1)
    expect(live[0]!.element.closest('[role="log"]')).toBeFalsy()
  })

  it('keeps following the tail even when the reader has not touched anything for a while', async () => {
    // The old code only re-pinned the panel to the newest line if something
    // had happened in the last three seconds, so a reader who parked the
    // mouse over the panel stopped receiving the tail exactly when they were
    // watching it.
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const w = mountViewer([line('first')])
    const el = w.element.querySelector('[role="log"]') as HTMLElement
    el.scrollTop = 0
    // Ten seconds of nothing happening.
    vi.setSystemTime(new Date('2026-01-01T00:00:10Z'))
    await w.setProps({ lines: [line('newest'), line('first')] })
    await w.vm.$nextTick()
    expect(el.scrollTop).toBe(0)
    expect(w.emitted('update:autoFollow')).toBeUndefined()
  })

  it('restores the reading position by identity, not by pixel offset', async () => {
    // A stored pixel only means something relative to the model that
    // produced it, and the model moves every time lines are prepended or
    // trimmed. The position is stored as the group the reader was at.
    const first = mountViewer([line('a'), line('b'), line('c'), line('d'), line('e')])
    const keys = first
      .findAll('[role="log"] [data-gkey]')
      .map((g) => g.attributes('data-gkey')!)
    expect(keys.length).toBeGreaterThan(1)
    const target = keys[1]
    first.unmount()

    sessionStorage.setItem(
      'k8s-log-scroll:ns:pod',
      JSON.stringify({ key: target, offset: 0 }),
    )
    const w = mountViewer([line('a'), line('b'), line('c'), line('d'), line('e')], {
      autoFollow: false,
    })
    await w.vm.$nextTick()
    await w.vm.$nextTick()
    const el = w.element.querySelector('[role="log"]') as HTMLElement
    // The second group sits one row down, and a row the model has not
    // measured is estimated at the line height.
    expect(el.scrollTop).toBe(22)
    sessionStorage.removeItem('k8s-log-scroll:ns:pod')
  })
})
