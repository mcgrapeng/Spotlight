<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RefreshCw, Server, Cpu, MemoryStick, Box, AlertTriangle, AlertCircle } from '@lucide/vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatCard from '@/components/common/StatCard.vue'
import StatusChip from '@/components/common/StatusChip.vue'
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
  errorFallback: t('state.error'),
  ttlMs: 60_000,
})

async function load() {
  if (!cluster.activeCluster) return
  // Rekey here, not at setup: `computed(...).value` captured above would be
  // frozen at 'none' and serve one cluster's nodes for every other cluster.
  nodesFetch.rekey(`nodes:${cluster.activeCluster}`)
  nodesFetch.hydrateFromCache()
  // Through useCachedFetch, not a direct `nodesApi.list`: it carries the
  // supersede guard (a slow cluster A must not overwrite a fast cluster B)
  // and it writes the cache — the TTL was a no-op while the view filled
  // `nodes` by hand.
  await nodesFetch.load()
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
        <Button variant="outline" size="sm" :loading="loading" @click="load" :aria-label="t('nodes.refresh')">
          <template #icon>
            <RefreshCw :size="14" :stroke-width="1.75" />
          </template>
          {{ t('nodes.refresh') }}
        </Button>
      </template>
    </PageHeader>

    <!-- Gated on the data, not on `loading`: `!loading &&` made the whole
         stat row vanish on every cluster / namespace refetch and pop back.
         Same flash as the pods table and the log panel. -->
    <!-- ponytail: 四张卡变三张。NotReady = total - Ready，从 Ready 就能推
         出来，而它自己那张卡又把同一个数写了一遍（Ready 卡的 hint 里也是
         这个数）。剩下的「Pod 总数」是数字聚合，说明不了分布，但那是
         这一页唯一的整体量，留着。 -->
    <div v-if="nodes.length" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard :label="t('nodes.statTotal')" :value="nodes.length" />
      <StatCard :label="t('nodes.statReady')" :value="ready" :hint="t('nodes.statReadyHint', { count: notReady })" />
      <StatCard :label="t('nodes.statPods')" :value="totalPods" />
    </div>

    <ErrorState v-if="error" :message="error" @retry="load" />

    <div
      v-else-if="nodeDisplays.length"
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
              <div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span v-if="d.node.roles.length" class="font-mono">{{ d.node.roles.join(', ') }}</span>
                <span v-if="d.node.roles.length" class="opacity-30">·</span>
                <span class="font-mono">v{{ d.node.kubelet_version }}</span>
                <span class="opacity-30">·</span>
                <span class="tabular-nums">{{ d.node.age ?? '—' }}</span>
              </div>
            </div>
            <StatusChip
              :tone="d.node.status === 'Ready' ? 'success' : 'error'"
              :label="d.node.status"
              dot
              class="shrink-0"
            />
          </div>

          <!-- Pod 数：核心指标，放大显示 -->
          <div>
            <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Box :size="12" :stroke-width="1.75" />
              Pods
              <span class="text-xs opacity-70">{{ t('nodes.podsRunning') }}</span>
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
            <div v-if="podOverloaded(d.node)" class="mt-1 text-xs text-warning">
              {{ t('nodes.podOverCap', { count: d.node.pod_count - MAX_PODS_PER_NODE }) }}
            </div>
            <div class="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div
                :class="cn(
                  // ponytail: 正常容量走中性灰，超限走琥珀。
                  //
                  // 之前正常的那根是 bg-foreground —— 亮色下是一块实心黑
                  // 条，暗色下是一块接近白的实心条。而这块「一切正常」的
                  // 条是全页最重的形状，真出问题的那张卡反而更轻：优先级
                  // 整个反了。超限的判断已经由琥珀色和下面那句「超出节点
                  // 上限 N 个」承担了，条本身不用再抢戏。
                  'h-full transition-[width] ease-app dur-base rounded-full',
                  podOverloaded(d.node) ? 'bg-warning' : 'bg-muted-foreground/40',
                )"
                :style="{ width: `${podPct(d.node)}%` }"
              />
            </div>
          </div>

          <!-- 规格表：纯文字展示，没有 bar 也不会有歧义 -->
          <div class="pt-3 border-t border-border space-y-2">
            <!--
              ponytail: 那个百分比删掉了。

              原来这一行右边挂着一个「100%」，它是「可分配 / 总量」
              （allocatable ÷ capacity）—— 一个预留比例，不是使用率。
              真实集群上三个节点全是 100%：CPU 32 / 32，内存
              60.36Gi / 60.36Gi。健康节点写着 100%，读起来像一块烧到底
              的仪表；更糟的是内存那个 63364680Ki / 63262280Ki 四舍五入
              之后也是 100%，而两个数其实不相等 —— 百分比在骗人。

              左边那行「32 可分配 / 32 总」已经把同样的比例说清楚了，
              而且说对：它写的是「可分配」和「总」，不是「已用」。
              一个数字只出现一次，而这一次是真的。
            -->
            <div class="flex items-center gap-2 text-xs">
              <Cpu :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">CPU</span>
              <!--
                数字和单位之间要有空格。原来的写法是
                `<span> {{ t('nodes.allocatable') }}</span>` —— 那个前导
                空格是 span 的第一个子节点，Vue 编译时把「只有空白、且是
                首个子节点」的文本节点删掉了，于是屏幕上贴着「32可分配」。
                中文和数字之间挤在一起，密度就不对了。改成 flex + gap，
                间距由布局决定，不依赖文本节点里那个看不见的空格。
              -->
              <span class="inline-flex items-baseline gap-1 font-mono tabular-nums">
                <span :class="d.cpu.allocRatio < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ d.cpu.alloc }}
                </span>
                <span class="text-muted-foreground">{{ t('nodes.allocatable') }}</span>
                <span class="text-muted-foreground">/</span>
                <span class="text-muted-foreground">{{ d.cpu.cap }} {{ t('nodes.total') }}</span>
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <MemoryStick :size="12" :stroke-width="1.75" class="text-muted-foreground shrink-0" />
              <span class="text-muted-foreground w-14 shrink-0">{{ t('nodes.memory') }}</span>
              <span class="inline-flex items-baseline gap-1 font-mono tabular-nums">
                <span :class="d.mem.allocRatio < 20 ? 'text-warning font-medium' : 'text-foreground'">
                  {{ d.mem.alloc }}
                </span>
                <span class="text-muted-foreground">{{ t('nodes.allocatable') }}</span>
                <span class="text-muted-foreground">/</span>
                <span class="text-muted-foreground">{{ d.mem.cap }} {{ t('nodes.total') }}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <LoadingState v-else-if="!nodes.length && loading" :message="t('nodes.loading')" />
    <EmptyState v-else :title="t('nodes.emptyTitle')" :description="t('nodes.emptyDescription')">
      <template #icon>
        <Server :size="32" :stroke-width="1.5" class="text-muted-foreground" />
      </template>
    </EmptyState>
  </div>
</template>
