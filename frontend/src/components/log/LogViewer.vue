<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Search, Pause, Play, ChevronUp, ChevronDown,
  Copy, X, Terminal, Filter,
} from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LogLine {
  timestamp: string; content: string; container: string; severity: string
}

const props = defineProps<{
  lines: ReadonlyArray<LogLine>
  streaming?: boolean
  unreadCount?: number
}>()

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
  'consume-unread': []
}>()

// === State ===
const search = ref('')
const autoFollow = ref(true)
const scrollEl = ref<HTMLElement | null>(null)
const searchInput = ref<InstanceType<typeof HTMLInputElement> | null>(null)
const lastInteraction = ref(Date.now())
function markInteraction() { lastInteraction.value = Date.now() }

const LINE_HEIGHT = 22
const BUFFER = 50
const MAX_FILTERED = 50000

// === Filtering ===
const SEV_RANK: Record<string, number> = {
  trace: 0, debug: 0, info: 1, notice: 1,
  warn: 2, warning: 2, error: 3, err: 3,
  critical: 4, fatal: 4, alert: 4, emergency: 4,
  unknown: 0,
}
const MIN_SEVERITY = ref(0)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return props.lines.filter(l => {
    if (MIN_SEVERITY.value > 0 && (SEV_RANK[l.severity.toLowerCase()] ?? 0) < MIN_SEVERITY.value) return false
    if (!q) return true
    return l.content.toLowerCase().includes(q) || l.container.toLowerCase().includes(q)
  }).slice(0, MAX_FILTERED)
})

// === Severity counts (over full unfiltered set, so chips stay stable while searching) ===
const counts = computed(() => {
  const c: Record<string, number> = { trace: 0, debug: 0, info: 0, warn: 0, error: 0 }
  for (const l of props.lines) {
    const s = l.severity.toLowerCase()
    if (s in c) c[s]++
  }
  return c
})

// === Virtual scroll (NEWEST AT TOP → scrollTop=0 is newest) ===
const visibleRange = ref({ start: 0, end: 0, padBottom: 0 })

function recomputeVisible() {
  const el = scrollEl.value
  if (!el) return
  const total = filtered.value.length
  const viewportH = el.clientHeight
  const scrollTop = el.scrollTop
  const start = Math.max(0, Math.floor(scrollTop / LINE_HEIGHT) - BUFFER)
  const end = Math.min(total, Math.ceil((scrollTop + viewportH) / LINE_HEIGHT) + BUFFER)
  const padBottom = Math.max(0, (total - end) * LINE_HEIGHT)
  if (start !== visibleRange.value.start || end !== visibleRange.value.end || padBottom !== visibleRange.value.padBottom) {
    visibleRange.value = { start, end, padBottom }
  }
}

function jumpToTop() {
  if (!scrollEl.value) return
  scrollEl.value.scrollTo({ top: 0, behavior: 'smooth' })
  recomputeVisible()
}

watch(filtered, () => {
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) {
    jumpToTop()
  } else {
    recomputeVisible()
  }
})

watch(() => props.lines.length, () => {
  const recentlyWatched = Date.now() - lastInteraction.value < 3000
  const wasNearTop = scrollEl.value ? scrollEl.value.scrollTop < 100 : true
  if (autoFollow.value && recentlyWatched && wasNearTop) {
    jumpToTop()
  } else {
    recomputeVisible()
  }
})

function onScroll() {
  if (!scrollEl.value) return
  // If user scrolled away from top, disable auto-follow (show unread pill)
  if (scrollEl.value.scrollTop > 50 && autoFollow.value) {
    autoFollow.value = false
  }
  recomputeVisible()
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

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  document.addEventListener('keydown', onKey)
  nextTick(() => {
    recomputeVisible()
    jumpToTop()
  })
  if (scrollEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => recomputeVisible())
    resizeObserver.observe(scrollEl.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  resizeObserver?.disconnect()
  resizeObserver = null
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
const SEV_BG: Record<string, string> = {
  error: 'bg-error/5', err: 'bg-error/5', critical: 'bg-error/10',
  fatal: 'bg-error/10', alert: 'bg-error/10', emergency: 'bg-error/10',
}
const SEV_LEFT_BORDER: Record<string, string> = {
  error: 'border-l-error', err: 'border-l-error',
  critical: 'border-l-error', fatal: 'border-l-error',
  alert: 'border-l-error', emergency: 'border-l-error',
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
  MIN_SEVERITY.value = MIN_SEVERITY.value === rank ? 0 : rank
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
          MIN_SEVERITY === 0 ? 'border-foreground/40 bg-foreground/5 text-foreground' : 'border-transparent text-muted-foreground hover:bg-accent',
        )"
        @click="MIN_SEVERITY = 0"
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
          MIN_SEVERITY === SEV_RANK[sev] ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
          MIN_SEVERITY !== SEV_RANK[sev] ? (SEV_CLASS[sev] ?? 'text-muted-foreground') : '',
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

    <!-- Virtualized log area (NEWEST AT TOP) -->
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
        <div
          v-for="(line, idx) in filtered.slice(visibleRange.start, visibleRange.end)"
          :key="(visibleRange.start + idx) + ':' + line.content.slice(0, 40)"
          v-memo="[line.content, line.severity, line.container]"
          :class="cn(
            'flex items-start gap-3 px-3 leading-[22px] min-h-[22px] border-l-2',
            'hover:bg-muted/40 transition-colors',
            SEV_BG[line.severity.toLowerCase()] ?? '',
            SEV_LEFT_BORDER[line.severity.toLowerCase()] ?? 'border-l-transparent',
          )"
        >
          <span
            :class="cn('shrink-0 mt-px w-3 text-center font-bold tabular-nums', SEV_CLASS[line.severity.toLowerCase()] ?? 'text-foreground')"
            aria-hidden="true"
          >{{ SEV_ICON[line.severity.toLowerCase()] ?? '·' }}</span>
          <span class="shrink-0 w-[160px] text-muted-foreground/80 tabular-nums truncate pt-px">{{ line.timestamp }}</span>
          <span
            v-if="line.container && line.container !== '—'"
            class="shrink-0 inline-flex items-center max-w-[140px] px-1.5 py-0 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border uppercase tracking-wider truncate"
            :title="line.container"
          >{{ line.container }}</span>
          <span class="flex-1 min-w-0 whitespace-pre-wrap break-all" v-html="highlight(line.content)" />
        </div>
        <div :style="{ height: visibleRange.padBottom + 'px' }" aria-hidden="true" />
      </div>
    </div>

    <!-- Status bar -->
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between items-center shrink-0 font-sans">
      <span class="tabular-nums">
        <span class="text-foreground font-medium">{{ filtered.length.toLocaleString() }}</span>
        <span v-if="search || MIN_SEVERITY > 0"> / {{ lines.length.toLocaleString() }}</span>
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