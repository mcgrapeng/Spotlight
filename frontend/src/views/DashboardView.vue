<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertCircle, Activity, AlertTriangle } from '@lucide/vue'
import { podsApi, eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatPercent, formatNumber } from '@/lib/utils'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import type { DashboardStats, EventInfo } from '@/domain/types'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

function formatRel(iso: string | null) {
  if (!iso) return '—'
  return dayjs(iso).fromNow()
}

const cluster = useClusterStore()
const stats = ref<DashboardStats | null>(null)
const warns = ref<EventInfo[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const refreshing = ref(false)
const lastRefreshed = ref<Date | null>(null)

async function load(silent = false) {
  if (!cluster.activeCluster) return
  if (silent) refreshing.value = true
  else loading.value = true
  error.value = null
  try {
    const [s, ev] = await Promise.all([
      podsApi.stats(cluster.activeCluster),
      eventsApi.list({ cluster: cluster.activeCluster, namespace: cluster.activeNamespace, limit: 50 }),
    ])
    stats.value = s
    warns.value = ev.filter(e => e.type === 'Warning').slice(0, 8)
    lastRefreshed.value = new Date()
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, () => load())
watch(() => cluster.activeNamespace, () => load(true))

const healthScore = computed(() => {
  if (!stats.value) return 0
  const s = stats.value
  if (s.total_pods === 0) return 100
  return Math.round(((s.running + s.succeeded) / s.total_pods) * 100)
})

const phaseBars = [
  { key: 'running',   label: 'Running',   count: () => stats.value?.running   ?? 0 },
  { key: 'pending',   label: 'Pending',   count: () => stats.value?.pending   ?? 0 },
  { key: 'failed',    label: 'Failed',    count: () => stats.value?.failed    ?? 0 },
  { key: 'succeeded', label: 'Succeeded', count: () => stats.value?.succeeded ?? 0 },
] as const

const topRestart = computed(() => stats.value?.restart_top?.[0])
const criticalText = computed(() => {
  const t = topRestart.value
  return t ? `${t.pod} 累计重启 ${formatNumber(t.restarts)} 次` : null
})
</script>

<template>
  <LoadingState v-if="loading" message="加载集群状态…" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />

  <div v-else-if="stats">
    <PageHeader
      :title="cluster.activeCluster || '总览'"
      :subtitle="`健康度 ${healthScore}% · Node ${stats.nodes_ready}/${stats.nodes_total}`"
    >
      <template #actions>
        <Button variant="outline" size="sm" :disabled="refreshing" @click="load(true)" aria-label="刷新">
          <RefreshCw :size="14" :stroke-width="1.75" :class="refreshing && 'animate-spin'" />
          刷新
        </Button>
      </template>
    </PageHeader>

    <!-- Critical alert (if any) -->
    <div
      v-if="criticalText"
      class="mb-6 flex items-start gap-3 rounded-lg border border-border bg-card border-l-4 border-l-foreground p-4"
    >
      <AlertCircle :size="20" class="text-foreground shrink-0 mt-0.5" :stroke-width="1.75" />
      <div class="flex-1 min-w-0">
        <div class="text-xs font-bold text-foreground tracking-wide mb-1">CRITICAL</div>
        <div class="text-sm text-foreground">{{ criticalText }}</div>
      </div>
    </div>

    <!-- Metrics grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card class="p-0">
        <CardContent class="p-5">
          <div class="text-xs text-muted-foreground tracking-wide mb-2">集群健康度</div>
          <div class="text-3xl font-bold tracking-tight">{{ healthScore }}<span class="text-base text-muted-foreground">%</span></div>
          <div class="h-1 bg-muted rounded-sm mt-3 overflow-hidden">
            <div class="h-full bg-foreground transition-all" :style="{ width: `${healthScore}%` }" />
          </div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-5">
          <div class="text-xs text-muted-foreground tracking-wide mb-2">运行 Pods</div>
          <div class="text-3xl font-bold tracking-tight">{{ formatNumber(stats.running + stats.pending) }}</div>
          <div class="text-xs text-muted-foreground mt-3">Node Ready <span class="text-foreground font-semibold">{{ stats.nodes_ready }} / {{ stats.nodes_total }}</span></div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-5">
          <div class="text-xs text-muted-foreground tracking-wide mb-2">告警事件</div>
          <div class="text-3xl font-bold tracking-tight text-warning">{{ formatNumber(stats.warning_events) }}</div>
          <div class="text-xs text-muted-foreground mt-3">Namespace <span class="text-foreground font-semibold">{{ cluster.activeNamespace }}</span></div>
        </CardContent>
      </Card>
    </div>

    <!-- Phase distribution -->
    <Card class="p-0 mb-6">
      <CardContent class="p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold">Pod 状态分布</h3>
          <span class="text-xs text-muted-foreground">{{ formatNumber(stats.total_pods) }} 总数</span>
        </div>
        <div class="space-y-3">
          <div v-for="bar in phaseBars" :key="bar.key" class="flex items-center gap-3">
            <PodStatusPill :phase="bar.label" class="w-16 shrink-0" />
            <div class="flex-1 h-1.5 bg-muted rounded-sm overflow-hidden">
              <div
                :class="cn(
                  'h-full transition-all',
                  bar.key === 'running' && 'bg-foreground',
                  bar.key === 'pending' && 'bg-warning',
                  bar.key === 'failed' && 'bg-error',
                  bar.key === 'succeeded' && 'bg-muted-foreground',
                )"
                :style="{ width: stats.total_pods ? `${(bar.count() / stats.total_pods) * 100}%` : '0%' }"
              />
            </div>
            <span class="text-sm font-medium tabular-nums w-10 text-right">{{ bar.count() }}</span>
            <span class="text-xs text-muted-foreground w-12 text-right tabular-nums">
              {{ formatPercent(bar.count(), stats.total_pods) }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Bottom split: events + restart top -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card class="p-0">
        <CardContent class="p-5">
          <h3 class="text-base font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle :size="16" :stroke-width="1.75" />
            最近告警
            <span class="text-xs text-muted-foreground ml-auto">{{ warns.length }}</span>
          </h3>
          <div v-if="warns.length === 0" class="text-sm text-muted-foreground py-4 text-center">
            没有告警事件
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="ev in warns"
              :key="ev.name"
              class="flex items-start gap-3 text-sm py-1.5 border-b border-border last:border-0"
            >
              <span class="shrink-0 px-1.5 py-0.5 rounded text-2xs font-semibold bg-warning-bg text-warning border border-warning-border">
                {{ ev.reason }}
              </span>
              <span class="flex-1 min-w-0 truncate">
                <span class="text-muted-foreground">{{ ev.namespace }}/</span>
                <span class="font-medium">{{ ev.involved_name }}</span>
                <span class="text-muted-foreground ml-2">×{{ ev.count }}</span>
              </span>
              <span class="shrink-0 text-2xs text-muted-foreground" :title="ev.last_seen ?? undefined">
                {{ formatRel(ev.last_seen) }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="p-0">
        <CardContent class="p-5">
          <h3 class="text-base font-semibold mb-4 flex items-center gap-2">
            <Activity :size="16" :stroke-width="1.75" />
            重启 Top 10
          </h3>
          <div v-if="!stats.restart_top || stats.restart_top.length === 0" class="text-sm text-muted-foreground py-4 text-center">
            没有重启数据
          </div>
          <ol v-else class="space-y-1.5">
            <li
              v-for="(item, i) in stats.restart_top.slice(0, 10)"
              :key="item.pod"
              class="flex items-center gap-3 text-sm py-1"
            >
              <span class="text-xs text-muted-foreground tabular-nums w-6 text-right">{{ i + 1 }}</span>
              <span class="flex-1 min-w-0 truncate font-mono text-xs">{{ item.pod }}</span>
              <span class="text-sm font-semibold tabular-nums">{{ formatNumber(item.restarts) }}</span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  </div>
</template>