import { onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import { logsApi, podsApi } from '@/api/endpoints'
import { splitLogLines } from '@/domain/services/logFormat'
import type { LogLineOut } from '@/api/types'

export interface UsePodLogsOptions {
  /* Pinia store (or anything exposing activeCluster) — read reactively. */
  cluster: { activeCluster: string | null }
  namespace: Ref<string>
  name: Ref<string>
  enabled: Ref<boolean>
  streaming?: Ref<boolean>
  tailLines?: number
  maxBuffered?: number
}

const MAX_BUFFERED_DEFAULT = 10000
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
  // ponytail: shallowRef — buffer replaced whole on each flush; never mutate inner line
  // objects, so deep reactivity would waste proxy overhead on every field of every line.
  const lines = shallowRef<LogLineOut[]>([])
  const streaming = ref(false)
  const error = ref<string | null>(null)
  const unreadCount = ref(0)

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
    unreadCount.value = 0
    error.value = null

    try {
      const { items } = await podsApi.historyLogs(
        opts.cluster.activeCluster,
        opts.namespace.value,
        opts.name.value,
        null, tail,
      )
      if (!alive) return
      const flat: LogLineOut[] = []
      for (const item of items.slice(-max)) {
        for (const content of splitLogLines(item.content)) {
          flat.push({
            timestamp: item.timestamp,
            content,
            container: item.container || '—',
            severity: item.severity || 'info',
          })
        }
      }
      flat.reverse()
      lines.value = flat
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

    let pending: LogLineOut[] = []
    let flushTimer: ReturnType<typeof setTimeout> | null = null

    function flush() {
      flushTimer = null
      if (pending.length === 0) return
      // Backend yields lines in chronological order (oldest first within batch).
      // Store newest-first: reverse pending before prepending.
      const batch = pending.slice().reverse()
      lines.value = [...batch, ...lines.value]
      if (lines.value.length > max) {
        lines.value = lines.value.slice(0, max)
      }
      unreadCount.value += pending.length
      pending = []
    }

    es.addEventListener('log', (e) => {
      if (!alive) return
      try {
        const raw = JSON.parse((e as MessageEvent).data) as LogLineOut
        const container = raw.container || '—'
        const severity = raw.severity || 'info'
        for (const content of splitLogLines(raw.content)) {
          pending.push({ timestamp: raw.timestamp, content, container, severity })
        }
        if (!flushTimer) {
          flushTimer = setTimeout(flush, 100)
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

  watch(() => opts.streaming?.value, (s) => {
    if (!alive || s === undefined) return
    if (s === false) closeStream()
    else if (opts.enabled.value) start()
  })

  onBeforeUnmount(() => {
    alive = false
    closeStream()
  })

  function clear() { lines.value = []; unreadCount.value = 0 }

  return { lines, streaming, error, unreadCount, start, close: closeStream, clear }
}