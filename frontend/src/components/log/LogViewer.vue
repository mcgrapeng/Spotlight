<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch, type Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import {
  Search, Pause, Play, ChevronUp, ChevronDown, ChevronRight, ChevronsRight,
  Copy, X, Terminal, Filter, WrapText, Download, AlertCircle, HelpCircle,
  MoreHorizontal, Trash2, Info, TriangleAlert, CircleX,
} from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { foldRuns, normalize } from '@/lib/logFold'
import { virtualWindow } from '@/lib/logVirtual'
import { chipClasses } from '@/lib/chip'
import { useLogFilters } from '@/composables/useLogFilters'
import { useLogSeverityCounts, SEVERITY_FILTER_CHIPS, cumulativeSeverityCounts } from '@/composables/useLogSeverityCounts'
import { useLogKeyboardShortcuts } from '@/composables/useLogKeyboardShortcuts'
import { ansiToHtml, getAnsiFor } from '@/utils/ansiToHtml'
import { stripAnsi } from '@/domain/services/logFormat'
import { STORAGE_KEYS } from '@/storage-keys'
import type { LogLineOut } from '@/api/types'

const props = withDefaults(defineProps<{
  lines: ReadonlyArray<LogLineOut>
  streaming?: boolean
  unreadCount?: number
  containers?: readonly string[]
  podName?: string
  namespace?: string
  error?: string | null
  /** 403 时缺哪个权限——有它就没有「重试」按钮：重试不会授予权限。 */
  errorPermission?: string | null
  downloadScope?: 'all' | 'visible'
  /** Shared with usePodLogs: true = new lines are prepended immediately
   *  (auto-follow the tail); false = buffered as deferred backlog. The
   *  parent owns this ref so SSE flush and the UI pill stay in sync. */
  autoFollow?: boolean
}>(), {
  podName: '',
  namespace: '',
  error: null,
  errorPermission: null,
  downloadScope: 'visible',
  autoFollow: true,
})

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
  'update:autoFollow': [value: boolean]
  'consume-unread': []
  'update:filtered': [value: readonly LogLineOut[]]
  retry: []
}>()

// `locale` is destructured so it can be listed in the row v-memo arrays below:
// v-memo skips the whole row subtree when its deps are equal, and the rows now
// carry translated chrome — without the locale they would keep the old language.
//
// `livePulse` is on the same list for the same reason: the newest-line dot
// breathes only while a line is arriving, and v-memo would otherwise freeze
// the dot at its first-rendered class and the pulse would never start.
const { t, locale } = useI18n()

// === State ===
const search = ref('')
// `autoFollow` is owned by the parent (PodDetailView shares the same ref
// with usePodLogs). We mirror it into a local ref so v-if / watchers can
// react synchronously; mutations are pushed back via 'update:autoFollow'.
const autoFollow = ref(props.autoFollow ?? true)
watch(() => props.autoFollow, (v) => {
  if (typeof v === 'boolean') autoFollow.value = v
})
const wrapMode = ref<'wrap' | 'nowrap'>(
  (localStorage.getItem(STORAGE_KEYS.appLogWrap) as 'wrap' | 'nowrap') ?? 'nowrap',
)
watch(wrapMode, (m) => {
  try { localStorage.setItem(STORAGE_KEYS.appLogWrap, m) } catch { /* quota / disabled */ }
  // Wrapped rows are a different height than unwrapped ones; every cached
  // measurement is now wrong, so drop it and let the averages re-seed.
  groupHeights.clear()
  estSingleSum = 0
  estSingleCount = 0
  estRunSum = 0
  estRunCount = 0
  estSingle = LINE_HEIGHT
  estRun = LINE_HEIGHT
  nextTick(() => {
    rebuildOffsets()
    recomputeVirtualRange()
    scheduleSettle(captureAnchor())
  })
})
function toggleWrap() {
  wrapMode.value = wrapMode.value === 'wrap' ? 'nowrap' : 'wrap'
}
// ponytail: nowrap mode lets long lines trigger horizontal scroll on the
// grid row (ts + badge stay sticky on the left via `position: sticky`), so
// we drop text-ellipsis here. wrap mode still wraps inside col 3.
const wrapClass = computed(() =>
  wrapMode.value === 'wrap'
    ? 'whitespace-pre-wrap break-all'
    : 'whitespace-nowrap',
)
const scrollEl = ref<HTMLElement | null>(null)
const searchInput = ref<InstanceType<typeof HTMLInputElement> | null>(null)
// === Reading position memory ===
//
// The reading position is stored as an IDENTITY: which group was at the top
// of the viewport, and how far into it. A pixel offset only means something
// relative to the model that produced it, and the model moves every time
// lines are prepended or trimmed, so a stored pixel drifts onto a different
// line every time the tab is switched back.
const scrollMemoryKey = computed(() => `k8s-log-scroll:${props.namespace}:${props.podName}`)

interface ScrollMemory {
  key: string
  offset: number
}

function saveScrollMemory(): void {
  const el = scrollEl.value
  if (!el) return
  try {
    const top = el.scrollTop
    // At the top there is nothing to come back to: the newest line is the
    // position, and the follower owns it.
    if (top <= FOLLOW_EPSILON) {
      sessionStorage.removeItem(scrollMemoryKey.value)
      return
    }
    const idx = indexAt(top)
    const g = groups.value[idx]
    if (!g) return
    sessionStorage.setItem(
      scrollMemoryKey.value,
      JSON.stringify({ key: g.key, offset: top - (offsetsBuf[idx] ?? 0) }),
    )
  } catch { /* quota / disabled */ }
}

function readScrollMemory(): ScrollMemory | null {
  try {
    const raw = sessionStorage.getItem(scrollMemoryKey.value)
    if (!raw) return null
    const m = JSON.parse(raw) as ScrollMemory
    if (typeof m?.key !== 'string' || typeof m?.offset !== 'number') return null
    return m
  } catch { /* quota / disabled */ }
  return null
}

/** Put the reader back on the group they left, at the same distance into it. */
function restoreScrollMemory(): void {
  const mem = readScrollMemory()
  if (!mem) return
  const idx = groups.value.findIndex((g) => g.key === mem.key)
  if (idx < 0) return
  pendingRestore = { idx, offset: mem.offset }
  applyAnchor({ idx, delta: mem.offset })
}

// === Filtering ===
const minSeverity = ref(0)
// ponytail: 「未识别」是一个筛选，不是档位。
//
// 档位（INFO+/WARN+/ERROR+）是「severity >= rank」，而未识别的行没有
// severity 可比 —— 它们只能被单独挑出来。所以这是一个独立开关，不是
// 第五个 rank。
const unknownOnly = ref(false)

const { filtered, searchMatched } = useLogFilters({
  lines: toRef(props, 'lines'),
  search,
  minSeverity,
  unknownOnly,
})

defineExpose({})

// 折叠规则（normalize / foldRuns）在 lib/logFold.ts：纯函数，单独可测。

// === Trace_id extraction + hash → HSL hue (same UUID → same color) ===
const TRACE_ID_RE = /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i
function extractTraceId(content: string): string | null {
  return content.match(TRACE_ID_RE)?.[1] ?? null
}
function traceIdColor(tid: string): string {
  let h = 0
  for (let i = 0; i < tid.length; i++) {
    h = ((h << 5) - h + tid.charCodeAt(i)) | 0
  }
  return `hsl(${Math.abs(h) % 360} 60% 45%)`
}

// ponytail: JSON cache must live BEFORE the WeakMap helpers — they call parseJson at
// decorate-time, and decorate runs when watch(displayedLines, {immediate:true}) tracks
// its source during setup. If jsonCache were still in TDZ, cachedIsJson would throw.
// ponytail: WeakMap keyed by LogLineOut — entries GC'd when the line drops out of the
// buffer. Map<string,> grew unboundedly across long sessions (audit T1).
const jsonCache = new WeakMap<LogLineOut, unknown>()
function parseJson(line: LogLineOut): unknown {
  const cached = jsonCache.get(line)
  if (cached !== undefined) return cached
  let parsed: unknown = null
  // A log line is JSON only if it opens with { or [. Asking JSON.parse and
  // catching the SyntaxError threw an exception PER LINE — 10,000 of them
  // on a full buffer — and the throw cost more than the rest of the
  // panel's work put together (measured: 1.4 s of a 2.1 s profile, with
  // the panel blocked for a quarter of a second while it happened).
  const first = line.content.trimStart()[0]
  if (first === '{' || first === '[') {
    try { parsed = JSON.parse(line.content) } catch { /* not JSON after all */ }
  }
  if (parsed === null || typeof parsed !== 'object') parsed = null
  jsonCache.set(line, parsed)
  return parsed
}

// ponytail: per-line WeakMap caches — auto-clean when lines drop out of the buffer.
// Decorate once per line; render path reads primitives off the line, no per-row
// regex/JSON.parse.
const traceIdCache = new WeakMap<LogLineOut, string | null>()
const isJsonCache = new WeakMap<LogLineOut, { isJson: boolean }>()
const sigCache = new WeakMap<LogLineOut, string>()

function cachedTraceId(line: LogLineOut): string | null {
  let v = traceIdCache.get(line)
  if (v === undefined) {
    v = extractTraceId(line.content)
    traceIdCache.set(line, v)
  }
  return v
}

function cachedIsJson(line: LogLineOut): boolean {
  let v = isJsonCache.get(line)
  if (!v) {
    v = { isJson: parseJson(line) !== null }
    isJsonCache.set(line, v)
  }
  return v.isJson
}

function cachedSig(line: LogLineOut): string {
  let s = sigCache.get(line)
  if (s === undefined) {
    s = normalize(line.content)
    sigCache.set(line, s)
  }
  return s
}

interface DecoratedLine {
  raw: LogLineOut
  traceId: string | null
  isJson: boolean
}

// ponytail: stable identity per LogLineOut object. Index-based group keys
// broke under prepend (SSE flush shifts every index) — virtual-scroll +
// v-memo then patched stale DOM refs and crashed with insertBefore(null).
// Ids survive prepends; distinct-but-identical payloads (history + SSE
// replay) also get distinct ids, so keys never collide.
const lineIdCache = new WeakMap<LogLineOut, string>()
let lineIdSeq = 0
function lineId(line: LogLineOut): string {
  let v = lineIdCache.get(line)
  if (v === undefined) {
    v = `l${++lineIdSeq}`
    lineIdCache.set(line, v)
  }
  return v
}
const decorated = computed<DecoratedLine[]>(() =>
  filtered.value.map(line => ({
    raw: line,
    traceId: cachedTraceId(line),
    isJson: cachedIsJson(line),
  })),
)

interface Group {
  kind: 'single' | 'run'
  /**
   * Stable identity of the group. It survives a prepend: a run's key is its
   * OLDEST line, and prepending only ever extends a run at its front.
   */
  key: string
  /** The group's lines, newest first. A 'single' group has exactly one. */
  lines: DecoratedLine[]
  expanded: boolean
}

const expanded = ref(new Set<string>())

/**
 * Signature used to decide whether two neighbouring lines fold together.
 *
 * Two lines fold only when their normalized text matches AND neither of
 * them is a JSON payload.
 *
 * `normalize()` maps every number to 'N', so
 * `{"msg":"json payload 399","n":39}` and `{"msg":"json payload 398","n":38}`
 * normalize to the same string. A busy structured log therefore folded into
 * a single row that displayed one payload and hid the other 39 behind a
 * JSON button whose state nothing rendered. A JSON line carries a unique
 * signature, so every payload keeps its own row and its own expander.
 */
function foldSig(line: DecoratedLine): string {
  return line.isJson ? '\u0000json\u0000' + lineId(line.raw) : cachedSig(line.raw)
}

const groups = computed<Group[]>(() =>
  // ponytail: 日志按时间正序渲染，最新的在最后（`kubectl logs -f` 的约定，
  // 追 stack trace 时不会每来一行就整体下移）。props.lines 是最新在前，
  // 所以组在这里反一次。组内的行保持最新在前：折叠行显示的是这一组里
  // 最新一条的时间戳，那是「它还在发生吗」的信号。
  foldRuns(
    displayedLines.value,
    foldSig,
    (l) => lineId(l.raw),
    (key) => expanded.value.has(key),
  ).reverse(),
)

