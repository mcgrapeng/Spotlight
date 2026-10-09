<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import {
  Search, Pause, Play, ChevronUp, ChevronDown, ChevronRight, ChevronsRight,
  Copy, X, Terminal, Filter, Clock, WrapText, Download, AlertCircle, HelpCircle,
} from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useLogFilters } from '@/composables/useLogFilters'
import { useLogSeverityCounts, SEVERITY_CHIP_THRESHOLDS } from '@/composables/useLogSeverityCounts'
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
  downloadScope?: 'all' | 'visible'
  /** Shared with usePodLogs: true = new lines are prepended immediately
   *  (auto-follow the tail); false = buffered as deferred backlog. The
   *  parent owns this ref so SSE flush and the UI pill stay in sync. */
  autoFollow?: boolean
}>(), {
  podName: '',
  namespace: '',
  error: null,
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
const lastInteraction = ref(Date.now())
function markInteraction() { lastInteraction.value = Date.now() }

// === Filtering ===
const minSeverity = ref(0)

const { filtered } = useLogFilters({
  lines: toRef(props, 'lines'),
  search,
  minSeverity,
})

defineExpose({})

// === Fold duplicate consecutive lines (logreduce-style) ===
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, 'UUID')
    .replace(/\b\d+\b/g, 'N')
    .replace(/\b0x[a-f0-9]+\b/g, '0xN')
    .replace(/\s+/g, ' ')
    .trim()
}

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
  try { parsed = JSON.parse(line.content) } catch { /* not JSON */ }
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

interface FoldGroup {
  kind: 'single'
  line: DecoratedLine
  key: string
}
interface FoldRun {
  kind: 'run'
  lines: DecoratedLine[]
  key: string
  sig: string
  expanded: boolean
}
type Group = FoldGroup | FoldRun

const expanded = ref(new Set<string>())

const groups = computed<Group[]>(() => {
  const out: Group[] = []
  let i = 0
  const arr = displayedLines.value
  while (i < arr.length) {
    const sig = cachedSig(arr[i].raw)
    let j = i + 1
    while (j < arr.length && cachedSig(arr[j].raw) === sig) j++
    if (j - i >= 3) {
      // Run key = the OLDEST line of the run (slice tail). displayedLines is
      // newest-first and prepends only extend runs at their front, so the
      // tail is the stable anchor across SSE flushes.
      const key = lineId(arr[j - 1].raw)
      out.push({
        kind: 'run',
        lines: arr.slice(i, j),
        key,
        sig,
        expanded: expanded.value.has(key),
      })
      i = j
    } else {
      for (let k = i; k < j; k++) {
        out.push({ kind: 'single', line: arr[k], key: lineId(arr[k].raw) })
      }
      i = j
    }
  }
  return out
})

// === Virtual scroll (NEWEST AT TOP, scrollTop=0) ===
// ponytail: fixed LINE_HEIGHT assumes one row per group; expanded runs/JSON add extra
// DOM rows below the header, so total scrollHeight drifts slightly past scrollTop+pad
// when many are expanded. Acceptable for typical logs where runs stay collapsed. Upgrade
// path: track per-group cumulative offsets with a ResizeObserver.
const LINE_HEIGHT = 22
const BUFFER = 8

const virtualRange = ref({ start: 0, end: 100 })

function recomputeVirtualRange() {
  const el = scrollEl.value
  if (!el) return
  const total = groups.value.length
  if (total === 0) {
    virtualRange.value = { start: 0, end: 0 }
    return
  }
  const top = el.scrollTop
  const viewportH = el.clientHeight
  const start = Math.max(0, Math.floor(top / LINE_HEIGHT) - BUFFER)
  const end = Math.min(total, Math.ceil((top + viewportH) / LINE_HEIGHT) + BUFFER)
  if (start !== virtualRange.value.start || end !== virtualRange.value.end) {
    virtualRange.value = { start, end }
  }
}

const renderedGroups = computed(() => {
  const { start, end } = virtualRange.value
  return groups.value.slice(start, end)
})

const padTop = computed(() => virtualRange.value.start * LINE_HEIGHT)
const padBottom = computed(() =>
  Math.max(0, (groups.value.length - virtualRange.value.end) * LINE_HEIGHT),
)

function toggleExpand(key: string) {
  const s = new Set(expanded.value)
  if (s.has(key)) s.delete(key); else s.add(key)
  expanded.value = s
}

// === Severity counts (4 aggregated buckets, over full unfiltered set) ===
const counts = useLogSeverityCounts(toRef(props, 'lines'))

// === Additional filter pipeline: container ===
const selectedContainer = ref<string | null>(null)
const availableContainers = computed(() => props.containers ?? [])

const containerCounts = computed(() => {
  const c: Record<string, number> = {}
  for (const l of props.lines) c[l.container] = (c[l.container] ?? 0) + 1
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

// === Auto-scroll (NEWEST AT TOP → scrollTop=0 is newest) ===
function jumpToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(displayedLines, (v) => {
  emit('update:filtered', v.map(d => d.raw))
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) jumpToTop()
  nextTick(recomputeVirtualRange)
}, { immediate: true })

watch(() => props.lines.length, () => {
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) jumpToTop()
})

