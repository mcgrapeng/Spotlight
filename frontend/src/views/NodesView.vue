<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, Server, Cpu, MemoryStick, Box } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusPill from '@/components/common/StatusPill.vue'
import StatCard from '@/components/common/StatCard.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { nodesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { NodeInfo } from '@/domain/types'

const cluster = useClusterStore()
const nodes = ref<NodeInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  error.value = null
  try {
    nodes.value = await nodesApi.list(cluster.activeCluster)
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}
onMounted(load)
watch(() => cluster.activeCluster, load)

const ready = computed(() => nodes.value.filter((n) => n.status === 'Ready').length)
const notReady = computed(() => nodes.value.length - ready.value)
const totalPods = computed(() => nodes.value.reduce((sum, n) => sum + n.pod_count, 0))
const subtitle = computed(() => {
  const total = nodes.value.length
  if (!total) return '尚无节点'
  const pct = Math.round((ready.value / total) * 100)
  return `${total} 个节点 · ${ready.value} Ready · ${pct}% 在线`
})

const parseNum = (s: string): number => parseFloat(s) || 0
const parseMem = (s: string): number => parseFloat(s.replace(/[^0-9.]/g, '')) || 0
const usedPct = (alloc: string, cap: string, parser: (s: string) => number): number => {
  const total = parser(cap)
  if (!total) return 0
  return Math.min(100, Math.round(((total - parser(alloc)) / total) * 100))
}
const cpuPct = (n: NodeInfo) => usedPct(n.cpu_allocatable, n.cpu_capacity, parseNum)
const memPct = (n: NodeInfo) => usedPct(n.memory_allocatable, n.memory_capacity, parseMem)
</script>

<template>
  <div class="space-y-5">
    <PageHeader title="Nodes" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="load" aria-label="刷新节点列表">
          <RefreshCw :size="14" :stroke-width="1.75" :class="cn(loading && 'animate-spin')" />
          刷新
        </Button>
      </template>
    </PageHeader>

    <div v-if="!loading && nodes.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="节点总数" :value="nodes.length" />
      <StatCard label="Ready" :value="ready" :hint="`${notReady} 未就绪`" />
      <StatCard label="NotReady" :value="notReady" />
      <StatCard label="Pod 总数" :value="totalPods" />
    </div>

    <ErrorState v-if="error" :message="error" @retry="load" />

    <div
      v-else-if="!loading && nodes.length"
      class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <Card v-for="n in nodes" :key="n.name" class="p-0">
        <CardContent class="p-5 space-y-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <Server :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
                <h3 class="text-sm font-semibold font-mono truncate">{{ n.name }}</h3>
              </div>
              <p class="mt-1 text-2xs text-muted-foreground font-mono">v{{ n.kubelet_version }}</p>
            </div>
            <StatusPill
              :variant="n.status === 'Ready' ? 'running' : 'failed'"
              :label="n.status"
            />
          </div>

          <div v-if="n.roles.length" class="flex flex-wrap gap-1.5">
            <span
              v-for="role in n.roles"
              :key="role"
              :class="cn(
                'inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-medium border',
                role === 'control-plane'
                  ? 'bg-warning-bg text-warning border-warning-border'
                  : 'bg-muted text-muted-foreground border-border',
              )"
            >{{ role }}</span>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <div class="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Box :size="12" :stroke-width="1.75" />
                Pods
              </div>
              <div class="text-xl font-semibold tabular-nums">{{ n.pod_count }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground mb-1">Age</div>
              <div class="text-sm tabular-nums">{{ n.age ?? '—' }}</div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="flex items-center gap-1.5 text-muted-foreground">
                <Cpu :size="12" :stroke-width="1.75" />
                <span class="font-mono">{{ n.cpu_allocatable }} / {{ n.cpu_capacity }}</span>
              </span>
              <span
                :class="cn(
                  'font-mono tabular-nums',
                  cpuPct(n) > 80 ? 'text-warning' : 'text-muted-foreground',
                )"
              >{{ cpuPct(n) }}%</span>
            </div>
            <div class="h-1.5 rounded-full bg-muted overflow-hidden" :aria-label="`CPU ${cpuPct(n)}%`">
              <div
                :class="cn('h-full transition-all', cpuPct(n) > 80 ? 'bg-warning' : 'bg-foreground')"
                :style="{ width: `${cpuPct(n)}%` }"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="flex items-center gap-1.5 text-muted-foreground">
                <MemoryStick :size="12" :stroke-width="1.75" />
                <span class="font-mono">{{ n.memory_allocatable }} / {{ n.memory_capacity }}</span>
              </span>
              <span
                :class="cn(
                  'font-mono tabular-nums',
                  memPct(n) > 80 ? 'text-warning' : 'text-muted-foreground',
                )"
              >{{ memPct(n) }}%</span>
            </div>
            <div class="h-1.5 rounded-full bg-muted overflow-hidden" :aria-label="`内存 ${memPct(n)}%`">
              <div
                :class="cn('h-full transition-all', memPct(n) > 80 ? 'bg-warning' : 'bg-muted-foreground')"
                :style="{ width: `${memPct(n)}%` }"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <LoadingState v-else-if="loading" message="加载节点…" />
    <EmptyState v-else title="没有节点" description="当前集群尚未注册任何 Node">
      <template #icon>
        <Server :size="40" :stroke-width="1.5" class="text-muted-foreground" />
      </template>
    </EmptyState>
  </div>
</template>
