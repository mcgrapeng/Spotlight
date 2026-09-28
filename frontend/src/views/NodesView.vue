<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, Server, Cpu, MemoryStick, Box, AlertTriangle, AlertCircle } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatCard from '@/components/common/StatCard.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, parseCPU, parseMemory, formatMillicores, formatMiB } from '@/lib/utils'
import { nodesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useCachedFetch } from '@/composables/useCachedFetch'
import type { NodeInfo } from '@/domain/types'

const cluster = useClusterStore()
const nodes = ref<NodeInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const nodesCacheKey = computed(() => `nodes:${cluster.activeCluster || 'none'}`)
const nodesFetch = useCachedFetch<NodeInfo[]>({
  key: nodesCacheKey.value,
  fetcher: () => nodesApi.list(cluster.activeCluster!),
  data: nodes,
  loading,
  error,
  ttlMs: 60_000,
})

async function load() {
  if (!cluster.activeCluster) return
  nodesFetch.hydrateFromCache()
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

// ponytail: 归一化为同单位，避免 "64322Mi / 128Gi" 视觉对齐问题
const cpuMc = (s: string) => parseCPU(s)
const memMib = (s: string) => parseMemory(s)

// 算 allocatable / capacity 比例，仅作文本标注，不画 bar（没有 metrics-server，
// CPU/内存 bar 无法表达真实使用率，画上去反而误导）。
function allocRatio(alloc: string, cap: string, parser: (s: string) => number): number {
  const total = parser(cap)
  if (!total) return 0
  return Math.round((parser(alloc) / total) * 100)
}
const cpuAllocRatio = (n: NodeInfo) => allocRatio(n.cpu_allocatable, n.cpu_capacity, cpuMc)
const memAllocRatio = (n: NodeInfo) => allocRatio(n.memory_allocatable, n.memory_capacity, memMib)

function cpuDisplay(alloc: string, cap: string) {
  return { alloc: formatMillicores(cpuMc(alloc)), cap: formatMillicores(cpuMc(cap)) }
}
function memDisplay(alloc: string, cap: string) {
  return { alloc: formatMiB(memMib(alloc)), cap: formatMiB(memMib(cap)) }
}

// 把每个 Node 的主要告警信息抽象出来，卡片顶部一行 banner 用
type Issue =
  | { kind: 'critical'; label: string }
  | { kind: 'warning'; label: string }
  | null

function nodeIssue(n: NodeInfo): Issue {
  if (n.status !== 'Ready') return { kind: 'critical', label: 'NotReady · 节点离线' }
  if (cpuAllocRatio(n) < 20) return { kind: 'warning', label: `CPU 预留过高 · 可分配仅 ${cpuAllocRatio(n)}%` }
  if (memAllocRatio(n) < 20) return { kind: 'warning', label: `内存预留过高 · 可分配仅 ${memAllocRatio(n)}%` }
  return null
}

const MAX_PODS_PER_NODE = 110
function podPct(n: NodeInfo): number {
  if (n.pod_count <= MAX_PODS_PER_NODE) return Math.round((n.pod_count / MAX_PODS_PER_NODE) * 100)
  return 100  // 超载 bar 顶到 100%，靠颜色提示
}
function podOverloaded(n: NodeInfo): boolean {
  return n.pod_count > MAX_PODS_PER_NODE
}
// ponytail: 仅 Pod 利用率有真实数据（pod_count / MAX），保留 bar；
// CPU/内存没有 metrics-server，画 bar 反而误导用户以为在展示使用率。
</script>

<template>
  <div class="space-y-5">
    <PageHeader title="Nodes" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="load" aria-label="刷新">
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
      <Card
        v-for="n in nodes"
        :key="n.name"
        :class="cn(
          'p-0 overflow-hidden',
          n.status === 'Ready' ? '' : 'border-error/40',
        )"
      >
        <CardContent class="p-5 space-y-4">
          <!-- Attention banner: 节点的核心告警，远高于其他视觉噪音 -->
          <div
            v-if="nodeIssue(n)"
            :class="cn(
              'flex items-center gap-2 -mx-5 -mt-5 px-5 py-2 text-xs font-medium border-b',
              nodeIssue(n)!.kind === 'critical'
                ? 'bg-error/10 text-error border-error/30'
                : 'bg-warning/10 text-warning border-warning/30',
            )"
          >
            <AlertCircle
              v-if="nodeIssue(n)!.kind === 'critical'"
              :size="14" :stroke-width="2" aria-hidden="true"
            />
            <AlertTriangle
              v-else
              :size="14" :stroke-width="2" aria-hidden="true"
            />
            <span>{{ nodeIssue(n)!.label }}</span>
          </div>

          <!-- Hero: 节点名 + 状态 pill -->
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <Server :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
                <h3 class="text-base font-semibold font-mono truncate">{{ n.name }}</h3>
              </div>
              <div class="mt-1 flex items-center gap-2 text-2xs text-muted-foreground">
                <span v-if="n.roles.length" class="font-mono">{{ n.roles.join(', ') }}</span>
                <span v-if="n.roles.length" class="opacity-30">·</span>
                <span class="font-mono">v{{ n.kubelet_version }}</span>
                <span class="opacity-30">·</span>
                <span class="tabular-nums">{{ n.age ?? '—' }}</span>
              </div>
            </div>
            <span :class="cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border shrink-0',
              n.status === 'Ready'
                ? 'bg-success-bg text-success border-success-border'
                : 'bg-error-bg text-error border-error-border',
            )">
              <span :class="cn(
                'inline-block w-1.5 h-1.5 rounded-full',
                n.status === 'Ready' ? 'bg-success' : 'bg-error',
              )"></span>
              {{ n.status }}
            </span>
          </div>

          <!-- Pod 数：核心指标，放大显示 -->
          <div>
            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Box :size="12" :stroke-width="1.75" />
              Pods
              <span class="text-2xs opacity-70">当前运行</span>
            </div>
            <div class="mt-1 flex items-baseline gap-2">
              <span :class="cn(
                'text-3xl font-bold tabular-nums leading-none',
                podOverloaded(n) ? 'text-warning' : 'text-foreground',
              )">
                {{ n.pod_count }}
              </span>
              <span
                class="text-sm text-muted-foreground tabular-nums"
                :title="`kubelet 默认单节点最大 Pod 数 = ${MAX_PODS_PER_NODE}（可通过 --max-pods 配置）`"
              >/ {{ MAX_PODS_PER_NODE }} 上限</span>
            </div>
            <div v-if="podOverloaded(n)" class="mt-1 text-2xs text-warning">
              超出节点上限 {{ n.pod_count - MAX_PODS_PER_NODE }} 个，调度器会拒接新 Pod
            </div>
            <div class="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                :class="cn(
                  'h-full transition-all rounded-full',
                  podOverloaded(n) ? 'bg-warning' : 'bg-foreground',
                )"
                :style="{ width: `${podPct(n)}%` }"
              />
            </div>
          </div>

          <!-- 规格表：纯文字展示，没有 bar 也不会有歧义 -->
          <div class="pt-3 border-t border-border space-y-2">
            <div class="flex items-center gap-2 text-xs">
              <Cpu :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">CPU</span>
              <span class="font-mono tabular-nums">
                <span :class="cpuAllocRatio(n) < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ cpuDisplay(n.cpu_allocatable, n.cpu_capacity).alloc }}
                </span>
                <span class="text-muted-foreground"> 可分配</span>
                <span class="text-muted-foreground"> / </span>
                <span class="text-muted-foreground">{{ cpuDisplay(n.cpu_allocatable, n.cpu_capacity).cap }} 总</span>
              </span>
              <span :class="cn(
                'ml-auto tabular-nums text-2xs',
                cpuAllocRatio(n) < 20 ? 'text-warning' : 'text-muted-foreground',
              )">{{ cpuAllocRatio(n) }}%</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <MemoryStick :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">内存</span>
              <span class="font-mono tabular-nums">
                <span :class="memAllocRatio(n) < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ memDisplay(n.memory_allocatable, n.memory_capacity).alloc }}
                </span>
                <span class="text-muted-foreground"> 可分配</span>
                <span class="text-muted-foreground"> / </span>
                <span class="text-muted-foreground">{{ memDisplay(n.memory_allocatable, n.memory_capacity).cap }} 总</span>
              </span>
              <span :class="cn(
                'ml-auto tabular-nums text-2xs',
                memAllocRatio(n) < 20 ? 'text-warning' : 'text-muted-foreground',
              )">{{ memAllocRatio(n) }}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <LoadingState v-else-if="!nodes.length && loading" message="加载节点…" />
    <EmptyState v-else title="没有节点" description="当前集群尚未注册任何 Node">
      <template #icon>
        <Server :size="40" :stroke-width="1.5" class="text-muted-foreground" />
      </template>
    </EmptyState>
  </div>
</template>