import { onBeforeUnmount, ref, shallowRef, watch, type Ref } from 'vue'
import { readApiError } from '@/lib/apiError'
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
 * Merge a newest-first batch into a newest-first panel.
 *
 * The server reads a whole window, so a batch can hold lines OLDER than the
 * panel's oldest one (the backfill asked for fewer lines than the window
 * contains). Prepending such a batch would put the older lines on top of
 * the newer ones, so the two lists are merged by timestamp instead. The
 * timestamps come from the backend in one fixed format, so comparing them
 * as strings compares them as times.
 */
function mergeNewestFirst(batch: LogLineOut[], panel: LogLineOut[]): LogLineOut[] {
  const out: LogLineOut[] = []
  let i = 0
  let j = 0
  while (i < batch.length && j < panel.length) {
    if (batch[i].timestamp >= panel[j].timestamp) out.push(batch[i++])
    else out.push(panel[j++])
  }
  while (i < batch.length) out.push(batch[i++])
  while (j < panel.length) out.push(panel[j++])
  return out
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
  /**
   * 这次读取失败的原因：HTTP 状态码，和缺哪个权限。
   *
   * 「没权限读日志」和「日志连接断了」是两件事：前者要找管理员要权限，
   * 后者要找网络。混成一句话，读者会去查错的方向。而前者配「重试」按钮
   * 更糟——重试不会授予权限。
   */
  const errorStatus = ref<number | null>(null)
  const errorPermission = ref<string | null>(null)
  const error = ref<string | null>(null)
  const unreadCount = ref(0)

  // Lives in the composable scope (not inside start()) so the autoFollow
  // watcher can reach it across reconnects and the deferred backlog
  // survives a fresh history fetch. Reset only by clear() (user action).
  //
  // ponytail: 一批一批存，不是把行拍平存。之前把整个数组 reverse 一次，
  // 那是按「行」倒的，而要的是按「批」倒 —— 结果回到顶部时，攒着的几百行
  // 被打乱顺序插到面板最前面，最上面一行反而是最老的那条。现在 deferred
  // 存的是批的列表，commit 时按批倒序展开，每批内部保持「最新在前」。
  const deferred: LogLineOut[][] = []

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
  // Whether the HISTORY for the current target has actually arrived. A
  // failed history load left this false, and the backfill is gated on it:
  // the Retry button re-ran start() for the same target, so "the target did
  // not change" skipped the history fetch — the error cleared, the stream
  // opened, and the panel said "no logs yet" FOREVER while the pod's
  // history sat unrequested.
  let historyLoaded = false

  function closeStream() {
    es?.close()
    es = null
    streaming.value = false
  }

  function commitDeferred() {
    if (deferred.length === 0) return
    // Newest batch first, each batch internally newest-first — the panel
    // renders the array newest-first, so the buffer goes in as it came.
    const batch = deferred.slice().reverse().flat()
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
      historyLoaded = false
    }
    // The pill count IS the backlog length — keep the two in step. On a
    // target change the backlog was just cleared, so this reads 0. On a
    // re-open of the same target it preserves the count, which is what lets
    // the user know unread lines are still waiting when they scroll back up.
    unreadCount.value = deferred.reduce((n, b) => n + b.length, 0)
    error.value = null

    // Dedup the SSE backlog against what the panel already shows.
    //
    // BOUNDED, and sized from what actually has to be covered. The server now
    // dedups its own consecutive polls (see stream_logs), so within one
    // connection the client only has to cover two overlaps:
    //   1. the history backfill vs the first streamed batch — the stream opens
    //      by re-reading the tail window the backfill just read; and
    //   2. an EventSource reconnect, which replays `tail_lines` from scratch.
    // Both are bounded by the tail window, so sizing off `tail` with room to
    // spare is sufficient. The previous Set was append-only and grew for the
    // whole session (~288k entries at 10 lines/sec over 8h) while never being a
    // fixed point for anything.
    const seenCap = Math.max(2048, tail * 4)
    const seen = new Set<string>()
    const sigOf = (t: string, c: string) => `${t}\u0000${c}`
    const remember = (sig: string) => {
      // Set preserves insertion order, so the first key it yields is the
      // oldest — correct eviction without a second data structure.
      if (seen.size >= seenCap) {
        const oldest = seen.values().next().value
        if (oldest !== undefined) seen.delete(oldest)
      }
      seen.add(sig)
    }
    // Seed OLDEST-first. `seen` evicts its oldest entry when it is full, and
    // the panel is newest-first — so seeding it in panel order evicted the
    // NEWEST lines. Past `seenCap` the tail was gone from the set and the
    // stream's replay (the last `tail` lines, which the server re-reads)
    // came back as new and was prepended a second time.
    const seed = (ls: LogLineOut[]) => {
      for (let i = ls.length - 1; i >= 0; i--) {
        remember(sigOf(ls[i].timestamp, ls[i].content))
      }
    }
    if (sameTarget) {
      // Seed from the panel itself, because the backfill below is skipped on
      // this path and this is the only thing standing between the replay and
      // a doubled panel. `deferred` has to be seeded too: a replayed line
      // that is already waiting in the backlog would otherwise be queued in
      // `pending` and committed a second time on top of it.
      seed(lines.value)
      for (const b of deferred) seed(b)
    }

    // Backfill on a target change — and on a target whose history never
    // arrived. Re-fetching a target already on screen is what duplicated
    // lines: the response window overlaps both the rendered lines and the
    // preserved `deferred` backlog, `lines.value = flat` re-added the
    // overlap, and `commitDeferred()` then prepended the same content on top
    // — every overlapping line twice, with the pill reading 0 so nothing
    // warned the user first. Covered by the same-target re-open tests in
    // usePodLogs.spec.ts.
    if (!sameTarget || !historyLoaded) {
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
        seed(flat)
        historyLoaded = true
      } catch (e: any) {
        if (!alive || myGen !== gen) return
        historyLoaded = false
        // ponytail: 不用 axios 的原始 message。
        //
        // 那个字符串是 "Request failed with status code 500" —— 英文、
        // 带状态码、没有任何可行动的信息。接到真实集群上时它出现在中文
        // 界面的红条上，读者既不知道发生了什么，也拿不到原因。
        //
        // 后端现在每个错误都带 detail（"Pod 或容器不存在…"），用它；
        // 没有 detail 的（网络断了之类）用本地文案。
        // detail 在权限拒绝时是一个对象
      // （{code, permission, message}）——直接塞进界面会渲染出 JSON。
      const { status, message, permission } = readApiError(e)
      errorStatus.value = status
      errorPermission.value = permission
      error.value = message ?? (status ? `HTTP ${status}` : t('pod.logsLoadFailed'))
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
        // Merged, not prepended: the server reads a whole window, so the
        // batch can hold lines older than the panel's oldest one.
        lines.value = mergeNewestFirst(batch, lines.value)
        if (lines.value.length > max) {
          lines.value = lines.value.slice(0, max)
        }
      } else {
        // User is scrolled away — buffer for later and count for the pill.
        deferred.push(batch)
        // The cap counts lines, not batches.
        let buffered = 0
        for (const b of deferred) buffered += b.length
        while (buffered > max && deferred.length > 0) {
          buffered -= deferred.shift()!.length
        }
        unreadCount.value = buffered
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
            remember(sig)
            pending.push({ timestamp: raw.timestamp, content, container, severity })
          }
        }
        if (flushTimer === null) {
          flushTimer = setTimeout(flush, 100)
        }
      } catch (err) { console.error('parse log', err) }
    })
    es.addEventListener('end', () => {
      // The backend ends the stream when the pod or its only container is
      // gone — it sends `event: end` and closes the response. The native
      // EventSource sees EOF and reconnects every ~3s forever, re-running
      // the container lookup and a log read each time, while the panel
      // still claims to be streaming. So the stream is closed here and the
      // panel is told the tail is over.
      if (!alive || myGen !== gen) return
      closeStream()
      if (opts.streaming) opts.streaming.value = false
      // 权限拒绝不会因为重连而变好，而「日志连接中断」会把读者引去查网络
      // ——方向错了。已经说清楚是权限问题，就别覆盖它。
      if (errorPermission.value) return
      error.value = t('pod.logsDisconnected')
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
        // 写的是父组件那个 ref（opts.streaming），不是本地的 streaming。
        //
        // 之前这里写的是本地那个，于是 PodDetailView 的 logStreaming 仍是
        // true：面板底部一颗绿的「实时」，正文写着「日志连接中断」，工具栏
        // 的暂停按钮显示成播放图标（因为 LogViewer 读的是本地值）。
        // 同一块屏幕上三个互相矛盾的状态声明——恰恰是事故时读者最需要
        // 相信的那块面板。上面 end 分支写的正是 opts.streaming，两边对齐。
        if (opts.streaming) opts.streaming.value = false
        streaming.value = false
        if (errorPermission.value) return
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

  return { lines, streaming, error, errorStatus, errorPermission, unreadCount, start, close: closeStream, clear }
}
