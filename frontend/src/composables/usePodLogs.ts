import { onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { logsApi, podsApi } from '@/api/endpoints'
import type { LogLine } from '@/domain/types'

export interface UsePodLogsOptions {
  /* Pinia store (or anything exposing activeCluster) — read reactively. */
  cluster: { activeCluster: string | null }
  namespace: Ref<string>
  name: Ref<string>
  enabled: Ref<boolean>
  tailLines?: number
  maxBuffered?: number
}

const MAX_BUFFERED_DEFAULT = 5000
const TAIL_LINES_DEFAULT = 500

/**
 * Pod logs composable.
 *
 * Loads `podsApi.historyLogs()` first (backfill), then opens an
 * `EventSource` on the SSE stream endpoint so new lines are appended
 * live. Bounded ring buffer caps memory at `maxBuffered` lines.
 *
 * Designed to be gated by an `enabled` ref (e.g. only fetch+stream
 * while the Logs tab is active) and torn down on view unmount.
 */
export function usePodLogs(opts: UsePodLogsOptions) {
  const lines = ref<LogLine[]>([])
  const streaming = ref(false)
  const error = ref<string | null>(null)

  const max = opts.maxBuffered ?? MAX_BUFFERED_DEFAULT
  const tail = opts.tailLines ?? TAIL_LINES_DEFAULT

  let es: EventSource | null = null
  let alive = true

  function closeStream() {
    es?.close()
    es = null
    streaming.value = false
  }

  async function start() {
    if (!alive || !opts.name.value) return
    closeStream()
    lines.value = []
    error.value = null

    try {
      const { items } = await podsApi.historyLogs(
        opts.cluster.activeCluster,
        opts.namespace.value,
        opts.name.value,
        null, tail,
      )
      if (!alive) return
      lines.value = items.length > max ? items.slice(-max) : items
    } catch (e: any) {
      if (!alive) return
      error.value = e?.response?.data?.detail ?? e?.message ?? '日志加载失败'
    }

    if (!alive) return

    const url = logsApi.streamUrl(
      opts.cluster.activeCluster,
      opts.namespace.value,
      opts.name.value,
      null, tail,
    )
    es = new EventSource(url)
    streaming.value = true

    es.addEventListener('log', (e) => {
      if (!alive) return
      try {
        const line: LogLine = JSON.parse((e as MessageEvent).data)
        lines.value = [...lines.value, line]
        if (lines.value.length > max) {
          lines.value.splice(0, lines.value.length - max)
        }
      } catch (err) { console.error('parse log', err) }
    })
    es.addEventListener('error', () => {
      if (!alive) return
      streaming.value = false
      error.value = '日志连接中断'
    })
  }

  watch(
    () => [opts.enabled.value, opts.cluster.activeCluster, opts.namespace.value, opts.name.value],
    ([enabled]) => {
      if (!alive) return
      if (enabled) start()
      else closeStream()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    alive = false
    closeStream()
  })

  function clear() { lines.value = [] }

  return { lines, streaming, error, start, close: closeStream, clear }
}