// === Virtual scroll (NEWEST AT BOTTOM, the tail is the bottom) ===
//
// Virtualizing with a spacer above and below the rendered window is a
// promise: "the pixels outside the window are represented by that spacer".
// The browser audits the promise through two channels, and it caught the
// lie in both.
//
//   1. The total scroll height. When the model and the DOM disagree about
//      how tall the content is, the total changes every time the window
//      slides, and the scrollbar thumb breathes.
//   2. Native scroll anchoring. When the content above the viewport
//      resizes, the browser moves scrollTop to keep its anchor node in
//      place, so scrollTop walks backwards while the reader scrolls
//      forward. That is the flicker this panel was reported for.
//
// A flat LINE_HEIGHT could not hold that promise. Rows are 22px, 25.5px (a
// row carrying the JSON chip), 44px and up (wrapped text), and an expanded
// fold adds one row per folded line. So every group's height is measured
// from the DOM, and the spacers come from a prefix sum of those
// measurements. Groups that have never been rendered fall back to a per-kind
// average, which is what the scrollbar is made of until the reader gets
// there.
//
// The measurement reads ONE element per group. Every group renders inside a
// wrapper that carries the group's key, so the wrapper's height IS the
// group's height, and a sibling that forgets to be tagged cannot hide from
// the measurement. The previous revision tagged individual rows and summed
// them per key, and it left a 962px hole: folded runs and expanded JSON
// panels carried no key at all.
const LINE_HEIGHT = 22
const BUFFER = 8
// How close to the top still counts as "following the tail". Everything
// below it is history.
const FOLLOW_EPSILON = 4
// How far down the reader has to go before the follow is broken. A small
// band above this keeps a trackpad nudge from stopping the tail, and the
// anchor correction means a reader inside the band is not dragged around
// by the lines prepended above them.
const FOLLOW_BREAK = 50

// The window can only be computed once the scroller exists, because the
// viewport is part of the computation. The initial range covers the first
// screenful so the first paint is not an empty panel, and onMounted
// narrows it to what actually fits.
const virtualRange = ref({ start: 0, end: 100 })
const wrapEl = ref<HTMLElement | null>(null)

// Measured height per group key.
const groupHeights = new Map<string, number>()
// Per-kind estimate for groups that have never been rendered. A running
// average over the groups measured so far: a frozen average carries a
// systematic bias into every unrendered group, and the bias accumulates
// over thousands of groups until the scrollbar no longer describes the
// content. A running average converges instead, and once it has converged
// its per-update step is small enough to be invisible in the thumb.
//
// The sample is kept per group, so a group that is measured on every frame
// contributes once rather than once per frame.
let estSingleSum = 0
let estSingleCount = 0
let estRunSum = 0
let estRunCount = 0
let estSingle = LINE_HEIGHT
let estRun = LINE_HEIGHT
const estSamples = new Map<string, { h: number; run: boolean }>()

// Prefix sum of group heights. offsets[i] is the distance from the top of
// the content to the top of group i; offsets[n] is the total height.
//
// A Float64Array OUTSIDE Vue's reactivity. Routing a ten-thousand entry
// table through a computed made every scroll event allocate a reactive
// array and re-render both spacers; the arithmetic itself is microseconds.
let offsetsBuf = new Float64Array(1)

// The two spacers. Plain refs, written imperatively by syncSpacers().
const padTop = ref(0)
const padBottom = ref(0)

function heightOf(g: Group): number {
  const h = groupHeights.get(g.key)
  if (h !== undefined) return h
  return g.kind === 'run' ? estRun : estSingle
}

function rebuildOffsets(): void {
  const gs = groups.value
  const n = gs.length
  if (offsetsBuf.length < n + 1) {
    offsetsBuf = new Float64Array(Math.max(n + 1, 64))
  }
  let acc = 0
  offsetsBuf[0] = 0
  for (let i = 0; i < n; i++) {
    acc += heightOf(gs[i])
    offsetsBuf[i + 1] = acc
  }
}

/** Largest group index whose top edge is at or above `px`. */
function indexAt(px: number): number {
  const n = groups.value.length
  let lo = 0
  let hi = n
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (offsetsBuf[mid + 1] <= px) lo = mid + 1
    else hi = mid
  }
  return lo
}

function recomputeVirtualRange(): void {
  const el = scrollEl.value
  if (!el) return
  // 窗口的算法（跟随尾巴时必须含最后一组、不跟随时贴滚动位置、两头夹住）
  // 在 lib/logVirtual.ts：纯计算，单独可测。这里只管读 DOM 和发给渲染层。
  const next = virtualWindow({
    count: groups.value.length,
    scrollTop: el.scrollTop,
    viewportHeight: el.clientHeight,
    autoFollow: autoFollow.value,
    lineHeight: LINE_HEIGHT,
    buffer: BUFFER,
    indexAt,
  })
  if (next.start !== virtualRange.value.start || next.end !== virtualRange.value.end) {
    virtualRange.value = next
  }
  syncSpacers()
}

function syncSpacers(): void {
  const { start, end } = virtualRange.value
  padTop.value = offsetsBuf[start] ?? 0
  const tail = offsetsBuf[groups.value.length] ?? 0
  padBottom.value = Math.max(0, tail - (offsetsBuf[end] ?? 0))
}

const renderedGroups = computed(() => {
  const { start, end } = virtualRange.value
  return groups.value.slice(start, end)
})

/**
 * Measure every group currently in the DOM.
 *
 * Returns true when the model and the DOM had drifted apart, which means
 * the spacers and the window have to be recomputed.
 */
function measureRendered(): boolean {
  const wrap = wrapEl.value
  if (!wrap) return false
  const rendered = renderedGroups.value
  let changed = false
  let i = 0
  for (const node of wrap.children) {
    const key = (node as HTMLElement).dataset.gkey
    if (key === undefined) continue
    const g = rendered[i++]
    if (!g) continue
    const h = (node as HTMLElement).getBoundingClientRect().height
    if (h <= 0) continue
    const prev = groupHeights.get(key)
    if (prev === undefined || Math.abs(prev - h) > 0.25) {
      groupHeights.set(key, h)
      changed = true
    }
    // Only a collapsed group is a fair sample of its kind: an expanded one
    // carries a row per folded line and would poison the estimate.
    if (!g.expanded) sampleForEstimate(key, h, g.kind === 'run')
  }
  const prevSingle = estSingle
  const prevRun = estRun
  if (estSingleCount > 0) estSingle = estSingleSum / estSingleCount
  if (estRunCount > 0) estRun = estRunSum / estRunCount
  if (Math.abs(estSingle - prevSingle) > 0.005 || Math.abs(estRun - prevRun) > 0.005) {
    changed = true
  }
  pruneMeasurements()
  return changed
}

/** Fold a group's height into the per-kind estimate, once per distinct height. */
function sampleForEstimate(key: string, h: number, isRun: boolean): void {
  const prev = estSamples.get(key)
  if (prev === undefined) {
    estSamples.set(key, { h, run: isRun })
    if (isRun) {
      estRunSum += h
      estRunCount++
    } else {
      estSingleSum += h
      estSingleCount++
    }
    return
  }
  if (Math.abs(prev.h - h) <= 0.25) return
  estSamples.set(key, { h, run: isRun })
  if (isRun) estRunSum += h - prev.h
  else estSingleSum += h - prev.h
}

/**
 * Drop the measurements of groups that are no longer in the buffer.
 *
 * The keys are per line object, and the buffer turns over, so without this
 * the map would grow for the life of the tab. A group that leaves the
 * buffer also leaves the estimate: its height would otherwise keep pulling
 * the average towards whatever it used to be.
 */
function pruneMeasurements(): void {
  if (groupHeights.size <= groups.value.length * 2 + 512) return
  const live = new Set<string>()
  for (const g of groups.value) live.add(g.key)
  for (const key of [...groupHeights.keys()]) {
    if (live.has(key)) continue
    groupHeights.delete(key)
    const sample = estSamples.get(key)
    if (sample === undefined) continue
    estSamples.delete(key)
    if (sample.run) {
      estRunSum -= sample.h
      estRunCount--
    } else {
      estSingleSum -= sample.h
      estSingleCount--
    }
  }
}

interface Anchor {
  /** Index of the group at the top of the viewport. */
  idx: number
  /** Distance from that group's top edge to the top of the viewport. */
  delta: number
  /** The reader was at the end of the content, not in the middle of it. */
  atBottom?: boolean
}

/**
 * Is the reader AT the tail?
 *
 * The follow MODE says "keep following"; this says "they are really there".
 * The two are not the same thing, and the difference is the reader's own
 * scroll: the tail-pin moves the scroll position to the bottom of the
 * content, so pinning a reader who is NOT at the tail throws their scroll
 * away — the row under the cursor jumps and falls back.
 *
 * It cannot be derived from the geometry either: the tail moves under the
 * reader as new lines arrive, so a reader who was at the tail a moment ago
 * is suddenly a few pixels above it. That is the tail growing, not the
 * reader leaving, and the follow has to carry them along with it.
 *
 * So it is a state, not a measurement: the reader is at the tail until they
 * move, and they are somewhere else once they do.
 */
let readerAtTail = true

/**
 * Pin the group the reader is looking at.
 *
 * Measuring a group replaces an estimate with its real height, which moves
 * every offset after it. Without a correction the content slides under the
 * cursor, which is the flicker. The anchor is the group whose box contains
 * the top of the viewport; once the measurements land we put it back at the
 * same distance from the top of the viewport, so the visible rows do not
 * move even though the rows below them just changed height.
 */
function captureAnchor(): Anchor | null {
  const el = scrollEl.value
  if (!el) return null
  const top = el.scrollTop
  if (groups.value.length === 0) return null
  // A follower AT THE TAIL is anchored to it BY DEFINITION. The geometric
  // test cannot be used here: the model's end and the DOM's end disagree
  // for a frame while the tail is being measured (the last group may be a
  // folded run of forty identical lines, estimated at one row and really
  // forty), so a follower would look like they had scrolled away and would
  // be stranded above the newest line.
  //
  // A follower who is NOT at the tail keeps their own position: the
  // geometric anchor holds their place in the content while the tail grows
  // under them, instead of the panel dragging them back to it.
  if (autoFollow.value && readerAtTail) {
    return { idx: groups.value.length - 1, delta: 0, atBottom: true }
  }
  const idx = indexAt(top)
  return { idx, delta: top - (offsetsBuf[idx] ?? 0) }
}

function applyAnchor(a: Anchor | null): void {
  const el = scrollEl.value
  if (!el || !a) return
  let next: number
  if (a.atBottom) {
    // The DOM's own bottom, not the model's. The spacers are the model,
    // but the model and the DOM disagree for a frame while the tail is
    // being measured, and a target past the DOM's scrollable height is
    // silently clamped to it — which is how a follower ends up a screenful
    // above the newest line.
    next = Math.max(0, el.scrollHeight - el.clientHeight)
  } else {
    next = (offsetsBuf[a.idx] ?? 0) + a.delta
  }
  // 'instant' is required, not cosmetic. A smooth scroll would animate
  // towards the corrected position and read as the content sliding around
  // under the cursor, which is the very thing being corrected.
  if (Math.abs(next - el.scrollTop) > 0.5) {
    anchorAppliedAt = next
    el.scrollTo({ top: next, behavior: 'instant' as ScrollBehavior })
  }
}

// One settle per animation frame: measure what the DOM now holds, fold it
// into the model, and put the reader back where they were. The frame the
// scroll happened in is the frame the correction happens in, so the reader
// never sees the intermediate position.
let settleRaf = 0
let pendingAnchor: Anchor | null = null
// Pending scroll-position write, coalesced to one per animation frame. A
// wheel drag fires onScroll dozens of times a second and sessionStorage
// writes are synchronous main-thread work, so the persistence that was
// meant to be invisible was itself part of the stutter while scrolling.
let scrollRaf = 0

function scheduleSettle(anchor: Anchor | null): void {
  if (anchor) pendingAnchor = anchor
  if (settleRaf) return
  settleRaf = requestAnimationFrame(() => {
    settleRaf = 0
    settle()
  })
}

