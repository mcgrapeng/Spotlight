<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, toRef, watch } from 'vue'
import {
  Search, Pause, Play, ChevronUp, ChevronDown, ChevronRight,
  Copy, X, Terminal, Filter,
} from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLogFilters, SEVERITY_RANK as SEV_RANK } from '@/composables/useLogFilters'
import type { LogLine } from '@/domain/types'

const props = defineProps<{
  lines: ReadonlyArray<LogLine>
  streaming?: boolean
  unreadCount?: number
}>()

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
  'consume-unread': []
  'update:filtered': [value: readonly LogLine[]]
  'histogram-click': [binIndex: number]
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
  const arr = filtered.value
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

// === Auto-scroll (NEWEST AT TOP → scrollTop=0 is newest) ===
function jumpToTop() {
  scrollEl.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(filtered, (v) => {
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
  const text = filtered.value
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
</script>

<template>
  <div class="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden font-mono text-xs">
    <!-- Severity filter chips -->
    <div class="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted overflow-x-auto shrink-0 whitespace-nowrap">
      <button
        type="button"
        :class="cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition-colors text-2xs',
          minSeverity === 0 ? 'border-foreground/40 bg-foreground/5 text-foreground' : 'border-transparent text-muted-foreground hover:bg-accent',
        )"
        @click="minSeverity = 0"
      >
        <Filter :size="11" :stroke-width="1.75" />
        全部
      </button>
      <span class="text-muted-foreground/30 mx-0.5">·</span>
      <button
        v-for="(count, sev) in counts"
        :key="sev"
        type="button"
        :disabled="count === 0"
        :class="cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors text-2xs',
          'disabled:opacity-30 disabled:cursor-default',
          minSeverity === SEV_RANK[sev] ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          minSeverity !== SEV_RANK[sev] ? (SEV_CLASS[sev] ?? 'text-muted-foreground') : '',
        )"
        @click="setSeverity(SEV_RANK[sev])"
        :title="`${sev} · ${count.toLocaleString()} 行`"
      >
        <span class="font-mono w-3 inline-block text-center font-bold">{{ SEV_ICON[sev] }}</span>
        <span class="uppercase tracking-wider">{{ sev }}</span>
        <span class="tabular-nums">{{ count.toLocaleString() }}</span>
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
        :disabled="!filtered.length"
        @click="copyAll"
        aria-label="复制全部 (C)"
      >
        <Copy :size="13" :stroke-width="1.75" />
      </Button>
    </div>

    <!-- Time histogram (60 bins) -->
    <div
      class="flex items-end gap-px h-6 px-3 border-b border-border bg-muted/30 shrink-0"
      role="group"
      aria-label="时间分布直方图"
    >
      <button
        v-for="(count, i) in histogram.bins"
        :key="i"
        type="button"
        :class="cn(
          'flex-1 rounded-sm transition-colors cursor-pointer',
          count === 0 ? 'invisible pointer-events-none' : 'bg-foreground/30 hover:bg-foreground/70',
        )"
        :style="count > 0 ? { height: `${(count / histogramMax) * 100}%` } : undefined"
        :title="count > 0 ? `${formatBinTime(i)} — ${count.toLocaleString()} 条` : undefined"
        :aria-label="count > 0 ? `${formatBinTime(i)} ${count} 条` : undefined"
        @click="emit('histogram-click', i)"
      />
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

      <div v-if="filtered.length === 0" class="p-12 text-center text-muted-foreground font-sans">
        <Terminal :size="24" class="mx-auto mb-2 opacity-30" :stroke-width="1.5" />
        {{ search ? '没有匹配的行' : (streaming ? '等待日志…' : '日志已暂停') }}
      </div>
      <div v-else class="relative">
        <template v-for="group in groups" :key="group.key">
          <div
            v-if="group.kind === 'single'"
            :class="cn(
              'flex items-start gap-3 px-3 leading-[22px] min-h-[22px] border-l-2',
              'hover:bg-muted/40 transition-colors',
              severityBgFor(group.line.severity),
              severityBorderFor(group.line.severity),
            )"
            v-memo="[group.line.content, group.line.severity]"
          >
            <span :class="cn('shrink-0 mt-[5px] w-3 text-center font-bold tabular-nums', SEV_CLASS[group.line.severity.toLowerCase()] ?? 'text-foreground')" aria-hidden="true">{{ SEV_ICON[group.line.severity.toLowerCase()] ?? '·' }}</span>
            <span class="shrink-0 w-[160px] text-muted-foreground/80 tabular-nums truncate pt-0.5">{{ group.line.timestamp }}</span>
            <span
              v-if="group.line.container && group.line.container !== '—'"
              class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
              :title="group.line.container"
            >{{ group.line.container }}</span>
            <span class="flex-1 min-w-0 whitespace-pre-wrap break-all" v-html="highlight(group.line.content)" />
          </div>
          <template v-else>
            <div
              :class="cn(
                'flex items-start gap-3 px-3 leading-[22px] min-h-[22px] border-l-2 cursor-pointer select-none',
                'hover:bg-muted/40 transition-colors',
                severityBgFor(group.lines[0].severity),
                severityBorderFor(group.lines[0].severity),
              )"
              v-memo="[group.lines.length, group.expanded, group.lines[0].content]"
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
              <span class="flex-1 min-w-0 truncate">{{ group.lines[0].content }}</span>
              <span class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground text-background text-2xs font-semibold tabular-nums">
                <ChevronDown v-if="group.expanded" :size="10" :stroke-width="2.5" />
                <ChevronRight v-else :size="10" :stroke-width="2.5" />
                ×{{ group.lines.length }}
              </span>
            </div>
            <template v-if="group.expanded">
              <div
                v-for="line in group.lines.slice(1)"
                :key="`${group.key}:${line.timestamp}`"
                class="flex items-start gap-3 pl-10 pr-3 leading-[22px] min-h-[22px] border-l-2 border-l-foreground/20 ml-3 text-muted-foreground"
                v-memo="[line.content, line.severity]"
              >
                <span class="shrink-0 w-[130px] text-muted-foreground/60 tabular-nums truncate pt-0.5">{{ line.timestamp }}</span>
                <span class="flex-1 min-w-0 whitespace-pre-wrap break-all" v-html="highlight(line.content)" />
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>

    <!-- Status bar -->
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between items-center shrink-0 font-sans">
      <span class="tabular-nums">
        <span class="text-foreground font-medium">{{ filtered.length.toLocaleString() }}</span>
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