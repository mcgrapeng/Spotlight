import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, RouterLinkStub, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('vue-router', async (orig) => {
  const actual = await orig<typeof import('vue-router')>()
  return { ...actual, useRoute: () => ({ name: 'dashboard', query: {}, params: {} }) }
})

vi.mock('@/stores/cluster', () => {
  const reactiveObj: any = { activeCluster: 'demo-cluster', activeNamespace: 'default' }
  return { useClusterStore: () => reactiveObj }
})

vi.mock('@/api/endpoints', () => ({
  aiApi: {
    listProviders: vi.fn(async () => [
      { id: 1, name: 'OpenAI', provider: 'openai', model: 'gpt-4o-mini', enabled: true },
    ]),
    askStream: vi.fn(),
    analyze: vi.fn(),
  },
  podsApi: {
    stats: vi.fn(async () => ({
      total_pods: 287, running: 258, pending: 17, failed: 0, succeeded: 12,
      warning_events: 25, nodes_ready: 3, nodes_total: 3, restart_top: [], recent_warns: [],
    })),
  },
}))

import AIPanel from '@/components/ai/AIPanel.vue'
import { useAiStore } from '@/stores/ai'
import { getI18n } from '@/i18n'
import { aiApi } from '@/api/endpoints'

const i18n = getI18n()

beforeEach(() => {
  setActivePinia(createPinia())
  i18n.global.locale.value = 'zh-CN'
  vi.clearAllMocks()
  document.body.innerHTML = ''
})

function mountPanel() {
  return mount(AIPanel, {
    global: { stubs: { RouterLink: RouterLinkStub }, plugins: [i18n] },
    attachTo: document.body,
  })
}

/** The sheet is teleported to the body, so the DOM is queried there. */
function askButton(): HTMLButtonElement {
  const buttons = Array.from(document.querySelectorAll('button'))
  const btn = buttons.find((b) => b.textContent?.includes('提问'))
  if (!btn) throw new Error('no ask button in the DOM')
  return btn
}

describe('AIPanel streaming', () => {
  it('does not let a previous session\'s stream write into a reopened panel', async () => {
    const store = useAiStore()
    // The stream hands over one piece, then waits for the gate. The test
    // opens the gate after the panel has been reopened, so the second
    // piece arrives while the panel belongs to a different question.
    let release!: () => void
    const gate = new Promise<void>((r) => { release = r })
    ;(aiApi.askStream as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async (_id: number, _q: string, _c: string, onDelta: (t: string) => void) => {
        onDelta('第一段')
        await gate
        onDelta('第二段')
      },
    )

    // The panel is mounted once and watches the request counter, so the
    // first open has to come after the mount.
    mountPanel()
    store.openAsk()
    await flushPromises()
    const input = document.querySelector('#ai-question') as HTMLInputElement
    input.value = '哪个 Pod 在反复重启？'
    input.dispatchEvent(new Event('input'))
    await flushPromises()
    askButton().click()
    await flushPromises()
    expect(document.body.textContent).toContain('第一段')

    // The reader closes the panel and asks something else. The old stream
    // is still running.
    store.close()
    store.openAsk()
    await flushPromises()
    expect(document.body.textContent).not.toContain('第一段')

    // The tail of the OLD answer arrives now.
    release()
    await flushPromises()

    // It must not land in the new panel.
    expect(document.body.textContent).not.toContain('第二段')
  })
})

describe('AIPanel 提问框', () => {
  it('是多行输入框：回车换行，⌘/Ctrl+回车才提问', async () => {
    const store = useAiStore()
    mountPanel()
    store.openAsk()
    await flushPromises()

    const box = document.querySelector('#ai-question') as HTMLTextAreaElement
    // It used to be a single-line Input, so a question with a clause in
    // it had to be crammed onto one line.
    expect(box.tagName).toBe('TEXTAREA')

    ;(aiApi.askStream as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      async () => {},
    )
    box.value = '哪个 Pod 在反复重启？是同一个吗？'
    box.dispatchEvent(new Event('input'))
    await flushPromises()

    // Enter inserts a newline — it must not submit.
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await flushPromises()
    expect(aiApi.askStream).not.toHaveBeenCalled()

    // ⌘+Enter submits.
    box.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', metaKey: true, bubbles: true }))
    await flushPromises()
    expect(aiApi.askStream).toHaveBeenCalled()
  })

  it('给模型的快照按当前命名空间取，不是全集群', async () => {
    const store = useAiStore()
    const { podsApi } = await import('@/api/endpoints')
    mountPanel()
    store.openAsk()
    await flushPromises()

    // The stats used to be cluster-wide while the panel said "namespace
    // kube-system" — the model got a namespace and a list of pods from
    // somewhere else.
    expect(podsApi.stats).toHaveBeenCalledWith('demo-cluster', 'default')
  })
})