// A restore is expressed as a group's identity, not as a pixel offset: a
// pixel only means something relative to the model that produced it, and
// the model moves every time lines are prepended or trimmed. Once the
// group has been measured the offset can be applied exactly, so the
// restore is replayed after every model change until the reader takes
// over.
let pendingRestore: { idx: number; offset: number } | null = null
// Where the reader was, last time the scroller reported a position. A
// scroll event fires for two reasons: the reader moved, or the content
// changed size under them. Only the first ends the follow.
let lastScrollTop = 0
// Where the anchor correction last put the reader. A scroll event at that
// exact position is the correction's own echo, not the reader.
let anchorAppliedAt = -1
// Where the restore last put the reader. A scroll that lands somewhere
// else is the reader taking over, and the restore stops replaying.
let restoreAppliedAt = -1

function settle(): void {
  const anchor = pendingAnchor
  pendingAnchor = null
  if (measureRendered()) {
    rebuildOffsets()
    recomputeVirtualRange()
  }
  if (pendingRestore) {
    // The restore owns the position until the reader takes over: it is the
    // group they left, and the model is still settling towards it.
    const before = scrollEl.value?.scrollTop ?? 0
    applyAnchor({ idx: pendingRestore.idx, delta: pendingRestore.offset })
    restoreAppliedAt = scrollEl.value?.scrollTop ?? before
    return
  }
  applyAnchor(anchor)
}

// A group can change height without the window moving: a fold opens, a
// JSON panel expands, a web font swaps in. The observer catches those,
// because a height the model has never seen is exactly the blind spot that
// made the spacers lie about the content.
let resizeObserver: ResizeObserver | null = null

function onMotionPreferenceChange(e: MediaQueryListEvent): void {
  prefersReducedMotion.value = e.matches
}

/** Point the observer at the groups currently in the DOM. */
function observeRenderedGroups(): void {
  const ro = resizeObserver
  const wrap = wrapEl.value
  if (!ro || !wrap) return
  ro.disconnect()
  for (const node of wrap.children) {
    if ((node as HTMLElement).dataset.gkey !== undefined) ro.observe(node)
  }
}

watch(virtualRange, () => {
  nextTick(observeRenderedGroups)
})

function toggleExpand(key: string) {
  const s = new Set(expanded.value)
  if (s.has(key)) s.delete(key); else s.add(key)
  expanded.value = s
}

// === Severity counts (4 aggregated buckets) ===
//
// The level chips count the lines the reader would GET if they clicked the
// chip: the current container, within the current search. They used to count
// the whole buffer, so with sidecar selected the chips still described the
// other container's lines — three numbers on screen, each about a different
// set than the one in front of the reader.
const counts = useLogSeverityCounts(computed(() => {
  const sc = selectedContainer.value
  if (!sc) return searchMatched.value
  return searchMatched.value.filter((l) => l.container === sc)
}))
// 芯片显示的是「点了之后会看到几行」，不是该档位自己的行数。
const chipCounts = computed(() => cumulativeSeverityCounts(counts.value))

// ponytail: 一枚和「全部」写着同一个数字的芯片不渲染。
//
// 「≥ INFO」在没有任何 debug 行时和「全部」是同一批行。两枚芯片写着同
// 一个数字，一枚黑底一枚灰字，读起来像两个状态而不是一个——这个面板早
// 就因为「全部」和「DEBUG」并排出现、两枚都自称激活而吃过亏（见下面
// 芯片组的注释）。
//
// 它正在被选中时不能消失：那样面板上就没有任何一枚激活的芯片了。计数
// 为 0 的芯片照旧留着（禁用状态），它们占着位置，位置就不会跳。
// How many lines "all levels" would show: the current container, within the
// current search. The chip next to it used to print the whole buffer's size.
const levelAllCount = computed(() => {
  const sc = selectedContainer.value
  const src = searchMatched.value
  return sc ? src.filter((l) => l.container === sc).length : src.length
})

const severityChips = computed(() =>
  SEVERITY_FILTER_CHIPS.filter((chip) => {
    if (minSeverity.value === chip.rank) return true
    return chipCounts.value[chip.bucket] !== levelAllCount.value
  }),
)

// The name of the severity filter, in the reader's words. The panel used to
// print the internal rank here ("severity ≥ 2") where the chip the reader
// clicked says "WARN+" — two names for one thing, one of them not a word.
const severityFilterLabel = computed(() => {
  const chip = SEVERITY_FILTER_CHIPS.find((c) => c.rank === minSeverity.value)
  return chip ? `≥ ${chip.bucket.toUpperCase()}` : ''
})

// === Additional filter pipeline: container ===
const selectedContainer = ref<string | null>(null)
const availableContainers = computed(() => props.containers ?? [])

// The container chips count the lines within the current LEVEL filter, so
// with ERROR+ active they say how many errors each container holds. They
// used to count the whole buffer, so the row stayed frozen while the level
// filter changed the rows underneath it.
const containerCounts = computed(() => {
  const c: Record<string, number> = {}
  for (const l of filtered.value) c[l.container] = (c[l.container] ?? 0) + 1
  return c
})

watch(availableContainers, (cs) => {
  if (selectedContainer.value && !cs.includes(selectedContainer.value)) {
    selectedContainer.value = null
  }
})

const displayedLines = computed(() => {
  let lines = decorated.value
  const sc = selectedContainer.value
  if (sc) lines = lines.filter((l) => l.raw.container === sc)
  return lines
})

// === Auto-scroll (NEWEST AT BOTTOM → the tail is the bottom) ===
//
// The app owns scrollTop. The container carries no CSS scroll-behavior and
// native scroll anchoring is off, so nothing moves the scroll position
// behind the model's back.
//
//   - a reader command (jump to newest, jump to error, page) animates,
//     unless the reader asked for reduced motion;
//   - a correction (putting the reader back where the measurement moved
//     them) is instant, because an animated correction reads as the very
//     slide it is correcting.
const prefersReducedMotion = ref(false)
let motionQuery: MediaQueryList | null = null

function commandBehavior(): ScrollBehavior {
  return prefersReducedMotion.value ? 'instant' : 'smooth'
}

function scrollToPosition(top: number, kind: 'command' | 'correction' = 'command'): void {
  const el = scrollEl.value
  if (!el) return
  el.scrollTo({
    top,
    behavior: kind === 'correction' ? ('instant' as ScrollBehavior) : commandBehavior(),
  })
}

function jumpToBottom(instant = false) {
  const el = scrollEl.value
  if (!el) return
  scrollToPosition(
    Math.max(0, el.scrollHeight - el.clientHeight),
    instant ? 'correction' : 'command',
  )
  if (instant) {
    // The virtual window is chosen from the scroll position, so it has to
    // be recomputed after the jump. Without this the reader lands on the
    // spacer below the last rendered group instead of on the tail — the
    // panel would be at the bottom and still showing the oldest lines.
    recomputeVirtualRange()
  }
}

watch(displayedLines, (v) => {
  emit('update:filtered', v.map(d => d.raw))
  // The group list changed, so every offset moved. The model is rebuilt
  // before the window is recomputed, otherwise the window would be chosen
  // from stale offsets.
  rebuildOffsets()
  recomputeVirtualRange()
  scheduleSettle(captureAnchor())
}, { immediate: true })

// New lines arriving re-pin a follower through the anchor path
// (captureAnchor -> atBottom -> applyAnchor), which runs after the DOM has
// settled and knows the real bottom. An earlier version of this file also
// watched props.lines.length here, but the DOM had not re-rendered yet, so
// it resolved to the reader's current position and did nothing.

// === Live region ===
// The virtualized region is aria-live="off" (a scroll re-renders a window
// of rows, and a polite region would read all of them out). This is the
// half that matters: how many lines arrived.
const liveMessage = ref('')
let lastLineCount = 0
watch(() => props.lines.length, (n) => {
  const grew = n - lastLineCount
  lastLineCount = n
  if (grew > 0) liveMessage.value = t('log.newLines', { count: grew })
})

function onScroll() {
  if (!scrollEl.value) return
  const top = scrollEl.value.scrollTop
  // A pending restore is the position the reader was last at. As soon as
  // they move away from it, they have taken over and the restore stops
  // replaying.
  if (pendingRestore) {
    if (Math.abs(top - restoreAppliedAt) > 1) pendingRestore = null
  }
  // Restore-on-remount: switching tabs unmounts the LogViewer; persist the
  // reading position so coming back resumes where the user was. The
  // position is stored as an IDENTITY (which group was at the top) rather
  // than as a pixel offset, because a pixel only means something relative
  // to the model that produced it, and the model moves every time lines
  // are prepended or trimmed. Coalesced to one write per frame: a wheel
  // drag fires onScroll dozens of times a second and sessionStorage.setItem
  // is synchronous main-thread work.
  if (scrollRaf === 0) {
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0
      saveScrollMemory()
    })
  }
  // Newest-at-bottom: the tail is the bottom of the scroller, so "how far
  // from the newest line am I" is the distance from the bottom.
  const distFromBottom = scrollEl.value.scrollHeight - scrollEl.value.clientHeight - top
  // Did the READER move, or did the content change size under them? The
  // tail growing (a new log line, a fold they opened) moves the bottom
  // away from a reader who is standing still, and the anchor correction
  // carries them along — that is not them leaving.
  const movedUp = top < lastScrollTop - 1
  // One-shot: the correction's own echo is consumed here, so a later
  // genuine scroll that happens to pass the same pixel is not mistaken for
  // one — and the reader is not yanked back to the tail.
  const corrected = anchorAppliedAt >= 0 && Math.abs(top - anchorAppliedAt) <= 1
  if (corrected) anchorAppliedAt = -1
  lastScrollTop = top
  if (distFromBottom <= FOLLOW_EPSILON) {
    // The reader is at the tail. From here on the tail-pin is theirs: the
    // tail grows under them and the correction carries them along with it.
    readerAtTail = true
    // User is back at the tail — re-engage auto-follow and clear unread.
    if (!autoFollow.value) {
      autoFollow.value = true
      emit('update:autoFollow', true)
      emit('consume-unread')
    }
  } else if (movedUp && !corrected) {
    // The reader left the tail. A small band keeps the follow on — the tail
    // still follows them — but the panel must stop pinning them to the
    // bottom: from here on their own scroll is what moves the content.
    readerAtTail = false
    if (distFromBottom > FOLLOW_BREAK && autoFollow.value) {
      // User scrolled away from top — disable auto-follow, show unread pill.
      // The emit is mandatory, not just for the pill: `autoFollow` is a LOCAL
      // mirror of the ref PodDetailView shares with usePodLogs, and flush()
      // reads that shared one to decide prepend-vs-defer. Without this emit the
      // shared ref stayed `true`, so every incoming batch was spliced into the
      // top of `lines` while the user was reading history — the content moved
      // under their cursor on every flush. `deferred` never filled, so the pill
      // was dead too and returning to the top committed nothing.
      autoFollow.value = false
      emit('update:autoFollow', false)
    }
  }
  // The anchor's shape depends on the follow state, and the window is
  // chosen from it, so both come after the detection above.
  const anchor = captureAnchor()
  recomputeVirtualRange()
  // The groups that just scrolled in have never been measured. Measure
  // them once the DOM has settled, then put the reader back where the
  // measurement moved them.
  scheduleSettle(anchor)
}

function toggleAutoFollow() {
  autoFollow.value = !autoFollow.value
  emit('update:autoFollow', autoFollow.value)
  if (autoFollow.value) {
    // The reader asked for the tail, so the tail-pin is theirs from here.
    readerAtTail = true
    emit('consume-unread')
    jumpToBottom()
  }
}

// === Keyboard (owned by the panel while it is on screen) ===
const helpOpen = ref(false)

function focusSearchInput() {
  searchInput.value?.focus()
}
function toggleErrorsOnly() {
  // 3 = error rank (matches useLogFilters SEVERITY_RANK).
  minSeverity.value = minSeverity.value === 3 ? 0 : 3
  unknownOnly.value = false
}
function jumpToError(dir: 1 | -1) {
  const el = scrollEl.value
  if (!el) return
  const gs = groups.value
  if (gs.length === 0) return
  const cur = indexAt(el.scrollTop)
  let target = -1
  // The groups are oldest-first, so "newer" is a LARGER group index.
  // The previous implementation compared a LINE index against a pixel
  // offset computed from a flat 22px row, so it landed on an unrelated line
  // whenever the rows were not uniform.
  if (dir === 1) {
    for (let i = cur + 1; i < gs.length; i++) if (groupHasError(gs[i])) { target = i; break }
    if (target < 0) for (let i = cur - 1; i >= 0; i--) if (groupHasError(gs[i])) { target = i; break }
  } else {
    for (let i = cur - 1; i >= 0; i--) if (groupHasError(gs[i])) { target = i; break }
    if (target < 0) for (let i = cur + 1; i < gs.length; i++) if (groupHasError(gs[i])) { target = i; break }
  }
  if (target < 0) return
  revealGroup(gs[target], target)
}

