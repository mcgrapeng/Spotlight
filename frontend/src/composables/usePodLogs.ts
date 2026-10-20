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
  // Monotonic generation. `start()` is re-entered whenever the cluster,
  // namespace or pod changes, and those changes arrive while a previous
  // history request is still in flight. Without this, a slow response from
  // the OLD selection lands after the new one and overwrites it — showing one
  // cluster's logs under another's heading.
  let gen = 0
  // Identity of the target the current `lines` belong to. Keeps the panel
  // populated across a re-trigger that does not change the target (tab back to
  // Logs, reconnect) while still blanking it when the target genuinely changed
  // — otherwise pod A's lines sit under pod B's heading, forever, if B's
  // history fetch fails.
  let lastTarget = ''

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
    // The cluster selection is resolved by App.vue on mount, which runs AFTER
    // child setup. Starting before it lands opens a stream against whatever
    // the kubeconfig's current-context happens to be and then immediately
    // restarts when the real selection arrives — a flash, and briefly the
    // wrong cluster's logs. The watcher below re-runs on change, so waiting
    // here costs nothing.
    if (!opts.cluster.activeCluster) {
      // No cluster means nothing to stream to — but the PREVIOUS target's
      // stream still has to be torn down. Bailing out here used to skip both
      // `closeStream()` and `++gen`, so clearing the selection left the old
      // EventSource open (holding a backend session slot) and left its
      // handlers passing the `myGen === gen` guard, writing a dead cluster's
      // lines into the panel forever. Reachable whenever the selection is
      // cleared: `loadClusters()` nulls a restored cluster this login cannot
      // see, and `reset()` nulls it on logout.
      closeStream()
      ++gen
      lastTarget = ''
      lines.value = []
      deferred.length = 0
      unreadCount.value = 0
      error.value = null
      return
    }
    const myGen = ++gen
    const cluster0 = opts.cluster.activeCluster
    const ns0 = opts.namespace.value
    const name0 = opts.name.value
    const target = JSON.stringify([cluster0, ns0, name0])
    const sameTarget = target === lastTarget
    lastTarget = target
    closeStream()
    // Blank only on a target change. A re-trigger that keeps the same target
    // (tab back to Logs) used to blank the panel and wait for the refetch, so
    // every tab switch flashed. A target change must blank: the lines on
    // screen belong to a different cluster/namespace/pod, and a failed history
    // fetch would otherwise leave them there permanently under the new
    // heading — stale data presented as current.
    if (!sameTarget) {
      lines.value = []
      deferred.length = 0
    }
    // The pill count IS the backlog length — keep the two in step. On a
    // target change the backlog was just cleared, so this reads 0. On a
    // re-open of the same target it preserves the count, which is what lets
    // the user know unread lines are still waiting when they scroll back up.
    unreadCount.value = deferred.length
    error.value = null

    // Dedup the SSE backlog against what the panel already shows. The
    // follow-stream replays `tail_lines` on connect — and on every
    // EventSource auto-reconnect — which would otherwise double every line
    // (500 → 1000).
    //
    // ponytail / KNOWN LIMITATION: this Set is append-only and never pruned,
    // so it is bounded by the session's total line count, NOT by
    // `maxBuffered` — that caps `lines`, a different array. A pod left
    // streaming for a full shift grows it without limit (~288k entries at
    // 10 lines/sec over 8h). Deliberately left unbounded: a ring buffer would
    // need N larger than the largest replay window or a slow replay silently
    // re-delivers pruned lines, trading an 8-hour-tab leak for a duplicate-
    // lines bug that can fire in seconds. Tracked for removal with the SSE
    // redesign, where a server-side cursor replaces this Set outright.
    const seen = new Set<string>()
    const sigOf = (t: string, c: string) => `${t}\u0000${c}`
    if (sameTarget) {
      // Seed from the panel itself, because the backfill below is skipped on
      // this path and this is the only thing standing between the replay and
      // a doubled panel. `deferred` has to be seeded too: a replayed line
      // that is already waiting in the backlog would otherwise be queued in
      // `pending` and committed a second time on top of it.
      for (const l of lines.value) seen.add(sigOf(l.timestamp, l.content))
      for (const l of deferred) seen.add(sigOf(l.timestamp, l.content))
    }

    // Backfill only on a target change. Re-fetching a target already on
    // screen is what duplicated lines: the response window overlaps both the
    // rendered lines and the preserved `deferred` backlog, `lines.value =
    // flat` re-added the overlap, and `commitDeferred()` then prepended the
    // same content on top — every overlapping line twice, with the pill
    // reading 0 so nothing warned the user first. Covered by the
    // same-target re-open tests in usePodLogs.spec.ts.
    if (!sameTarget) {
      try {
        const { items } = await podsApi.historyLogs(
          cluster0,
          ns0,
          name0,
          null, tail,
        )
        if (!alive || myGen !== gen) return
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
        if (!alive || myGen !== gen) return
        error.value = e?.response?.data?.detail ?? e?.message ?? t('pod.logsLoadFailed')
      }
    }

    if (!alive || myGen !== gen) return

    const url = logsApi.streamUrl(
      cluster0,
      ns0,
      name0,
      null, tail,
    )
    es = new EventSource(url)
    streaming.value = true

    let pending: LogLineOut[] = []
    let flushTimer: ReturnType<typeof setTimeout> | null = null

    function flush() {
      flushTimer = null
      // The `log` listener is generation-guarded, but a batch that arrived
      // while this generation was still live has already armed this timer.
      // closeStream() does not cancel it, so without the check here it fires
      // after the stream was replaced and prepends the old target's tail into
      // the new target's panel.
      if (myGen !== gen) {
        pending = []
        return
      }
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
      // A replaced stream must not write into the new session's buffer — the
      // old EventSource's handlers close over their own `pending` but share
      // `lines`, so without this a late batch from the previous cluster lands
      // in the new one.
      if (!alive || myGen !== gen) return
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
      if (!alive || myGen !== gen) return
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
