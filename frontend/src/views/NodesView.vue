<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import { NDataTable, NProgress } from 'naive-ui'
import { Server } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { nodesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { NodeInfo } from '@/domain/types'

const cluster = useClusterStore()
const nodes = ref<NodeInfo[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  errorMsg.value = null
  try { nodes.value = await nodesApi.list(cluster.activeCluster) }
  catch (e: any) { errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => cluster.activeCluster, load)

function cpuPct(n: NodeInfo): number {
  const c = parseFloat(n.cpu_capacity), a = parseFloat(n.cpu_allocatable)
  if (!c) return 0
  return Math.min(100, Math.round(((c - a) / c) * 100))
}
function memPct(n: NodeInfo): number {
  const cap = parseFloat(n.memory_capacity.replace(/[^0-9.]/g, '')) || 0
  const alloc = parseFloat(n.memory_allocatable.replace(/[^0-9.]/g, '')) || 0
  if (!cap) return 0
  return Math.min(100, Math.round(((cap - alloc) / cap) * 100))
}

const subtitle = computed(() => {
  const ready = nodes.value.filter((n) => n.status === 'Ready').length
  return `${nodes.value.length} 个节点 · ${ready} Ready`
})
</script>

<template>
  <div class="page space-y-4">
    <PageHeader title="Nodes" :subtitle="subtitle" />
    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />
    <div v-else class="card card__body--flush">
      <LoadingState v-if="loading" variant="skeleton" :rows="4" height="200px" />
      <EmptyState v-else-if="!nodes.length" :icon="Server" title="没有节点" description="当前集群尚未注册任何 Node" />
      <NDataTable
        v-else
        :columns="[
          { title: 'Name', key: 'name', minWidth: 260,
            render: (r: NodeInfo) => h('div', { class: 'flex items-center gap-2' }, [
              h('span', { class: ['w-1.5 h-1.5 rounded-full', r.status === 'Ready' ? 'bg-emerald-500' : 'bg-red-500'] }),
              h('span', { class: 'font-mono text-zinc-100 text-[12.5px]' }, r.name),
            ]) },
          { title: 'Status', key: 'status', width: 100,
            render: (r: NodeInfo) => h('span', { class: r.status === 'Ready' ? 'chip chip--ok' : 'chip chip--err' }, () => r.status) },
          { title: 'Roles', key: 'roles', width: 180,
            render: (r: NodeInfo) => h('div', { class: 'flex gap-1 flex-wrap' },
              r.roles.map(role =>
                h('span', { class: ['chip', role === 'control-plane' ? 'chip--warn' : 'chip--info'], key: role }, () => role))) },
          { title: 'Pods', key: 'pod_count', width: 80,
            render: (r: NodeInfo) => h('span', { class: 'tabular-nums text-zinc-300' }, String(r.pod_count)) },
          { title: 'Version', key: 'kubelet_version', width: 140,
            render: (r: NodeInfo) => h('code', { class: 'text-[11.5px] text-zinc-400 font-mono' }, r.kubelet_version) },
          { title: 'CPU', key: 'cpu', width: 280,
            render: (r: NodeInfo) =>
              h('div', { class: 'flex items-center gap-3' }, [
                h(NProgress, { type: 'line', percentage: cpuPct(r), color: '#5b8def', height: 3,
                  processing: false, railColor: '#1a1c22', showIndicator: false }),
                h('span', { class: 'text-[11px] text-zinc-500 font-mono whitespace-nowrap tabular-nums w-32 text-right' },
                  `${r.cpu_allocatable} / ${r.cpu_capacity}`),
              ]) },
          { title: 'Memory', key: 'mem', width: 240,
            render: (r: NodeInfo) =>
              h('div', { class: 'flex items-center gap-3' }, [
                h(NProgress, { type: 'line', percentage: memPct(r), color: '#22c55e', height: 3,
                  processing: false, railColor: '#1a1c22', showIndicator: false }),
                h('span', { class: 'text-[11px] text-zinc-500 font-mono whitespace-nowrap tabular-nums w-36 text-right' },
                  `${r.memory_allocatable} / ${r.memory_capacity}`),
              ]) },
          { title: 'Age', key: 'age', width: 80,
            render: (r: NodeInfo) => h('span', { class: 'text-[12px] text-zinc-500 tabular-nums' }, r.age ?? '—') },
        ]"
        :data="nodes" size="medium" :bordered="false" :pagination="{ pageSize: 50 }" />
    </div>
  </div>
</template>
