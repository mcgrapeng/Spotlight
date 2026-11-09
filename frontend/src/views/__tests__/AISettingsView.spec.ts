import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return {
    ...actual,
    useRoute: () => ({ query: {}, path: '/settings/ai' }),
    useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  }
})

vi.mock('@/api/endpoints', () => ({
  aiApi: {
    listProviders: vi.fn(async () => []),
    addProvider: vi.fn(),
    updateProvider: vi.fn(),
    deleteProvider: vi.fn(),
    setDefault: vi.fn(),
  },
}))

vi.mock('vue-sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

import AISettingsView from '../AISettingsView.vue'
import { aiApi } from '@/api/endpoints'
import { toast } from 'vue-sonner'
import { getI18n } from '@/i18n'

const i18n = getI18n()

const provider = {
  id: 7,
  name: 'Ollama',
  provider: 'ollama',
  model: 'llama3',
  api_base: 'http://127.0.0.1:11434/v1',
  temperature: 0.7,
  max_tokens: 2048,
  is_default: true,
  enabled: true,
  api_key_masked: '***',
}

beforeEach(() => {
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
  ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([])
  document.body.innerHTML = ''
})

function mountView() {
  return mount(AISettingsView, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    attachTo: document.body,
  })
}

/** The dialog is teleported to the body, so the DOM is queried there. */
function buttonByText(text: string): HTMLButtonElement {
  const btn = Array.from(document.querySelectorAll('button'))
    .find((b) => b.textContent?.trim() === text)
  if (!btn) throw new Error(`no "${text}" button in the DOM`)
  return btn
}

describe('AISettingsView', () => {
  it('renders the empty state when no provider is configured', async () => {
    const wrapper = mount(AISettingsView, {
      global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    })
    await flushPromises()
    expect(wrapper.text()).toContain('没有 Provider')
  })

  it('opens the edit dialog on the provider being edited', async () => {
    ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([provider])
    const wrapper = mountView()
    await flushPromises()

    // The edit button carries the localized label as its aria-label.
    const edit = wrapper.findAll('button').find((b) => b.attributes('aria-label') === '编辑')
    expect(edit).toBeDefined()
    edit!.trigger('click')
    await flushPromises()

    // The form used to keep the creation defaults: an edit showed an empty
    // name and the stock model, and the save was rejected.
    const name = document.querySelector('#provider-name') as HTMLInputElement
    const model = document.querySelector('#provider-model') as HTMLInputElement
    expect(name.value).toBe('Ollama')
    expect(model.value).toBe('llama3')
  })

  it('saves the provider being edited, not the creation defaults', async () => {
    ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([provider])
    const wrapper = mountView()
    await flushPromises()

    const edit = wrapper.findAll('button').find((b) => b.attributes('aria-label') === '编辑')
    edit!.trigger('click')
    await flushPromises()

    buttonByText('保存').click()
    await flushPromises()

    expect(aiApi.updateProvider).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ name: 'Ollama', model: 'llama3', is_default: true }),
    )
  })

  it('reports a rejected save instead of swallowing it', async () => {
    ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([provider])
    ;(aiApi.updateProvider as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { detail: 'api_key required for non-ollama provider' } },
    })
    const wrapper = mountView()
    await flushPromises()

    const edit = wrapper.findAll('button').find((b) => b.attributes('aria-label') === '编辑')
    edit!.trigger('click')
    await flushPromises()

    buttonByText('保存').click()
    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith('api_key required for non-ollama provider')
  })

  it('reports a rejected delete', async () => {
    ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([provider])
    ;(aiApi.deleteProvider as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { detail: 'provider not found' } },
    })
    const wrapper = mountView()
    await flushPromises()

    const del = wrapper.findAll('button').find((b) => b.attributes('aria-label') === '删除')
    del!.trigger('click')
    await flushPromises()

    buttonByText('删除').click()
    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith('provider not found')
  })

  it('reports a rejected set-default', async () => {
    // The "set as default" button only shows for a provider that is not
    // the default one yet.
    ;(aiApi.listProviders as ReturnType<typeof vi.fn>).mockResolvedValue([
      { ...provider, is_default: false },
    ])
    ;(aiApi.setDefault as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { detail: 'provider not found' } },
    })
    const wrapper = mountView()
    await flushPromises()

    const setDefault = wrapper.findAll('button').find((b) => b.text().trim() === '设为默认')
    setDefault!.trigger('click')
    await flushPromises()

    expect(toast.error).toHaveBeenCalledWith('provider not found')
  })
})
