<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { AlertCircle, AlertTriangle, Box, CircleCheck, Search, Filter, ArrowRight } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataToolbar from '@/components/ui/DataToolbar.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { EventInfo } from '@/domain/types'

const cluster = useClusterStore()
const events = ref<EventInfo[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)
const typeFilter = ref<'all' | 'Warning' | 'Normal'>('all')
const search = ref('')

const typeOptions: { label: string; value: typeof typeFilter.value }[] = [
  { label: '全部', value: 'all' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Normal', value: 'Normal' },
]

async function load() {
  loading.value = true
  errorMsg.value = null
  try {
    events.value = await eventsApi.list({
      cluster: cluster.activeCluster, namespace: cluster.activeNamespace, limit: 500,
    })
  } catch (e: any) { errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const visible = computed(() => {
  let l = events.value
  if (typeFilter.value !== 'all') l = l.filter((e) => e.type === typeFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    l = l.filter((e) =>
      e.reason.toLowerCase().includes(q) ||
      e.message.toLowerCase().includes(q) ||
      e.involved_name.toLowerCase().includes(q))
  }
  return l
})

const stats = computed(() => ({
  warnings: events.value.filter((e) => e.type === 'Warning').length,
  normals: events.value.filter((e) => e.type === 'Normal').length,
  total: events.value.length,
}))

const subtitle = computed(() => `${visible.value.length} / ${events.value.length} 条`)

function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 0) return '刚刚'
  const sec = Math.floor(ms / 1000)
  if (sec < 60) return `${sec} 秒前`
  if (sec < 3600) return `${Math.floor(sec / 60)} 分钟前`
  if (sec < 86400) return `${Math.floor(sec / 3600)} 小时前`
  return `${Math.floor(sec / 86400)} 天前`
}
</script>

<template>
  <div class="page space-y-5">
    <PageHeader title="Events" :subtitle="subtitle" />

    <!-- KPI row -->
    <section v-if="!loading && events.length" class="grid grid-cols-3 gap-4">
      <div class="card px-5 py-4">
        <p class="section-title">总数</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-zinc-100">{{ stats.total.toLocaleString() }}</p>
      </div>
      <div class="card px-5 py-4">
        <p class="section-title flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
          Warning
        </p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums" :class="stats.warnings ? 'text-amber-400' : 'text-zinc-500'">{{ stats.warnings }}</p>
      </div>
      <div class="card px-5 py-4">
        <p class="section-title flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true"></span>
          Normal
        </p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-zinc-300">{{ stats.normals }}</p>
      </div>
    </section>

    <DataToolbar label="Events 筛选">
      <NIcon :component="Filter" :size="13" class="text-zinc-500" />
      <NSelect v-model:value="typeFilter" :options="typeOptions" size="small" style="width: 130px" aria-label="按类型筛选" />
      <div class="flex-1 max-w-md">
        <NInput v-model:value="search" size="small" placeholder="搜索 reason / message / 资源" clearable aria-label="搜索">
          <template #prefix><NIcon :component="Search" :size="13" /></template>
        </NInput>
      </div>
    </DataToolbar>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />

    <LoadingState v-else-if="loading" variant="skeleton" :rows="6" height="60px" />

    <EmptyState
      v-else-if="!visible.length"
      :icon="CircleCheck"
      tone="success"
      title="无事件"
      :description="events.length ? '筛选条件过滤掉了所有事件' : '当前 namespace 没有事件'"
    />

    <!-- Event cards -->
    <ul v-else class="space-y-2">
      <li
        v-for="ev in visible.slice(0, 100)"
        :key="ev.name + ev.namespace + ev.last_seen"
        class="card p-4 transition-colors hover:border-zinc-700"
        :class="ev.type === 'Warning' ? '!border-amber-500/30' : ''"
      >
        <div class="flex items-start gap-3">
          <div
            class="shrink-0 w-9 h-9 rounded-md flex items-center justify-center"
            :class="ev.type === 'Warning' ? 'bg-amber-500/15 text-amber-400' : 'bg-sky-500/15 text-sky-400'"
            aria-hidden="true"
          >
            <NIcon :component="ev.type === 'Warning' ? AlertTriangle : Box" :size="16" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span :class="['chip', ev.type === 'Warning' ? 'chip--warn' : 'chip--info']">{{ ev.reason }}</span>
              <RouterLink
                v-if="ev.involved_kind === 'Pod'"
                :to="{ name: 'pod-detail', params: { namespace: ev.namespace, name: ev.involved_name } }"
                class="text-[12px] text-indigo-400 hover:text-indigo-300 font-mono transition-colors focus:outline-none focus-visible:underline"
                :aria-label="`查看 ${ev.involved_name}`"
              >{{ ev.involved_kind }}/{{ ev.involved_name }}</RouterLink>
              <span v-else class="text-[12px] text-zinc-400 font-mono">{{ ev.involved_kind }}/{{ ev.involved_name }}</span>
              <code class="text-[10.5px] text-zinc-500 font-mono px-1.5 py-0.5 rounded bg-zinc-800/60">{{ ev.namespace }}</code>
            </div>
            <p class="mt-1.5 text-[13px] text-zinc-300 leading-relaxed">{{ ev.message }}</p>
            <div class="mt-2 flex items-center gap-3 text-[11px] text-zinc-500 tabular-nums">
              <span>出现 {{ ev.count }} 次</span>
              <span class="text-zinc-700">·</span>
              <span>{{ timeAgo(ev.last_seen) }}</span>
              <span class="text-zinc-700">·</span>
              <span class="font-mono">{{ ev.last_seen || '—' }}</span>
            </div>
          </div>
          <RouterLink
            v-if="ev.involved_kind === 'Pod'"
            :to="{ name: 'pod-detail', params: { namespace: ev.namespace, name: ev.involved_name } }"
            class="btn-ghost shrink-0"
            :aria-label="`查看 ${ev.involved_name} 详情`"
          >
            <NIcon :component="ArrowRight" :size="13" />
          </RouterLink>
        </div>
      </li>
    </ul>
  </div>
</template>