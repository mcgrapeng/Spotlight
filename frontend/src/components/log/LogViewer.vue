<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import {
  Search, Pause, Play, ChevronUp, ChevronDown, ChevronRight,
  Copy, X, Terminal, Filter, Clock,
} from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useLogFilters, SEVERITY_RANK as SEV_RANK } from '@/composables/useLogFilters'
import type { LogLine } from '@/domain/types'

const props = defineProps<{
  lines: ReadonlyArray<LogLine>
  streaming?: boolean
  unreadCount?: number
  containers?: readonly string[]
}>()

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
  'consume-unread': []
  'update:filtered': [value: readonly LogLine[]]
}>()

// === State ===
const search = ref('')
const autoFollow = ref(true)
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

interface FoldGroup {
  kind: 'single'
  line: LogLine
  key: number
}
interface FoldRun {
  kind: 'run'
  lines: LogLine[]
  key: number
  sig: string
  expanded: boolean
}
type Group = FoldGroup | FoldRun

const expanded = ref(new Set<number>())

const groups = computed<Group[]>(() => {
  const out: Group[] = []
  let i = 0
  const arr = displayedLines.value
  while (i < arr.length) {
    const sig = normalize(arr[i].content)
    let j = i + 1
    while (j < arr.length && normalize(arr[j].content) === sig) j++
    if (j - i >= 3) {
      out.push({
        kind: 'run',
        lines: arr.slice(i, j),
        key: i,
        sig,
        expanded: expanded.value.has(i),
      })
      i = j
    } else {
      for (let k = i; k < j; k++) out.push({ kind: 'single', line: arr[k], key: k })
      i = j
    }
  }
  return out
})

function toggleExpand(key: number) {
  const s = new Set(expanded.value)
  if (s.has(key)) s.delete(key); else s.add(key)
  expanded.value = s
}

// === Severity counts (over full unfiltered set, so chips stay stable while searching) ===
const counts = computed(() => {
  const c: Record<string, number> = { trace: 0, debug: 0, info: 0, warn: 0, error: 0 }
  for (const l of props.lines) {
    const s = l.severity.toLowerCase()
    if (s in c) c[s]++
  }
  return c
})

// === Time histogram (60 bins over the full unfiltered set — chips-style stable) ===
const HISTOGRAM_BINS = 60

function parseTs(s: string): number {
  const t = new Date(s).getTime()
  return Number.isFinite(t) ? t : NaN
}

const histogram = computed(() => {
  const bins = new Array<number>(HISTOGRAM_BINS).fill(0)
  let min = Infinity, max = -Infinity, any = false
  for (const l of props.lines) {
    const t = parseTs(l.timestamp)
    if (!Number.isFinite(t)) continue
    if (t < min) min = t
    if (t > max) max = t
    any = true
  }
  const range = any ? max - min : 0
  const binMs = range > 0 ? range / HISTOGRAM_BINS : 0
  if (any) {
    for (const l of props.lines) {
      const t = parseTs(l.timestamp)
      if (!Number.isFinite(t)) continue
      const idx = range > 0
        ? Math.min(HISTOGRAM_BINS - 1, Math.max(0, Math.floor((t - min) / binMs)))
        : 0
      bins[idx]++
    }
  }
  return { bins, binMs, minTs: any ? min : 0 }
})

const histogramMax = computed(() => Math.max(1, ...histogram.value.bins))

function formatBinTime(idx: number): string {
  const { minTs, binMs } = histogram.value
  if (!minTs) return ''
  return new Date(minTs + idx * binMs).toISOString().slice(11, 19)
}

function formatBinEndTime(): string {
  const { minTs, binMs } = histogram.value
  if (!minTs) return ''
  return new Date(minTs + HISTOGRAM_BINS * binMs).toISOString().slice(11, 19)
}

function formatRangeLabel(r: readonly [number, number]): string {
  const fmt = (t: number) => new Date(t).toISOString().slice(11, 19)
  return `${fmt(r[0])}–${fmt(r[1])}`
}

// === Time-range filter (click histogram bar → narrow to that bin) ===
const histogramRange = ref<[number, number] | null>(null)