/**
 * Is this line an ERROR?
 *
 * It used to include warnings. Then `e` (errors only) and `g` (jump to the
 * next error) meant different things: press `e`, then `g`, and the reader
 * landed on a warning out of 1,446 — while 20 actual errors waited further
 * down. Both now mean error, so the shortcut and the filter agree.
 */
function isErrorLine(l: DecoratedLine): boolean {
  return SEV_ERROR_KEYS.has(l.raw.severity.toLowerCase())
}

function groupHasError(g: Group): boolean {
  return g.lines.some(isErrorLine)
}

/**
 * Bring a group into view.
 *
 * A folded run shows only its first line, so a jump that lands on a fold
 * has to open it. Otherwise the command moves the reader to a row that
 * displays a count instead of the error they asked for.
 */
function revealGroup(g: Group, idx: number): void {
  const lineIdx = g.lines.findIndex(isErrorLine)
  const within = g.kind === 'run' && lineIdx > 0 ? lineIdx * estSingle : 0
  if (g.kind === 'run' && !g.expanded) {
    const s = new Set(expanded.value)
    s.add(g.key)
    expanded.value = s
    // Opening the fold changes the group's height, so the target is only
    // known once the extra rows have been laid out and measured.
    nextTick(() => {
      rebuildOffsets()
      recomputeVirtualRange()
      scrollToPosition((offsetsBuf[idx] ?? 0) + within)
    })
    return
  }
  scrollToPosition((offsetsBuf[idx] ?? 0) + within)
}

function jumpLine(dir: 1 | -1) {
  const el = scrollEl.value
  if (!el) return
  el.scrollBy({ top: dir * estSingle * 5, behavior: commandBehavior() })
}
function clearAll() {
  emit('clear')
}

useLogKeyboardShortcuts(
  {
    focusSearch: focusSearchInput,
    toggleErrorsOnly,
    togglePause: togglePause,
    // The `c` shortcut must ask before it clears, exactly like the ⋯ menu
    // does. It used to call clearAll() straight away, so the keyboard path
    // destroyed the screen without the confirmation the mouse path requires.
    clear: requestClear,
    jumpError: jumpToError,
    jumpLine,
    toggleHelp: () => { helpOpen.value = !helpOpen.value },
  },
)

async function copyAll() {
  // ponytail: 复制出来的是时间正序 —— 粘进 issue 的时候，第一行就该是
  // 最早的那条。displayedLines 是最新在前，所以这里反过来。
  const text = [...displayedLines.value]
    .reverse()
    .map(l => `${l.raw.timestamp} [${l.raw.severity.toUpperCase()}] [${l.raw.container}] ${l.raw.content}`)
    .join('\n')
  try {
    await navigator.clipboard.writeText(text)
    // ponytail: 复制是静默的 —— 用户按了 C 键，什么都没发生，只能自己
    // 去别的窗口粘贴才知道成没成。给一个瞬时确认。
    toast.success(t('toast.logsCopied', { count: displayedLines.value.length }))
  } catch (err) {
    console.error('clipboard', err)
    toast.error(t('toast.logsCopyFailed'))
  }
}

onMounted(() => {
  // Reduced motion reaches scroll animations too. The global stylesheet
  // shortens CSS animations and transitions, but a programmatic scroll is
  // neither, so the preference is honoured here.
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  prefersReducedMotion.value = motionQuery.matches
  motionQuery.addEventListener('change', onMotionPreferenceChange)
  // A group can change height without the window moving: a fold opens, a
  // JSON panel expands, a web font swaps in. The observer catches those,
  // because a height the model has never seen is exactly the blind spot
  // that made the spacers lie.
  resizeObserver = new ResizeObserver(() => {
    scheduleSettle(captureAnchor())
  })
  // Now that the scroller exists, the window can be computed properly.
  rebuildOffsets()
  recomputeVirtualRange()
  observeRenderedGroups()
  // Followers land on the newest line; readers resume their saved position
  // (tab switches remount this component and used to reset scrollTop to 0).
  if (autoFollow.value) {
    nextTick(() => jumpToBottom(true))
  } else {
    // The restore is replayed by settle() as the model is corrected, so it
    // lands on the same GROUP the reader left rather than on the same
    // pixel, which by then may mean a different line.
    nextTick(restoreScrollMemory)
  }
})

onUnmounted(() => {
  motionQuery?.removeEventListener('change', onMotionPreferenceChange)
  motionQuery = null
  resizeObserver?.disconnect()
  resizeObserver = null
  if (settleRaf) {
    cancelAnimationFrame(settleRaf)
    settleRaf = 0
  }
  // ponytail: 清理 search history debounce timer，避免 unmount 后还写 localStorage
  if (searchHistoryTimer) {
    clearTimeout(searchHistoryTimer)
    searchHistoryTimer = null
  }
})

// === Visual helpers ===
// ponytail: 过滤器芯片上的图标原来是 ASCII 字符（`i` `!` `▲` `?`）——
// 那是等宽字体里的裸字形，不是图标：左边「全部」用的是 Lucide 的漏斗，
// 右边三个是字符，两种视觉语言并排。`▲` 在多数图标字体里是「上三角／
// 插入」的意思，拿它表示 ERROR 语义是反的。换成 Lucide 图标。
const SEV_ICON_COMPONENT: Record<string, Component> = {
  info: Info,
  warn: TriangleAlert,
  error: CircleX,
}
const SEV_CLASS: Record<string, string> = {
  trace: 'text-muted-foreground', debug: 'text-muted-foreground',
  info: 'text-foreground', notice: 'text-foreground',
  warn: 'text-warning', warning: 'text-warning',
  error: 'text-error', err: 'text-error',
  critical: 'text-error font-semibold', fatal: 'text-error font-bold',
  alert: 'text-error font-bold', emergency: 'text-error font-bold',
  unknown: 'text-foreground',
}
const SEV_ERROR_KEYS = new Set(['error', 'err', 'critical', 'fatal', 'alert', 'emergency'])
const SEV_FATAL_KEYS = new Set(['critical', 'fatal', 'alert', 'emergency'])

function severityBorderFor(s: string): string {
  const k = s.toLowerCase()
  if (SEV_FATAL_KEYS.has(k)) return 'border-l-error'
  if (SEV_ERROR_KEYS.has(k)) return 'border-l-error/70'
  if (k === 'warn' || k === 'warning') return 'border-l-warning/60'
  if (k === 'info' || k === 'notice') return 'border-l-info/30'
  return 'border-l-transparent'
}

// ponytail: per-row opacity fade by age removed — a log panel's job is to
// make OLD lines readable (that's what scrolling back is for); fading them
// to 30% opacity made history look like a veil. The timestamp column already
// communicates recency.

/**
 * The newest line is the one that just arrived, so its pulse is the
 * product's only "something just happened" signal. Red when the line that
 * arrived is an error: at 3am that is the one thing worth interrupting
 * for.
 */
function isNewestLineError(group: Group): boolean {
  // Group.lines is newest-first, so lines[0] is the line that just arrived
  // — the same line the collapsed row renders.
  return isErrorLine(group.lines[0])
}

function isNewestLine(group: Group): boolean {
  // ponytail: under virtualization, v-for idx is local to the rendered slice —
  // compare against the head of the FULL group list so the pulse follows the
  // actual newest line, not "first row currently in viewport".
  return props.streaming && groups.value[groups.value.length - 1]?.key === group.key
}

// === 新到的错误行闪一次 ===
//
// 这一轮方向文档写的规则是「动效只在数据到达时发生：新 ERROR 行到达时
// severity chip 闪一次（200ms 内）」。这是整个产品承诺过的唯一一个动效
// 时刻，之前没有实现 —— SSE 推来一条新 ERROR，它就直接出现在列表里，
// 和历史行长得一模一样。
//
// 怎么知道哪些行是「新到的」？SSE 层把新批次 prepend 到 props.lines 的
// 数组头，所以新行在前面。用上一批的头做锚点：这一批的头变了，就从
// 头往后找到上一批的头，中间那些就是新到的。
const flashing = ref<Set<string>>(new Set())
const flashTimers = new Map<string, ReturnType<typeof setTimeout>>()
let seenHeadId: string | null = null
/** How long a newly arrived error row stays tinted. The animation itself is
 *  400ms; the class lives slightly longer so the animation can finish. */
const FLASH_MS = 450
/** Above this many new lines at once, it is a backlog flush, not an arrival. */
const FLASH_BATCH_LIMIT = 10

function flashErrors(ids: string[]) {
  if (!ids.length) return
  for (const id of ids) {
    const old = flashTimers.get(id)
    if (old) clearTimeout(old)
    flashTimers.set(id, setTimeout(() => {
      flashTimers.delete(id)
      const next = new Set(flashing.value)
      next.delete(id)
      flashing.value = next
    }, FLASH_MS))
  }
  flashing.value = new Set([...flashing.value, ...ids])
}

// ponytail: 「实时」那个点只在真的有新行到达时闪。
//
// 之前它跟着 streaming 状态永远在呼吸 —— 连接开着就闪，30 秒没有一行
// 日志也闪。凌晨三点一块屏幕上有个一直在闪的绿点，是纯粹的注意力税，
// 而且它不携带任何信息（它一直在闪，所以「闪」本身说明不了什么）。
//
// 现在它只在收到新行之后的 2 秒里闪：闪 = 刚刚有东西进来了。
//
// 行首「最新一行」那个点用的是同一个信号。它以前自己挂着 animate-pulse，
// 于是连接开着它就永远在呼吸 —— 同一份注意力税交了两遍，而且第二个
// 呼吸的点在每一行上，比状态栏那个更靠近读者的视线。
const livePulse = ref(false)
let liveTimer: ReturnType<typeof setTimeout> | null = null
function markLive() {
  livePulse.value = true
  if (liveTimer) clearTimeout(liveTimer)
  liveTimer = setTimeout(() => { livePulse.value = false }, 2000)
}

watch(() => props.lines, (next) => {
  if (!next.length) {
    seenHeadId = null
    return
  }
  const headId = lineId(next[0]!)
  if (seenHeadId === null) {
    seenHeadId = headId
    return
  }
  if (headId === seenHeadId) return
  // 上一批的头现在排在新行之后，它的位置就是新行的数量。
  // 只扫前面 200 行：缓冲区满了以后旧行会被挤掉，找不到锚点就干脆不闪，
  // 总比把整个缓冲区都闪一遍好。
  let addedCount = 0
  const limit = Math.min(next.length, 200)
  for (let i = 0; i < limit; i++) {
    if (lineId(next[i]!) === seenHeadId) {
      addedCount = i
      break
    }
  }
  seenHeadId = headId
  if (!addedCount) return
  markLive()
  // ponytail: 一次只闪一条。
  // 读者翻完历史回到顶部时，SSE 层会把攒着的整个 backlog 一次性 prepend
  // 进来 —— 那时候 addedCount 是几百，「新到的」是几百行，整个面板一起
  // 闪红半秒，和「一条错误刚到」是两回事。所以超过阈值就不闪，闪也只闪
  // 头几条。
  if (addedCount > FLASH_BATCH_LIMIT) return
  const errorIds: string[] = []
  for (let i = 0; i < addedCount; i++) {
    const line = next[i]!
    // 只闪错误，不闪 warn：集群里 warn 的量级通常是 error 的十倍，
    // 每一行都闪一次等于什么都没闪。
    if (SEV_ERROR_KEYS.has(line.severity.toLowerCase())) errorIds.push(lineId(line))
  }
  flashErrors(errorIds.slice(0, FLASH_BATCH_LIMIT))
}, { immediate: true })

onUnmounted(() => {
  for (const timer of flashTimers.values()) clearTimeout(timer)
  flashTimers.clear()
  if (liveTimer) clearTimeout(liveTimer)
})

/** True when this group contains a line that just arrived as an error. */
function groupFlashes(group: Group): boolean {
  if (!flashing.value.size) return false
  for (const l of group.lines) {
    if (flashing.value.has(lineId(l.raw))) return true
  }
  return false
}