function onScroll() {
  recomputeVirtualRange()
  if (!scrollEl.value) return
  const top = scrollEl.value.scrollTop
  // Newest-at-top: scrollTop=0 means we're at the newest line.
  if (top < 4) {
    // User is back at the top — re-engage auto-follow and clear unread.
    if (!autoFollow.value) {
      autoFollow.value = true
      emit('update:autoFollow', true)
      emit('consume-unread')
    }
  } else if (top > 50 && autoFollow.value) {
    // User scrolled away from top — disable auto-follow, show unread pill.
    autoFollow.value = false
  }
}

function toggleAutoFollow() {
  autoFollow.value = !autoFollow.value
  emit('update:autoFollow', autoFollow.value)
  if (autoFollow.value) {
    emit('consume-unread')
    jumpToTop()
  }
}

// === Keyboard (scoped to LogViewer via mouseenter/leave) ===
const shortcutsActive = ref(false)
const helpOpen = ref(false)

function focusSearchInput() {
  searchInput.value?.focus()
}
function toggleErrorsOnly() {
  // 3 = error rank (matches useLogFilters SEVERITY_RANK).
  minSeverity.value = minSeverity.value === 3 ? 0 : 3
}
function jumpToError(dir: 1 | -1) {
  // Find next/prev error-or-warn line in displayedLines (after container filter),
  // and scroll to it. Reverse iteration for `dir = -1` (G).
  const errs = displayedLines.value.filter((l) =>
    SEV_ERROR_KEYS.has(l.raw.severity.toLowerCase())
    || l.raw.severity.toLowerCase() === 'warn'
    || l.raw.severity.toLowerCase() === 'warning',
  )
  if (errs.length === 0) return
  // displayedLines is newest-first. `g` (dir=1) = newer, `G` (dir=-1) = older.
  // Newer has smaller group.key (closer to 0). For "next" we want the line
  // after the current top: pick the first err whose key > 0 if any.
  const top = scrollEl.value?.scrollTop ?? 0
  const currentKey = top <= 0 ? -1 : Math.floor(top / LINE_HEIGHT)
  let target: DecoratedLine | null = null
  if (dir === 1) {
    target = errs.find((l) => displayedLines.value.indexOf(l) > currentKey) ?? errs[0]!
  } else {
    // find latest err before currentKey
    for (const e of errs) {
      const k = displayedLines.value.indexOf(e)
      if (k < currentKey) { target = e; break }
    }
    if (!target) target = errs[errs.length - 1]!
  }
  const idx = displayedLines.value.indexOf(target)
  scrollEl.value?.scrollTo({ top: idx * LINE_HEIGHT, behavior: 'smooth' })
}
function jumpLine(dir: 1 | -1) {
  const el = scrollEl.value
  if (!el) return
  el.scrollBy({ top: dir * LINE_HEIGHT * 5, behavior: 'smooth' })
}
function clearAll() {
  emit('clear')
}

useLogKeyboardShortcuts(
  {
    focusSearch: focusSearchInput,
    toggleErrorsOnly,
    togglePause: togglePause,
    clear: clearAll,
    jumpError: jumpToError,
    jumpLine,
    toggleHelp: () => { helpOpen.value = !helpOpen.value },
  },
  { active: shortcutsActive },
)

function onRegionEnter() {
  shortcutsActive.value = true
  markInteraction()
}
function onRegionLeave() {
  shortcutsActive.value = false
}

async function copyAll() {
  const text = displayedLines.value
    .map(l => `${l.raw.timestamp} [${l.raw.severity.toUpperCase()}] [${l.raw.container}] ${l.raw.content}`)
    .join('\n')
  try { await navigator.clipboard.writeText(text) } catch (err) { console.error('clipboard', err) }
}

onMounted(() => {
  // ponytail: keyboard shortcuts are scoped to the LogViewer region via the
  // mouseenter/leave toggle on shortcutsActive (see useLogKeyboardShortcuts).
  // Mounting/unmounting of `document` listeners is handled by the composable's
  // watchEffect. We still need an initial focus state for SSR safety.
  shortcutsActive.value = false
  nextTick(jumpToTop)
})

onUnmounted(() => {
  // ponytail: 清理 search history debounce timer，避免 unmount 后还写 localStorage
  if (searchHistoryTimer) {
    clearTimeout(searchHistoryTimer)
    searchHistoryTimer = null
  }
})

// === Visual helpers ===
const SEV_ICON: Record<string, string> = {
  trace: '·', debug: '·', info: 'i', notice: 'i',
  warn: '!', warning: '!', error: '×', err: '×',
  critical: '×', fatal: '×', alert: '×', emergency: '×',
  unknown: '?',
}
const SEV_CLASS: Record<string, string> = {
  trace: 'text-muted-foreground/70', debug: 'text-muted-foreground/70',
  info: 'text-foreground', notice: 'text-foreground',
  warn: 'text-warning', warning: 'text-warning',
  error: 'text-error', err: 'text-error',
  critical: 'text-error font-semibold', fatal: 'text-error font-bold',
  alert: 'text-error font-bold', emergency: 'text-error font-bold',
  unknown: 'text-foreground',
}
const SEV_ERROR_KEYS = new Set(['error', 'err', 'critical', 'fatal', 'alert', 'emergency'])
const SEV_FATAL_KEYS = new Set(['critical', 'fatal', 'alert', 'emergency'])