function onHistogramBarClick(i: number) {
  const { minTs, binMs } = histogram.value
  if (!minTs) return
  const start = minTs + i * binMs
  const end = start + binMs
  const cur = histogramRange.value
  if (cur && Math.abs(cur[0] - start) < 1 && Math.abs(cur[1] - end) < 1) {
    histogramRange.value = null
    return
  }
  histogramRange.value = [start, end]
}

function isBinInRange(i: number): boolean {
  const r = histogramRange.value
  if (!r) return false
  const { minTs, binMs } = histogram.value
  if (!minTs) return false
  const binStart = minTs + i * binMs
  return binStart >= r[0] - binMs / 2 && binStart < r[1]
}

// === Additional filter pipeline: container + time range ===
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
  let lines = filtered.value
  const sc = selectedContainer.value
  if (sc) lines = lines.filter((l) => l.container === sc)
  const r = histogramRange.value
  if (r) lines = lines.filter((l) => {
    const t = parseTs(l.timestamp)
    return Number.isFinite(t) && t >= r[0] && t < r[1]
  })
  return lines
})

// === Auto-scroll (NEWEST AT TOP → scrollTop=0 is newest) ===
function jumpToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(displayedLines, (v) => {
  emit('update:filtered', v)
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) jumpToTop()
}, { immediate: true })

watch(() => props.lines.length, () => {
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) jumpToTop()
})

function onScroll() {
  if (!scrollEl.value) return
  // If user scrolled away from top, disable auto-follow (show unread pill)
  if (scrollEl.value.scrollTop > 50 && autoFollow.value) {
    autoFollow.value = false
  }
}

function toggleAutoFollow() {
  autoFollow.value = !autoFollow.value
  if (autoFollow.value) {
    emit('consume-unread')
    jumpToTop()
  }
}

// === Keyboard ===
function onKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') {
    if (e.key === 'Escape' && tag === 'INPUT') {
      search.value = ''
      ;(e.target as HTMLInputElement).blur()
    }
    return
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
    e.preventDefault()
    searchInput.value?.focus()
  } else if (e.key === '/') {
    e.preventDefault()
    searchInput.value?.focus()
  } else if (e.key === 'k' || e.key === 'K') {
    e.preventDefault()
    emit('update:streaming', !props.streaming)
  } else if (e.key === 'l' || e.key === 'L') {
    e.preventDefault()
    toggleAutoFollow()
  } else if (e.key === 'c' || e.key === 'C') {
    if (e.metaKey || e.ctrlKey) return
    e.preventDefault()
    copyAll()
  }
}

async function copyAll() {
  const text = displayedLines.value
    .map(l => `${l.timestamp} [${l.severity.toUpperCase()}] [${l.container}] ${l.content}`)
    .join('\n')
  try { await navigator.clipboard.writeText(text) } catch (err) { console.error('clipboard', err) }
}

onMounted(() => {
  document.addEventListener('keydown', onKey)
  nextTick(jumpToTop)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
})

// === Visual helpers ===
const SEV_ICON: Record<string, string> = {
  trace: '·', debug: '·', info: 'i', notice: 'i',
  warn: '!', warning: '!', error: '×', err: '×',
  critical: '×', fatal: '×', alert: '×', emergency: '×',
  unknown: '?',
}
const SEV_CLASS: Record<string, string> = {
  trace: 'text-muted-foreground/50', debug: 'text-muted-foreground/50',
  info: 'text-foreground', notice: 'text-foreground',
  warn: 'text-warning', warning: 'text-warning',
  error: 'text-error', err: 'text-error',
  critical: 'text-error font-semibold', fatal: 'text-error font-bold',
  alert: 'text-error font-bold', emergency: 'text-error font-bold',
  unknown: 'text-foreground',
}
const SEV_ERROR_KEYS = new Set(['error', 'err', 'critical', 'fatal', 'alert', 'emergency'])

