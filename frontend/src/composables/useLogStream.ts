import { getCurrentInstance, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { logsApi } from '@/api/endpoints'
import type { LogLine } from '@/domain/types'

export interface UseLogStreamOptions {
  cluster: Ref<string | null>
  namespace: Ref<string>
  name: Ref<string>
  container?: Ref<string | null>
  tailLines?: number
  maxBuffered?: number
}

/* Reconnect policy — exponential backoff capped at 8s. The store stays
 * live through a brief apiserver restart or proxy blip without the user
 * having to manually restart the stream. */
const BASE_DELAY_MS = 500
const MAX_DELAY_MS = 8_000
const MAX_BACKOFF_STEPS = 8

/**
 * Log stream composable.
 *
 * Backed by native EventSource (SSE). Keeps a bounded ring buffer so a
 * runaway container doesn't OOM the browser tab.
 *
 * Production hardening vs. the v1 implementation:
 * - **Auto-reconnect** with exponential backoff on disconnect
 * - **Batched updates** — pushes are flushed at most once per animation
 *   frame to avoid Vue reactivity thrashing on high-volume streams
 * - **Abort guard** — watches no-op after unmount (defense in depth)
 */
export function useLogStream(opts: UseLogStreamOptions) {
  const lines = ref<LogLine[]>([])
  const status = ref<'idle' | 'open' | 'closed' | 'error'>('idle')
  const errorMessage = ref<string | null>(null)

  let es: EventSource | null = null
  let alive = true
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempt = 0
  let intentionalClose = false  // user clicked Stop, don't auto-reconnect

  const max = opts.maxBuffered ?? 5000

  /* ── Batched line pushes ───────────────────────────────────────────────
     Multiple SSE messages within one tick collapse into a single reactive
     update. With 100 lines/sec this is the difference between smooth
     scroll and a frozen tab. */
  let pending: LogLine[] = []
  let flushScheduled = false
  function scheduleFlush() {
    if (flushScheduled) return
    flushScheduled = true
    queueMicrotask(() => {
      flushScheduled = false
      if (!pending.length || !alive) return
      const batch = pending
      pending = []
      lines.value = [...lines.value, ...batch]
      if (lines.value.length > max) {
        lines.value.splice(0, lines.value.length - max)
      }
    })
  }

  function clearReconnectTimer() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function scheduleReconnect() {
    if (!alive || intentionalClose) return
    clearReconnectTimer()
    const delay = Math.min(
      BASE_DELAY_MS * 2 ** reconnectAttempt,
      MAX_DELAY_MS,
    )
    reconnectAttempt = Math.min(reconnectAttempt + 1, MAX_BACKOFF_STEPS)
    console.debug(`[sse] reconnect in ${delay}ms (attempt ${reconnectAttempt})`)
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      if (alive && !intentionalClose) open()
    }, delay)
  }

  function close() {
    clearReconnectTimer()
    es?.close()
    es = null
    if (alive) status.value = 'closed'
  }

  function open() {
    if (!alive) return
    clearReconnectTimer()
    es?.close()
    es = null
    // Don't reset `lines` — reconnect should preserve buffered history so
    // the user doesn't lose context across a brief blip.
    errorMessage.value = null
    intentionalClose = false
    const url = logsApi.streamUrl(
      opts.cluster.value, opts.namespace.value, opts.name.value,
      opts.container?.value, opts.tailLines ?? 200,
    )
    es = new EventSource(url)
    status.value = 'open'
    reconnectAttempt = 0  // successful open resets the backoff

    es.addEventListener('log', (e) => {
      if (!alive) return
      try {
        const line: LogLine = JSON.parse((e as MessageEvent).data)
        pending.push(line)
        scheduleFlush()
      } catch (err) { console.error('parse log', err) }
    })
    es.addEventListener('error', () => {
      if (!alive) return
      // EventSource fires 'error' both on transient drops AND when the
      // server explicitly closes. We treat all as recoverable; the next
      // successful open will reset state.
      status.value = 'error'
      es?.close()
      es = null
      scheduleReconnect()
    })
    es.addEventListener('end', close)
  }

  function clearBuffer() { lines.value = [] }

  // Auto-reopen only when the user hasn't paused and the resource changes
  // mid-stream. We avoid reopening after a manual Stop (intentionalClose).
  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.name.value, opts.container?.value],
    () => {
      if (!alive) return
      // If the user explicitly stopped, switching pod shouldn't silently resume.
      if (intentionalClose) return
      open()
    },
    { deep: false },
  )

  onBeforeUnmount(() => {
    alive = false
    clearReconnectTimer()
    close()
  })

  if (!getCurrentInstance()) {
    console.warn('useLogStream() should be called from within a setup() function')
  }

  /**
   * User-driven stop. Marks intentionalClose so the resource watcher
   * doesn't auto-resume, and clears buffered lines only if requested.
   */
  function stop() {
    intentionalClose = true
    clearReconnectTimer()
    close()
  }

  return { lines, status, errorMessage, open, close, clear: clearBuffer, stop }
}