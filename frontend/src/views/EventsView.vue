<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { NDataTable, NSelect, NInput, NIcon } from 'naive-ui'
import { Search, Filter, CircleCheck } from '@vicons/tabler'
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
const typeFilter = ref<string>('all')
const search = ref('')

const typeOptions = [
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

const subtitle = computed(() => `${visible.value.length} / ${events.value.length} 条`)
</script>

<template>
  <div class="page space-y-4">
    <PageHeader title="Events" :subtitle="subtitle" />

    <DataToolbar label="Events 筛选">
      <NIcon :component="Filter" :size="13" class="text-zinc-500" />
      <NSelect v-model:value="typeFilter" :options="typeOptions" size="small" style="width: 120px" aria-label="按类型筛选" />
      <div class="flex-1 max-w-md">
        <NInput v-model:value="search" size="small" placeholder="搜索 reason / message / 资源" clearable aria-label="搜索">
          <template #prefix><NIcon :component="Search" :size="13" /></template>
        </NInput>
      </div>
    </DataToolbar>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />
    <div v-else class="card card__body--flush">
      <LoadingState v-if="loading" variant="skeleton" :rows="8" height="400px" />
      <EmptyState
        v-else-if="!visible.length"
        :icon="CircleCheck"
        tone="success"
        title="无事件"
        :description="events.length ? '筛选条件过滤掉了所有事件' : '当前 namespace 没有事件'"
      />
      <NDataTable
        v-else
        :columns="[
          { title: 'Type', key: 'type', width: 110,
            render: (r: EventInfo) => h('span', { class: r.type === 'Warning' ? 'chip chip--warn' : 'chip chip--info' }, () => r.type) },
          { title: 'Reason', key: 'reason', width: 180, render: (r: EventInfo) => h('span', { class: 'text-zinc-100 text-[12.5px]' }, r.reason) },
          { title: 'Object', key: 'involved', width: 280,
            render: (r: EventInfo) =>
              h('a', {
                class: 'inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-mono text-[12px] cursor-pointer focus-visible:outline-none focus-visible:underline',
                href: `/pods/${encodeURIComponent(r.namespace)}/${encodeURIComponent(r.involved_name)}`,
                'aria-label': `查看 ${r.involved_kind} ${r.involved_name}`,
              }, `${r.involved_kind}/${r.involved_name}`) },
          { title: 'Namespace', key: 'namespace', width: 160, render: (r: EventInfo) => h('span', { class: 'text-[11.5px] text-zinc-500 font-mono' }, r.namespace) },
          { title: 'Message', key: 'message', render: (r: EventInfo) => h('span', { class: 'text-zinc-300 text-[12.5px]' }, r.message) },
          { title: 'Count', key: 'count', width: 80, render: (r: EventInfo) => h('span', { class: 'tabular-nums text-zinc-400' }, String(r.count)) },
          { title: 'Last Seen', key: 'last_seen', width: 200, render: (r: EventInfo) => h('span', { class: 'text-[12px] text-zinc-500 font-mono' }, r.last_seen || '—') },
        ]"
        :data="visible" size="medium" :bordered="false" :pagination="{ pageSize: 50 }" />
    </div>
  </div>
</template>
