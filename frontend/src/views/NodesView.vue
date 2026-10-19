<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
import type { NodeOut } from '@/api/types'

const cluster = useClusterStore()
const { t } = useI18n()
const nodes = ref<NodeOut[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const nodesFetch = useCachedFetch<NodeOut[]>({
  key: '',
  fetcher: () => nodesApi.list(cluster.activeCluster!),
  data: nodes,
  loading,
  error,
  ttlMs: 60_000,
})

async function load() {
  if (!cluster.activeCluster) return
  // Rekey here, not at setup: `computed(...).value` captured above would be
  // frozen at 'none' and serve one cluster's nodes for every other cluster.
  nodesFetch.rekey(`nodes:${cluster.activeCluster}`)
  nodesFetch.hydrateFromCache()
  loading.value = true
  error.value = null
  try {
    nodes.value = await nodesApi.list(cluster.activeCluster)
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? t('state.error')
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
  if (!total) return t('nodes.subtitleEmpty')
  const pct = Math.round((ready.value / total) * 100)
  return t('nodes.subtitle', { total, ready: ready.value, pct })
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

// Pre-parse all the strings once per nodes change — was 2 regex parses per
// node per render before; with 50+ nodes and 4 re-renders per refresh
// that's 400+ useless parse calls. Now O(N) per refresh.
const nodeDisplays = computed(() =>
  nodes.value.map((n) => {
    const cpuAllocMc = cpuMc(n.cpu_allocatable)
    const cpuCapMc = cpuMc(n.cpu_capacity)
    const memAllocMib = memMib(n.memory_allocatable)
    const memCapMib = memMib(n.memory_capacity)
    return {
      node: n,
      cpu: {
        alloc: formatMillicores(cpuAllocMc),
        cap: formatMillicores(cpuCapMc),
        allocRatio: cpuCapMc ? Math.round((cpuAllocMc / cpuCapMc) * 100) : 0,
      },
      mem: {
        alloc: formatMiB(memAllocMib),
        cap: formatMiB(memCapMib),
        allocRatio: memCapMib ? Math.round((memAllocMib / memCapMib) * 100) : 0,
      },
    }
  }),
)

// 把每个 Node 的主要告警信息抽象出来，卡片顶部一行 banner 用
type Issue =
  | { kind: 'critical'; label: string }
  | { kind: 'warning'; label: string }
  | null

function nodeIssue(d: typeof nodeDisplays.value[number]): Issue {
  if (d.node.status !== 'Ready') return { kind: 'critical', label: t('nodes.issueNotReady') }
  if (d.cpu.allocRatio < 20) {
    return { kind: 'warning', label: t('nodes.issueCpuHeadroom', { pct: d.cpu.allocRatio }) }
  }
  if (d.mem.allocRatio < 20) {
    return { kind: 'warning', label: t('nodes.issueMemoryHeadroom', { pct: d.mem.allocRatio }) }
  }
  return null
}

const MAX_PODS_PER_NODE = 110
function podPct(n: NodeOut): number {
  if (n.pod_count <= MAX_PODS_PER_NODE) return Math.round((n.pod_count / MAX_PODS_PER_NODE) * 100)
  return 100  // 超载 bar 顶到 100%，靠颜色提示
}
function podOverloaded(n: NodeOut): boolean {
  return n.pod_count > MAX_PODS_PER_NODE
}
// ponytail: 仅 Pod 利用率有真实数据（pod_count / MAX），保留 bar；
// CPU/内存没有 metrics-server，画 bar 反而误导用户以为在展示使用率。
</script>

<template>
  <div class="space-y-5">
    <PageHeader :title="t('route.nodes')" :subtitle="subtitle">
      <template #actions>
        <Button variant="outline" size="sm" :disabled="loading" @click="load" :aria-label="t('nodes.refresh')">
          <RefreshCw :size="14" :stroke-width="1.75" :class="cn(loading && 'animate-spin')" />
          {{ t('nodes.refresh') }}
        </Button>
      </template>
    </PageHeader>

    <div v-if="!loading && nodes.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard :label="t('nodes.statTotal')" :value="nodes.length" />
      <StatCard label="Ready" :value="ready" :hint="t('nodes.statReadyHint', { count: notReady })" />
      <StatCard label="NotReady" :value="notReady" />
      <StatCard :label="t('nodes.statPods')" :value="totalPods" />
    </div>

    <ErrorState v-if="error" :message="error" @retry="load" />

    <div
      v-else-if="!loading && nodeDisplays.length"
      class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <Card
        v-for="d in nodeDisplays"
        :key="d.node.name"
        :class="cn(
          'p-0 overflow-hidden',
          d.node.status === 'Ready' ? '' : 'border-error/40',
        )"
      >
        <CardContent class="p-5 space-y-4">
          <!-- Attention banner: 节点的核心告警，远高于其他视觉噪音 -->
          <div
            v-if="nodeIssue(d)"
            :class="cn(
              'flex items-center gap-2 -mx-5 -mt-5 px-5 py-2 text-xs font-medium border-b',
              nodeIssue(d)!.kind === 'critical'
                ? 'bg-error/10 text-error border-error/30'
                : 'bg-warning/10 text-warning border-warning/30',
            )"
          >
            <AlertCircle
              v-if="nodeIssue(d)!.kind === 'critical'"
              :size="14" :stroke-width="2" aria-hidden="true"
            />
            <AlertTriangle
              v-else
              :size="14" :stroke-width="2" aria-hidden="true"
            />
            <span>{{ nodeIssue(d)!.label }}</span>
          </div>

          <!-- Hero: 节点名 + 状态 pill -->
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <Server :size="14" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
                <h3 class="text-base font-semibold font-mono truncate">{{ d.node.name }}</h3>
              </div>
              <div class="mt-1 flex items-center gap-2 text-2xs text-muted-foreground">
                <span v-if="d.node.roles.length" class="font-mono">{{ d.node.roles.join(', ') }}</span>
                <span v-if="d.node.roles.length" class="opacity-30">·</span>
                <span class="font-mono">v{{ d.node.kubelet_version }}</span>
                <span class="opacity-30">·</span>
                <span class="tabular-nums">{{ d.node.age ?? '—' }}</span>
              </div>
            </div>
            <span :class="cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium border shrink-0',
              d.node.status === 'Ready'
                ? 'bg-success-bg text-success border-success-border'
                : 'bg-error-bg text-error border-error-border',
            )">
              <span :class="cn(
                'inline-block w-1.5 h-1.5 rounded-full',
                d.node.status === 'Ready' ? 'bg-success' : 'bg-error',
              )"></span>
              {{ d.node.status }}
            </span>
          </div>

          <!-- Pod 数：核心指标，放大显示 -->
          <div>
            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Box :size="12" :stroke-width="1.75" />
              Pods
              <span class="text-2xs opacity-70">{{ t('nodes.podsRunning') }}</span>
            </div>
            <div class="mt-1 flex items-baseline gap-2">
              <span :class="cn(
                'text-3xl font-bold tabular-nums leading-none',
                podOverloaded(d.node) ? 'text-warning' : 'text-foreground',
              )">
                {{ d.node.pod_count }}
              </span>
              <span
                class="text-sm text-muted-foreground tabular-nums"
                :title="t('nodes.podCapTitle', { max: MAX_PODS_PER_NODE })"
              >/ {{ MAX_PODS_PER_NODE }} {{ t('nodes.podCap') }}</span>
            </div>
            <div v-if="podOverloaded(d.node)" class="mt-1 text-2xs text-warning">
              {{ t('nodes.podOverCap', { count: d.node.pod_count - MAX_PODS_PER_NODE }) }}
            </div>
            <div class="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                :class="cn(
                  'h-full transition-all rounded-full',
                  podOverloaded(d.node) ? 'bg-warning' : 'bg-foreground',
                )"
                :style="{ width: `${podPct(d.node)}%` }"
              />
            </div>
          </div>

          <!-- 规格表：纯文字展示，没有 bar 也不会有歧义 -->
          <div class="pt-3 border-t border-border space-y-2">
            <div class="flex items-center gap-2 text-xs">
              <Cpu :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">CPU</span>
              <span class="font-mono tabular-nums">
                <span :class="d.cpu.allocRatio < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ d.cpu.alloc }}
                </span>
                <span class="text-muted-foreground"> {{ t('nodes.allocatable') }}</span>
                <span class="text-muted-foreground"> / </span>
                <span class="text-muted-foreground">{{ d.cpu.cap }} {{ t('nodes.total') }}</span>
              </span>
              <span :class="cn(
                'ml-auto tabular-nums text-2xs',
                d.cpu.allocRatio < 20 ? 'text-warning' : 'text-muted-foreground',
              )">{{ d.cpu.allocRatio }}%</span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <MemoryStick :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">{{ t('nodes.memory') }}</span>
              <span class="font-mono tabular-nums">
                <span :class="d.mem.allocRatio < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ d.mem.alloc }}
                </span>
                <span class="text-muted-foreground"> {{ t('nodes.allocatable') }}</span>
                <span class="text-muted-foreground"> / </span>
                <span class="text-muted-foreground">{{ d.mem.cap }} {{ t('nodes.total') }}</span>
              </span>
              <span :class="cn(
                'ml-auto tabular-nums text-2xs',
                d.mem.allocRatio < 20 ? 'text-warning' : 'text-muted-foreground',
              )">{{ d.mem.allocRatio }}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <LoadingState v-else-if="!nodes.length && loading" :message="t('nodes.loading')" />
    <EmptyState v-else :title="t('nodes.emptyTitle')" :description="t('nodes.emptyDescription')">
      <template #icon>
        <Server :size="40" :stroke-width="1.5" class="text-muted-foreground" />
      </template>
    </EmptyState>
  </div>
</template>