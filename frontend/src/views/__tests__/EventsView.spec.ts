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

describe('EventsView event cards', () => {
  it('makes the whole card a click target for pod events', async () => {
    // 这条路是事件页的主路径：读到一条告警 → 点进去看那个 Pod。
    // 之前它只有右下角一个 12px 的「查看详情 ›」，约 60×16px。
    const wrapper = mountEvents()
    await flushPromises()

    const link = wrapper.findAllComponents(RouterLinkStub).find((l) => {
      const to = l.props('to') as { name?: string } | undefined
      return to?.name === 'pod-detail'
    })
    expect(link).toBeTruthy()
    // 链接用 ::after 铺满整张卡，所以它必须不是 relative
    // ——否则覆盖层会以链接为定位祖先，铺不开。
    expect(link!.classes().join(' ')).toContain('after:inset-0')
    expect(link!.classes().join(' ')).not.toContain('relative')
  })

  it('keeps the event message selectable above the card overlay', async () => {
    // 正文是读者真正要读、要复制的东西（上游原文）。它必须抬在整卡
    // 覆盖层之上，否则鼠标按下去是跳转而不是选字。
    const wrapper = mountEvents()
    await flushPromises()
    const msg = wrapper.findAll('p').find((p) => p.text().includes('Back-off restarting'))
    expect(msg).toBeTruthy()
    expect(msg!.classes().join(' ')).toContain('z-10')
  })

  it('does not dim the repeat count below the contrast floor', async () => {
    // opacity-60 的次要文字在暗色下是 3.2:1，低于 AA 的 4.5:1。
    // 层级改由颜色承担：数字用 foreground，单位用 muted-foreground。
    const wrapper = mountEvents()
    await flushPromises()
    const times = wrapper.findAll('span').find((s) => s.text() === '次')
    expect(times).toBeTruthy()
    expect(times!.classes().join(' ')).not.toContain('opacity-60')
    const count = wrapper.findAll('span').find((s) => s.text() === '4')
    expect(count).toBeTruthy()
    expect(count!.classes().join(' ')).toContain('text-foreground')
  })

  it('drops the 3px accent border from event cards', async () => {
    // 3px 彩色左边框撞上 12px 圆角，检测器判它 side-tab。
    const wrapper = mountEvents()
    await flushPromises()
    const card = wrapper.findAll('div').find((d) => d.classes().includes('rounded-card'))
    expect(card).toBeTruthy()
    expect(card!.classes().join(' ')).not.toContain('border-l-[3px]')
  })
})
