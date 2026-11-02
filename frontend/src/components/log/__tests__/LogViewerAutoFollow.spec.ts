import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LogViewer from '../LogViewer.vue'
import { getI18n } from '@/i18n'

// The log renders oldest-first with the tail at the BOTTOM of the scroller,
// so "the reader is at the tail" is a distance from the bottom, not a
// scrollTop of 0.
//
// happy-dom has no layout, so scrollHeight and clientHeight are both 0 and
// every scroll position would look like it was past the tail. The scroller
// is given a real size so the tail sits at a known offset.
const SCROLL_HEIGHT = 5000
const CLIENT_HEIGHT = 1000
const TAIL = SCROLL_HEIGHT - CLIENT_HEIGHT

function mountViewer() {
  return mount(LogViewer, {
    props: { lines: [], namespace: 'ns', podName: 'pod', autoFollow: true, streaming: true },
    global: { plugins: [getI18n()] },
    attachTo: document.body,
  })
}

function scrollTo(w: ReturnType<typeof mountViewer>, top: number) {
  const el = w.element.querySelector('[role="log"]') as HTMLElement
  Object.defineProperty(el, 'scrollHeight', { value: SCROLL_HEIGHT, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: CLIENT_HEIGHT, configurable: true })
  el.scrollTop = top
  el.dispatchEvent(new Event('scroll'))
}

describe('LogViewer auto-follow transitions', () => {
  it('emits false when the user scrolls up into the history', async () => {
    // autoFollow here is a LOCAL mirror of the ref PodDetailView shares with
    // usePodLogs. The re-engage branch emitted; the scroll-away branch only
    // set the local copy. The shared ref therefore stayed true and flush()
    // kept splicing new batches into the view while they scrolled through
    // history. The unread pill was dead for the same reason: deferred never
    // received anything.
    const w = mountViewer()
    scrollTo(w, TAIL)
    await w.vm.$nextTick()
    scrollTo(w, TAIL - 400)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false]])
  })

  it('emits true when the user returns to the tail', async () => {
    const w = mountViewer()
    scrollTo(w, TAIL)
    await w.vm.$nextTick()
    scrollTo(w, TAIL - 400)
    await w.vm.$nextTick()
    scrollTo(w, TAIL)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false], [true]])
  })

  it('does not re-emit while the user keeps scrolling the same way', async () => {
    // onScroll fires dozens of times per wheel drag; every extra emit pushes a
    // value through the shared ref and retriggers the composable's watcher.
    const w = mountViewer()
    scrollTo(w, TAIL)
    await w.vm.$nextTick()
    for (const top of [TAIL - 100, TAIL - 200, TAIL - 300]) scrollTo(w, top)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toEqual([[false]])
  })

  it('keeps the follow when the content grows below the reader', async () => {
    // The tail moves when a fold is opened or a new line arrives. That is
    // the content changing size under the reader, not the reader leaving:
    // the anchor correction carries them along.
    const w = mountViewer()
    scrollTo(w, TAIL)
    await w.vm.$nextTick()
    expect(w.emitted('update:autoFollow')).toBeUndefined()
  })
})
