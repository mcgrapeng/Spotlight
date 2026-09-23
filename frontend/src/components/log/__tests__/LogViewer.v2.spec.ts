import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClusterStore } from '@/stores/cluster'
import { ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { NConfigProvider, NMessageProvider, darkTheme } from 'naive-ui'
import LogViewer from '@/components/log/LogViewer.vue'
import type { LogLine } from '@/domain/types'
type Status = 'idle' | 'open' | 'closed' | 'error'

vi.mock('@/composables/useLogStream', () => ({
  useLogStream: () => ({
    lines: ref<LogLine[]>([]),
    status: ref<'idle' | 'open' | 'closed' | 'error'>('idle'),
    errorMessage: ref<string | null>(null),
    open: vi.fn(),
    close: vi.fn(),
    clear: vi.fn(),
  }),
}))

const historyLogsMock = vi.fn().mockResolvedValue({
  total: 1,
  items: [
    { timestamp: '2024-01-01T00:00:00Z', content: 'auto-loaded line', container: 'app', severity: 'info' },
  ],
})

vi.mock('@/api/endpoints', () => ({
  podsApi: {
    list: vi.fn(),
    get: vi.fn(),
    stats: vi.fn(),
    historyLogs: (...args: unknown[]) => historyLogsMock(...args),
  },
}))

function mountLogViewer(props: { preset?: LogLine[] } = {}) {
  // Pre-populate the active cluster so loadHistory() doesn't bail.
  const cluster = useClusterStore()
  cluster.activeCluster = 'demo'

  const w = mount({
    components: { NConfigProvider, NMessageProvider, LogViewer },
    setup() { return { darkTheme, preset: props.preset ?? [], props } },
    template: `
      <NConfigProvider :theme="darkTheme">
        <NMessageProvider>
          <LogViewer
            namespace="default"
            name="p1"
            :containers="['app']"
            :preset="preset"
          />
        </NMessageProvider>
      </NConfigProvider>
    `,
  })
  return w
}

const LINES: LogLine[] = [
  { timestamp: '2024-01-01T00:00:00Z', content: 'preset line', container: 'app', severity: 'info' },
]

describe('LogViewer v2 — default history + live start/stop', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    historyLogsMock.mockClear()
    historyLogsMock.mockResolvedValue({
      total: 1,
      items: [{ timestamp: '2024-01-01T00:00:00Z', content: 'auto-loaded line', container: 'app', severity: 'info' }],
    })
  })
  afterEach(() => { vi.restoreAllMocks() })

  it('auto-loads history on mount when no preset (default = recent history)', async () => {
    const wrapper = mountLogViewer()
    await new Promise((r) => setTimeout(r, 30))
    await flushPromises()
    // Should have called historyLogs with default 15m range
    expect(historyLogsMock).toHaveBeenCalledTimes(1)
    expect(historyLogsMock.mock.calls[0]?.[5]).toBe('15m')
    void wrapper
  })

  it('does NOT auto-load when preset is provided (preset takes precedence)', async () => {
    mountLogViewer({ preset: LINES })
    await new Promise((r) => setTimeout(r, 10))
    await flushPromises()
    expect(historyLogsMock).not.toHaveBeenCalled()
  })

  it('clicking a time-range pill reloads history with that range', async () => {
    const wrapper = mountLogViewer()
    await new Promise((r) => setTimeout(r, 10))
    await flushPromises()
    expect(historyLogsMock).toHaveBeenCalledTimes(1)

    // Find and click "1h" pill
    const pill1h = wrapper.findAll('button').find((b) => b.text().trim() === '1h')
    expect(pill1h).toBeDefined()
    await pill1h!.trigger('click')
    await new Promise((r) => setTimeout(r, 10))
    await flushPromises()

    expect(historyLogsMock).toHaveBeenCalledTimes(2)
    expect(historyLogsMock.mock.calls[1]?.[5]).toBe('1h')
  })

  it('shows start-tracking button by default', async () => {
    const wrapper = mountLogViewer({ preset: LINES })
    await flushPromises()
    expect(wrapper.text()).toContain('开始跟踪')
    expect(wrapper.text()).not.toContain('停止跟踪')
  })

  it('shows start-tracking button when no SSE is open', async () => {
    const wrapper = mountLogViewer({ preset: LINES })
    await flushPromises()
    expect(wrapper.text()).toContain('开始跟踪')
    expect(wrapper.text()).not.toContain('停止跟踪')
    // Mode badge shows 历史模式 since preset populated the lines without SSE.
    expect(wrapper.text()).toContain('历史模式')
  })
})