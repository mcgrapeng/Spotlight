<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { NEmpty, NIcon, NTooltip } from 'naive-ui'
import {
  AlertTriangle, AlertOctagon, Bug, CircleDashed, Copy, Filter,
  Flame, InfoCircle, PlayerPause, PlayerPlay, Search, X, History,
} from '@vicons/tabler'
import { useLogStream } from '@/composables/useLogStream'
import { useClusterStore } from '@/stores/cluster'
import { applyClientFilter, groupStackTraces, highlightMatch } from '@/utils/logFormat'
import { podsApi } from '@/api/endpoints'
import type { LogLine, LogSeverity } from '@/domain/types'
import SeverityChip from '@/components/common/SeverityChip.vue'

const props = defineProps<{
  namespace: string
  name: string
  containers: string[]
  preset?: LogLine[]
}>()

const emit = defineEmits<{
  (e: 'lines', lines: LogLine[]): void
  (e: 'ask-ai', payload: { lines: string[]; question: string }): void
}>()

const cluster = useClusterStore()
const containerRef = ref<string>(props.containers[0] || '')

/**
 * Three explicit modes. Default is `history` — when the component mounts
 * it fetches the most recent `historySince` window and stays there until
 * the user starts live tailing. This matches user expectation that "open a
 * Pod → see its recent logs" is the default.
 *
 *   idle      → nothing loaded, no SSE
 *   history   → static window (default), show 历史 badge
 *   live      → SSE stream open, append new lines, show 实时 badge
 */
type Mode = 'idle' | 'history' | 'live'
const mode = ref<Mode>('idle')

const { lines, status, open: startStream, close: stopStream, clear: clearBuffer, stop: userStopStream } = useLogStream({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => props.namespace),
  name: computed(() => props.name),
  container: computed(() => containerRef.value),
  maxBuffered: 5000,
})

// ── Filters ─────────────────────────────────────────────────────────────────
const filter = ref('')
const regex = ref(false)
const caseInsensitive = ref(true)
const minSeverity = ref<LogSeverity | null>(null)
const following = ref(true)            // auto-scroll on new lines (live mode)
const historySince = ref('15m')
const historyLoading = ref(false)

const SINCE_PRESETS = [
  { label: '5m',  value: '5m'  },
  { label: '15m', value: '15m' },
  { label: '1h',  value: '1h'  },
  { label: '3h',  value: '3h'  },
  { label: '1d',  value: '1d'  },
  { label: '7d',  value: '7d'  },
] as const

const SEVERITY_PRESETS = [
  { label: 'INFO',     value: 'info'     as LogSeverity },
  { label: 'WARN+',    value: 'warn'     as LogSeverity },
  { label: 'ERROR+',   value: 'error'    as LogSeverity },
  { label: 'CRITICAL+',value: 'critical' as LogSeverity },
  { label: 'FATAL',    value: 'fatal'    as LogSeverity },
] as const

// ── Container auto-pick ────────────────────────────────────────────────────
watch(() => [props.namespace, props.name, props.containers],
  () => {
    if (!containerRef.value && props.containers.length) {
      containerRef.value = props.containers[0]
    } else if (containerRef.value && !props.containers.includes(containerRef.value)) {
      containerRef.value = props.containers[0] || ''
    }
  },
)

/* ── On mount: default to showing recent history ────────────────────────
   This is the requested default behavior — when the user opens a Pod they
   see the most recent logs immediately. Live tailing is opt-in. */
onMounted(() => {
  // Only honour preset when it's a non-empty array; otherwise fetch history.
  if (props.preset && props.preset.length) {
    lines.value = props.preset
    mode.value = 'history'
    return
  }
  loadHistory()
})

watch(lines, (l) => emit('lines', l), { deep: false, immediate: true })

