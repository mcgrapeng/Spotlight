<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { NEmpty, NIcon, NSwitch, NTooltip } from 'naive-ui'
import {
  AlertTriangle, AlertOctagon, Bug, CircleDashed, Copy, FileText, Filter,
  Flame, InfoCircle, PlayerPause, PlayerPlay, RotateClockwise, Search, X,
} from '@vicons/tabler'
import { useLogStream } from '@/composables/useLogStream'
import { useClusterStore } from '@/stores/cluster'
import { SEVERITY_OPTIONS } from '@/utils/severity'
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

const { lines, status, open, close, clear } = useLogStream({
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
const following = ref(true)
const historyMode = ref(false)
const historySince = ref('15m')
const historyLoading = ref(false)

// Available time-range presets (sent verbatim to backend).
const SINCE_PRESETS = [
  { label: '5m', value: '5m' }, { label: '15m', value: '15m' }, { label: '1h', value: '1h' },
  { label: '3h', value: '3h' }, { label: '1d', value: '1d' }, { label: '7d', value: '7d' },
]

// Container switch watcher — auto-pick the first valid container.
watch(() => [props.namespace, props.name, props.containers],
  () => {
    if (!containerRef.value && props.containers.length) {
      containerRef.value = props.containers[0]
    } else if (containerRef.value && !props.containers.includes(containerRef.value)) {
      containerRef.value = props.containers[0] || ''
    }
  },
)

if (props.preset) lines.value = props.preset
// Emit the initial set so parents (PodDetailView → AI analyzer) get the
// preset synchronously, not on the next SSE event.
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

// ── Highlight matched substring ─────────────────────────────────────────────
function highlight(content: string): string {
  return highlightMatch(content, filter.value, caseInsensitive.value, regex.value)
}

// ── Auto-scroll follow ──────────────────────────────────────────────────────
const viewerRef = ref<HTMLElement | null>(null)
watch([following, groupedEntries], async () => {
  if (!following.value) return
  await nextTick()
  if (viewerRef.value) viewerRef.value.scrollTop = viewerRef.value.scrollHeight
})

// ── History fetch ───────────────────────────────────────────────────────────
async function loadHistory() {
  if (!historySince.value) return
  historyMode.value = true
  historyLoading.value = true
  // Stop any open stream first — assigning AFTER ensures the watch emits
  // the new history set rather than racing with the empty stream buffer.
  close()
  try {
    const r = await podsApi.historyLogs(
      cluster.activeCluster, props.namespace, props.name,
      containerRef.value, 2000, historySince.value,
    )
    lines.value = r.items
  } catch (e) {
    console.error('history load failed', e)
  } finally {
    historyLoading.value = false
  }
}

async function resumeStream() {
  historyMode.value = false
  lines.value = []
  open()
}

function clearAll() {
  clear()
}

function clearFilter() {
  filter.value = ''
  minSeverity.value = null
  regex.value = false
}

// ── Per-line actions ────────────────────────────────────────────────────────
async function copyLine(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch { /* swallow — older browsers */ }
}

function filterToContent(content: string) {
  // "Filter to this" — promote the first quoted/token chunk to a quick filter.
  const m = content.match(/[A-Za-z0-9_./:-]{4,}/)
  if (m) filter.value = m[0]
}

function askAi(lines_: string[]) {
  emit('ask-ai', { lines: lines_, question: '分析这些日志的根因与建议' })
}

// ── Status indicator ────────────────────────────────────────────────────────
const statusText = computed(() => {
  switch (status.value) {
    case 'open': return historyMode.value ? '历史模式' : '实时跟踪'
    case 'closed': return '已停止'
    case 'error': return '连接错误'
    default: return '空闲'
  }
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
  close()
})

// Stack-trace group expand state — keyed by group start index.
const expandedGroups = reactive<Record<number, boolean>>({})
function toggleGroup(start: number, total: number) {
  const cur = !!expandedGroups[start]
  for (let i = 0; i < total; i++) expandedGroups[start + i] = !cur
}
function groupExpanded(entry: { kind: 'group'; firstIndex: number; lines: LogLine[] }): boolean {
  // Treat the group as expanded only when the whole block is expanded (start index true).
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
                  aria-label="Container">
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

          <!-- Severity quick-pick — only the 5 high-signal levels. TRACE/DEBUG/NOTICE
               are too noisy for a fast filter; users who need them can use the
               full dropdown filter via URL params. -->
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
              v-for="opt in [
                { label: 'INFO', value: 'info' as LogSeverity },
                { label: 'WARN+', value: 'warn' as LogSeverity },
                { label: 'ERROR+', value: 'error' as LogSeverity },
                { label: 'CRITICAL+', value: 'critical' as LogSeverity },
                { label: 'FATAL', value: 'fatal' as LogSeverity },
              ]"
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

          <div class="ml-auto flex items-center gap-1.5">
            <NSwitch v-model:value="following" size="small">
              <template #checked>跟随</template>
              <template #unchecked>暂停</template>
            </NSwitch>

            <button
              v-if="!historyMode && status !== 'open'"
              type="button"
              class="btn-primary !h-7"
              @click="open"
              aria-label="开始实时跟踪"
            >
              <NIcon :component="PlayerPlay" :size="12" />
              <span>实时跟踪</span>
            </button>
            <button
              v-else-if="!historyMode && status === 'open'"
              type="button"
              class="btn-secondary !h-7"
              @click="close"
              aria-label="停止跟踪"
            >
              <NIcon :component="PlayerPause" :size="12" />
              <span>停止</span>
            </button>
            <button
              v-if="historyMode"
              type="button"
              class="btn-secondary !h-7"
              @click="resumeStream"
              aria-label="返回实时模式"
            >
              <NIcon :component="RotateClockwise" :size="12" />
              <span>回到实时</span>
            </button>

            <button
              type="button"
              class="btn-ghost"
              @click="clearAll"
              aria-label="清空日志"
            >
              <NIcon :component="X" :size="12" />
            </button>
          </div>
        </div>

        <!-- History quick-bar -->
        <div class="lp-row lp-row--second">
          <span class="section-title">历史区间</span>
          <div class="lp-presets" role="group" aria-label="预设时间区间">
              <button
                v-for="p in SINCE_PRESETS"
                :key="p.value"
                type="button"
                :class="['lp-preset', historySince === p.value && 'lp-preset-active']"
                @click="historySince = p.value"
                :aria-pressed="historySince === p.value"
              >{{ p.label }}</button>
            </div>
          <button
            type="button"
            class="btn-secondary !h-6 !text-[11px]"
            :disabled="historyLoading"
            @click="loadHistory"
          >
            <NIcon :component="historyLoading ? RotateClockwise : FileText" :size="11" :class="historyLoading ? 'animate-spin' : ''" />
            {{ historyLoading ? '加载中…' : '载入历史' }}
          </button>
        </div>
      </div>

    <!-- ── Status strip ──────────────────────────────────────────────────── -->
    <div class="lp-status">
      <span class="flex items-center gap-1.5">
        <span :class="[
          'w-1.5 h-1.5 rounded-full',
          status === 'open' ? 'bg-emerald-500 animate-pulse' :
          status === 'error' ? 'bg-red-500' : 'bg-zinc-500'
        ]" aria-hidden="true" />
        <span>{{ statusText }}</span>
      </span>
      <span class="text-zinc-700">|</span>
      <span class="tabular-nums">缓冲 <span class="text-zinc-300">{{ lines.length.toLocaleString() }}</span></span>
      <span class="text-zinc-700">|</span>
      <span class="tabular-nums">显示 <span class="text-zinc-300">{{ visibleLines.length.toLocaleString() }}</span></span>
      <span class="ml-auto flex items-center gap-1 truncate">
        <code class="kbd">{{ namespace }}</code>
        <code class="kbd truncate">{{ name }}</code>
      </span>
    </div>

    <!-- ── Body ─────────────────────────────────────────────────────────── -->
    <div ref="viewerRef" class="lp-body" role="log" aria-live="off" aria-label="Pod 日志">
      <NEmpty v-if="!visibleLines.length"
              description="暂无日志 — 点击「实时跟踪」或「载入历史」"
              class="py-16" />

      <template v-else>
        <template v-for="entry in groupedEntries" :key="entry.kind === 'line' ? `l-${entry.index}` : `g-${entry.firstIndex}`">
          <!-- Group (collapsed by default) -->
          <div v-if="entry.kind === 'group'" class="lp-group">
            <div class="lp-group-head"
                 tabindex="0"
                 role="button"
                 :aria-expanded="groupExpanded(entry)"
                 @click="toggleGroup(entry.firstIndex, entry.lines.length)"
                 @keydown.enter="toggleGroup(entry.firstIndex, entry.lines.length)">
              <NIcon :component="AlertOctagon" :size="13" class="text-red-400 shrink-0" aria-hidden="true" />
              <span class="text-[12px] text-zinc-200">
                <span class="chip chip--err mr-1.5">栈追踪</span>
                <span class="text-zinc-500">{{ entry.lines.length }} 行</span>
                <span class="text-zinc-600 mx-2">·</span>
                <span class="font-mono text-zinc-400 truncate">{{ entry.lines[0].content.slice(0, 80) }}…</span>
              </span>
              <div class="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" class="lp-iconbtn" title="复制全部" @click.stop="copyLine(entry.lines.map((l) => l.content).join('\n'))">
                  <NIcon :component="Copy" :size="11" />
                </button>
                <button type="button" class="lp-iconbtn" title="用 AI 分析" @click.stop="askAi(entry.lines.map((l) => l.content))">
                  <span class="text-[10px] font-medium">AI</span>
                </button>
              </div>
            </div>
            <template v-if="groupExpanded(entry)">
              <div v-for="(l, idx) in entry.lines" :key="`g-${entry.firstIndex}-${idx}`" class="lp-line" :data-sev="l.severity">
                <span class="lp-num text-zinc-600 tabular-nums">{{ entry.firstIndex + idx + 1 }}</span>
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
            <span class="lp-num text-zinc-600 tabular-nums">{{ entry.index + 1 }}</span>
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
                  <button type="button" class="lp-iconbtn" @click="copyLine(entry.line.content)" aria-label="复制">
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
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.log-pane {
  display: flex; flex-direction: column;
  height: 100%;
  background: var(--bg-0);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}
.lp-toolbar {
  border-bottom: 1px solid var(--line-1);
  background: var(--bg-1);
  padding: 8px 12px;
  display: flex; flex-direction: column; gap: 6px;
}
.lp-row {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap;
}
.lp-row--second { padding-top: 4px; border-top: 1px dashed var(--line-1); }

.container-select {
  height: 28px; padding: 0 8px;
  background: var(--bg-2); color: var(--fg-1);
  font-family: ui-monospace, monospace; font-size: 11.5px;
  border: 1px solid var(--line-2); border-radius: 5px;
  min-width: 120px; max-width: 180px;
}
.container-select:focus { border-color: var(--accent); outline: none; }

/* Filter input — explicit flex layout (no absolute positioning) so the
   parent doesn't overflow. The wrapper is a fixed-width column, NOT
   `flex-1 max-w-sm`, which was previously causing the input to grow over
   the severity chip group. */
.filter-wrap {
  position: relative;
  width: 240px; min-width: 160px;
  display: flex; align-items: center;
}
.filter-icon {
  position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
  color: var(--fg-3); pointer-events: none;
}
.filter-input {
  width: 100%; height: 28px;
  padding: 0 30px 0 30px;
  background: var(--bg-2); color: var(--fg-1);
  font-size: 12px; font-family: inherit;
  border: 1px solid var(--line-2); border-radius: 5px;
}
.filter-input:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 3px var(--accent-ring); }
.filter-clear {
  position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
  background: transparent; color: var(--fg-3);
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 3px;
}
.filter-clear:hover { background: var(--bg-3); color: var(--fg-1); }

