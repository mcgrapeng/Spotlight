<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NSelect, NInput, NDataTable, NButton, NTag, NEmpty } from 'naive-ui'
import PodStatusBadge from '@/components/common/PodStatusBadge.vue'
import { podsApi } from '@/api'
import { useClusterStore } from '@/stores/cluster'
import type { PodInfo } from '@/types'
import { h } from 'vue'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

const pods = ref<PodInfo[]>([])
const loading = ref(false)
const search = ref<string>((route.query.search as string) || '')
const statusFilter = ref<string>('all')

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: 'Running', value: 'Running' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
  { label: 'Succeeded', value: 'Succeeded' },
]

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  try {
    const r = await podsApi.list({
      cluster: cluster.activeCluster,
      namespace: cluster.activeNamespace,
      status: statusFilter.value,
      search: search.value || undefined,
    })
    pods.value = r.items
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)
watch(statusFilter, load)

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(load, 250)
})

const columns = computed(() => [
  {
    title: 'Name',
    key: 'name',
    minWidth: 220,
    render: (row: PodInfo) =>
      h(
        'a',
        {
          class: 'text-zinc-100 hover:text-indigo-400 transition-colors cursor-pointer font-medium',
          onClick: () =>
            router.push({ name: 'pod-detail', params: { namespace: row.namespace, name: row.name } }),
        },
        row.name,
      ),
  },
  {
    title: 'Namespace',
    key: 'namespace',
    width: 160,
    render: (row: PodInfo) => h('span', { class: 'text-zinc-400 font-mono text-xs' }, row.namespace),
  },
  {
    title: 'Status',
    key: 'phase',
    width: 130,
    render: (row: PodInfo) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(PodStatusBadge, { phase: row.phase, size: 'sm' }),
        row.reason && h(NTag, { size: 'tiny', type: 'error', round: true }, () => row.reason),
      ]),
  },
  {
    title: 'Containers',
    key: 'containers',
    width: 90,
    render: (row: PodInfo) => {
      const ready = row.containers.filter((c) => c.ready).length
      const total = row.containers.length
      const ok = ready === total
      return h('span', { class: ok ? 'text-zinc-300' : 'text-amber-400' }, `${ready}/${total}`)
    },
  },
  {
    title: 'Restarts',
    key: 'restart_count',
    width: 100,
    sorter: (a: PodInfo, b: PodInfo) => a.restart_count - b.restart_count,
    render: (row: PodInfo) =>
      row.restart_count
        ? h('span', { class: 'text-amber-400 font-medium' }, String(row.restart_count))
        : h('span', { class: 'text-zinc-600' }, '0'),
  },
  {
    title: 'Node',
    key: 'node',
    width: 160,
    render: (row: PodInfo) =>
      row.node
        ? h('span', { class: 'text-zinc-400 font-mono text-xs' }, row.node)
        : h('span', { class: 'text-zinc-600' }, '—'),
  },
  {
    title: 'Age',
    key: 'age',
    width: 80,
    render: (row: PodInfo) => h('span', { class: 'text-zinc-500 text-xs' }, row.age ?? '—'),
  },
])
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">Pods</h1>
        <p class="text-sm text-zinc-500 mt-1">
          {{ pods.length }} 个 · namespace: <code class="kbd">{{ cluster.activeNamespace }}</code>
        </p>
      </div>
    </header>

    <NCard :bordered="false">
      <div class="flex items-center gap-3 mb-4">
        <NSelect
          v-model:value="statusFilter"
          :options="statusOptions"
          size="small"
          style="width: 160px"
        />
        <NInput
          v-model:value="search"
          size="small"
          placeholder="按 pod / container / node 搜索"
          style="max-width: 360px"
          clearable
        />
      </div>

      <NDataTable
        :columns="columns"
        :data="pods"
        :loading="loading"
        :bordered="false"
        :pagination="{ pageSize: 50 }"
        size="small"
        :row-key="(r: PodInfo) => `${r.namespace}/${r.name}`"
        striped
      />
      <NEmpty v-if="!loading && !pods.length" description="没有匹配的 Pod" class="py-8" />
    </NCard>
  </div>
</template>
