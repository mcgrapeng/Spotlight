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

/**
 * Log stream composable.
 *
 * Backed by native EventSource (SSE). Keeps a bounded ring buffer so a runaway
 * container doesn't OOM the browser tab. The same composable is used by
 * LogViewer (full UI) and AIAnalyzer (just needs the latest N lines).
 */
export function useLogStream(opts: UseLogStreamOptions) {
  const lines = ref<LogLine[]>([])
  const status = ref<'idle' | 'open' | 'closed' | 'error'>('idle')
  const errorMessage = ref<string | null>(null)
  let es: EventSource | null = null
  // Lifecycle flag — under Vue hot-reload, watchers can fire AFTER unmount
  // and would otherwise reopen a dangling EventSource. Set to false on unmount.
  let alive = true
  const max = opts.maxBuffered ?? 5000

  function close() {
    es?.close()
    es = null
    if (alive) status.value = 'closed'
  }

  function open() {
    if (!alive) return
    close()
    lines.value = []
    errorMessage.value = null
    const url = logsApi.streamUrl(
      opts.cluster.value, opts.namespace.value, opts.name.value,
      opts.container?.value, opts.tailLines ?? 200,
    )
    es = new EventSource(url)
    status.value = 'open'

    es.addEventListener('log', (e) => {
      if (!alive) return
      try {
        const line: LogLine = JSON.parse((e as MessageEvent).data)
        lines.value.push(line)
        if (lines.value.length > max) {
          lines.value.splice(0, lines.value.length - max)
        }
      } catch (err) { console.error('parse log', err) }
    })
    es.addEventListener('error', () => { if (alive) status.value = 'error' })
    es.addEventListener('end', close)
  }

  function clear() { lines.value = [] }

  // Only auto-reopen if the component is still mounted.
  watch(
    () => [opts.cluster.value, opts.namespace.value, opts.name.value, opts.container?.value],
    () => { if (alive && status.value === 'open') open() },
    { deep: false },
  )

  onBeforeUnmount(() => {
    alive = false
    close()
  })

  // Sanity-check: warn if used outside a component (likely a bug).
  if (!getCurrentInstance()) {
    console.warn('useLogStream() should be called from within a setup() function')
  }

  return { lines, status, errorMessage, open, close, clear }
}
