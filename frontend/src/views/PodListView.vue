<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDataTable, NSelect, NInput, NTag, NEmpty, NButton, NIcon } from 'naive-ui'
import { Search, Filter, Refresh, Box, AlertCircle } from '@vicons/tabler'
import { usePodList } from '@/composables/usePodList'
import { useClusterStore } from '@/stores/cluster'
import PodStatusBadge from '@/components/resources/PodStatusBadge.vue'
import type { PodInfo } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

const search = ref<string>((route.query.search as string) || '')
const statusFilter = ref<string>('all')

const { data, loading, reload } = usePodList({
  cluster: computed(() => cluster.activeCluster),
  namespace: computed(() => cluster.activeNamespace),
  status: statusFilter,
  search,
})

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: 'Running', value: 'Running' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Succeeded', value: 'Succeeded' },
]

const columns = computed(() => [
  {
    title: 'Pod',
    key: 'name',
    minWidth: 280,
    sorter: true,
    render: (row: PodInfo) =>
      h('a', {
        class: 'group flex items-center gap-2 cursor-pointer',
        onClick: () => router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } }),
      }, [
        h('span', {
          class: 'w-7 h-7 rounded-md flex items-center justify-center bg-zinc-800/80 border border-zinc-700/40 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-colors',
        }, [
          h(NIcon, { component: Box, size: 14, color: '#a1a1aa' }),
        ]),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'text-zinc-100 font-medium truncate group-hover:text-indigo-300 transition-colors' }, row.name),
          row.owner_kind
            ? h('div', { class: 'text-[11px] text-zinc-500 font-mono truncate' }, `${row.owner_kind}/${row.owner_name}`)
            : h('div', { class: 'text-[11px] text-zinc-600' }, '—'),
        ]),
      ]),
  },
  {
    title: 'Namespace',
    key: 'namespace',
    width: 180,
    render: (row: PodInfo) =>
      h('span', { class: 'text-[12px] text-zinc-400 font-mono' }, row.namespace),
  },
  {
    title: 'Status',
    key: 'phase',
    width: 200,
    sorter: true,
    render: (row: PodInfo) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(PodStatusBadge, { phase: row.phase, size: 'sm' }),
        row.reason && h(NTag, { size: 'tiny', type: 'error', round: true }, () => row.reason),
      ]),
  },
  {
    title: 'Containers',
    key: 'containers',
    width: 110,
    sorter: (a: PodInfo, b: PodInfo) =>
      a.containers.filter((c) => c.ready).length - b.containers.filter((c) => c.ready).length,
    render: (row: PodInfo) => {
      const ready = row.containers.filter((c) => c.ready).length
      const total = row.containers.length
      const ok = ready === total
      return h('div', { class: 'flex items-center gap-1.5' }, [
        h('span', { class: 'tabular-nums font-medium ' + (ok ? 'text-emerald-400' : 'text-amber-400') }, `${ready}`),
        h('span', { class: 'text-zinc-600' }, '/'),
        h('span', { class: 'tabular-nums text-zinc-400' }, `${total}`),
      ])
    },
  },
  {
    title: 'Restarts',
    key: 'restart_count',
    width: 100,
    sorter: (a: PodInfo, b: PodInfo) => a.restart_count - b.restart_count,
    render: (row: PodInfo) =>
      row.restart_count
        ? h('div', { class: 'flex items-center gap-1.5' }, [
            h(NIcon, { component: AlertCircle, size: 13, color: '#f59e0b' }),
            h('span', { class: 'text-amber-400 font-medium tabular-nums' }, String(row.restart_count)),
          ])
        : h('span', { class: 'text-zinc-600 tabular-nums' }, '0'),
  },
  {
    title: 'Node',
    key: 'node',
    width: 180,
    render: (row: PodInfo) =>
      row.node
        ? h('span', { class: 'text-[12px] text-zinc-400 font-mono' }, row.node.replace(/^[a-z0-9-]+\.([a-z0-9]+).*/, '$1…'))
        : h('span', { class: 'text-zinc-600' }, '—'),
  },
  {
    title: 'Age',
    key: 'age',
    width: 80,
    sorter: true,
    render: (row: PodInfo) => h('span', { class: 'text-[12px] text-zinc-500 tabular-nums' }, row.age ?? '—'),
  },
])

const subtitle = computed(() => cluster.activeNamespace === '_all' ? '所有 namespace' : `namespace: ${cluster.activeNamespace}`)
</script>

<template>
  <div class="page space-y-6">
    <header class="page-header">
      <div>
        <h1 class="page-title">Pods</h1>
        <p class="page-subtitle">
          <span class="tabular-nums">{{ data.total }}</span> 个 · {{ subtitle }}
        </p>
      </div>
    </header>

    <!-- Filters toolbar -->
    <div class="toolbar">
      <NIcon :component="Filter" :size="14" class="text-zinc-500" />
      <NSelect v-model:value="statusFilter" :options="statusOptions" size="small" style="width: 140px" />
      <div class="flex-1 max-w-md">
        <NInput v-model:value="search" size="small" placeholder="按 pod / container / node 搜索" clearable>
          <template #prefix><NIcon :component="Search" :size="13" /></template>
        </NInput>
      </div>
      <NButton size="small" tertiary @click="reload">
        <template #icon><NIcon :component="Refresh" :size="13" /></template>
        刷新
      </NButton>
    </div>

    <!-- Table -->
    <div class="card card__body--flush overflow-hidden">
      <div v-if="!loading && !data.items.length" class="empty-state">
        <NIcon :component="Box" :size="40" class="empty-state__icon" />
        <p class="text-zinc-300 text-[14px] font-medium">没有匹配的 Pod</p>
        <p class="text-zinc-500 text-[12px] mt-1">调整搜索词或切换 namespace</p>
      </div>
      <NDataTable
        v-else
        :columns="columns"
        :data="data.items"
        :loading="loading"
        :bordered="false"
        :pagination="{ pageSize: 50 }"
        size="medium"
        :row-key="(r: PodInfo) => `${r.namespace}/${r.name}`"
        striped
        flex-height
        style="height: calc(100vh - 280px)"
      />
    </div>
  </div>
</template>