.lp-sev-group {
  display: inline-flex; gap: 1px;
  background: var(--bg-2);
  border: 1px solid var(--line-2);
  border-radius: 5px;
  padding: 1px;
}
.lp-sev {
  padding: 0 8px; height: 22px; min-width: 28px;
  font-family: ui-monospace, monospace; font-size: 10.5px; font-weight: 600;
  color: var(--fg-3);
  border-radius: 3px;
  transition: background 80ms ease, color 80ms ease;
  letter-spacing: 0.04em;
}
.lp-sev:hover:not(.lp-sev-active) { color: var(--fg-1); background: var(--bg-3); }
.lp-sev-active { background: var(--accent); color: #fff !important; box-shadow: 0 0 0 1px rgba(91,141,239,.4); }

/* Severity-tinted chip variants — each level uses its semantic color */
.lp-sev[data-sev="all"]:not(.lp-sev-active) { color: var(--fg-2); background: var(--bg-3); font-weight: 700; }
.lp-sev[data-sev="info"]:not(.lp-sev-active)  { color: #60a5fa; }
.lp-sev[data-sev="warn"]:not(.lp-sev-active)  { color: #fbbf24; }
.lp-sev[data-sev="error"]:not(.lp-sev-active) { color: #fb923c; }
.lp-sev[data-sev="critical"]:not(.lp-sev-active) { color: #f87171; }
.lp-sev[data-sev="fatal"]:not(.lp-sev-active) { color: #fca5a5; font-weight: 700; }

.lp-toggle {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 11px; color: var(--fg-3);
  cursor: pointer; user-select: none;
}
.lp-toggle input { accent-color: var(--accent); width: 12px; height: 12px; }

.lp-presets { display: inline-flex; gap: 1px; }
.lp-preset {
  padding: 0 8px; height: 22px;
  font-family: ui-monospace, monospace; font-size: 10.5px;
  color: var(--fg-3);
  background: var(--bg-2);
  border: 1px solid var(--line-2);
}
.lp-preset:first-child { border-radius: 5px 0 0 5px; }
.lp-preset:last-child  { border-radius: 0 5px 5px 0; }
.lp-preset:hover { color: var(--fg-1); background: var(--bg-3); }
.lp-preset-active { background: var(--accent); color: #fff; border-color: var(--accent); }

.lp-status {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 12px;
  font-size: 10.5px; color: var(--fg-3);
  border-bottom: 1px solid var(--line-1);
  background: var(--bg-1);
}

.lp-body {
  flex: 1;
  overflow-y: auto;
  font-size: 12.5px;
  line-height: 1.65;
}

.lp-line {
  display: grid;
  grid-template-columns: 44px 18px 86px 1fr auto;
  gap: 10px; padding: 1px 16px;
  border-left: 2px solid transparent;
  white-space: pre-wrap; word-break: break-all;
}
.lp-line:hover { background: rgba(255, 255, 255, 0.03); }

.lp-line[data-sev="debug"]    { color: var(--log-debug-fg); }
.lp-line[data-sev="info"]     { color: var(--log-info-fg); border-left-color: var(--log-info-border); }
.lp-line[data-sev="warn"]     { color: var(--log-warn-fg); border-left-color: var(--log-warn-border); background: var(--log-warn-bg); }
.lp-line[data-sev="error"]    { color: var(--log-error-fg); border-left-color: var(--log-error-border); background: var(--log-error-bg); }
.lp-line[data-sev="critical"] { color: var(--log-critical-fg); border-left-color: var(--log-critical-border); background: var(--log-critical-bg); font-weight: 500; }
.lp-line[data-sev="fatal"]    { color: var(--log-fatal-fg); border-left-color: var(--log-error-border); background: var(--log-fatal-bg); font-weight: 600; }

.lp-num { font-size: 10px; text-align: right; user-select: none; }
.lp-sev-mark { display: flex; align-items: center; justify-content: center; }
.lp-ts { font-size: 10.5px; color: var(--fg-3); font-variant-numeric: tabular-nums; }
.lp-content { min-width: 0; }

.lp-iconbtn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  color: var(--fg-3); border-radius: 4px;
  transition: background 80ms ease, color 80ms ease;
}
.lp-iconbtn:hover { background: var(--bg-3); color: var(--fg-1); }

.lp-actions { display: inline-flex; gap: 2px; align-items: center; }

.lp-group { border-top: 1px dashed var(--line-1); border-bottom: 1px dashed var(--line-1); margin: 4px 0; }
.lp-group-head {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 16px;
  background: var(--log-error-bg);
  cursor: pointer;
}
.lp-group-head:hover { background: var(--log-warn-bg); }
.lp-group-head:focus-visible { outline: none; box-shadow: inset 0 0 0 2px var(--accent-ring); }

.lp-body :deep(mark) {
  background: rgba(250, 204, 21, 0.32); color: inherit;
  padding: 0 1px; border-radius: 2px;
  border: 1px solid rgba(250, 204, 21, 0.4);
}
</style>