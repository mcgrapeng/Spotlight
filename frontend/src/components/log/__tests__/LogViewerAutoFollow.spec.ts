import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LogViewer from '../LogViewer.vue'
import { getI18n } from '@/i18n'

function mountViewer() {
  return mount(LogViewer, {
    props: { lines: [], namespace: 'ns', podName: 'pod', autoFollow: true, streaming: true },
    global: { plugins: [getI18n()] },
    attachTo: document.body,
  })
}

function scrollTo(w: ReturnType<typeof mountViewer>, top: number) {
  const el = w.element.querySelector('[role="log"]') as HTMLElement
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
}

describe('LogViewer auto-follow transitions', () => {
  it('emits false when the user scrolls away from the top', async () => {
    // autoFollow here is a LOCAL mirror of the ref PodDetailView shares with
    // usePodLogs. The re-engage branch emitted; the scroll-away branch only
    // set the local copy. The shared ref therefore stayed true and flush()
    // kept splicing new batches above the user's cursor while they scrolled
    // through history. The unread pill was dead for the same reason:
    // deferred never received anything.
    const w = mountViewer()
    scrollTo(w, 400)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false]])
  })

  it('emits true when the user returns to the top', async () => {
    const w = mountViewer()
    scrollTo(w, 400)
    await w.vm.$nextTick()
    scrollTo(w, 0)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false], [true]])
  })

  it('does not re-emit while the user keeps scrolling the same way', async () => {
    // onScroll fires dozens of times per wheel drag; every extra emit pushes a
    // value through the shared ref and retriggers the composable's watcher.
    const w = mountViewer()
    for (const top of [400, 500, 600, 700, 800]) scrollTo(w, top)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false]])
  })
})