/**
 * 到达闪光：动画，或减少动态效果下的静态色块。
 *
 * 全局的 `animation-duration: 0.01ms`（prefers-reduced-motion）把 400ms 的
 * 闪光压成看不见 ——「新错误行到达」的反馈整个消失。减少动态效果去掉的
 * 是运动，不是状态：同一扇窗口里换成静态色块，窗口结束同样消失。
 */
function arrivalFlashClass(group: Group): string {
  if (!groupFlashes(group)) return ''
  return prefersReducedMotion.value ? 'bg-error/25' : 'animate-log-flash'
}

// === Severity badge (per-row label, replaces single-char icon) ===
// ponytail: 走 @/lib/chip 的统一外观。之前这里自己写了一套 class：
// border-error/40 的 alpha 边框（别处用的是 border-error-border token），
// 同一个 ERROR 在日志里和在别处渲染成两种颜色。现在全站一个来源。
const SEV_BADGE_CLASS: Record<string, string> = {
  critical: chipClasses({ tone: 'error', variant: 'solid', size: 'xs' }),
  fatal: chipClasses({ tone: 'error', variant: 'solid', size: 'xs' }),
  alert: chipClasses({ tone: 'error', variant: 'solid', size: 'xs' }),
  emergency: chipClasses({ tone: 'error', variant: 'solid', size: 'xs' }),
  error: chipClasses({ tone: 'error', size: 'xs' }),
  err: chipClasses({ tone: 'error', size: 'xs' }),
  warn: chipClasses({ tone: 'warning', size: 'xs' }),
  warning: chipClasses({ tone: 'warning', size: 'xs' }),
  // ponytail: INFO is the noise, so it gets no surface.
  //
  // On a busy pod 95% of the rows are INFO, and a pill on every one of them
  // turned a wall of log lines into a wall of badges — the eye had nothing
  // to land on. The WORD stays (it is what the eye scans); the surface goes,
  // so ERROR and WARN are the only rows that raise their voice.
  info: chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' }),
  notice: chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' }),
  trace: chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' }),
  debug: chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' }),
  // ponytail: 未识别也是裸的。
  //
  // 真实集群里输出没有级别词的 Pod 很常见（Attu、纯 stdout 的应用）。
  // 那种 Pod 的每一行都会戴一枚灰底药丸，于是整个面板又是一堵灰墙 ——
  // 和 INFO 底色当初要去掉的是同一个毛病。「未识别」这一档的计数在
  // 上面那排芯片里已经写着，行首的 `?` 只需要说「没有级别」就够了。
  unknown: chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' }),
}
const SEV_BADGE_TEXT: Record<string, string> = {
  critical: 'CRIT', fatal: 'FATAL', alert: 'ALERT', emergency: 'EMRG',
  error: 'ERROR', err: 'ERROR',
  warn: 'WARN', warning: 'WARN',
  info: 'INFO', notice: 'NOTI',
  trace: '[T]', debug: '[D]',
  unknown: '?',
}
function sevBadgeClass(s: string): string {
  return SEV_BADGE_CLASS[s.toLowerCase()] ?? chipClasses({ tone: 'neutral', variant: 'bare', size: 'xs' })
}
function sevBadgeText(s: string): string {
  return SEV_BADGE_TEXT[s.toLowerCase()] ?? '?'
}

// === Local timezone HH:MM:SS (hover shows UTC + offset) ===
const localTimeFmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})
const utcDateTimeFmt = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC',
})
/**
 * The apiserver stamps nanoseconds ("…42.005646139Z"). The ECMAScript
 * date-time format allows three fractional digits, so a nine-digit stamp is
 * not portable — a browser that rejects it renders the raw UTC string in
 * the time column instead of a local time. Trim to milliseconds.
 */
function toDate(ts: string): Date | null {
  const d = new Date(ts.replace(/(\.\d{3})\d+/, '$1'))
  return Number.isNaN(d.getTime()) ? null : d
}
function fmtLocalTime(ts: string): string {
  const d = toDate(ts)
  return d ? localTimeFmt.format(d) : ts
}
/**
 * The full UTC stamp, date included.
 *
 * The time column shows HH:MM:SS, so a pod that has been up for days has
 * lines from two different days that look identical. The date used to be
 * visible only because the application printed its own timestamp into the
 * line — and that prefix is now stripped, so the tooltip is where the date
 * lives.
 */
function fmtUtcDateTime(ts: string): string {
  const d = toDate(ts)
  return d ? utcDateTimeFmt.format(d) + 'Z' : ts
}
function tzOffset(): string {
  const off = -new Date().getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const h = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')
  const m = String(Math.abs(off) % 60).padStart(2, '0')
  return `UTC${sign}${h}:${m}`
}
/** The same offset, short enough for a chip: "UTC+8", "UTC+5:30", "UTC". */
function tzShort(): string {
  const off = -new Date().getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const h = Math.floor(Math.abs(off) / 60)
  const m = Math.abs(off) % 60
  return `UTC${sign}${h}${m ? ':' + String(m).padStart(2, '0') : ''}`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c] as string,
  )
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function togglePause() {
  emit('update:streaming', !props.streaming)
}

function setSeverity(rank: number) {
  minSeverity.value = minSeverity.value === rank ? 0 : rank
  unknownOnly.value = false
}

function toggleUnknownOnly() {
  unknownOnly.value = !unknownOnly.value
  if (unknownOnly.value) minSeverity.value = 0
}

function clearSearch() {
  search.value = ''
}

// === Recent search history (localStorage, last 10, debounced 1.5s) ===
const RECENT_KEY = STORAGE_KEYS.appLogSearchHistory
const MAX_RECENT = 10

const recentSearches = ref<string[]>(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'))
// The overflow menu and the clear confirmation. Both live here because
// "clear the screen" destroys what the reader is looking at, and the
// overflow menu is where the action moved to.
const moreOpen = ref(false)
const clearConfirmOpen = ref(false)
let searchHistoryTimer: ReturnType<typeof setTimeout> | null = null

watch(search, (v, old) => {
  const q = v.trim()
  if (!q || q === old?.trim()) return
  if (searchHistoryTimer) clearTimeout(searchHistoryTimer)
  searchHistoryTimer = setTimeout(() => {
    const next = [q, ...recentSearches.value.filter(s => s !== q)].slice(0, MAX_RECENT)
    recentSearches.value = next
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch { /* quota / disabled */ }
  }, 1500)
})

function requestClear() {
  moreOpen.value = false
  clearConfirmOpen.value = true
}

function confirmClear() {
  clearConfirmOpen.value = false
  clearAll()
}

function applyRecent(q: string) {
  search.value = q
  moreOpen.value = false
}

function clearRecent() {
  if (searchHistoryTimer) clearTimeout(searchHistoryTimer)
  recentSearches.value = []
  try { localStorage.removeItem(RECENT_KEY) } catch { /* ignore */ }
}

// === JSON auto-detect + pretty-print ===
// ponytail: primitives rejected by JSON.parse('42') === 42 fall through this guard;
// only objects/arrays get a badge (numbers/strings/booleans/null alone are too noisy)
// (jsonCache/parseJson/isJson live above near decorated — they're needed at decorate
// time and jsonCache must be initialized before the watch tracks displayedLines)

interface JsonLineHtml { num: number; indent: number; html: string }
// ponytail: WeakMap keyed by LogLineOut — entries GC'd when the line drops out of the
// buffer. Map<string,> grew unboundedly across long sessions (audit T1).
const jsonLinesCache = new WeakMap<LogLineOut, JsonLineHtml[]>()

function tokenizeJsonLine(line: string): string {
  return line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(?:\\.|[^"\\])*")(\s*:)?|(\b(?:true|false|null)\b)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
      (m, str, colon, bool, num) => {
        if (str !== undefined) {
          return colon !== undefined
            ? `<span class="text-info">${str}</span>${colon}`
            : `<span class="text-success">${str}</span>`
        }
        if (bool !== undefined) return `<span class="text-error">${bool}</span>`
        if (num !== undefined) return `<span class="text-warning">${num}</span>`
        return m
      },
    )
}

function formatJsonLines(line: LogLineOut): JsonLineHtml[] {
  const cached = jsonLinesCache.get(line)
  if (cached) return cached
  const parsed = parseJson(line)
  if (parsed === null) return []
  const text = JSON.stringify(parsed, null, 2)
  const out: JsonLineHtml[] = []
  for (const [i, srcLine] of text.split('\n').entries()) {
    const m = srcLine.match(/^( *)/)
    const indent = (m?.[1].length ?? 0) / 2
    const stripped = srcLine.slice(m?.[1].length ?? 0)
    out.push({ num: i + 1, indent, html: tokenizeJsonLine(stripped) })
  }
  jsonLinesCache.set(line, out)
  return out
}

// ponytail: 1.2em = 2 monospace chars at our font; gradient draws a 1px line
// at the right edge of each tile, visually marking indent boundaries without
// text overlap. Using em so it scales with text size.
const JSON_GUIDE_STYLE = {
  backgroundImage:
    'linear-gradient(to right, transparent 0 calc(1.2em - 1px), rgba(127,127,127,0.18) calc(1.2em - 1px) 1.2em, transparent 1.2em 100%)',
  backgroundSize: '1.2em 100%',
  backgroundRepeat: 'repeat-x',
  backgroundPosition: '0 0',
} as const

const jsonExpanded = ref(new Set<string>())
function toggleJson(key: string) {
  const s = new Set(jsonExpanded.value)
  if (s.has(key)) s.delete(key); else s.add(key)
  jsonExpanded.value = s
}

// === JSON field chips (top-level keys from the first JSON object line) ===
const jsonFieldChips = computed<string[]>(() => {
  for (const l of props.lines) {
    const parsed = parseJson(l)
    if (parsed !== null && !Array.isArray(parsed)) {
      return Object.keys(parsed as Record<string, unknown>)
    }
  }
  return []
})

function applyFieldFilter(key: string) {
  // ponytail: the query is a plain substring, so it has to be a substring
  // that actually occurs in a JSON log line.
  //
  // It used to be `key=`. JSON lines spell the field `"level":"ERROR"` —
  // never `level=` — so every field chip filtered to ZERO lines: the whole
  // chip row was a dead control for exactly the case it exists to serve.
  // `"level":` is in the line, and it works for numbers too (`"n":5000`).
  search.value = `"${key}":`
}
function clearFieldFilter() {
  search.value = ''
}

// === Long line truncation (> TRUNCATE_LIMIT chars → show first N + expand) ===
// ponytail: uses content as key so identical lines share expand state; tradeoff
// is map/set size scales with unique long lines. 500 chars is enough to render
// ~6 wrapped lines on the typical viewport.
const TRUNCATE_LIMIT = 500
const truncatedExpanded = ref(new Set<string>())

function toggleTruncate(content: string) {
  const s = new Set(truncatedExpanded.value)
  if (s.has(content)) s.delete(content); else s.add(content)
  truncatedExpanded.value = s
}

// === ANSI-aware line rendering (preserves pod-supplied colors) ===
// ponytail: ansiToHtml does the heavy lifting. For truncation we slice on
// plain-char count, then find the safe byte offset in the raw content so
// we don't cut through an ANSI sequence.
const ANSI_TRUNC_SCAN_RE = /\x1b\[[0-9;]*[a-zA-Z]/g
function safeCutAt(content: string, plainLimit: number): number {
  let plain = 0
  let i = 0
  ANSI_TRUNC_SCAN_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = ANSI_TRUNC_SCAN_RE.exec(content)) !== null) {
    if (plain + (m.index - i) >= plainLimit) return i + (plainLimit - plain)
    plain += m.index - i
    i = m.index + m[0].length
  }
  if (plain + (content.length - i) >= plainLimit) return i + (plainLimit - plain)
  return content.length
}
function plainLength(line: LogLineOut): number {
  return getAnsiFor(line).plain.length
}
function lineHtml(line: LogLineOut): string {
  const expanded = truncatedExpanded.value.has(line.content)
  const parts = getAnsiFor(line)
  if (expanded || parts.plain.length <= TRUNCATE_LIMIT) return applySearchHighlight(parts.html)
  const cut = safeCutAt(line.content, TRUNCATE_LIMIT)
  const { html: cutHtml } = ansiToHtml(line.content.slice(0, cut))
  return applySearchHighlight(cutHtml) + '<span class="text-muted-foreground/60 select-none">…</span>'
}
const MARK = '<mark class="bg-warning/30 text-foreground rounded-sm px-0.5">$1</mark>'
function applySearchHighlight(html: string): string {
  const q = search.value.trim()
  if (!q) return html
  // ponytail: skip highlight when filter is a `trace:` lookup — the visible
  // content never contains the bare query string, only an embedded UUID, so
  // highlighting wastes a regex pass per row.
  if (q.toLowerCase().startsWith('trace:')) return html
  const qEsc = escapeHtml(q)
  const re = new RegExp(`(${escapeRegex(qEsc)})`, 'gi')
  // Only the text BETWEEN tags is content. The HTML carries class names —
  // `text-red-600` — and replacing every match in the whole string put the
  // <mark> INSIDE the class attribute, so searching for "red" (or "text",
  // or "600") broke the span's colour.
  return html
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith('<') ? part : part.replace(re, MARK)))
    .join('')
}