// ── Filtering ───────────────────────────────────────────────────────────────
const visibleLines = computed(() =>
  applyClientFilter(lines.value, {
    keyword: filter.value,
    regex: regex.value,
    caseInsensitive: caseInsensitive.value,
    minSeverity: minSeverity.value,
  }),
)

const groupedEntries = computed(() => groupStackTraces(visibleLines.value))

function highlight(content: string): string {
  return highlightMatch(content, filter.value, caseInsensitive.value, regex.value)
}

// ── Auto-scroll follow (live mode only — irrelevant for history) ──────────
const viewerRef = ref<HTMLElement | null>(null)
watch([following, groupedEntries, mode], async () => {
  if (!following.value || mode.value !== 'live') return
  await nextTick()
  if (viewerRef.value) viewerRef.value.scrollTop = viewerRef.value.scrollHeight
})

// ── History ────────────────────────────────────────────────────────────────
async function loadHistory() {
  if (!historySince.value) return
  // Stop any active SSE so we don't race the buffer with the static fetch.
  if (mode.value === 'live') stopStream()
  historyLoading.value = true
  mode.value = 'history'
  try {
    const r = await podsApi.historyLogs(
      cluster.activeCluster, props.namespace, props.name,
      containerRef.value, 2000, historySince.value,
    )
    lines.value = r.items
  } catch (e) {
    console.error('history load failed', e)
    lines.value = []
  } finally {
    historyLoading.value = false
  }
}

// Switching the time-range pill reloads history immediately.
function pickRange(v: string) {
  historySince.value = v
  loadHistory()
}

// ── Live tracking ───────────────────────────────────────────────────────────
function startLive() {
  // Keep existing buffered lines; SSE appends from now on.
  startStream()
  mode.value = 'live'
  following.value = true
}

function stopLive() {
  // Use the dedicated userStop() so the resource watcher doesn't silently
  // re-tail when the user pans back to the same pod later.
  userStopStream()
  // Buffer still has the historical snapshot — keep mode as 'history'
  // so the user sees what they had, no awkward empty state.
  mode.value = lines.value.length ? 'history' : 'idle'
}

function clearAll() {
  clearBuffer()
  lines.value = []
  mode.value = 'idle'
}

function clearFilter() {
  filter.value = ''
  minSeverity.value = null
  regex.value = false
}

// SSE may drop while user thinks stream is live (proxy restart, etc.).
// With auto-reconnect now active in the composable, transient 'error' is
// expected — only demote to history/idle if we get *closed* permanently.
watch(status, (s) => {
  if (mode.value !== 'live') return
  // 'open' = reconnect succeeded, stay in live.
  if (s === 'open') return
  // 'closed' = user stopped, or server definitively ended the stream.
  if (s === 'closed') {
    mode.value = lines.value.length ? 'history' : 'idle'
    return
  }
  // 'error' = transient. The composable will auto-reconnect with backoff.
  // We keep mode='live' so the UI badge stays consistent during reconnect.
  // (The status bar already shows the red dot for the connection state.)
})

// ── Per-line actions ────────────────────────────────────────────────────────
async function copyLine(content: string) {
  try { await navigator.clipboard.writeText(content) }
  catch { /* swallow */ }
}

function filterToContent(content: string) {
  const m = content.match(/[A-Za-z0-9_./:-]{4,}/)
  if (m) filter.value = m[0]
}

function askAi(lines_: string[]) {
  emit('ask-ai', { lines: lines_, question: '分析这些日志的根因与建议' })
}

// ── Status / mode badge ────────────────────────────────────────────────────
const modeText = computed(() => {
  if (mode.value === 'live' && status.value === 'open') return '实时跟踪'
  if (mode.value === 'live' && status.value === 'error') return '连接错误'
  if (mode.value === 'live' && status.value === 'closed') return '已停止'
  if (mode.value === 'history') return '历史模式'
  return '空闲'
})

