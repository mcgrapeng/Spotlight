<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NInput, NSelect, NCheckbox, NButton, NSpace, NEmpty, NTag, NSwitch,
} from 'naive-ui'
import { Search, Filter, PlayerPlay, PlayerStop, Trash, X } from '@vicons/tabler'
import { useLogStream } from '@/composables/useLogStream'
import { useClusterStore } from '@/stores/cluster'
import { SEVERITY_OPTIONS, severityAtLeast } from '@/utils/severity'
import type { LogLine, LogSeverity } from '@/domain/types'
import SeverityChip from '@/components/common/SeverityChip.vue'

const props = defineProps<{
  namespace: string
  name: string
  containers: string[]
  preset?: LogLine[]
}>()

const emit = defineEmits<{ (e: 'lines', lines: LogLine[]): void }>()
const cluster = useClusterStore()

const container = ref<string>(props.containers[0] || '')
const { lines, status, open, close, clear } = useLogStream({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => props.namespace),
  name: computed(() => props.name),
  container: computed(() => container.value),
  maxBuffered: 5000,
})

const filter = ref('')
const regex = ref(false)
const caseInsensitive = ref(true)
const minSeverity = ref<LogSeverity | null>(null)
const following = ref(true)

watch(
  () => [props.namespace, props.name, props.containers],
  () => { if (!container.value && props.containers.length) container.value = props.containers[0] },
)

if (props.preset) lines.value = props.preset
watch(lines, (l) => emit('lines', l), { deep: false })

const visibleLines = computed(() => {
  let l = lines.value
  if (minSeverity.value) l = l.filter((x) => severityAtLeast(x.severity, minSeverity.value!))
  if (filter.value) {
    const q = filter.value
    if (regex.value) {
      try {
        const re = new RegExp(q, caseInsensitive.value ? 'i' : '')
        l = l.filter((x) => re.test(x.content))
      } catch { /* ignore invalid regex */ }
    } else {
      const needle = caseInsensitive.value ? q.toLowerCase() : q
      l = l.filter((x) => {
        const c = caseInsensitive.value ? x.content.toLowerCase() : x.content
        return c.includes(needle)
      })
    }
  }
  return l
})

function highlight(content: string): string {
  if (!filter.value || regex.value) return content
  const q = filter.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return content.replace(
    new RegExp(q, caseInsensitive.value ? 'gi' : 'g'),
    (m) => `<mark>${m}</mark>`,
  )
}
</script>

<template>
  <div class="flex flex-col h-full bg-[var(--bg-0)]">
    <!-- Toolbar -->
    <div class="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800/60 bg-[var(--bg-1)]/50">
      <NIcon :component="Filter" :size="14" class="text-zinc-500" />
      <select v-model="container"
              class="h-7 px-2 bg-zinc-900 border border-zinc-800 rounded-md text-[12.5px] text-zinc-200 focus:outline-none focus:border-indigo-500/60 focus:shadow-[0_0_0_3px_rgba(99,102,241,.15)] transition-all">
        <option v-for="c in containers" :key="c" :value="c">{{ c }}</option>
      </select>

      <NInput v-model:value="filter" placeholder="过滤关键字" size="small" style="width: 260px">
        <template #prefix><NIcon :component="Search" :size="13" /></template>
      </NInput>

      <NSelect
        v-model:value="minSeverity"
        :options="[{ label: '所有级别', value: null as any }, ...SEVERITY_OPTIONS]"
        size="small"
        placeholder="最低级别"
        style="width: 130px"
        clearable
      />

      <NCheckbox v-model:checked="regex" size="small">正则</NCheckbox>
      <NCheckbox v-model:checked="caseInsensitive" size="small">Aa</NCheckbox>
      <NSwitch v-model:value="following" size="small">
        <template #checked>跟随</template>
        <template #unchecked>暂停</template>
      </NSwitch>

      <div class="ml-auto flex items-center gap-1.5">
        <NButton v-if="status !== 'open'" size="small" type="primary" @click="open">
          <template #icon><NIcon :component="PlayerPlay" :size="13" /></template>
          实时跟踪
        </NButton>
        <NButton v-else size="small" type="warning" ghost @click="close">
          <template #icon><NIcon :component="PlayerStop" :size="13" /></template>
          停止
        </NButton>
        <NButton size="small" quaternary @click="clear">
          <template #icon><NIcon :component="Trash" :size="13" /></template>
        </NButton>
      </div>
    </div>

    <!-- Status bar -->
    <div class="px-4 py-1.5 text-[11.5px] text-zinc-500 border-b border-zinc-800/40 bg-[var(--bg-1)]/30 flex items-center gap-3">
      <span class="flex items-center gap-1.5">
        <span class="status-dot" :class="status === 'open' ? 'status-dot--running' : status === 'error' ? 'status-dot--failed' : 'status-dot--unknown'" />
        <span class="font-medium text-zinc-400">{{ status }}</span>
      </span>
      <span class="text-zinc-700">·</span>
      <span class="tabular-nums">缓冲 <span class="text-zinc-300">{{ lines.length }}</span> 行</span>
      <span class="text-zinc-700">·</span>
      <span class="tabular-nums">显示 <span class="text-zinc-300">{{ visibleLines.length }}</span></span>
      <span class="ml-auto font-mono text-[11px]">
        <span class="kbd !mr-2">{{ namespace }}</span>
        <span class="kbd">{{ name }}</span>
      </span>
    </div>

    <!-- Body -->
    <div class="log-viewer flex-1 overflow-auto" role="log" aria-live="polite" aria-label="Pod logs">
      <NEmpty v-if="!visibleLines.length" description="暂无日志 — 点击「实时跟踪」开始 tail" class="py-20" />
      <template v-else>
        <div v-for="(line, i) in visibleLines" :key="i" class="line" :data-sev="line.severity">
          <span class="ts">
            <SeverityChip :severity="line.severity" />
            <span class="text-[11px] text-zinc-500 tabular-nums">{{ line.timestamp?.slice(11, 19) }}</span>
          </span>
          <span v-html="highlight(line.content)" />
        </div>
      </template>
    </div>
  </div>
</template>
