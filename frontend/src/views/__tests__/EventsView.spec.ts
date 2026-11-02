import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/events' }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  }
})

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'demo-cluster', activeNamespace: 'default' }
  return { useClusterStore: () => reactiveObj }
})

const LONG_MESSAGE =
  'Back-off restarting failed container in pod cache-001. The container redis failed to start ' +
  'because the image pull was rate limited, and the kubelet is backing off before the next attempt, ' +
  'which is a long enough message that three lines cannot hold it.'

vi.mock('@/api/endpoints', () => ({
  eventsApi: {
    list: vi.fn(async () => [
      {
        name: 'ev1', namespace: 'default', type: 'Warning', reason: 'BackOff',
        involved_kind: 'Pod', involved_name: 'cache-001', count: 4,
        last_seen: '2026-10-21T09:00:00Z', message: LONG_MESSAGE,
      },
    ]),
  },
}))

import EventsView from '../EventsView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeAll(() => {
  // happy-dom does no layout, so the clamp measurement has to be simulated:
  // a clamped element is shorter than its content, an expanded one is not.
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true, get() { return 60 },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get() { return this.classList.contains('line-clamp-3') ? 300 : 60 },
  })
})

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
})

function mountEvents() {
  return mount(EventsView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
  })
}

function expandButton(wrapper: ReturnType<typeof mountEvents>) {
  return wrapper.findAll('button').find((b) => b.text().includes('展开'))
}

describe('EventsView message truncation', () => {
  it('offers the expand button for a message that overflows three lines', async () => {
    const wrapper = mountEvents()
    await flushPromises()
    expect(expandButton(wrapper)).toBeTruthy()
  })

  it('keeps the expand button after the message is expanded and collapsed again', async () => {
    const wrapper = mountEvents()
    await flushPromises()

    await expandButton(wrapper)!.trigger('click')
    await flushPromises()
    // A window resize re-measures every message. An expanded message has no
    // clamp, so it measures as "not overflowing" — but it is exactly the
    // ones that overflowed, and dropping it there would take its own
    // "expand" button with it.
    window.dispatchEvent(new Event('resize'))
    await flushPromises()
    await flushPromises()

    const collapse = wrapper.findAll('button').find((b) => b.text().includes('收起'))
    expect(collapse).toBeTruthy()
    await collapse!.trigger('click')
    await flushPromises()

    // Collapsing brings the clamp back, and the button has to stay.
    expect(expandButton(wrapper)).toBeTruthy()
  })
})