// === Trace-id chip click → filter to that trace ===
function toggleTraceFilter(tid: string | null) {
  if (!tid) return
  const current = search.value.trim().toLowerCase()
  const want = `trace:${tid.toLowerCase()}`
  if (current === want) {
    search.value = ''
  } else {
    search.value = want
  }
}

// === Download .log (filtered or all) ===
function downloadLogs() {
  // Chronological, like the clipboard copy: the file you attach to an
  // issue starts with the first line, not the last.
  const source = (props.downloadScope === 'all' ? props.lines : filtered.value).slice().reverse()
  const text = source.map((l) => stripAnsi(l.content)).join('\n') + '\n'
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const podPart = props.podName
    ? `pod-${props.namespace ? `${props.namespace}-` : ''}${props.podName}.log`
    : (props.namespace ? `pod-${props.namespace}.log` : 'pod.log')
  a.href = url
  a.download = podPart
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // ponytail: revoke on next tick so the click can complete before the URL
  // becomes invalid. Calling revokeObjectURL synchronously after .click() works
  // in Chrome but Safari sometimes races; deferring is the documented pattern.
  setTimeout(() => URL.revokeObjectURL(url), 0)
  toast.success(t('toast.logsDownloaded', { count: source.length }))
}

function clearAllFilters() {
  search.value = ''
  minSeverity.value = 0
  unknownOnly.value = false
}

// ponytail: keep help content out of the template to avoid re-listing the same
// key map as the keyboard composable. Single source of truth for the help popover.
// computed (not a plain array) so a locale switch re-renders the labels.
const helpRows = computed(() => [
  { key: 'f / /', label: t('log.help.focusSearch') },
  { key: 'e', label: t('log.help.errorsOnly') },
  { key: 'p', label: t('log.help.pause') },
  { key: 'c', label: t('log.help.clear') },
  { key: 'g / G', label: t('log.help.jumpError') },
  { key: 'j / k', label: t('log.help.scroll') },
  { key: '?', label: t('log.help.toggle') },
])
</script>