function severityBgFor(s: string): string {
  const k = s.toLowerCase()
  if (SEV_FATAL_KEYS.has(k)) return 'bg-red-500/10'
  if (SEV_ERROR_KEYS.has(k)) return 'bg-red-500/5'
  if (k === 'warn' || k === 'warning') return 'bg-amber-500/5'
  return ''
}
function severityBorderFor(s: string): string {
  const k = s.toLowerCase()
  if (SEV_FATAL_KEYS.has(k)) return 'border-l-red-500'
  if (SEV_ERROR_KEYS.has(k)) return 'border-l-red-500/70'
  if (k === 'warn' || k === 'warning') return 'border-l-amber-500/60'
  if (k === 'info' || k === 'notice') return 'border-l-blue-500/30'
  return 'border-l-transparent'
}

// === Time-gradient opacity (newest=100%, oldest=30%) ===
function timeOpacity(ts: string): number {
  const ageMs = Date.now() - new Date(ts).getTime()
  if (ageMs < 30_000) return 1
  if (ageMs < 300_000) return 0.95
  if (ageMs < 3_600_000) return 0.8
  if (ageMs < 21_600_000) return 0.6
  if (ageMs < 86_400_000) return 0.45
  return 0.3
}

function isNewestLine(group: Group): boolean {
  // ponytail: under virtualization, v-for idx is local to the rendered slice —
  // compare against the head of the FULL group list so the pulse follows the
  // actual newest line, not "first row currently in viewport".
  return props.streaming && groups.value[0]?.key === group.key
}

// === Severity badge (per-row label, replaces single-char icon) ===
const SEV_BADGE_CLASS: Record<string, string> = {
  critical: 'bg-error text-background border-error font-bold',
  fatal: 'bg-error text-background border-error font-bold',
  alert: 'bg-error text-background border-error font-bold',
  emergency: 'bg-error text-background border-error font-bold',
  error: 'bg-error/15 text-error border-error/40 font-semibold',
  err: 'bg-error/15 text-error border-error/40 font-semibold',
  warn: 'bg-warning/15 text-warning border-warning/40 font-medium',
  warning: 'bg-warning/15 text-warning border-warning/40 font-medium',
  info: 'bg-muted text-foreground border-border font-medium',
  notice: 'bg-muted text-foreground border-border font-medium',
  trace: 'bg-transparent text-muted-foreground/70 border-transparent',
  debug: 'bg-transparent text-muted-foreground/70 border-transparent',
  unknown: 'bg-muted text-muted-foreground border-border',
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
  return SEV_BADGE_CLASS[s.toLowerCase()] ?? 'bg-muted text-muted-foreground border-border'
}
function sevBadgeText(s: string): string {
  return SEV_BADGE_TEXT[s.toLowerCase()] ?? '?'
}

// === Local timezone HH:MM:SS (hover shows UTC + offset) ===
const localTimeFmt = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
})
const utcTimeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC',
})
function fmtLocalTime(ts: string): string {
  try { return localTimeFmt.format(new Date(ts)) } catch { return ts }
}
function fmtUtcTime(ts: string): string {
  try { return utcTimeFmt.format(new Date(ts)) + 'Z' } catch { return ts }
}
function tzOffset(): string {
  const off = -new Date().getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const h = String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')
  const m = String(Math.abs(off) % 60).padStart(2, '0')
  return `UTC${sign}${h}:${m}`
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
}

function clearSearch() {
  search.value = ''
}

// === Recent search history (localStorage, last 10, debounced 1.5s) ===
const RECENT_KEY = STORAGE_KEYS.appLogSearchHistory
const MAX_RECENT = 10

