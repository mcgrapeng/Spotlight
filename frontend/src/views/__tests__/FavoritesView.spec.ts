import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/favorites' }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  }
})

vi.mock('@/api/endpoints', () => ({
  favoritesApi: {
    list: vi.fn(async () => []),
    add: vi.fn(),
    remove: vi.fn(),
  },
}))

import FavoritesView from '../FavoritesView.vue'
import { getI18n } from '@/i18n'

const i18n = getI18n()

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
})

describe('FavoritesView', () => {
  it('renders the empty state when there are no favorites', async () => {
    const wrapper = mount(FavoritesView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('还没有收藏')
    expect(wrapper.text()).toContain('收藏夹')
  })
})