<template>
  <div class="flex flex-col h-full rounded-card border border-border bg-card overflow-hidden font-mono text-xs">
    <!-- Severity filter chips (4 aggregated buckets: ERROR / WARN / INFO / DEBUG) -->
    <!-- ponytail: 窄屏上这排芯片换行，不横向滚。

         事故的时候要按的是 ERROR+。横向滚动的话它在 390px 上完全在屏幕
         外，而且没有滚动提示 —— 读者看到的是「全部 / INFO+ / WARN+」，以
         为没有错误可筛。换成两行，六枚芯片全在视野里。
    -->
    <div class="flex flex-wrap sm:flex-nowrap items-center gap-1 px-3 py-1.5 border-b border-border bg-muted overflow-x-auto shrink-0 whitespace-nowrap">
      <button
        type="button"
        :aria-pressed="minSeverity === 0"
        :class="cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-colors ease-app dur-fast text-xs',
          minSeverity === 0
            ? 'border-foreground bg-foreground text-background'
            : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        )"
        @click="setSeverity(0)"
      >
        <Filter :size="12" :stroke-width="1.75" />
        {{ t('log.filterAll') }}
        <span class="tabular-nums">{{ levelAllCount.toLocaleString() }}</span>
      </button>
      <span class="text-muted-foreground/50 mx-0.5">·</span>
      <button
        v-for="chip in severityChips"
        :key="chip.bucket"
        type="button"
        :disabled="chipCounts[chip.bucket] === 0"
        :aria-pressed="minSeverity === chip.rank"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors ease-app dur-fast text-xs',
          'disabled:opacity-30 disabled:cursor-default',
          minSeverity === chip.rank
            ? 'border-foreground bg-foreground text-background'
            : cn(
                'border-transparent hover:bg-accent hover:text-foreground',
                SEV_CLASS[chip.bucket] ?? 'text-muted-foreground',
              ),
        )"
        @click="setSeverity(chip.rank)"
        :title="t('log.severityLines', { bucket: chip.bucket, count: chipCounts[chip.bucket].toLocaleString() })"
      >
        <component
          :is="SEV_ICON_COMPONENT[chip.bucket]"
          :size="12"
          :stroke-width="2"
          class="shrink-0"
          aria-hidden="true"
        />
        <span class="uppercase tracking-wider">{{ chip.bucket }}+</span>
        <span class="tabular-nums">{{ chipCounts[chip.bucket].toLocaleString() }}</span>
      </button>
      <!--
        ponytail: 「未识别」这一枚。

        分类器认不出来的行（真实的 MCP 日志是 ℹ️ emoji 风格，认不出来）
        以前被算进 INFO，于是芯片写着「INFO+ 513」—— 513 行全都没被读懂，
        芯片却说它们都是 INFO 及以上。读者按 ERROR+ 过滤得到 0 行，面板
        告诉他「没有错误」。

        现在未识别是独立的一档，有自己的芯片和自己的计数。它不是第四个
        rank（未识别的行没有 severity 可比），是一个单独的筛选。
      -->
      <button
        type="button"
        :disabled="counts.unknown === 0"
        :aria-pressed="unknownOnly"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors ease-app dur-fast text-xs',
          'disabled:opacity-30 disabled:cursor-default',
          unknownOnly
            ? 'border-foreground bg-foreground text-background'
            : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        )"
        @click="toggleUnknownOnly()"
        :title="t('log.severityUnknownLines', { count: counts.unknown.toLocaleString() })"
      >
        <HelpCircle :size="12" :stroke-width="2" class="shrink-0" aria-hidden="true" />
        <span>{{ t('log.severityUnknown') }}</span>
        <span class="tabular-nums">{{ counts.unknown.toLocaleString() }}</span>
      </button>
    </div>

    <!--
      ponytail: 容器页签改成药丸，和级别芯片同族。

      全站的规则定了：**筛选器用药丸，页签用下划线**。

      这一行是筛选器（看哪个容器的日志），不是页签 —— 它切的是同一份
      日志的视角，底下那张表始终在。原来它是下划线样式，于是同一个
      面板里出现了两种下划线：上面这排容器，下面那个面板自己的标签栏。

      改完，这一行的容器芯片和上面那排级别芯片是同一种东西 —— 都在
      筛选要看的行；页面级页签（下划线）留在 Pod 详情那一层。
    -->
    <div
      v-if="availableContainers.length > 1"
      class="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-background shrink-0 overflow-x-auto whitespace-nowrap"
      role="group"
      :aria-label="t('log.containerFilterLabel')"
    >
      <span class="text-xs text-muted-foreground uppercase tracking-wider shrink-0 mr-1">{{ t('log.container') }}</span>
      <button
        type="button"
        :aria-pressed="selectedContainer === null"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium transition-colors ease-app dur-fast',
          selectedContainer === null
            ? 'border-foreground bg-foreground text-background'
            : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        )"
        @click="selectedContainer = null"
      >
        {{ t('log.containerAll') }}
        <span class="tabular-nums opacity-80">{{ filtered.length.toLocaleString() }}</span>
      </button>
      <button
        v-for="c in availableContainers"
        :key="c"
        type="button"
        :aria-pressed="selectedContainer === c"
        :title="c"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium transition-colors ease-app dur-fast max-w-[180px] truncate',
          selectedContainer === c
            ? 'border-foreground bg-foreground text-background'
            : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        )"
        @click="selectedContainer = c"
      >
        {{ c }}
        <span class="tabular-nums opacity-80 shrink-0">{{ (containerCounts[c] ?? 0).toLocaleString() }}</span>
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-background shrink-0">
      <div class="relative flex-1 min-w-0">
        <Search :size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" :stroke-width="1.75" />
        <Input
          ref="searchInput"
          v-model="search"
          :placeholder="t('log.searchPlaceholder')"
          class="pl-8 pr-8 h-7 text-xs"
          :aria-label="t('log.searchLabel')"
        />
        <button
          v-if="search"
          type="button"
          @click="clearSearch"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          :aria-label="t('log.clearFilterLabel')"
        >
          <X :size="14" :stroke-width="1.75" />
        </button>
      </div>
      <Button
        variant="outline" size="xs"
        @click="togglePause"
        :aria-label="streaming ? t('log.pauseLabel') : t('log.resumeLabel')"
        :class="cn(!streaming && 'text-warning border-warning/50')"
      >
        <Pause v-if="streaming" :size="14" :stroke-width="1.75" />
        <Play v-else :size="14" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="xs"
        @click="toggleAutoFollow"
        :aria-label="autoFollow ? t('log.followOffLabel') : t('log.followOnLabel')"
        :class="cn(!autoFollow && (unreadCount ?? 0) > 0 && 'border-warning text-warning')"
      >
        <ChevronDown v-if="autoFollow" :size="14" :stroke-width="1.75" />
        <ChevronUp v-else :size="14" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="xs"
        :disabled="!displayedLines.length"
        @click="copyAll"
        :aria-label="t('log.copyAllLabel')"
      >
        <Copy :size="14" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="xs"
        :disabled="!filtered.length"
        @click="downloadLogs"
        :aria-label="t('log.downloadLabel')"
        :title="t('log.downloadLabel')"
      >
        <Download :size="14" :stroke-width="1.75" />
      </Button>
      <!--
        ponytail: 工具栏收成「三个动作 + 一个溢出菜单」。
        之前是九个同权重的图标按钮：凌晨三点没人记得住 ChevronUp 是「跟随」，
        而清空屏幕的 X 和搜索框里的清除 X 是同一个字形。两个意思不同的 X
        并排放在一排图标里，是这个面板最难读的地方。
        现在常驻的是值班时真的会按的四个（暂停、跟随、复制、下载），
        加上一个 ? 帮助；搜索历史、换行、清屏进「⋯」菜单，每一项都带文字。
      -->
      <Popover v-model:open="moreOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="xs"
            :aria-label="t('log.moreActions')"
            :title="t('log.moreActions')"
          >
            <MoreHorizontal :size="14" :stroke-width="1.75" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[260px] p-0" align="end">
          <div v-if="recentSearches.length > 0" class="py-1">
            <div class="px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
              {{ t('log.searchHistoryLabel') }}
            </div>
            <button
              v-for="q in recentSearches"
              :key="q"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-mono hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              @click="applyRecent(q)"
            >
              <span class="flex-1 truncate">{{ q }}</span>
            </button>
            <div class="border-t border-border p-1">
              <Button variant="ghost" size="sm" class="w-full" @click="clearRecent">
                {{ t('log.searchHistoryClearAll') }}
              </Button>
            </div>
          </div>
          <div class="border-t border-border p-1">
            <button
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              @click="toggleWrap"
            >
              <WrapText v-if="wrapMode === 'wrap'" :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <ChevronsRight v-else :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="flex-1">{{ t('log.menuToggleWrap') }}</span>
              <span class="text-xs text-muted-foreground">
                {{ wrapMode === 'wrap' ? t('log.wrapStateOn') : t('log.wrapStateOff') }}
              </span>
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-error hover:bg-error/10 focus-visible:bg-error/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              :disabled="!lines.length"
              :aria-label="t('log.clearLabel')"
              @click="requestClear"
            >
              <Trash2 :size="14" :stroke-width="1.75" class="shrink-0" />
              <span class="flex-1">{{ t('log.menuClear') }}</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <Popover v-model:open="helpOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="xs"
            :aria-label="t('log.shortcutsHelpLabel')"
            :title="t('log.shortcutsTitle')"
          >
            <HelpCircle :size="14" :stroke-width="1.75" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[260px] p-3" align="end">
          <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{{ t('log.shortcutsHeading') }}</div>
          <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs font-mono">
            <template v-for="row in helpRows" :key="row.key">
              <kbd class="px-1.5 py-0.5 rounded-sm border border-border bg-muted text-xs">{{ row.key }}</kbd>
              <span class="text-muted-foreground self-center">{{ row.label }}</span>
            </template>
          </dl>
        </PopoverContent>
      </Popover>
    </div>

    <!-- JSON field filter chips (top-level keys from the first JSON object line) -->
    <div
      v-if="jsonFieldChips.length > 0"
      class="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted overflow-x-auto shrink-0 whitespace-nowrap"
    >
      <span class="text-xs text-muted-foreground shrink-0 mr-1">{{ t('log.field') }}</span>
      <button
        v-for="key in jsonFieldChips"
        :key="key"
        type="button"
        class="inline-flex items-center px-2 py-0.5 rounded-md border border-transparent text-xs text-muted-foreground hover:bg-accent hover:text-foreground hover:border-foreground/20 transition-colors ease-app dur-fast"
        :title="t('log.filterField', { field: key })"
        @click="applyFieldFilter(key)"
      >
        {{ key }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-transparent text-xs text-muted-foreground hover:bg-accent hover:text-error hover:border-error/30 transition-colors ease-app dur-fast ml-auto"
        :title="t('log.clearFieldFilter')"
        :aria-label="t('log.clearFieldFilter')"
        @click="clearFieldFilter"
      >
        <X :size="12" :stroke-width="1.75" />
        {{ t('log.clearFieldFilter') }}
      </button>
    </div>

    <!-- ponytail: the error banner belongs to the PANEL, not to the log
         stream. It used to sit inside the scrollable region, where it took
         flow space the virtual model knew nothing about, so every offset
         was shifted by the banner's height whenever an error was showing,
         and the banner scrolled away from the thing it was reporting on.

         It only shows when there are still logs on screen — a partial
         failure (one container's stream died, the others are fine). When
         the whole fetch failed there is nothing to show, and the empty
         area below carries the message and the retry instead. Two error
         surfaces for one failure is one too many. -->
    <div
      v-if="error && displayedLines.length > 0"
      class="flex items-center gap-3 px-3 py-2 bg-error/10 border-b border-error/30 text-error shrink-0"
      role="alert"
    >
      <AlertCircle :size="14" :stroke-width="2" />
      <span class="flex-1 text-xs font-medium">{{ error }}</span>
      <!-- 权限类错误没有「重试」：重试不会授予权限。 -->
      <Button
        v-if="!errorPermission"
        variant="outline"
        size="xs"
        class="text-xs border-error-border text-error hover:bg-error-bg"
        @click="emit('retry')"
        :aria-label="t('state.retry')"
      >
        {{ t('state.retry') }}
      </Button>
    </div>

    <!-- Log area (NEWEST AT BOTTOM) - fold groups, virtualized -->
    <!--
      The scroll container owns no scroll behaviour of its own. A CSS
      `scroll-behavior: smooth` turns every programmatic scroll into an
      animation, and the animation is interrupted whenever the virtual
      window changes the content height underneath it, so a jump to the end
      of the log used to land hundreds of pixels short. Native scroll
      anchoring is switched off for the same reason: the browser re-anchors
      when the content above the viewport resizes, which moves scrollTop on
      its own and fights the model's own correction.
    -->
    <!--
      The "N new" pill lives OUTSIDE the scroll container, pinned to the
      bottom of the log area. It used to be absolutely positioned inside the
      scroller, which meant it sat at the top of the scrollable content and
      scrolled out of view the moment the reader moved down — the one
      affordance that tells them how much they missed was the one they
      could not see.
    -->
    <div class="relative flex-1 min-h-0">
    <div
      ref="scrollEl"
      class="log-scroll h-full overflow-auto bg-background"
      role="log"
      aria-live="off"
      :aria-label="t('log.outputLabel')"
      @scroll="onScroll"
    >
      <div
        v-if="displayedLines.length === 0"
        class="flex flex-col items-center justify-center h-full px-4 text-center text-muted-foreground font-sans"
      >
        <!-- ponytail: three explicit branches so the message always reads true.
             Without filter + lines=[] + streaming=true → "等待" (pods haven't
             written yet); without filter + paused → "已暂停"; with filter but
             filtered=[] (lines exist) → "无匹配" + a one-click reset. -->
        <!--
          ponytail: 第四个分支 —— 出错。
          之前这里只有三个分支，于是「读取失败」和「暂无日志」会同时出现：
          上面一条红条说「Request failed with status code 500」，下面一块
          空白区说「暂无日志 · 等待容器输出…」。两句话互相矛盾，读者只能
          猜哪个是真的。

          现在这一块是失败的唯一出口：文案用 error 本身（后端说的原话，
          比如「Pod 或容器不存在」），「重试」按钮也在这里。上面那条红条
          只在还有日志可看的时候出现（部分容器失败），两种情况不再同时
          出现，也不再用两个词说同一件事。
        -->
        <template v-if="error">
          <CircleX :size="32" class="mb-3 opacity-40 text-error" :stroke-width="1.5" />
          <p class="text-sm font-medium text-foreground mb-1">
            {{ error }}
          </p>
          <p v-if="errorPermission" class="text-xs text-muted-foreground mb-2">
            {{ t('permission.hint', { permission: errorPermission }) }}
          </p>
          <Button v-if="!errorPermission" variant="outline" size="xs" @click="emit('retry')">
            {{ t('state.retry') }}
          </Button>
        </template>
        <template v-else-if="lines.length === 0">
          <Terminal :size="32" class="mb-3 opacity-30" :stroke-width="1.5" />
          <p class="text-sm font-medium text-foreground mb-1">
            {{ t('log.emptyTitle') }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ streaming ? t('log.emptyWaiting') : t('log.emptyPaused') }}
          </p>
        </template>
        <template v-else>
          <Search :size="32" class="mb-3 opacity-30" :stroke-width="1.5" />
          <p class="text-sm font-medium text-foreground mb-1">
            {{ t('log.emptyFilteredTitle') }}
          </p>
          <p class="text-xs text-muted-foreground mb-3">
            {{ t('log.filteredOut', { count: lines.length.toLocaleString() }) }}{{ search || minSeverity > 0 ? t('log.currentFilter') : '' }}{{ search ? t('log.filterQuery', { query: search }) : '' }}{{ search && minSeverity > 0 ? ' + ' : '' }}{{ minSeverity > 0 ? severityFilterLabel : '' }}
          </p>
          <Button variant="outline" size="xs" class="text-xs" @click="clearAllFilters">
            <X :size="12" :stroke-width="2" class="mr-1" />
            {{ t('log.clearFilters') }}
          </Button>
        </template>
      </div>
      <div v-else ref="wrapEl" class="relative">
        <div :style="{ height: padTop + 'px' }" aria-hidden="true" />
        <div
          v-for="group in renderedGroups"
          :key="group.key"
          :data-gkey="group.key"
          class="log-group"
        >
          <template v-if="group.kind === 'single'">
            <!-- ponytail: 窄屏这一行只有两列：时间 + 内容。

                 级别徽章是第三列的占位，窄屏上没有第三列 —— 它必须整个
                 消失，而不是缩在内容列里。

                 以前写的是 `hidden sm:inline-flex`，但 cn() 是
                 twMerge(clsx(...))：chipClasses() 返回的 `inline-flex`
                 和 `hidden` 在同一个 display 组里，后来的那个赢，hidden
                 被静默删掉。徽章于是留在了窄屏上，占着内容列的 1fr，
                 正文被挤到第二行、压成 88px。`max-sm:hidden` 活下来了
                 （变体不同 = 不是同一组），窄屏才真的隐藏。
            -->
            <div
              :class="cn(
                'grid grid-cols-[88px_1fr] sm:grid-cols-[88px_72px_1fr] gap-x-3 items-baseline px-3 leading-[22px] min-h-[22px] border-l-[3px] relative',
                'hover:bg-muted/40 transition-colors ease-app dur-fast',
                severityBorderFor(group.lines[0].raw.severity),
                arrivalFlashClass(group),
              )"
              v-memo="[group.lines[0].raw.content, group.lines[0].raw.severity, jsonExpanded.has(`${group.key}`), group.lines[0].traceId, truncatedExpanded.has(group.lines[0].raw.content), wrapMode, locale, arrivalFlashClass(group), livePulse]"
            >
              <button
                v-if="group.lines[0].traceId"
                type="button"
                @click.stop="toggleTraceFilter(group.lines[0].traceId)"
                class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-[width] ease-app dur-fast cursor-pointer z-10"
                :style="{ background: traceIdColor(group.lines[0].traceId) }"
                :title="t('log.filterTraceTitle', { traceId: group.lines[0].traceId })"
                :aria-label="t('log.filterTraceLabel', { traceId: group.lines[0].traceId })"
              />
              <span
                v-if="isNewestLine(group)"
                :class="cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full',
                  isNewestLineError(group) ? 'bg-error' : 'bg-success',
                  livePulse && 'animate-pulse',
                )"
                aria-hidden="true"
              />
              <!-- Col 1: timestamp (sticky) -->
              <span
                class="sticky left-0 bg-card text-xs text-muted-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                :title="`${fmtUtcDateTime(group.lines[0].raw.timestamp)} · ${tzOffset()}`"
              >
                {{ fmtLocalTime(group.lines[0].raw.timestamp) }}
              </span>
              <!-- Col 2: severity badge (sticky) -->
              <span :class="cn('max-sm:hidden sm:inline-flex sticky left-[100px] bg-card z-10 items-center justify-center font-mono tracking-wide whitespace-nowrap', sevBadgeClass(group.lines[0].raw.severity))">{{ sevBadgeText(group.lines[0].raw.severity) }}</span>
              <!-- Col 3: content (inline-prefix chips + ANSI-colored text + truncate toggle) -->
              <div class="flex items-baseline gap-2 min-w-0">
                <span
                  v-if="group.lines[0].raw.container && group.lines[0].raw.container !== '—'"
                  class="shrink-0 inline-flex items-center max-w-[140px] text-xs font-medium text-muted-foreground uppercase tracking-wider truncate"
                  :title="group.lines[0].raw.container"
                >{{ group.lines[0].raw.container }}</span>
                <button
                  v-if="group.lines[0].isJson"
                  type="button"
                  @click="toggleJson(`${group.key}`)"
                  class="shrink-0 inline-flex items-center gap-0.5 px-1.5 min-h-6 rounded-sm text-xs font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors ease-app dur-fast"
                  :title="jsonExpanded.has(`${group.key}`) ? t('log.collapseJson') : t('log.expandJson')"
                  :aria-expanded="jsonExpanded.has(`${group.key}`)"
                  :aria-label="t('log.toggleJsonLabel')"
                >
                  JSON
                  <ChevronDown v-if="!jsonExpanded.has(`${group.key}`)" :size="12" :stroke-width="2.5" />
                  <ChevronUp v-else :size="12" :stroke-width="2.5" />
                </button>
                <span class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" :title="wrapMode === 'nowrap' ? group.lines[0].raw.content : undefined" v-html="lineHtml(group.lines[0].raw)" />
                <button
                  v-if="plainLength(group.lines[0].raw) > TRUNCATE_LIMIT"
                  type="button"
                  class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded-sm text-xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors ease-app dur-fast"
                  :title="truncatedExpanded.has(group.lines[0].raw.content) ? t('log.collapse') : t('log.expandRemaining', { count: (plainLength(group.lines[0].raw) - TRUNCATE_LIMIT).toLocaleString() })"
                  @click.stop="toggleTruncate(group.lines[0].raw.content)"
                >
                  {{ truncatedExpanded.has(group.lines[0].raw.content) ? t('log.collapse') : t('log.moreChars', { count: (plainLength(group.lines[0].raw) - TRUNCATE_LIMIT).toLocaleString() }) }}
                </button>
              </div>
            </div>
            <div
              v-if="group.lines[0].isJson && jsonExpanded.has(`${group.key}`)"
              class="ml-[184px] mr-3 mb-1 mt-1 px-3 py-2 rounded-md bg-muted/40 border border-border text-xs overflow-x-auto font-mono"
            >
              <div
                v-for="jl in formatJsonLines(group.lines[0].raw)"
                :key="jl.num"
                class="flex items-start gap-2 leading-[1.7] hover:bg-background/40 -mx-1 px-1 rounded-sm"
              >
                <span class="shrink-0 w-7 text-right text-muted-foreground tabular-nums select-none text-xs mt-px">{{ jl.num }}</span>
                <span
                  class="flex-1 min-w-0 whitespace-pre"
                  :style="JSON_GUIDE_STYLE"
                  v-html="jl.html"
                />
              </div>
            </div>
          </template>
          <template v-else>
            <div
              :class="cn(
                'grid grid-cols-[88px_1fr] sm:grid-cols-[88px_72px_1fr] gap-x-3 items-baseline px-3 leading-[22px] min-h-[22px] border-l-[3px] cursor-pointer select-none relative group/fold',
                'hover:bg-muted/40 transition-colors ease-app dur-fast',
                severityBorderFor(group.lines[0].raw.severity),
                arrivalFlashClass(group),
              )"
              v-memo="[group.lines.length, group.expanded, group.lines[0].raw.content, group.lines[0].traceId, wrapMode, locale, arrivalFlashClass(group), livePulse]"
              role="button"
              tabindex="0"
              :aria-expanded="group.expanded"
              @click="toggleExpand(group.key)"
              @keydown.enter.prevent="toggleExpand(group.key)"
              @keydown.space.prevent="toggleExpand(group.key)"
            >
              <button
                v-if="group.lines[0].traceId"
                type="button"
                @click.stop="toggleTraceFilter(group.lines[0].traceId)"
                class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-[width] ease-app dur-fast cursor-pointer z-10"
                :style="{ background: traceIdColor(group.lines[0].traceId) }"
                :title="t('log.filterTraceTitle', { traceId: group.lines[0].traceId })"
                :aria-label="t('log.filterTraceLabel', { traceId: group.lines[0].traceId })"
              />
              <span
                v-if="isNewestLine(group)"
                :class="cn(
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full',
                  isNewestLineError(group) ? 'bg-error' : 'bg-success',
                  livePulse && 'animate-pulse',
                )"
                aria-hidden="true"
              />
              <span
                class="sticky left-0 bg-card text-xs text-muted-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                :title="`${fmtUtcDateTime(group.lines[0].raw.timestamp)} · ${tzOffset()}`"
              >
                {{ fmtLocalTime(group.lines[0].raw.timestamp) }}
              </span>
              <span :class="cn('max-sm:hidden sm:inline-flex sticky left-[100px] bg-card z-10 items-center justify-center font-mono tracking-wide whitespace-nowrap', sevBadgeClass(group.lines[0].raw.severity))">{{ sevBadgeText(group.lines[0].raw.severity) }}</span>
              <div class="flex items-baseline gap-2 min-w-0">
                <span
                  v-if="group.lines[0].raw.container && group.lines[0].raw.container !== '—'"
                  class="shrink-0 inline-flex items-center max-w-[140px] text-xs font-medium text-muted-foreground uppercase tracking-wider truncate"
                  :title="group.lines[0].raw.container"
                >{{ group.lines[0].raw.container }}</span>
                <span
                  v-if="!group.expanded"
                  class="relative flex-1 min-w-0 font-mono truncate"
                >
                  <span v-html="lineHtml(group.lines[0].raw)" class="font-mono text-foreground" :class="wrapClass" :title="wrapMode === 'nowrap' ? group.lines[0].raw.content : undefined" />
                  <!-- ponytail: hover preview — when a user hovers the collapsed
                       content cell, float a tooltip showing up to 3 distinct
                       timestamps. CSS hover is enough; no per-row state needed. -->
                  <span
                    class="pointer-events-none absolute left-0 top-full mt-1 z-30 hidden group-hover/fold:flex group-focus-visible/fold:flex flex-col gap-1 p-2 rounded-md border border-border bg-popover text-popover-foreground shadow-md min-w-[320px] max-w-[640px]"
                    role="tooltip"
                  >
                    <span class="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">
                      {{ t('log.foldTooltip', { count: group.lines.length }) }}
                    </span>
                    <span
                      v-for="(l, i) in group.lines.slice(0, 3)"
                      :key="i"
                      class="flex gap-2 text-xs font-mono"
                    >
                      <span class="text-muted-foreground tabular-nums shrink-0">{{ fmtLocalTime(l.raw.timestamp) }}</span>
                      <span class="truncate text-foreground/80">{{ stripAnsi(l.raw.content).slice(0, 120) }}</span>
                    </span>
                    <span
                      v-if="group.lines.length > 3"
                      class="text-xs text-muted-foreground italic"
                    >
                      {{ t('log.foldMore', { count: group.lines.length }) }}
                    </span>
                  </span>
                </span>
                <span v-else class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" :title="wrapMode === 'nowrap' ? group.lines[0].raw.content : undefined" v-html="lineHtml(group.lines[0].raw)" />
                <!-- ponytail: large ×N badge on the left of the row signals
                     "this is folded". Color follows severity for instant
                     scanability — error fold = red, warn = amber, etc. -->
                <span
                  :class="cn(
                    'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold tabular-nums transition-colors ease-app dur-fast',
                        severityBorderFor(group.lines[0].raw.severity),
                  )"
                  :title="t('log.foldTitle', { count: group.lines.length })"
                >
                  <ChevronDown v-if="group.expanded" :size="12" :stroke-width="2.5" />
                  <ChevronRight v-else :size="12" :stroke-width="2.5" />
                  ×{{ group.lines.length }}
                </span>
              </div>
            </div>
            <Transition name="fade-fast">
              <div v-if="group.expanded" class="contents">
                <template v-for="(line, li) in group.lines.slice(1)" :key="`${group.key}:${li}`">
                  <div
                    class="grid grid-cols-[88px_1fr] sm:grid-cols-[88px_72px_1fr] gap-x-3 items-baseline pl-7 pr-3 leading-[22px] min-h-[22px] border-l-[3px] border-l-foreground/20 text-foreground relative"
                    v-memo="[line.raw.content, line.raw.severity, line.traceId, truncatedExpanded.has(line.raw.content), wrapMode, locale]"
                  >
                  <button
                    v-if="line.traceId"
                    type="button"
                    @click.stop="toggleTraceFilter(line.traceId)"
                    class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-[width] ease-app dur-fast cursor-pointer z-10"
                    :style="{ background: traceIdColor(line.traceId) }"
                    :title="t('log.filterTraceTitle', { traceId: line.traceId })"
                    :aria-label="t('log.filterTraceLabel', { traceId: line.traceId })"
                  />
                  <span
                    class="sticky left-0 bg-card text-xs text-muted-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                    :title="`${fmtUtcDateTime(line.raw.timestamp)} · ${tzOffset()}`"
                  >
                    {{ fmtLocalTime(line.raw.timestamp) }}
                  </span>
                  <span class="max-sm:hidden sticky left-[100px] bg-card z-10" />
                  <div class="flex items-baseline gap-2 min-w-0">
                    <span class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" :title="wrapMode === 'nowrap' ? line.raw.content : undefined" v-html="lineHtml(line.raw)" />
                    <button
                      v-if="plainLength(line.raw) > TRUNCATE_LIMIT"
                      type="button"
                      class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded-sm text-xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors ease-app dur-fast"
                      :title="truncatedExpanded.has(line.raw.content) ? t('log.collapse') : t('log.expandRemaining', { count: (plainLength(line.raw) - TRUNCATE_LIMIT).toLocaleString() })"
                      @click.stop="toggleTruncate(line.raw.content)"
                    >
                      {{ truncatedExpanded.has(line.raw.content) ? t('log.collapse') : t('log.moreChars', { count: (plainLength(line.raw) - TRUNCATE_LIMIT).toLocaleString() }) }}
                    </button>
                  </div>
                  </div>
                </template>
              </div>
            </Transition>
          </template>
        </div>
        <div :style="{ height: padBottom + 'px' }" aria-hidden="true" />
      </div>
    </div>
      <!-- "N new" pill when auto-follow is off and new lines arrived -->
      <button
        v-if="!autoFollow && (unreadCount ?? 0) > 0"
        type="button"
        class="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium shadow-md hover:opacity-90 transition-opacity ease-app dur-fast"
        @click="toggleAutoFollow"
      >
        <ChevronDown :size="12" :stroke-width="2" />
        {{ t('log.newLines', { count: unreadCount }) }}
      </button>
    </div>

    <!--
      The virtualized region is marked `aria-live="off"`: every scroll
      re-renders a window of rows, and a polite region would read all of
      them out. A separate, visually hidden region names what actually
      changed, which is the useful half of the announcement.
    -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">{{ liveMessage }}</div>

    <!-- Status bar -->
    <div class="px-3 py-1.5 border-t border-border bg-muted text-xs text-muted-foreground flex justify-between items-center shrink-0 font-sans">
      <div class="flex items-center gap-2 min-w-0">
        <span class="tabular-nums">
          <span class="text-foreground font-medium">{{ displayedLines.length.toLocaleString() }}</span>
          <span v-if="search || minSeverity > 0"> / {{ lines.length.toLocaleString() }}</span>
          {{ t('log.linesUnit') }}
        </span>
        <!--
          The time column is local time, and nothing on screen said so. A
          reader comparing a log line against a chart, an alert, or another
          machine had to hover the cell to find out which zone they were
          looking at. The zone is now stated once, in the panel's own status
          bar.
        -->
        <!-- Inherits the status bar's own colour: at 80% opacity the chip
             measured 4.17:1 on the dark bar's surface, under the 4.5 AA
             floor. -->
        <span aria-hidden="true">·</span>
        <span class="shrink-0" :title="t('log.localTimeHint')">
          {{ t('log.localTime', { tz: tzShort() }) }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <!--
          三种状态，不是两种。连接断了的时候写「已暂停」是在撒谎 ——
          「暂停」是读者自己按的，而这里是他没按但流断了。事故时读者
          正是靠这行字判断「是我暂停的」还是「工具断了」，两者要分清。
        -->
        <span v-if="error" class="flex items-center gap-1 text-error">
          <span class="h-1.5 w-1.5 rounded-full bg-error" />
          {{ t('log.disconnected') }}
        </span>
        <span v-else-if="streaming" class="flex items-center gap-1 text-success">
          <span class="h-1.5 w-1.5 rounded-full bg-success" :class="livePulse ? 'animate-pulse' : ''" />
          {{ t('log.live') }}
        </span>
        <span v-else class="text-warning">{{ t('log.paused') }}</span>
        <span class="hidden sm:inline text-muted-foreground">·</span>
        <span v-if="!autoFollow">{{ t('log.scrollHint') }}</span>
        <span v-else>{{ t('log.autoFollow') }} <ChevronDown :size="12" :stroke-width="2" class="inline -mb-px" /></span>
      </div>
    </div>

    <!--
      Clearing the screen destroys what the reader is looking at, and it sits
      next to "copy all" — two different risk levels side by side. It asks
      first.
    -->
    <Dialog :open="clearConfirmOpen" @update:open="(v) => (clearConfirmOpen = v)">
      <DialogContent class="sm:max-w-sm font-sans">
        <DialogTitle>{{ t('log.clearConfirmTitle') }}</DialogTitle>
        <p class="text-sm text-muted-foreground">{{ t('log.clearConfirmBody') }}</p>
        <div class="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" @click="clearConfirmOpen = false">
            {{ t('log.clearConfirmCancel') }}
          </Button>
          <Button variant="destructive" size="sm" @click="confirmClear">
            {{ t('log.clearConfirmOk') }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
/*
  The scroll container owns its own scroll position.

  `scroll-behavior: auto` because a CSS smooth scroll turns every
  programmatic scroll into an animation, and that animation is interrupted
  whenever the virtual window changes the content height underneath it, so
  a jump to the end of the log landed hundreds of pixels short.

  `overflow-anchor: none` because native scroll anchoring re-anchors when
  the content above the viewport resizes, moving scrollTop on its own and
  fighting the model's own correction. That fight is the flicker.
*/
.log-scroll {
  scroll-behavior: auto;
  overflow-anchor: none;
}

/* ponytail: scoped fade-fast for the fold-row <Transition>. Soft 150ms so the
   expand/collapse of duplicate-line groups doesn't flicker when the user clicks
   a 12-row fold open. */
.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 150ms ease, max-height 150ms ease, transform 150ms ease;
  overflow: hidden;
}
.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-2px);
}
.fade-fast-enter-to,
.fade-fast-leave-from {
  opacity: 1;
  max-height: 1200px;
  transform: translateY(0);
}
</style>