const recentSearches = ref<string[]>(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'))
const searchHistoryOpen = ref(false)
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

function applyRecent(q: string) {
  search.value = q
  searchHistoryOpen.value = false
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
  search.value = `${key}=`
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
function applySearchHighlight(html: string): string {
  const q = search.value.trim()
  if (!q) return html
  // ponytail: skip highlight when filter is a `trace:` lookup — the visible
  // content never contains the bare query string, only an embedded UUID, so
  // highlighting wastes a regex pass per row.
  if (q.toLowerCase().startsWith('trace:')) return html
  const qEsc = escapeHtml(q)
  return html.replace(
    new RegExp(`(${escapeRegex(qEsc)})`, 'gi'),
    '<mark class="bg-warning/30 text-foreground rounded-sm px-0.5">$1</mark>',
  )
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
  const source = props.downloadScope === 'all' ? props.lines : filtered.value
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
}

function clearAllFilters() {
  search.value = ''
  minSeverity.value = 0
}

// ponytail: keep help content out of the template to avoid re-listing the same
// key map as the keyboard composable. Single source of truth for the help popover.
const helpRows = [
  { key: 'f / /', label: '聚焦搜索' },
  { key: 'e', label: '仅显示 error（再按取消）' },
  { key: 'p', label: '暂停 / 继续' },
  { key: 'c', label: '清空日志' },
  { key: 'g / G', label: '下一条 / 上一条 error·warn' },
  { key: 'j / k', label: '向下 / 向上滚动 5 行' },
  { key: '?', label: '显示 / 隐藏此面板' },
] as const
</script>

<template>
  <div class="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden font-mono text-xs">
    <!-- Severity filter chips (4 aggregated buckets: ERROR / WARN / INFO / DEBUG) -->
    <div class="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted overflow-x-auto shrink-0 whitespace-nowrap">
      <button
        type="button"
        :aria-pressed="minSeverity === 0"
        :class="cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-colors text-2xs',
          minSeverity === 0
            ? 'border-foreground bg-foreground text-background'
            : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
        )"
        @click="setSeverity(0)"
      >
        <Filter :size="11" :stroke-width="1.75" />
        全部
        <span class="tabular-nums">{{ lines.length.toLocaleString() }}</span>
      </button>
      <span class="text-muted-foreground/30 mx-0.5">·</span>
      <button
        v-for="(rank, bucket) in SEVERITY_CHIP_THRESHOLDS"
        :key="bucket"
        type="button"
        :disabled="counts[bucket] === 0"
        :aria-pressed="minSeverity === rank"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors text-2xs',
          'disabled:opacity-30 disabled:cursor-default',
          minSeverity === rank
            ? 'border-foreground bg-foreground text-background'
            : cn(
                'border-transparent hover:bg-accent hover:text-foreground',
                SEV_CLASS[bucket] ?? 'text-muted-foreground',
              ),
        )"
        @click="setSeverity(rank)"
        :title="`${bucket} · ${counts[bucket].toLocaleString()} 行`"
      >
        <span class="font-mono w-3 inline-block text-center font-bold">{{ SEV_ICON[bucket] }}</span>
        <span class="uppercase tracking-wider">{{ bucket }}</span>
        <span class="tabular-nums">{{ counts[bucket].toLocaleString() }}</span>
      </button>
    </div>

    <!-- Container tabs (only when pod has multiple containers) -->
    <div
      v-if="availableContainers.length > 1"
      class="flex items-center gap-px px-3 border-b border-border bg-background shrink-0 overflow-x-auto whitespace-nowrap"
      role="tablist"
      aria-label="容器选择"
    >
      <span class="text-2xs text-muted-foreground uppercase tracking-wider shrink-0 mr-1">容器</span>
      <button
        type="button"
        role="tab"
        :aria-selected="selectedContainer === null"
        :class="cn(
          'px-3 py-1.5 text-2xs font-medium transition-colors border-b-2',
          selectedContainer === null
            ? 'border-foreground text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40',
        )"
        @click="selectedContainer = null"
      >
        全部
        <span class="ml-1 tabular-nums text-muted-foreground">{{ lines.length.toLocaleString() }}</span>
      </button>
      <button
        v-for="c in availableContainers"
        :key="c"
        type="button"
        role="tab"
        :aria-selected="selectedContainer === c"
        :title="c"
        :class="cn(
          'inline-flex items-center px-3 py-1.5 text-2xs font-medium transition-colors border-b-2 max-w-[180px] truncate',
          selectedContainer === c
            ? 'border-foreground text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/40',
        )"
        @click="selectedContainer = c"
      >
        {{ c }}
        <span class="ml-1 tabular-nums text-foreground shrink-0">{{ (containerCounts[c] ?? 0).toLocaleString() }}</span>
      </button>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-background shrink-0">
      <div class="relative flex-1 min-w-0">
        <Search :size="13" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" :stroke-width="1.75" />
        <Input
          ref="searchInput"
          v-model="search"
          placeholder="过滤（内容 / 容器） · / 聚焦搜索"
          class="pl-8 pr-8 h-7 text-xs"
          aria-label="过滤日志"
        />
        <button
          v-if="search"
          type="button"
          @click="clearSearch"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="清除过滤"
        >
          <X :size="13" :stroke-width="1.75" />
        </button>
      </div>
      <Popover v-model:open="searchHistoryOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2"
            aria-label="搜索历史"
          >
            <Clock :size="13" :stroke-width="1.75" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[260px] p-0" align="start">
          <div v-if="recentSearches.length === 0" class="p-4 text-center text-2xs text-muted-foreground">
            暂无历史搜索
          </div>
          <div v-else class="py-1">
            <button
              v-for="q in recentSearches"
              :key="q"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-mono hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
              @click="applyRecent(q)"
            >
              <span class="flex-1 truncate">{{ q }}</span>
            </button>
            <div class="border-t border-border p-1">
              <Button variant="ghost" size="sm" class="w-full" @click="clearRecent">
                清除全部
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        :title="wrapMode === 'wrap' ? '当前：自动换行（点击切换为不换行）' : '当前：不换行（点击切换为换行）'"
        @click="toggleWrap"
        aria-label="切换换行"
      >
        <WrapText v-if="wrapMode === 'wrap'" :size="13" :stroke-width="1.75" />
        <ChevronsRight v-else :size="13" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        @click="togglePause"
        :aria-label="streaming ? '暂停 (K)' : '继续 (K)'"
        :class="cn(!streaming && 'text-warning border-warning/50')"
      >
        <Pause v-if="streaming" :size="13" :stroke-width="1.75" />
        <Play v-else :size="13" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        @click="toggleAutoFollow"
        :aria-label="autoFollow ? '关闭自动跟随 (L)' : '开启自动跟随 (L)'"
        :class="cn(!autoFollow && (unreadCount ?? 0) > 0 && 'border-warning text-warning')"
      >
        <ChevronUp v-if="autoFollow" :size="13" :stroke-width="1.75" />
        <ChevronDown v-else :size="13" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        :disabled="!lines.length"
        @click="emit('clear')"
        aria-label="清空"
      >
        <X :size="13" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        :disabled="!displayedLines.length"
        @click="copyAll"
        aria-label="复制全部 (C)"
      >
        <Copy :size="13" :stroke-width="1.75" />
      </Button>
      <Button
        variant="outline" size="sm"
        class="h-7 px-2"
        :disabled="!filtered.length"
        @click="downloadLogs"
        aria-label="下载日志"
        title="下载日志"
      >
        <Download :size="13" :stroke-width="1.75" />
      </Button>
      <Popover v-model:open="helpOpen">
        <PopoverTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="h-7 px-2"
            aria-label="快捷键帮助 (?)"
            title="快捷键 (?)"
          >
            <HelpCircle :size="13" :stroke-width="1.75" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[260px] p-3" align="end">
          <div class="text-2xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">快捷键</div>
          <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs font-mono">
            <template v-for="row in helpRows" :key="row.key">
              <kbd class="px-1.5 py-0.5 rounded border border-border bg-muted text-2xs">{{ row.key }}</kbd>
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
      <span class="text-2xs text-muted-foreground shrink-0 mr-1">字段</span>
      <button
        v-for="key in jsonFieldChips"
        :key="key"
        type="button"
        class="inline-flex items-center px-2 py-0.5 rounded-md border border-transparent text-2xs text-muted-foreground hover:bg-accent hover:text-foreground hover:border-foreground/20 transition-colors"
        :title="`过滤 ${key}=`"
        @click="applyFieldFilter(key)"
      >
        {{ key }}
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-transparent text-2xs text-muted-foreground hover:bg-accent hover:text-error hover:border-error/30 transition-colors ml-auto"
        title="清除字段过滤"
        aria-label="清除字段过滤"
        @click="clearFieldFilter"
      >
        <X :size="11" :stroke-width="1.75" />
        清除字段过滤
      </button>
    </div>

    <!-- Log area (NEWEST AT TOP) - fold groups, no virtualization -->
    <div
      ref="scrollEl"
      class="flex-1 overflow-auto bg-background relative scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="日志输出（最新在上）"
      @mouseenter="onRegionEnter"
      @mouseleave="onRegionLeave"
      @scroll="(e) => { onScroll(); markInteraction() }"
    >
      <!-- ponytail: error banner sits inside the scrollable region so the layout
           above (toolbar + status bar) stays the same; it's the first thing the
           user sees at the top of the buffer. -->
      <div
        v-if="error"
        class="sticky top-0 z-20 flex items-center gap-3 px-3 py-2 bg-error/10 border-b border-error/30 text-error"
        role="alert"
      >
        <AlertCircle :size="14" :stroke-width="2" />
        <span class="flex-1 text-xs font-medium">{{ error }}</span>
        <Button
          variant="outline"
          size="sm"
          class="h-6 px-2 text-2xs border-error/40 text-error hover:bg-error/15"
          @click="emit('retry')"
          aria-label="重试"
        >
          重试
        </Button>
      </div>

      <!-- "N new" pill when auto-follow is off and new lines arrived -->
      <button
        v-if="!autoFollow && (unreadCount ?? 0) > 0"
        type="button"
        class="absolute top-2 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-2xs font-medium shadow-md hover:opacity-90 transition-opacity"
        @click="toggleAutoFollow"
      >
        <ChevronUp :size="12" :stroke-width="2" />
        {{ unreadCount }} 条新 · 跳转
      </button>

      <div
        v-if="displayedLines.length === 0"
        class="flex flex-col items-center justify-center h-full px-4 text-center text-muted-foreground font-sans"
      >
        <!-- ponytail: three explicit branches so the message always reads true.
             Without filter + lines=[] + streaming=true → "等待" (pods haven't
             written yet); without filter + paused → "已暂停"; with filter but
             filtered=[] (lines exist) → "无匹配" + a one-click reset. -->
        <template v-if="lines.length === 0">
          <Terminal :size="28" class="mb-3 opacity-30" :stroke-width="1.5" />
          <p class="text-sm font-medium text-foreground mb-1">
            暂无日志
          </p>
          <p class="text-2xs text-muted-foreground">
            {{ streaming ? '等待容器输出…' : '日志已暂停' }}
          </p>
        </template>
        <template v-else>
          <Search :size="28" class="mb-3 opacity-30" :stroke-width="1.5" />
          <p class="text-sm font-medium text-foreground mb-1">
            当前过滤无匹配
          </p>
          <p class="text-2xs text-muted-foreground mb-3">
            {{ lines.length.toLocaleString() }} 行被过滤掉，{{ search || minSeverity > 0 ? '当前条件：' : '' }}{{ search ? `「${search}」` : '' }}{{ search && minSeverity > 0 ? ' + ' : '' }}{{ minSeverity > 0 ? `severity ≥ ${minSeverity}` : '' }}
          </p>
          <Button variant="outline" size="sm" class="h-7 text-xs" @click="clearAllFilters">
            <X :size="11" :stroke-width="2" class="mr-1" />
            清空过滤
          </Button>
        </template>
      </div>
      <div v-else class="relative">
        <div :style="{ height: padTop + 'px' }" aria-hidden="true" />