function severityBgFor(s: string): string {
  return SEV_ERROR_KEYS.has(s.toLowerCase()) ? 'bg-error/5' : ''
}
function severityBorderFor(s: string): string {
  return SEV_ERROR_KEYS.has(s.toLowerCase()) ? 'border-l-error' : 'border-l-transparent'
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c] as string,
  )
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlight(content: string): string {
  const q = search.value.trim()
  if (!q) return escapeHtml(content)
  return escapeHtml(content).replace(
    new RegExp(`(${escapeRegex(q)})`, 'gi'),
    '<mark class="bg-warning/30 text-foreground rounded-sm px-0.5">$1</mark>',
  )
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
const RECENT_KEY = 'k8s-viewer:log-search-history'
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
const jsonCache = new Map<string, unknown>()

function parseJson(content: string): unknown {
  if (jsonCache.has(content)) return jsonCache.get(content) ?? null
  let parsed: unknown = null
  try { parsed = JSON.parse(content) } catch { /* not JSON */ }
  if (parsed === null || typeof parsed !== 'object') parsed = null
  jsonCache.set(content, parsed)
  return parsed
}

function isJson(content: string): boolean {
  return parseJson(content) !== null
}

function prettyJson(content: string): string {
  const parsed = parseJson(content)
  if (parsed === null) return ''
  const json = JSON.stringify(parsed, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Tokenize: "key":  → info,  "value"  → success,  number → warning,  true/false/null → error
  return json.replace(
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

interface JsonLineHtml { num: number; indent: number; html: string }
const jsonLinesCache = new Map<string, JsonLineHtml[]>()

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

function formatJsonLines(content: string): JsonLineHtml[] {
  const cached = jsonLinesCache.get(content)
  if (cached) return cached
  const parsed = parseJson(content)
  if (parsed === null) return []
  const text = JSON.stringify(parsed, null, 2)
  const out: JsonLineHtml[] = []
  for (const [i, line] of text.split('\n').entries()) {
    const m = line.match(/^( *)/)
    const indent = (m?.[1].length ?? 0) / 2
    const stripped = line.slice(m?.[1].length ?? 0)
    out.push({ num: i + 1, indent, html: tokenizeJsonLine(stripped) })
  }
  jsonLinesCache.set(content, out)
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
    const parsed = parseJson(l.content)
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

function truncatedHtml(content: string): string {
  if (content.length <= TRUNCATE_LIMIT || truncatedExpanded.value.has(content)) {
    return highlight(content)
  }
  return highlight(content.slice(0, TRUNCATE_LIMIT)) + '<span class="text-muted-foreground/60 select-none">…</span>'
}
</script>

<template>
  <div class="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden font-mono text-xs">
    <!-- Severity filter chips -->
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
        @click="minSeverity = 0"
      >
        <Filter :size="11" :stroke-width="1.75" />
        全部
        <span class="tabular-nums">{{ lines.length.toLocaleString() }}</span>
      </button>
      <span class="text-muted-foreground/30 mx-0.5">·</span>
      <button
        v-for="(count, sev) in counts"
        :key="sev"
        type="button"
        :disabled="count === 0"
        :aria-pressed="minSeverity === SEV_RANK[sev]"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors text-2xs',
          'disabled:opacity-30 disabled:cursor-default',
          minSeverity === SEV_RANK[sev]
            ? 'border-foreground bg-foreground text-background'
            : cn(
                'border-transparent hover:bg-accent hover:text-foreground',
                SEV_CLASS[sev] ?? 'text-muted-foreground',
              ),
        )"
        @click="setSeverity(SEV_RANK[sev])"
        :title="`${sev} · ${count.toLocaleString()} 行`"
      >
        <span class="font-mono w-3 inline-block text-center font-bold">{{ SEV_ICON[sev] }}</span>
        <span class="uppercase tracking-wider">{{ sev }}</span>
        <span class="tabular-nums">{{ count.toLocaleString() }}</span>
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
        <span class="ml-1 tabular-nums text-muted-foreground/60">{{ lines.length.toLocaleString() }}</span>
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
        <span class="ml-1 tabular-nums text-muted-foreground/60 shrink-0">{{ (containerCounts[c] ?? 0).toLocaleString() }}</span>
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
        <ChevronDown v-if="autoFollow" :size="13" :stroke-width="1.75" />
        <ChevronUp v-else :size="13" :stroke-width="1.75" />
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

    <!-- Time histogram (60 bins) with edge labels + click-to-filter -->
    <div class="border-b border-border bg-muted/30 shrink-0">
      <div class="flex items-center justify-between gap-2 px-3 pt-1 text-2xs text-muted-foreground font-sans">
        <span class="tabular-nums">{{ histogram.minTs ? formatBinTime(0) : '—' }}</span>
        <span
          v-if="histogramRange"
          class="inline-flex items-center gap-1 px-1.5 py-px rounded bg-foreground/10 text-foreground font-mono tabular-nums"
        >
          {{ formatRangeLabel(histogramRange) }}
          <button
            type="button"
            class="hover:text-error"
            aria-label="清除时间范围"
            @click="histogramRange = null"
          >
            <X :size="10" :stroke-width="2" />
          </button>
        </span>
        <span v-else class="tabular-nums">{{ lines.length.toLocaleString() }} 条</span>
        <span class="tabular-nums">{{ histogram.minTs ? formatBinEndTime() : '—' }}</span>
      </div>
      <div
        class="flex items-end gap-px h-10 px-3 pb-1"
        role="group"
        aria-label="时间分布直方图"
      >
        <button
          v-for="(count, i) in histogram.bins"
          :key="i"
          type="button"
          :class="cn(
            'flex-1 rounded-sm transition-colors cursor-pointer',
            count === 0 ? 'invisible pointer-events-none' : 'hover:bg-foreground/70',
            isBinInRange(i) ? 'bg-foreground' : 'bg-foreground/30',
          )"
          :style="count > 0 ? { height: `${(count / histogramMax) * 100}%` } : undefined"
          :title="count > 0 ? `${formatBinTime(i)} — ${count.toLocaleString()} 条` : undefined"
          :aria-label="count > 0 ? `${formatBinTime(i)} ${count} 条` : undefined"
          @click="onHistogramBarClick(i)"
        />
      </div>
    </div>

    <!-- Log area (NEWEST AT TOP) - fold groups, no virtualization -->
    <div
      ref="scrollEl"
      class="flex-1 overflow-auto bg-background relative scroll-smooth"
      role="log"
      aria-live="polite"
      aria-label="日志输出（最新在上）"
      @mouseenter="markInteraction"
      @scroll="(e) => { onScroll(); markInteraction() }"
    >
      <!-- "N new" pill when auto-follow is off and new lines arrived -->
      <button
        v-if="!autoFollow && (unreadCount ?? 0) > 0"
        type="button"
        class="sticky top-2 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground text-background text-2xs font-medium shadow-md hover:opacity-90 transition-opacity"
        @click="toggleAutoFollow"
      >
        <ChevronUp :size="12" :stroke-width="2" />
        {{ unreadCount }} 条新 · 跳转
      </button>

      <div v-if="displayedLines.length === 0" class="p-12 text-center text-muted-foreground font-sans">
        <Terminal :size="24" class="mx-auto mb-2 opacity-30" :stroke-width="1.5" />
        {{ search ? '没有匹配的行' : (streaming ? '等待日志…' : '日志已暂停') }}
      </div>
      <div v-else class="relative">
        <template v-for="group in groups" :key="group.key">
          <template v-if="group.kind === 'single'">
            <div
              :class="cn(
                'flex items-start gap-3 px-3 leading-[22px] min-h-[22px] border-l-2',
                'hover:bg-muted/40 transition-colors',
                severityBgFor(group.line.severity),
                severityBorderFor(group.line.severity),
              )"
              v-memo="[group.line.content, group.line.severity, jsonExpanded.has(`${group.key}`)]"
            >
              <span :class="cn('shrink-0 mt-[5px] w-3 text-center font-bold tabular-nums', SEV_CLASS[group.line.severity.toLowerCase()] ?? 'text-foreground')" aria-hidden="true">{{ SEV_ICON[group.line.severity.toLowerCase()] ?? '·' }}</span>
              <span class="shrink-0 w-[160px] text-muted-foreground/80 tabular-nums truncate pt-0.5">{{ group.line.timestamp }}</span>
              <span
                v-if="group.line.container && group.line.container !== '—'"
                class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
                :title="group.line.container"
              >{{ group.line.container }}</span>
              <button
                v-if="isJson(group.line.content)"
                type="button"
                @click="toggleJson(`${group.key}`)"
                class="shrink-0 inline-flex items-center gap-0.5 px-1 py-0 rounded text-[9px] font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                :title="jsonExpanded.has(`${group.key}`) ? '折叠 JSON' : '展开 JSON'"
                :aria-expanded="jsonExpanded.has(`${group.key}`)"
                aria-label="切换 JSON 展开"
              >
                JSON
                <ChevronDown v-if="!jsonExpanded.has(`${group.key}`)" :size="9" :stroke-width="2.5" />
                <ChevronUp v-else :size="9" :stroke-width="2.5" />
              </button>
              <span class="flex-1 min-w-0 whitespace-pre-wrap break-all" v-html="truncatedHtml(group.line.content)" />
              <button
                v-if="group.line.content.length > TRUNCATE_LIMIT"
                type="button"
                class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-2xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors"
                :title="truncatedExpanded.has(group.line.content) ? '收起' : `展开剩余 ${(group.line.content.length - TRUNCATE_LIMIT).toLocaleString()} 字`"
                @click.stop="toggleTruncate(group.line.content)"
              >
                {{ truncatedExpanded.has(group.line.content) ? '收起' : `+${(group.line.content.length - TRUNCATE_LIMIT).toLocaleString()} 字` }}
              </button>
            </div>
            <div
              v-if="isJson(group.line.content) && jsonExpanded.has(`${group.key}`)"
              class="ml-12 mr-3 mb-1 mt-1 px-3 py-2 rounded bg-muted/40 border border-border text-[11px] overflow-x-auto font-mono"
            >
              <div
                v-for="jl in formatJsonLines(group.line.content)"
                :key="jl.num"
                class="flex items-start gap-2 leading-[1.7] hover:bg-background/40 -mx-1 px-1 rounded-sm"
              >
                <span class="shrink-0 w-7 text-right text-muted-foreground/40 tabular-nums select-none text-[10px] mt-px">{{ jl.num }}</span>
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
                'flex items-start gap-3 px-3 leading-[22px] min-h-[22px] border-l-2 cursor-pointer select-none',
                'hover:bg-muted/40 transition-colors',
                severityBgFor(group.lines[0].severity),
                severityBorderFor(group.lines[0].severity),
              )"
              v-memo="[group.lines.length, group.expanded, group.lines[0].content, jsonExpanded.has(`${group.key}`)]"
              role="button"
              :aria-expanded="group.expanded"
              @click="toggleExpand(group.key)"
            >
              <span :class="cn('shrink-0 mt-[5px] w-3 text-center font-bold tabular-nums', SEV_CLASS[group.lines[0].severity.toLowerCase()] ?? 'text-foreground')" aria-hidden="true">{{ SEV_ICON[group.lines[0].severity.toLowerCase()] ?? '·' }}</span>
              <span class="shrink-0 w-[160px] text-muted-foreground/80 tabular-nums truncate pt-0.5">{{ group.lines[0].timestamp }}</span>
              <span
                v-if="group.lines[0].container && group.lines[0].container !== '—'"
                class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
                :title="group.lines[0].container"
              >{{ group.lines[0].container }}</span>
              <button
                v-if="isJson(group.lines[0].content)"
                type="button"
                @click.stop="toggleJson(`${group.key}`)"
                class="shrink-0 inline-flex items-center gap-0.5 px-1 py-0 rounded text-[9px] font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                :title="jsonExpanded.has(`${group.key}`) ? '折叠 JSON' : '展开 JSON'"
                :aria-expanded="jsonExpanded.has(`${group.key}`)"
                aria-label="切换 JSON 展开"
              >
                JSON
                <ChevronDown v-if="!jsonExpanded.has(`${group.key}`)" :size="9" :stroke-width="2.5" />
                <ChevronUp v-else :size="9" :stroke-width="2.5" />
              </button>
              <span class="flex-1 min-w-0 truncate">{{ group.lines[0].content }}</span>
              <span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground text-background text-2xs font-semibold tabular-nums">
                <ChevronDown v-if="group.expanded" :size="10" :stroke-width="2.5" />
                <ChevronRight v-else :size="10" :stroke-width="2.5" />
                ×{{ group.lines.length }}
              </span>
            </div>
            <template v-if="group.expanded">
              <template v-for="(line, idx) in group.lines.slice(1)" :key="`${group.key}:${line.timestamp}`">
                <div
                  class="flex items-start gap-3 pl-10 pr-3 leading-[22px] min-h-[22px] border-l-2 border-l-foreground/20 ml-3 text-muted-foreground"
                  v-memo="[line.content, line.severity, jsonExpanded.has(`${group.key + idx + 1}`)]"
                >
                  <span class="shrink-0 w-[130px] text-muted-foreground/60 tabular-nums truncate pt-0.5">{{ line.timestamp }}</span>
                  <button
                    v-if="isJson(line.content)"
                    type="button"
                    @click="toggleJson(`${group.key + idx + 1}`)"
                    class="shrink-0 inline-flex items-center gap-0.5 px-1 py-0 rounded text-[9px] font-bold uppercase tracking-wider bg-info-bg text-info border border-info-border hover:bg-info/20 transition-colors"
                    :title="jsonExpanded.has(`${group.key + idx + 1}`) ? '折叠 JSON' : '展开 JSON'"
                    :aria-expanded="jsonExpanded.has(`${group.key + idx + 1}`)"
                    aria-label="切换 JSON 展开"
                  >
                    JSON
                    <ChevronDown v-if="!jsonExpanded.has(`${group.key + idx + 1}`)" :size="9" :stroke-width="2.5" />
                    <ChevronUp v-else :size="9" :stroke-width="2.5" />
                  </button>
                  <span class="flex-1 min-w-0 whitespace-pre-wrap break-all" v-html="truncatedHtml(line.content)" />
                  <button
                    v-if="line.content.length > TRUNCATE_LIMIT"
                    type="button"
                    class="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-2xs font-medium border border-info-border text-info hover:bg-info/10 transition-colors"
                    :title="truncatedExpanded.has(line.content) ? '收起' : `展开剩余 ${(line.content.length - TRUNCATE_LIMIT).toLocaleString()} 字`"
                    @click.stop="toggleTruncate(line.content)"
                  >
                    {{ truncatedExpanded.has(line.content) ? '收起' : `+${(line.content.length - TRUNCATE_LIMIT).toLocaleString()} 字` }}
                  </button>
                </div>
                <div
                  v-if="isJson(line.content) && jsonExpanded.has(`${group.key + idx + 1}`)"
                  class="ml-[170px] mr-3 mb-1 mt-1 px-3 py-2 rounded bg-muted/40 border border-border text-[11px] overflow-x-auto font-mono"
                >
                  <div
                    v-for="jl in formatJsonLines(line.content)"
                    :key="jl.num"
                    class="flex items-start gap-2 leading-[1.7] hover:bg-background/40 -mx-1 px-1 rounded-sm"
                  >
                    <span class="shrink-0 w-7 text-right text-muted-foreground/40 tabular-nums select-none text-[10px] mt-px">{{ jl.num }}</span>
                    <span
                      class="flex-1 min-w-0 whitespace-pre"
                      :style="JSON_GUIDE_STYLE"
                      v-html="jl.html"
                    />
                  </div>
                </div>
              </template>
            </template>
          </template>
        </template>
      </div>
    </div>

    <!-- Status bar -->
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between items-center shrink-0 font-sans">
      <span class="tabular-nums">
        <span class="text-foreground font-medium">{{ displayedLines.length.toLocaleString() }}</span>
        <span v-if="search || minSeverity > 0 || histogramRange"> / {{ lines.length.toLocaleString() }}</span>
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