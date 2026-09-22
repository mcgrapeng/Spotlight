<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDataTable, NSelect, NInput, NTag, NIcon } from 'naive-ui'
import { Search, Filter, Refresh, AlertCircle, AlertTriangle } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import DataToolbar from '@/components/ui/DataToolbar.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import StatusPill from '@/components/ui/StatusPill.vue'
import { usePodList } from '@/composables/usePodList'
import { useClusterStore } from '@/stores/cluster'
import type { PodInfo } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

const search = ref<string>((route.query.search as string) || '')
const statusFilter = ref<string>('all')

const { data, loading, error, reload } = usePodList({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => cluster.activeNamespace),
  status: statusFilter,
  search,
})

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: 'Running', value: 'Running' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Succeeded', value: 'Succeeded' },
]

const columns = computed(() => [
  {
    title: 'Pod',
    key: 'name',
    minWidth: 320,
    sorter: true,
    render: (row: PodInfo) =>
      h('div', { class: 'flex flex-col gap-0.5' }, [
        h('a', {
          class: 'text-zinc-100 font-mono text-[13px] hover:text-indigo-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-indigo-400 focus-visible:underline',
          href: `/pods/${encodeURIComponent(row.namespace)}/${encodeURIComponent(row.name)}`,
          'aria-label': `查看 ${row.name} 详情`,
        }, row.name),
        row.owner_kind
          ? h('span', { class: 'text-[10.5px] text-zinc-500 font-mono' }, `${row.owner_kind}/${row.owner_name}`)
          : null,
      ]),
  },
  { title: 'Namespace', key: 'namespace', width: 180,
    render: (row: PodInfo) => h('span', { class: 'text-[12px] text-zinc-400 font-mono' }, row.namespace) },
  { title: 'Status', key: 'phase', width: 180, sorter: true,
    render: (row: PodInfo) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(StatusPill, { phase: row.phase, size: 'sm' }),
        row.reason && h('span', { class: 'chip chip--err' }, () => row.reason),
      ]) },
  { title: 'Containers', key: 'containers', width: 110,
    sorter: (a: PodInfo, b: PodInfo) => a.containers.filter(c => c.ready).length - b.containers.filter(c => c.ready).length,
    render: (row: PodInfo) => {
      const ready = row.containers.filter((c) => c.ready).length
      const total = row.containers.length
      const ok = ready === total
      return h('span', {
        class: 'tabular-nums text-[12.5px] ' + (ok ? 'text-zinc-400' : 'text-amber-400'),
        'aria-label': `${ready} 个就绪 共 ${total} 个`,
      }, [`${ready}`, h('span', { class: 'text-zinc-600' }, '/'), `${total}`])
    } },
  { title: 'Restarts', key: 'restart_count', width: 110,
    sorter: (a: PodInfo, b: PodInfo) => a.restart_count - b.restart_count,
    render: (row: PodInfo) => {
      if (row.restart_count === 0) {
        return h('span', { class: 'text-zinc-600 tabular-nums text-[12.5px]' }, '0')
      }
      const isCritical = row.restart_count > 100
      const isWarn = row.restart_count > 5
      const cls = isCritical ? 'text-red-400 font-semibold' : isWarn ? 'text-amber-400' : 'text-zinc-400'
      return h('div', {
        class: 'flex items-center gap-1 tabular-nums text-[12.5px]',
        'aria-label': `${row.restart_count} 次重启`,
      }, [
        h(NIcon, {
          component: isCritical ? AlertCircle : AlertTriangle,
          size: 12, color: isCritical ? '#fb7185' : '#fbbf24', 'aria-hidden': true,
        }),
        h('span', { class: cls }, row.restart_count.toLocaleString()),
      ])
    } },
  { title: 'Node', key: 'node', width: 180,
    render: (row: PodInfo) =>
      row.node
        ? h('span', { class: 'text-[12px] text-zinc-400 font-mono' }, row.node.split('.')[0])
        : h('span', { class: 'text-zinc-600' }, '—'),
  },
  { title: 'Age', key: 'age', width: 80, sorter: true,
    render: (row: PodInfo) => h('span', { class: 'text-[12px] text-zinc-500 tabular-nums' }, row.age ?? '—') },
])

const subtitle = computed(() =>
  `${data.value.total} 个 · ${cluster.activeNamespace === '_all' ? '所有 namespace' : cluster.activeNamespace}`,
)
</script>

<template>
  <div class="page space-y-4">
    <PageHeader title="Pods" :subtitle="subtitle" />

    <DataToolbar label="Pod 列表筛选">
      <NIcon :component="Filter" :size="13" class="text-zinc-500" />
      <NSelect v-model:value="statusFilter" :options="statusOptions" size="small" style="width: 120px" aria-label="按状态筛选" />
      <div class="flex-1 max-w-md">
        <NInput v-model:value="search" size="small" placeholder="搜索 pod / container / node" clearable aria-label="搜索">
          <template #prefix><NIcon :component="Search" :size="13" /></template>
        </NInput>
      </div>
      <button class="btn-secondary" @click="reload" :disabled="loading" aria-label="刷新列表">
        <NIcon :component="Refresh" :size="13" />
        刷新
      </button>
    </DataToolbar>

    <ErrorState v-if="error" :message="error" :on-retry="reload" />

    <div v-else class="card card__body--flush overflow-hidden">
      <EmptyState
        v-if="!loading && !data.items.length"
        title="没有匹配的 Pod"
        description="调整搜索词或切换 namespace / 状态过滤"
      />
      <NDataTable
        v-else
        :columns="columns"
        :data="data.items"
        :loading="loading"
        :bordered="false"
        :pagination="{ pageSize: 50 }"
        size="medium"
        :row-key="(r: PodInfo) => `${r.namespace}/${r.name}`"
        flex-height
        style="height: calc(100vh - 240px)"
        :row-props="(row: PodInfo) => ({
          class: 'cursor-pointer',
          onClick: () => router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } }),
        })"
      />
    </div>
  </div>
</template>
