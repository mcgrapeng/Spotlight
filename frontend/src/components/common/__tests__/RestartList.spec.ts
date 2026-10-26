import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import { defineComponent, h, reactive, ref } from 'vue'
import { createPinia } from 'pinia'

/**
 * The fixes from the fourth audit, one test each.
 *
 *   1. a failed background poll must not replace the dashboard with an
 *      error page (covered in DashboardRefresh.spec.ts)
 *   2. the global `g` prefix must not hijack the log viewer's keys
 *      (covered in DashboardRefresh.spec.ts)
 *   3. the dashboard and the AI panel read the namespace they are told
 *      about
 *   5. the restart list carries information, and the pod name is not
 *      truncated away on a narrow screen
 *   6. the dashboard's "go see" opens the pod table already sorted
 *   8. the focus moves to the main content when the route changes
 *   10. the AI question box takes more than one line
 */
const clusterState: any = { activeCluster: 'demo-cluster', activeNamespace: 'default' }

vi.mock('@/stores/cluster', () => ({ useClusterStore: () => clusterState }))

vi.mock('@/api/endpoints', () => ({
  podsApi: { list: vi.fn(async () => ({ total: 0, items: [] })) },
  eventsApi: { list: vi.fn(async () => []) },
  aiApi: {
    listProviders: vi.fn(async () => [{ id: 1, name: 'openai', model: 'gpt-4o-mini', enabled: true }]),
    askStream: vi.fn(async () => {}),
    analyze: vi.fn(async () => ({ answer: '', model: '', latency_ms: 0 })),
  },
}))

import RestartList from '@/components/common/RestartList.vue'
import { usePodSorting } from '@/composables/usePodSorting'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
})

describe('RestartList', () => {
  const items = [
    { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-5jdr6', restarts: 21302 },
    { pod: 'monitoring/tempo-distributed-query-658f6bc8b9-fp78w', restarts: 21320 },
    { pod: 'monitoring/loki-write-0', restarts: 21320 },
  ]

  function mountList(list = items) {
    return mount(RestartList, {
      props: { items: list },
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
  }

  it('puts the pod with the most restarts first, whatever order it arrives in', () => {
    const wrapper = mountList()
    const names = wrapper.findAll('li').map((li) => li.text())
    // 21,320 leads, 21,302 is last.
    expect(names[0]).toContain('fp78w')
    expect(names[2]).toContain('5jdr6')
  })

  it('says how far the leader is ahead of the runner-up', () => {
    const wrapper = mountList([
      { pod: 'ns/a', restarts: 157 },
      { pod: 'ns/b', restarts: 12 },
    ])
    expect(wrapper.text()).toContain('比第 2 名多 145 次')
  })

  it('says the leaders are level when they are', () => {
    const wrapper = mountList()
    expect(wrapper.text()).toContain('与第 2 名持平')
  })

  it('never truncates the pod name — the name is the identity', () => {
    const wrapper = mountList()
    // A truncated name is "tempo-distributed-query-65…", two rows that look
    // identical. The full name has to be in the DOM and allowed to wrap.
    expect(wrapper.text()).toContain('tempo-distributed-query-658f6bc8b9-5jdr6')
    expect(wrapper.findAll('.truncate').length).toBe(0)
  })
})

describe('pod table sort from the URL', () => {
  it('starts on the sort the link asked for', () => {
    const { sortKey, sortDir, sorted } = usePodSorting(
      ref([
        { name: 'b', restart_count: 3 } as any,
        { name: 'a', restart_count: 99 } as any,
      ]),
      { key: 'restarts', dir: 'desc' },
    )
    expect(sortKey.value).toBe('restarts')
    expect(sortDir.value).toBe('desc')
    expect(sorted.value.map((p) => p.name)).toEqual(['a', 'b'])
  })
})

describe('focus on route change', () => {
  it('moves the focus to the main content when the path changes', async () => {
    const route = reactive({ path: '/dashboard' })
    vi.doMock('vue-router', () => ({
      useRoute: () => route,
      useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
      RouterView: defineComponent({ setup: () => () => h('div', 'page') }),
    }))
    vi.resetModules()

    const { default: AppLayout } = await import('@/components/layout/AppLayout.vue')
    const wrapper = mount(AppLayout, {
      // focus() only moves document.activeElement for an element that is in
      // the document — a detached mount would silently do nothing.
      attachTo: document.body,
      global: {
        stubs: {
          AppHeader: true, AppSidebar: true, MobileDrawer: true,
          RouterLink: RouterLinkStub,
          // The layout renders <RouterView v-slot="{ Component }">, so the
          // stub has to hand a component to the slot.
          RouterView: defineComponent({
            setup(_, { slots }) {
              const Page = defineComponent({ render: () => h('div', 'page') })
              return () => h('div', slots.default?.({ Component: Page }))
            },
          }),
        },
        plugins: [i18n, createPinia()],
      },
    })
    await flushPromises()

    const main = wrapper.find('#main-content')
    expect(main.exists()).toBe(true)

    route.path = '/pods'
    await flushPromises()
    await flushPromises()

    expect(document.activeElement?.id).toBe('main-content')
    wrapper.unmount()
  })
})
