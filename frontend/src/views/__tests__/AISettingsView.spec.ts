import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { NMessageProvider, NConfigProvider, darkTheme } from 'naive-ui'
import AISettingsView from '@/views/AISettingsView.vue'
import { useAIProviders } from '@/composables/useAIProviders'
import { aiApi } from '@/api/endpoints'

vi.mock('@/api/endpoints', () => ({
  aiApi: {
    listProviders: vi.fn(),
    addProvider: vi.fn(),
    updateProvider: vi.fn(),
    deleteProvider: vi.fn(),
    setDefault: vi.fn(),
    analyze: vi.fn(),
    status: vi.fn(),
    login: vi.fn(),
  },
}))

const makeRouter = () => createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/ai', name: 'ai', component: { template: '<div/>' } }],
})

const fakeProvider = (overrides: Partial<any> = {}) => ({
  id: 1,
  name: 'OpenAI',
  provider: 'openai',
  model: 'gpt-4o-mini',
  api_base: null,
  temperature: 0.2,
  max_tokens: 1024,
  is_default: false,
  enabled: true,
  extra: {},
  api_key_masked: 'sk-***',
  ...overrides,
})

/**
 * Wrap the AISettingsView in the Naive UI providers it needs.
 * `useMessage()` requires `<NMessageProvider>` in the ancestor tree.
 */
function mountView(providers: any[]) {
  const router = makeRouter()
  vi.mocked(aiApi.listProviders).mockResolvedValue(providers)
  // Naive UI requires both the message provider (for toasts) and the config
  // provider (for theming). Mounting the view as the root would crash; we
  // wrap it in a minimal but real provider tree.
  return mount({
    components: { NMessageProvider, AISettingsView },
    template: '<NMessageProvider><AISettingsView /></NMessageProvider>',
  }, {
    global: {
      plugins: [router],
      stubs: { 'transition': true, 'transition-group': true },
    },
  })
}

describe('AISettingsView — single-active contract', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })
  afterEach(() => { vi.restoreAllMocks() })

  it('renders the single-active explanation strip', () => {
    const wrapper = mountView([])
    expect(wrapper.text()).toMatch(/同时只能启用一个/)
  })

  it('shows "no providers" empty state when list is empty', () => {
    const wrapper = mountView([])
    expect(wrapper.text()).toContain('还没有配置')
  })

  it('displays the active provider in the top callout', () => {
    const active = fakeProvider({ id: 1, name: 'OpenAI', enabled: true })
    const inactive = fakeProvider({ id: 2, name: 'Anthropic', enabled: false })
    const wrapper = mountView([active, inactive])
    expect(wrapper.text()).toContain('OpenAI')
  })

  it('toggle() calls updateProvider with the opposite enabled value', async () => {
    const inactive = fakeProvider({ id: 2, name: 'Anthropic', enabled: false })
    vi.mocked(aiApi.listProviders).mockResolvedValue([inactive])
    vi.mocked(aiApi.updateProvider).mockResolvedValue({ ...inactive, enabled: true })

    const composable = useAIProviders()
    await composable.load()
    await composable.toggle(composable.providers.value[0])

    expect(aiApi.updateProvider).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ enabled: true }),
    )
  })

  it('composable-level: load() then toggle() does not crash', async () => {
    vi.mocked(aiApi.listProviders).mockResolvedValue([fakeProvider({ id: 1, enabled: false })])
    vi.mocked(aiApi.updateProvider).mockResolvedValue(fakeProvider({ id: 1, enabled: true }))

    const composable = useAIProviders()
    await composable.load()
    expect(composable.providers.value[0].enabled).toBe(false)
    await expect(composable.toggle(composable.providers.value[0])).resolves.toBeTruthy()
  })

  it('remove() invokes deleteProvider and reloads list', async () => {
    vi.mocked(aiApi.listProviders)
      .mockResolvedValueOnce([fakeProvider({ id: 1 })])
      .mockResolvedValueOnce([])
    vi.mocked(aiApi.deleteProvider).mockResolvedValue(undefined as any)

    const composable = useAIProviders()
    await composable.load()
    expect(composable.providers.value.length).toBe(1)
    await composable.remove(1)
    expect(aiApi.deleteProvider).toHaveBeenCalledWith(1)
    expect(composable.providers.value.length).toBe(0)
  })
})