<template v-for="(group, idx) in renderedGroups" :key="group.key">
          <template v-if="group.kind === 'single'">
            <div
              :class="cn(
                'grid grid-cols-[88px_72px_1fr] gap-x-3 items-baseline px-3 leading-[22px] min-h-[22px] border-l-[3px] relative',
                'hover:bg-muted/40 transition-colors',
                severityBgFor(group.line.raw.severity),
                severityBorderFor(group.line.raw.severity),
              )"
              :style="{ opacity: timeOpacity(group.line.raw.timestamp) }"
              v-memo="[group.line.raw.content, group.line.raw.severity, jsonExpanded.has(`${group.key}`), group.line.traceId, truncatedExpanded.has(group.line.raw.content)]"
            >
              <button
                v-if="group.line.traceId"
                type="button"
                @click.stop="toggleTraceFilter(group.line.traceId)"
                class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-all cursor-pointer z-10"
                :style="{ background: traceIdColor(group.line.traceId) }"
                :title="`按 trace_id 过滤: ${group.line.traceId}`"
                :aria-label="`按 trace_id ${group.line.traceId} 过滤`"
              />
              <span
                v-if="isNewestLine(group)"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-success animate-pulse"
                aria-label="实时"
              />
              <!-- Col 1: timestamp (sticky) -->
              <span
                class="sticky left-0 bg-card text-2xs text-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                :title="`${fmtUtcTime(group.line.raw.timestamp)} · ${tzOffset()}`"
              >
                {{ fmtLocalTime(group.line.raw.timestamp) }}
              </span>
              <!-- Col 2: severity badge (sticky) -->
              <span :class="cn('sticky left-[100px] bg-card z-10 inline-flex items-center justify-center px-1.5 py-0 rounded border text-2xs font-mono tracking-wide whitespace-nowrap', sevBadgeClass(group.line.raw.severity))">{{ sevBadgeText(group.line.raw.severity) }}</span>
              <!-- Col 3: content (inline-prefix chips + ANSI-colored text + truncate toggle) -->
              <div class="flex items-baseline gap-2 min-w-0">
                <span
                  v-if="group.line.raw.container && group.line.raw.container !== '—'"
                  class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-2xs font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
                  :title="group.line.raw.container"
                >{{ group.line.raw.container }}</span>
                <button
                  v-if="group.line.isJson"
                  type="button"
                  @click="toggleJson(`${group.key}`)"
                  class="shrink-0 inline-flex items-center gap-0.5 px-1.5 min-h-6 rounded text-2xs font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                  :title="jsonExpanded.has(`${group.key}`) ? '折叠 JSON' : '展开 JSON'"
                  :aria-expanded="jsonExpanded.has(`${group.key}`)"
                  aria-label="切换 JSON 展开"
                >
                  JSON
                  <ChevronDown v-if="!jsonExpanded.has(`${group.key}`)" :size="9" :stroke-width="2.5" />
                  <ChevronUp v-else :size="9" :stroke-width="2.5" />
                </button>
                <span class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" v-html="lineHtml(group.line.raw)" />
                <button
                  v-if="plainLength(group.line.raw) > TRUNCATE_LIMIT"
                  type="button"
                  class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-2xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors"
                  :title="truncatedExpanded.has(group.line.raw.content) ? '收起' : `展开剩余 ${(plainLength(group.line.raw) - TRUNCATE_LIMIT).toLocaleString()} 字`"
                  @click.stop="toggleTruncate(group.line.raw.content)"
                >
                  {{ truncatedExpanded.has(group.line.raw.content) ? '收起' : `+${(plainLength(group.line.raw) - TRUNCATE_LIMIT).toLocaleString()} 字` }}
                </button>
              </div>
            </div>
            <div
              v-if="group.line.isJson && jsonExpanded.has(`${group.key}`)"
              class="ml-[184px] mr-3 mb-1 mt-1 px-3 py-2 rounded bg-muted/40 border border-border text-[11px] overflow-x-auto font-mono"
            >
              <div
                v-for="jl in formatJsonLines(group.line.raw)"
                :key="jl.num"
                class="flex items-start gap-2 leading-[1.7] hover:bg-background/40 -mx-1 px-1 rounded-sm"
              >
                    <span class="shrink-0 w-7 text-right text-muted-foreground tabular-nums select-none text-2xs mt-px">{{ jl.num }}</span>
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
                'grid grid-cols-[88px_72px_1fr] gap-x-3 items-baseline px-3 leading-[22px] min-h-[22px] border-l-[3px] cursor-pointer select-none relative',
                'hover:bg-muted/40 transition-colors',
                severityBgFor(group.lines[0].raw.severity),
                severityBorderFor(group.lines[0].raw.severity),
              )"
              :style="{ opacity: timeOpacity(group.lines[0].raw.timestamp) }"
              v-memo="[group.lines.length, group.expanded, group.lines[0].raw.content, jsonExpanded.has(`${group.key}`), group.lines[0].traceId]"
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
                class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-all cursor-pointer z-10"
                :style="{ background: traceIdColor(group.lines[0].traceId) }"
                :title="`按 trace_id 过滤: ${group.lines[0].traceId}`"
                :aria-label="`按 trace_id ${group.lines[0].traceId} 过滤`"
              />
              <span
                v-if="isNewestLine(group)"
                class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-success animate-pulse"
                aria-label="实时"
              />
              <span
                class="sticky left-0 bg-card text-2xs text-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                :title="`${fmtUtcTime(group.lines[0].raw.timestamp)} · ${tzOffset()}`"
              >
                {{ fmtLocalTime(group.lines[0].raw.timestamp) }}
              </span>
              <span :class="cn('sticky left-[100px] bg-card z-10 inline-flex items-center justify-center px-1.5 py-0 rounded border text-2xs font-mono tracking-wide whitespace-nowrap', sevBadgeClass(group.lines[0].raw.severity))">{{ sevBadgeText(group.lines[0].raw.severity) }}</span>
              <div class="flex items-baseline gap-2 min-w-0">
                <span
                  v-if="group.lines[0].raw.container && group.lines[0].raw.container !== '—'"
                  class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-2xs font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
                  :title="group.lines[0].raw.container"
                >{{ group.lines[0].raw.container }}</span>
                <button
                  v-if="group.lines[0].isJson"
                  type="button"
                  @click.stop="toggleJson(`${group.key}`)"
                  class="shrink-0 inline-flex items-center gap-0.5 px-1.5 min-h-6 rounded text-2xs font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                  :title="jsonExpanded.has(`${group.key}`) ? '折叠 JSON' : '展开 JSON'"
                  :aria-expanded="jsonExpanded.has(`${group.key}`)"
                  aria-label="切换 JSON 展开"
                >
                  JSON
                  <ChevronDown v-if="!jsonExpanded.has(`${group.key}`)" :size="9" :stroke-width="2.5" />
                  <ChevronUp v-else :size="9" :stroke-width="2.5" />
                </button>
                <span
                  v-if="!group.expanded"
                  class="group/fold relative flex-1 min-w-0 font-mono truncate"
                >
                  <span v-html="lineHtml(group.lines[0].raw)" class="font-mono text-foreground" :class="wrapClass" />
                  <!-- ponytail: hover preview — when a user hovers the collapsed
                       content cell, float a tooltip showing up to 3 distinct
                       timestamps. CSS hover is enough; no per-row state needed. -->
                  <span
                    class="pointer-events-none absolute left-0 top-full mt-1 z-30 hidden group-hover/fold:flex flex-col gap-1 p-2 rounded-md border border-border bg-popover text-popover-foreground shadow-md min-w-[320px] max-w-[640px]"
                    role="tooltip"
                  >
                    <span class="text-2xs uppercase tracking-wider text-muted-foreground mb-0.5">
                      本组 ×{{ group.lines.length }}（点击展开全部）
                    </span>
                    <span
                      v-for="(l, i) in group.lines.slice(0, 3)"
                      :key="i"
                      class="flex gap-2 text-2xs font-mono"
                    >
                      <span class="text-muted-foreground tabular-nums shrink-0">{{ fmtLocalTime(l.raw.timestamp) }}</span>
                      <span class="truncate text-foreground/80">{{ stripAnsi(l.raw.content).slice(0, 120) }}</span>
                    </span>
                    <span
                      v-if="group.lines.length > 3"
                      class="text-2xs text-muted-foreground italic"
                    >
                      … 共 {{ group.lines.length }} 条
                    </span>
                  </span>
                </span>
                <span v-else class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" v-html="lineHtml(group.lines[0].raw)" />
                <!-- ponytail: large ×N badge on the left of the row signals
                     "this is folded". Color follows severity for instant
                     scanability — error fold = red, warn = amber, etc. -->
                <span
                  :class="cn(
                    'shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-bold tabular-nums transition-colors',
                    severityBgFor(group.lines[0].raw.severity),
                    severityBorderFor(group.lines[0].raw.severity),
                  )"
                  :title="`本组 ${group.lines.length} 条相同的日志 · 点击展开`"
                >
                  <ChevronDown v-if="group.expanded" :size="11" :stroke-width="2.5" />
                  <ChevronRight v-else :size="11" :stroke-width="2.5" />
                  ×{{ group.lines.length }}
                </span>
              </div>
            </div>
            <Transition name="fade-fast">
              <div v-if="group.expanded" class="contents">
                <template v-for="(line, idx) in group.lines.slice(1)" :key="`${group.key}:${line.raw.timestamp}`">
                  <div
                    class="grid grid-cols-[88px_72px_1fr] gap-x-3 items-baseline pl-7 pr-3 leading-[22px] min-h-[22px] border-l-[3px] border-l-foreground/20 text-muted-foreground relative"
                    :style="{ opacity: timeOpacity(line.raw.timestamp) }"
                    v-memo="[line.raw.content, line.raw.severity, jsonExpanded.has(`${group.key + idx + 1}`), line.traceId, truncatedExpanded.has(line.raw.content)]"
                  >
                  <button
                    v-if="line.traceId"
                    type="button"
                    @click.stop="toggleTraceFilter(line.traceId)"
                    class="absolute left-0 top-0 bottom-0 w-1 hover:w-1.5 transition-all cursor-pointer z-10"
                    :style="{ background: traceIdColor(line.traceId) }"
                    :title="`按 trace_id 过滤: ${line.traceId}`"
                    :aria-label="`按 trace_id ${line.traceId} 过滤`"
                  />
                  <span
                    class="sticky left-0 bg-card text-2xs text-foreground font-mono tabular-nums select-none whitespace-nowrap px-2 py-0.5 z-10"
                    :title="`${fmtUtcTime(line.raw.timestamp)} · ${tzOffset()}`"
                  >
                    {{ fmtLocalTime(line.raw.timestamp) }}
                  </span>
                  <span class="sticky left-[100px] bg-card z-10" />
                  <div class="flex items-baseline gap-2 min-w-0">
                    <button
                      v-if="line.isJson"
                      type="button"
                      @click="toggleJson(`${group.key + idx + 1}`)"
                      class="shrink-0 inline-flex items-center gap-0.5 px-1.5 min-h-6 rounded text-2xs font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                      :title="jsonExpanded.has(`${group.key + idx + 1}`) ? '折叠 JSON' : '展开 JSON'"
                      :aria-expanded="jsonExpanded.has(`${group.key + idx + 1}`)"
                      aria-label="切换 JSON 展开"
                    >
                      JSON
                      <ChevronDown v-if="!jsonExpanded.has(`${group.key + idx + 1}`)" :size="9" :stroke-width="2.5" />
                      <ChevronUp v-else :size="9" :stroke-width="2.5" />
                    </button>
                    <span class="flex-1 min-w-0 font-mono text-foreground" :class="wrapClass" v-html="lineHtml(line.raw)" />
                    <button
                      v-if="plainLength(line.raw) > TRUNCATE_LIMIT"
                      type="button"
                      class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-2xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors"
                      :title="truncatedExpanded.has(line.raw.content) ? '收起' : `展开剩余 ${(plainLength(line.raw) - TRUNCATE_LIMIT).toLocaleString()} 字`"
                      @click.stop="toggleTruncate(line.raw.content)"
                    >
                      {{ truncatedExpanded.has(line.raw.content) ? '收起' : `+${(plainLength(line.raw) - TRUNCATE_LIMIT).toLocaleString()} 字` }}
                    </button>
                  </div>
                </div>
                <div
                  v-if="line.isJson && jsonExpanded.has(`${group.key + idx + 1}`)"
                  class="ml-[184px] mr-3 mb-1 mt-1 px-3 py-2 rounded bg-muted/40 border border-border text-[11px] overflow-x-auto font-mono"
                >
                  <div
                    v-for="jl in formatJsonLines(line.raw)"
                    :key="jl.num"
                    class="flex items-start gap-2 leading-[1.7] hover:bg-background/40 -mx-1 px-1 rounded-sm"
                  >
                <span class="shrink-0 w-7 text-right text-muted-foreground tabular-nums select-none text-2xs mt-px">{{ jl.num }}</span>
                    <span
                      class="flex-1 min-w-0 whitespace-pre"
                      :style="JSON_GUIDE_STYLE"
                      v-html="jl.html"
                    />
                  </div>
                </div>
              </template>
              </div>
            </Transition>
          </template>
        </template>
        <div :style="{ height: padBottom + 'px' }" aria-hidden="true" />
      </div>
    </div>

    <!-- Status bar -->
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between items-center shrink-0 font-sans">
      <span class="tabular-nums">
        <span class="text-foreground font-medium">{{ displayedLines.length.toLocaleString() }}</span>
        <span v-if="search || minSeverity > 0"> / {{ lines.length.toLocaleString() }}</span>
        行
      </span>
      <div class="flex items-center gap-3">
        <span v-if="streaming" class="flex items-center gap-1 text-success">
          <span class="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          实时
        </span>
        <span v-else class="text-warning">已暂停</span>
        <span class="hidden sm:inline text-muted-foreground">·</span>
        <span v-if="!autoFollow">滚动到顶部查看最新</span>
        <span v-else>自动跟随 <ChevronDown :size="11" :stroke-width="2" class="inline -mb-px" /></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
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