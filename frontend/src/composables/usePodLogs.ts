import { onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
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
  /**
   * True when the user wants new lines to appear at the top immediately
   * (auto-follow the tail). False when the user has scrolled down to read
   * history — new lines must NOT prepend in that case or they shove the
   * user's viewport up while they try to scroll (the "scrollbar jitters
   * while pulling" symptom). The same ref is read by the LogViewer's pill
   * toggle and the SSE flush() here.
   */
  autoFollow?: Ref<boolean>
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
  // Only ever called from `<script setup>`, so `useI18n()` is available here.
  const { t } = useI18n()
  // ponytail: shallowRef — buffer replaced whole on each flush; never mutate inner line
  // objects, so deep reactivity would waste proxy overhead on every field of every line.
  const lines = shallowRef<LogLineOut[]>([])
  const streaming = ref(false)
  const error = ref<string | null>(null)
  const unreadCount = ref(0)

  // Lives in the composable scope (not inside start()) so the autoFollow
  // watcher can reach it across reconnects and the deferred backlog
  // survives a fresh history fetch. Reset only by clear() (user action).
  const deferred: LogLineOut[] = []

  const max = opts.maxBuffered ?? MAX_BUFFERED_DEFAULT
  const tail = opts.tailLines ?? TAIL_LINES_DEFAULT

  let es: EventSource | null = null
  let alive = true

  function closeStream() {
    es?.close()
    es = null
    streaming.value = false
  }

  function commitDeferred() {
    if (deferred.length === 0) return
    const batch = deferred.slice().reverse()
    lines.value = [...batch, ...lines.value]
    if (lines.value.length > max) {
      lines.value = lines.value.slice(0, max)
    }
    deferred.length = 0
    unreadCount.value = 0
  }

  // When the user re-engages auto-follow (clicks the pill or scrolls to
  // the top), flush whatever the SSE stream was holding back. Without this
  // watcher the deferred backlog would stay invisible until the next history
  // re-fetch.
  watch(() => opts.autoFollow?.value, (v) => {
    if (alive && v === true) commitDeferred()
  })

  async function start() {
    if (!alive || !opts.name.value) return
    closeStream()
    lines.value = []
    deferred.length = 0
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
      error.value = e?.response?.data?.detail ?? e?.message ?? t('pod.logsLoadFailed')
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
      const batch = pending.slice().reverse()
      if (opts.autoFollow?.value) {
        // User is at the top — prepend immediately (live tail experience).
        lines.value = [...batch, ...lines.value]
        if (lines.value.length > max) {
          lines.value = lines.value.slice(0, max)
        }
      } else {
        // User is scrolled away — buffer for later and count for the pill.
        deferred.push(...batch)
        if (deferred.length > max) {
          deferred.splice(0, deferred.length - max)
        }
        unreadCount.value = deferred.length
      }
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
        error.value = t('pod.logsDisconnected')
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

  function clear() { lines.value = []; unreadCount.value = 0; deferred.length = 0 }

  return { lines, streaming, error, unreadCount, start, close: closeStream, clear }
}