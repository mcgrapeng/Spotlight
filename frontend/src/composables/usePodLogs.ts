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

/** SSE `log` events carry a JSON *array* of entries (the backend batches up
 * to 100 per flush). Tolerate a single object too (older wire shapes / test
 * mocks). Entries without a string `content` are dropped — that's exactly
 * the shape that used to crash `splitLogLines` with
 * "Cannot read properties of undefined (reading 'split')". */
export function normalizeStreamPayload(data: unknown): LogLineOut[] {
  const arr = Array.isArray(data) ? data : [data]
  return arr.filter(
    (x): x is LogLineOut => !!x && typeof (x as LogLineOut).content === 'string',
  )
}

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

    // Dedup the SSE backlog against the history backfill. The follow-stream
    // replays `tail_lines` on connect — and on every EventSource
    // auto-reconnect — which would otherwise double every line (500 → 1000).
    // Declared before the history try-block so the SSE closure is safe even
    // when the backfill fetch fails. ponytail: sigs are content strings,
    // bounded by session length × maxBuffered (~2MB at 10k lines) — fine for
    // an ops panel.
    const seen = new Set<string>()
    const sigOf = (t: string, c: string) => `${t}\u0000${c}`

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
      for (const l of flat) seen.add(sigOf(l.timestamp, l.content))
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
        // Data flowing = connection healthy. Clears any stale "连接中断"
        // banner left by a transient drop / auto-reconnect cycle.
        if (error.value !== null) error.value = null
        streaming.value = true
        const entries = normalizeStreamPayload(JSON.parse((e as MessageEvent).data))
        for (const raw of entries) {
          const container = raw.container || '—'
          const severity = raw.severity || 'info'
          for (const content of splitLogLines(raw.content)) {
            const sig = sigOf(raw.timestamp, content)
            if (seen.has(sig)) continue
            seen.add(sig)
            pending.push({ timestamp: raw.timestamp, content, container, severity })
          }
        }
        if (flushTimer === null) {
          flushTimer = setTimeout(flush, 100)
        }
      } catch (err) { console.error('parse log', err) }
    })
    es.addEventListener('error', () => {
      if (!alive) return
      // EventSource fires 'error' both for transient reconnect cycles and for
      // a hard closure. readyState === CLOSED (2) means the browser has
      // given up and the server is unreachable; readyState === CONNECTING
      // (0) just means the next retry is in progress. Since `since_seconds=5`
      // closes the response after every snapshot, every reconnect looked
      // like an error to the client — only the terminal CLOSED state is
      // worth surfacing to the user.
      if (es && es.readyState === 2 /* CLOSED */) {
        streaming.value = false
        error.value = '日志连接中断'
      }
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