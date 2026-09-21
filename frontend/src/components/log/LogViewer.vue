<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { NInput, NButton, NSpace, NTag, NSwitch, NCheckbox, NEmpty } from 'naive-ui'
import { logsApi } from '@/api'
import { useClusterStore } from '@/stores/cluster'
import type { LogLine } from '@/types'

const props = defineProps<{
  namespace: string
  name: string
  containers: string[]
}>()

const cluster = useClusterStore()

const container = ref<string>(props.containers[0] || '')
const lines = ref<LogLine[]>([])
const filter = ref('')
const onlyWarnErr = ref(false)
const following = ref(true)
const streaming = ref(false)
const status = ref<'idle' | 'open' | 'closed' | 'error'>('idle')
let es: EventSource | null = null
const MAX_LINES = 5000

watch(
  () => props.containers,
  (v) => {
    if (!container.value && v.length) container.value = v[0]
  },
)

const visibleLines = computed(() => {
  let l = lines.value
  if (onlyWarnErr.value) {
    l = l.filter((x) => /warn|error|err|exception|fatal|fail/i.test(x.content))
  }
  if (filter.value) {
    const q = filter.value.toLowerCase()
    l = l.filter((x) => x.content.toLowerCase().includes(q))
  }
  return l
})

function severity(content: string): '' | 'warn' | 'error' {
  const c = content.toLowerCase()
  if (/(panic|fatal|\bfatal\b|critical|traceback|exception:|segfault)/.test(c)) return 'error'
  if (/(error|err\b|warn|warning|fail)/.test(c)) return 'warn'
  return ''
}

function highlight(content: string): string {
  if (!filter.value) return content
  const q = filter.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return content.replace(
    new RegExp(q, 'gi'),
    (m) => `<mark>${m}</mark>`,
  )
}

function pushLine(line: LogLine) {
  lines.value.push(line)
  if (lines.value.length > MAX_LINES) {
    lines.value.splice(0, lines.value.length - MAX_LINES)
  }
  if (following.value) {
    nextTick(scrollToBottom)
  }
}

function scrollToBottom() {
  const el = document.getElementById('log-viewport')
  if (el) el.scrollTop = el.scrollHeight
}

function open() {
  close()
  const url = logsApi.streamUrl(cluster.activeCluster, props.namespace, props.name, container.value, 200)
  es = new EventSource(url)
  streaming.value = true
  status.value = 'open'

  es.addEventListener('log', (e) => {
    try {
      pushLine(JSON.parse((e as MessageEvent).data))
    } catch (err) {
      console.error('parse log', err)
    }
  })
  es.addEventListener('error', () => {
    status.value = 'error'
  })
  es.addEventListener('end', () => {
    status.value = 'closed'
    close()
  })
}

function close() {
  if (es) {
    es.close()
    es = null
  }
  streaming.value = false
}

async function loadHistory() {
  close()
  lines.value = []
  try {
    const r = await fetch(
      `/api/v1/pods/${encodeURIComponent(props.namespace)}/${encodeURIComponent(props.name)}/logs?` +
        new URLSearchParams({
          context: cluster.activeCluster ?? '',
          container: container.value,
          tail_lines: '500',
        }),
    )
    const data = await r.json()
    lines.value = data.items || []
    status.value = 'idle'
    nextTick(scrollToBottom)
  } catch (e) {
    console.error(e)
    status.value = 'error'
  }
}

function clearLogs() {
  lines.value = []
}

onBeforeUnmount(close)
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 工具栏 -->
    <div class="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-800 bg-surface-1">
      <NSpace align="center" :wrap="false">
        <span class="section-title">Container</span>
        <select
          v-model="container"
          class="bg-surface-2 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
        >
          <option v-for="c in containers" :key="c" :value="c">{{ c }}</option>
        </select>
      </NSpace>

      <div class="flex-1 max-w-md">
        <NInput v-model:value="filter" placeholder="过滤日志（高亮匹配）" size="small" clearable />
      </div>

      <div class="flex items-center gap-2 text-xs text-zinc-400">
        <NCheckbox v-model:checked="onlyWarnErr" size="small">仅告警</NCheckbox>
        <NSwitch v-model:value="following" size="small">
          <template #checked>跟随</template>
          <template #unchecked>暂停</template>
        </NSwitch>
      </div>

      <NSpace>
        <NButton
          v-if="!streaming"
          size="small"
          type="primary"
          ghost
          @click="open"
        >
          <template #icon>▶</template>
          实时跟踪
        </NButton>
        <NButton v-else size="small" @click="close">停止</NButton>
        <NButton size="small" quaternary @click="loadHistory">
          <template #icon>⟳</template>
          历史
        </NButton>
        <NButton size="small" quaternary @click="clearLogs">
          <template #icon>×</template>
          清空
        </NButton>
      </NSpace>
    </div>

    <!-- 状态栏 -->
    <div class="px-4 py-1.5 text-xs text-zinc-500 border-b border-zinc-800/60 bg-surface-1 flex items-center gap-3">
      <NTag size="small" :type="status === 'open' ? 'success' : status === 'error' ? 'error' : 'default'" round>
        {{ status }}
      </NTag>
      <span>共 {{ lines.length }} 行 · 显示 {{ visibleLines.length }}</span>
      <span class="ml-auto">namespace <span class="kbd">{{ namespace }}</span> · pod <span class="kbd">{{ name }}</span></span>
    </div>

    <!-- 日志主体 -->
    <div
      id="log-viewport"
      class="log-viewer flex-1 overflow-auto"
    >
      <NEmpty v-if="!visibleLines.length" description="暂无日志 — 点击「实时跟踪」开始 tail，或「历史」加载最近日志" class="py-20" />
      <template v-else>
        <div
          v-for="(line, i) in visibleLines"
          :key="i"
          class="line"
          :class="{
            'line--warn': severity(line.content) === 'warn',
            'line--error': severity(line.content) === 'error',
          }"
        >
          <span class="ts">{{ line.timestamp }}</span>
          <span v-html="highlight(line.content)" />
        </div>
      </template>
    </div>
  </div>
</template>