const modeTone = computed(() => {
  if (mode.value === 'live' && status.value === 'open') return 'live'
  if (mode.value === 'live' && status.value === 'error') return 'error'
  if (mode.value === 'history' && historyLoading.value) return 'loading'
  return 'idle'
})

const severityIcon = (s: LogSeverity) => {
  switch (s) {
    case 'fatal': return Flame
    case 'critical': return AlertOctagon
    case 'error': return AlertOctagon
    case 'warn': return AlertTriangle
    case 'info': return InfoCircle
    case 'debug': return Bug
    default: return CircleDashed
  }
}

onBeforeUnmount(() => {
  if (mode.value === 'live') stopStream()
})

const expandedGroups = reactive<Record<number, boolean>>({})
function toggleGroup(start: number, total: number) {
  const cur = !!expandedGroups[start]
  for (let i = 0; i < total; i++) expandedGroups[start + i] = !cur
}
function groupExpanded(entry: { kind: 'group'; firstIndex: number; lines: LogLine[] }): boolean {
  return !!expandedGroups[entry.firstIndex]
}
</script>

<template>
  <div class="log-pane">
    <!-- ── Toolbar ─────────────────────────────────────────────────────── -->
    <div class="lp-toolbar">
      <div class="lp-row">
        <select v-model="containerRef"
                class="container-select"
                aria-label="容器">
          <option v-for="c in containers" :key="c" :value="c">{{ c }}</option>
        </select>

        <div class="filter-wrap">
          <NIcon :component="Search" :size="13" class="filter-icon" aria-hidden="true" />
          <input
            v-model="filter"
            type="text"
            placeholder="过滤关键字（支持正则）"
            class="filter-input"
            aria-label="过滤关键字"
          />
          <button
            v-if="filter"
            class="filter-clear"
            type="button"
            aria-label="清空过滤"
            @click="filter = ''"
          >
            <NIcon :component="X" :size="12" />
          </button>
        </div>

        <div class="lp-sev-group" role="group" aria-label="最低严重级">
          <button
            type="button"
            :class="['lp-sev', 'lp-sev-all', minSeverity === null && 'lp-sev-active']"
            data-sev="all"
            @click="minSeverity = null"
            :aria-pressed="minSeverity === null"
            title="所有级别"
          >ALL</button>
          <button
            v-for="opt in SEVERITY_PRESETS"
            :key="opt.value"
            type="button"
            :class="['lp-sev', minSeverity === opt.value && 'lp-sev-active']"
            :data-sev="opt.value"
            @click="minSeverity = opt.value"
            :aria-pressed="minSeverity === opt.value"
          >{{ opt.label }}</button>
        </div>

        <label class="lp-toggle">
          <input v-model="regex" type="checkbox" />
          <span>正则</span>
        </label>
        <label class="lp-toggle">
          <input v-model="caseInsensitive" type="checkbox" />
          <span>Aa</span>
        </label>

        <div class="ml-auto flex items-center gap-2">
          <!-- Time-range pill — clicking reloads history with that range.
               Active pill = currently displayed history range. -->
          <div class="lp-presets" role="group" aria-label="历史区间">
            <button
              v-for="p in SINCE_PRESETS"
              :key="p.value"
              type="button"
              :class="['lp-preset', historySince === p.value && mode === 'history' && 'lp-preset-active']"
              :disabled="historyLoading"
              @click="pickRange(p.value)"
              :aria-pressed="historySince === p.value && mode === 'history'"
              :title="`加载最近 ${p.label} 的历史日志`"
            >{{ p.label }}</button>
          </div>

          <!-- Live tail start/stop — single button that flips state. -->
          <button
            v-if="mode !== 'live'"
            type="button"
            class="btn-primary !h-7"
            @click="startLive"
            aria-label="开始实时跟踪"
          >
            <NIcon :component="PlayerPlay" :size="12" />
            <span>开始跟踪</span>
          </button>
          <button
            v-else
            type="button"
            class="btn-secondary !h-7 !text-amber-300 !border-amber-500/40 hover:!bg-amber-500/10"
            @click="stopLive"
            aria-label="停止实时跟踪"
          >
            <NIcon :component="PlayerPause" :size="12" />
            <span>停止跟踪</span>
          </button>

          <button
            type="button"
            class="btn-ghost"
            @click="clearAll"
            aria-label="清空日志"
            :disabled="!lines.length"
          >
            <NIcon :component="X" :size="12" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── Status strip ──────────────────────────────────────────────────── -->
    <!--
      aria-live strategy:
      - assertive when the *connection* drops (modeTone=error): users on
        screen readers need to know live tailing has stalled so they can
        decide whether to restart.
      - polite for routine count/filter changes — screen readers can
        announce these at natural pauses.
    -->
    <div
      class="lp-status"
      role="status"
      :aria-live="modeTone === 'error' ? 'assertive' : 'polite'"
      aria-atomic="false"
    >
      <!-- Mode badge: tells the user what's currently displayed -->
      <span :class="[
        'flex items-center gap-1.5 px-2 py-0.5 rounded-md',
        modeTone === 'live' ? 'bg-emerald-500/15 text-emerald-300' :
        modeTone === 'loading' ? 'bg-amber-500/15 text-amber-300' :
        modeTone === 'error' ? 'bg-red-500/15 text-red-300' :
        'bg-zinc-800/60 text-zinc-400'
      ]">
        <NIcon
          :component="
            modeTone === 'live' ? PlayerPlay :
            modeTone === 'loading' ? History :
            modeTone === 'error' ? AlertTriangle :
            History
          "
          :size="11"
          :class="modeTone === 'live' ? 'animate-pulse' : ''"
          aria-hidden="true"
        />
        <span class="text-[11px] font-medium">{{ modeText }}</span>
      </span>
      <span class="text-zinc-700">·</span>
      <span class="flex items-center gap-1.5">
        <span
          :class="[
            'w-1.5 h-1.5 rounded-full',
            status === 'open' ? 'bg-emerald-500 animate-pulse' :
            status === 'error' ? 'bg-red-500' : 'bg-zinc-500'
          ]"
          aria-hidden="true"
        />
        <span>{{ status === 'open' ? '已连接' : status === 'closed' ? '已断开' : status === 'error' ? '连接错误' : '空闲' }}</span>
      </span>
      <span class="text-zinc-700">·</span>
      <span class="tabular-nums">缓冲 <span class="text-zinc-300">{{ lines.length.toLocaleString() }}</span></span>
      <span class="text-zinc-700">·</span>
      <span class="tabular-nums">过滤后 <span class="text-zinc-300">{{ visibleLines.length.toLocaleString() }}</span></span>

      <!-- Auto-scroll only meaningful while live tailing -->
      <template v-if="mode === 'live'">
        <span class="text-zinc-700">·</span>
        <label class="flex items-center gap-1.5">
          <input
            type="checkbox"
            :checked="following"
            @change="(e) => following = (e.target as HTMLInputElement).checked"
            aria-label="自动滚动到最新行"
          />
          <span :class="following ? 'text-emerald-400' : 'text-zinc-500'">跟随</span>
        </label>
      </template>

      <span class="ml-auto flex items-center gap-1 truncate">
        <code class="kbd">{{ namespace }}</code>
        <code class="kbd truncate">{{ name }}</code>
      </span>
    </div>

    <!-- ── Body ─────────────────────────────────────────────────────────── -->
    <div ref="viewerRef" class="lp-body flex-1 overflow-auto" role="log" aria-live="off" aria-label="Pod 日志">
      <NEmpty
        v-if="!visibleLines.length && !historyLoading"
        description="暂无日志 — 切换时间区间或点击「开始跟踪」实时跟踪"
        class="py-16"
      />

      <template v-else-if="visibleLines">
        <div v-for="entry in groupedEntries" :key="entry.kind === 'line' ? `l-${entry.index}` : `g-${entry.firstIndex}`">
          <!-- Group (collapsed by default) -->
          <div v-if="entry.kind === 'group'" class="lp-group">
            <div class="lp-group-head"
                 tabindex="0"
                 role="button"
                 :aria-expanded="groupExpanded(entry)"
                 @click="toggleGroup(entry.firstIndex, entry.lines.length)"
                 @keydown.enter="toggleGroup(entry.firstIndex, entry.lines.length)"
                 @keydown.space.prevent="toggleGroup(entry.firstIndex, entry.lines.length)">
              <NIcon :component="AlertOctagon" :size="13" class="text-red-400 shrink-0" aria-hidden="true" />
              <span class="text-[12px] text-zinc-200">
                <span class="chip chip--err mr-1.5">栈追踪</span>
                <span class="text-zinc-500">{{ entry.lines.length }} 行</span>
                <span class="text-zinc-600 mx-2">·</span>
                <span class="font-mono text-zinc-400 truncate">{{ entry.lines[0].content.slice(0, 80) }}…</span>
              </span>
              <div class="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" class="lp-iconbtn" title="复制全部"
                        @click.stop="copyLine(entry.lines.map((l) => l.content).join('\n'))"
                        :aria-label="`复制 ${entry.lines.length} 行`">
                  <NIcon :component="Copy" :size="11" />
                </button>
                <button type="button" class="lp-iconbtn" title="用 AI 分析" @click.stop="askAi(entry.lines.map((l) => l.content))">
                  <span class="text-[10px] font-medium">AI</span>
                </button>
              </div>
            </div>
            <template v-if="groupExpanded(entry)">
              <div v-for="(l, idx) in entry.lines" :key="`g-${entry.firstIndex}-${idx}`" class="lp-line" :data-sev="l.severity">
                <span class="lp-num tabular-nums">{{ entry.firstIndex + idx + 1 }}</span>
                <span class="lp-sev-mark">
                  <SeverityChip :severity="l.severity" />
                </span>
                <span class="lp-ts">{{ l.timestamp?.slice(11, 23) || '—' }}</span>
                <span class="lp-content" v-html="highlight(l.content)" />
              </div>
            </template>
          </div>

          <!-- Single line -->
          <div v-else class="lp-line group" :data-sev="entry.line.severity">
            <span class="lp-num tabular-nums">{{ entry.index + 1 }}</span>
            <span class="lp-sev-mark">
              <NIcon :component="severityIcon(entry.line.severity)" :size="12"
                     :class="[
                       'shrink-0',
                       entry.line.severity === 'fatal' ? 'text-red-300' :
                       entry.line.severity === 'critical' ? 'text-red-400' :
                       entry.line.severity === 'error' ? 'text-red-400' :
                       entry.line.severity === 'warn' ? 'text-amber-400' :
                       entry.line.severity === 'info' ? 'text-sky-400' :
                       entry.line.severity === 'debug' ? 'text-zinc-500' : 'text-zinc-600'
                     ]" aria-hidden="true" />
            </span>
            <span class="lp-ts">{{ entry.line.timestamp?.slice(11, 23) || '—' }}</span>
            <span class="lp-content" v-html="highlight(entry.line.content)" />
            <span class="lp-actions opacity-0 group-hover:opacity-100 transition-opacity">
              <NTooltip>
                <template #trigger>
                  <button type="button" class="lp-iconbtn" @click="copyLine(entry.line.content)" aria-label="复制此行">
                    <NIcon :component="Copy" :size="11" />
                  </button>
                </template>
                复制
              </NTooltip>
              <NTooltip>
                <template #trigger>
                  <button type="button" class="lp-iconbtn" @click="filterToContent(entry.line.content)" aria-label="过滤此行">
                    <NIcon :component="Filter" :size="11" />
                  </button>
                </template>
                过滤此行
              </NTooltip>
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>