<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, Trash2, Pause, Play, ArrowDown } from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LogLine {
  timestamp: string; content: string; container: string; severity: string
}

const props = defineProps<{
  lines: ReadonlyArray<LogLine>
  streaming?: boolean
}>()

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
}>()

const search = ref('')
const autoScroll = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const visibleRange = ref({ start: 0, end: 0 })

const LINE_HEIGHT_PX = 22
const OVERSCAN = 8
const AUTOSCROLL_THRESHOLD_PX = 50

const filtered = computed(() => {
  const q = search.value
  if (!q) return props.lines
  const needle = q.toLowerCase()
  return props.lines.filter(l =>
    l.content.toLowerCase().includes(needle) ||
    l.container.toLowerCase().includes(needle)
  )
})

const totalHeight = computed(() => filtered.value.length * LINE_HEIGHT_PX)
const visibleLines = computed(() => filtered.value.slice(visibleRange.value.start, visibleRange.value.end))
const padTop = computed(() => visibleRange.value.start * LINE_HEIGHT_PX)
const padBottom = computed(() => (filtered.value.length - visibleRange.value.end) * LINE_HEIGHT_PX)

function recomputeVisible() {
  const el = containerRef.value
  if (!el) return
  const viewport = el.clientHeight
  const start = Math.max(0, Math.floor(el.scrollTop / LINE_HEIGHT_PX) - OVERSCAN)
  const end = Math.min(
    filtered.value.length,
    Math.ceil((el.scrollTop + viewport) / LINE_HEIGHT_PX) + OVERSCAN,
  )
  if (start !== visibleRange.value.start || end !== visibleRange.value.end) {
    visibleRange.value = { start, end }
  }
}

function onScroll() {
  const el = containerRef.value
  if (!el) return
  const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  autoScroll.value = distanceFromBottom <= AUTOSCROLL_THRESHOLD_PX
  recomputeVisible()
}

function scrollToBottom() {
  if (!containerRef.value) return
  nextTick(() => {
    const el = containerRef.value
    if (!el) return
    el.scrollTop = el.scrollHeight
    recomputeVisible()
  })
}

function jumpToBottom() {
  autoScroll.value = true
  scrollToBottom()
}

function togglePause() {
  emit('update:streaming', !props.streaming)
}

watch(() => props.lines.length, () => {
  recomputeVisible()
  if (autoScroll.value) scrollToBottom()
})

watch(() => filtered.value.length, () => {
  recomputeVisible()
  if (autoScroll.value) scrollToBottom()
})

const SEVERITY_TEXT: Record<string, string> = {
  trace: 'text-muted-foreground',
  debug: 'text-muted-foreground',
  info: 'text-foreground',
  notice: 'text-foreground',
  warn: 'text-warning',
  warning: 'text-warning',
  err: 'text-error',
  error: 'text-error',
  critical: 'text-error font-semibold',
  fatal: 'text-error font-bold',
  alert: 'text-error font-semibold',
  emergency: 'text-error font-bold',
  unknown: 'text-foreground',
}

const SEVERITY_DOT: Record<string, string> = {
  trace: 'bg-muted-foreground/40',
  debug: 'bg-muted-foreground/60',
  info: 'bg-foreground/70',
  notice: 'bg-foreground',
  warn: 'bg-warning',
  warning: 'bg-warning',
  err: 'bg-error',
  error: 'bg-error',
  critical: 'bg-error',
  fatal: 'bg-error',
  alert: 'bg-error',
  emergency: 'bg-error',
  unknown: 'bg-foreground/50',
}

const severityClass = (s: string) => SEVERITY_TEXT[s] ?? 'text-foreground'
const severityDotClass = (s: string) => SEVERITY_DOT[s] ?? 'bg-foreground/60'

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightHtml(text: string): string {
  const q = search.value
  if (!q) return escapeHtml(text)
  const re = new RegExp(escapeRegex(q), 'gi')
  return escapeHtml(text).replace(
    re,
    '<mark class="bg-warning/30 text-foreground rounded px-0.5">$&</mark>',
  )
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  recomputeVisible()
  if (autoScroll.value) scrollToBottom()
  if (containerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => recomputeVisible())
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<template>
  <div class="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden">
    <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted">
      <div class="relative flex-1">
        <Search :size="14" class="absolute left-2.5 top-2.5 text-muted-foreground" :stroke-width="1.75" />
        <Input
          v-model="search"
          placeholder="过滤日志…"
          class="pl-8 h-8 text-sm"
          aria-label="过滤日志"
        />
      </div>
      <Button v-if="search" variant="outline" size="sm" @click="search = ''" aria-label="清除过滤">
        清除
      </Button>
      <Button variant="outline" size="sm" @click="emit('clear')" aria-label="清空">
        <Trash2 :size="14" :stroke-width="1.75" />
      </Button>
      <Button variant="outline" size="sm" @click="togglePause" :aria-label="streaming ? '暂停' : '继续'">
        <Pause v-if="streaming" :size="14" :stroke-width="1.75" />
        <Play v-else :size="14" :stroke-width="1.75" />
      </Button>
      <Button variant="outline" size="sm" @click="jumpToBottom" aria-label="跳到底部">
        <ArrowDown :size="14" :stroke-width="1.75" />
      </Button>
    </div>
    <div
      ref="containerRef"
      class="flex-1 overflow-auto font-mono text-xs"
      role="log"
      aria-live="polite"
      aria-label="日志输出"
      @scroll.passive="onScroll"
    >
      <div v-if="filtered.length === 0" class="p-8 text-center text-muted-foreground">
        {{ search ? '没有匹配的行' : '等待日志…' }}
      </div>
      <div v-else :style="{ height: totalHeight + 'px', position: 'relative' }">
        <div :style="{ height: padTop + 'px' }" />
        <div
          v-for="(line, i) in visibleLines"
          :key="visibleRange.start + i"
          v-memo="[line.content, line.severity, line.container]"
          :style="{ height: LINE_HEIGHT_PX + 'px' }"
          :class="cn('px-3 flex items-center gap-3 border-b border-border/30 hover:bg-muted/50', severityClass(line.severity))"
        >
          <span
            class="shrink-0 inline-block w-1.5 h-1.5 rounded-full"
            :class="severityDotClass(line.severity)"
            aria-hidden="true"
          />
          <span class="text-muted-foreground select-none shrink-0">{{ line.timestamp }}</span>
          <span class="text-muted-foreground/70 select-none shrink-0 font-mono uppercase tracking-wider text-2xs">
            [{{ line.container }}]
          </span>
          <span class="flex-1 whitespace-pre-wrap break-all" v-html="highlightHtml(line.content)" />
        </div>
        <div :style="{ height: padBottom + 'px' }" />
      </div>
    </div>
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between items-center">
      <span>{{ filtered.length }} / {{ lines.length }} 行</span>
      <span class="flex items-center gap-2">
        <span
          v-if="streaming"
          class="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse"
          aria-hidden="true"
        />
        <span
          v-else-if="!autoScroll"
          class="inline-block w-1.5 h-1.5 rounded-full bg-warning"
          aria-hidden="true"
        />
        <span v-if="streaming" class="text-success">实时</span>
        <span v-else-if="!autoScroll" class="text-warning">已暂停自动滚动</span>
      </span>
    </div>
  </div>
</template>
