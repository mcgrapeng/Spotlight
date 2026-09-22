<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { NCard, NDataTable, NTag, NSpin, NProgress } from 'naive-ui'
import { nodesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { NodeInfo } from '@/domain/types'

const cluster = useClusterStore()
const nodes = ref<NodeInfo[]>([])
const loading = ref(true)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  try { nodes.value = await nodesApi.list(cluster.activeCluster) }
  finally { loading.value = false }
}

onMounted(load)
watch(() => cluster.activeCluster, load)

function cpuPct(n: NodeInfo): number {
  const c = parseFloat(n.cpu_capacity), a = parseFloat(n.cpu_allocatable)
  if (!c) return 0
  return Math.min(100, Math.round(((c - a) / c) * 100))
}
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">Nodes</h1>
      <p class="text-sm text-zinc-500 mt-1">{{ nodes.length }} 个节点 · 由 kubelet 上报</p>
    </header>
    <NCard :bordered="false">
      <div v-if="loading" class="py-20 flex justify-center"><NSpin size="large" /></div>
      <NDataTable v-else
        :columns="[
          { title: 'Name', key: 'name', render: (r: NodeInfo) => h('span', { class: 'font-mono text-zinc-100' }, r.name) },
          { title: 'Status', key: 'status', width: 110,
            render: (r: NodeInfo) => h(NTag, { type: r.status === 'Ready' ? 'success' : 'error', size: 'small', round: true }, () => r.status) },
          { title: 'Roles', key: 'roles', width: 200, render: (r: NodeInfo) => r.roles.join(', ') || '—' },
          { title: 'Pods', key: 'pod_count', width: 80 },
          { title: 'Version', key: 'kubelet_version', width: 140, render: (r: NodeInfo) => r.kubelet_version },
          { title: 'CPU (allocatable)', key: 'cpu', width: 220,
            render: (r: NodeInfo) =>
              h('div', { class: 'flex items-center gap-2' }, [
                h(NProgress, { type: 'line', percentage: cpuPct(r), color: '#6366f1', height: 6, processing: false }),
                h('span', { class: 'text-xs text-zinc-400 font-mono whitespace-nowrap' }, `${r.cpu_allocatable} / ${r.cpu_capacity}`),
              ]) },
          { title: 'Memory (allocatable)', key: 'mem', width: 200,
            render: (r: NodeInfo) => `${r.memory_allocatable} / ${r.memory_capacity}` },
          { title: 'Age', key: 'age', width: 80, render: (r: NodeInfo) => r.age ?? '—' },
        ]"
        :data="nodes" size="small" :bordered="false" :pagination="{ pageSize: 50 }" />
    </NCard>
  </div>
</template>
