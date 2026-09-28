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

const phaseCounts = computed(() => {
  const s = stats.value
  if (!s) return { running: 0, pending: 0, failed: 0, succeeded: 0 }
  return {
    running: s.running, pending: s.pending, failed: s.failed, succeeded: s.succeeded
  }
})

const actionItems = computed(() => {
  const items: Array<{ severity: 'critical' | 'warning'; label: string; detail: string }> = []
  if (phaseCounts.value.failed > 0) {
    items.push({
      severity: 'critical',
      label: `${phaseCounts.value.failed} 个 Failed Pod`,
      detail: '点击 Pods 页面按状态筛选排查',
    })
  }
  if (stats.value?.warning_events && stats.value.warning_events > 0) {
    items.push({
      severity: 'warning',
      label: `${stats.value.warning_events} 个 Warning 事件`,
      detail: '点击 Events 页面过滤type  Warning',
    })
  }
  if (stats.value?.nodes_ready !== undefined && stats.value.nodes_total > 0) {
    const notReady = stats.value.nodes_total - stats.value.nodes_ready
    if (notReady > 0) {
      items.push({
        severity: 'critical',
        label: `${notReady} 个 Node 未就绪`,
        detail: `Node Ready ${stats.value.nodes_ready}/${stats.value.nodes_total}`,
      })
    }
  }
  const noisy = (stats.value?.restart_top ?? []).filter(p => p.restarts > 10).slice(0, 3)
  if (noisy.length > 0) {
    items.push({
      severity: 'warning',
      label: `${noisy.length} 个 pod 频繁重启`,
      detail: noisy.map(p => `${p.pod.split('/').pop()} ×${p.restarts}`).join(', '),
    })
  }
  return items
})

const compactStats = computed(() => {
  const s = stats.value
  if (!s) return ''
  const parts = [
    `${formatNumber(s.total_pods)} pods`,
    `${formatNumber(s.running)} running`,
    `${formatNumber(s.failed)} failed`,
    `${s.nodes_ready}/${s.nodes_total} nodes`,
    `${s.warning_events} warnings`,
  ]
  return parts.join(' · ')
})

const recentActivity = computed(() => {
  const items: Array<{ time: string; icon: string; label: string; pod: string }> = []
  for (const ev of warns.value) {
    if (ev.last_seen) {
      items.push({
        time: formatRel(ev.last_seen),
        icon: ev.type === 'Warning' ? '⚠' : 'ℹ',
        label: ev.reason,
        pod: `${ev.namespace}/${ev.involved_name}`,
      })
    }
  }
  const topRestarts = (stats.value?.restart_top ?? []).slice(0, 5)
  for (const p of topRestarts) {
    if (p.restarts > 5) {
      items.push({
        time: 'recently',
        icon: '↻',
        label: `×${p.restarts} restarts`,
        pod: p.pod,
      })
    }
  }
  return items.slice(0, 8)
})
</script>

<template>
  <LoadingState v-if="loading && !stats" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <div v-else-if="stats">

    <PageHeader title="总览" :subtitle="compactStats">
      <template #actions>
        <span class="text-xs text-muted-foreground tabular-nums hidden sm:inline">
          {{ lastRefreshed ? `更新于 ${formatRel(lastRefreshed.toISOString())}` : '' }}
        </span>
        <Button variant="outline" size="sm" :disabled="refreshing" @click="load(true)" aria-label="刷新">
          <RefreshCw :size="14" :stroke-width="1.75" :class="refreshing && 'animate-spin'" />
          刷新
        </Button>
      </template>
    </PageHeader>

    <!-- Section 1: Action Required (only if there ARE actions) -->
    <Card v-if="actionItems.length > 0" class="p-0 mb-4 border-warning">
      <CardContent class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <AlertCircle :size="16" class="text-warning" :stroke-width="2" />
            需要处理 · {{ actionItems.length }} 项
          </h3>
          <span class="text-xs text-muted-foreground">点链接去查</span>
        </div>
        <div class="space-y-2">
          <router-link
            v-for="(item, i) in actionItems"
            :key="i"
            :to="item.severity === 'critical' ? { name: 'pods' } : { name: 'events' }"
            class="flex items-start gap-3 p-2.5 rounded-md border transition-colors hover:bg-muted/50"
            :class="item.severity === 'critical' ? 'border-error-border bg-error/5' : 'border-warning-border bg-warning/5'"
          >
            <span
              :class="cn(
                'shrink-0 mt-0.5 w-1.5 self-stretch rounded-full',
                item.severity === 'critical' ? 'bg-error' : 'bg-warning'
              )"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium">{{ item.label }}</div>
              <div class="text-xs text-muted-foreground">{{ item.detail }}</div>
            </div>
            <span class="shrink-0 text-2xs text-muted-foreground">→</span>
          </router-link>
        </div>
      </CardContent>
    </Card>

    <!-- Section 2: Compact stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">健康</div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold tabular-nums">{{ healthScore }}</span>
            <span class="text-xs text-muted-foreground">%</span>
            <span class="ml-auto h-1.5 w-12 rounded-full bg-muted overflow-hidden">
              <span
                class="block h-full transition-all"
                :class="healthScore >= 90 ? 'bg-success' : healthScore >= 70 ? 'bg-warning' : 'bg-error'"
                :style="{ width: `${healthScore}%` }"
              />
            </span>
          </div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">Pods</div>
          <div class="text-2xl font-bold tabular-nums">{{ formatNumber(stats.total_pods) }}</div>
          <div class="text-2xs text-muted-foreground mt-1">Running {{ formatNumber(stats.running) }}</div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">告警</div>
          <div class="text-2xl font-bold tabular-nums" :class="stats.warning_events > 0 ? 'text-warning' : 'text-muted-foreground/50'">
            {{ formatNumber(stats.warning_events) }}
          </div>
          <div class="text-2xs text-muted-foreground mt-1">5min 内最近</div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">节点</div>
          <div class="text-2xl font-bold tabular-nums" :class="stats.nodes_ready < stats.nodes_total ? 'text-error' : ''">
            {{ stats.nodes_ready }}<span class="text-xs text-muted-foreground/60">/{{ stats.nodes_total }}</span>
          </div>
          <div class="text-2xs text-muted-foreground mt-1">就绪</div>
        </CardContent>
      </Card>
    </div>

    <!-- Section 3: Recent Activity + Top Noisy -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <!-- Recent activity (2/3 width on lg) -->
      <Card class="p-0 lg:col-span-2">
        <CardContent class="p-4">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <Activity :size="15" :stroke-width="1.75" />
            最近活动
            <span class="text-2xs text-muted-foreground ml-auto">最近 1h</span>
          </h3>
          <div v-if="recentActivity.length === 0" class="text-sm text-muted-foreground py-4 text-center">
            安静 — 1 小时内没有事件
          </div>
          <ol v-else class="space-y-1.5">
            <li
              v-for="(item, i) in recentActivity"
              :key="i"
              class="flex items-start gap-3 text-sm py-1"
            >
              <span
                :class="cn(
                  'shrink-0 w-5 text-center font-mono text-xs',
                  item.icon === '⚠' ? 'text-warning' : 'text-muted-foreground'
                )"
              >{{ item.icon }}</span>
              <span class="shrink-0 text-2xs text-muted-foreground w-16 tabular-nums">{{ item.time }}</span>
              <span class="shrink-0 px-1.5 py-0 rounded text-2xs font-medium bg-muted text-foreground border border-border">
                {{ item.label }}
              </span>
              <span class="flex-1 min-w-0 truncate font-mono text-xs">{{ item.pod }}</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <!-- Top noisy (1/3 width on lg) -->
      <Card class="p-0">
        <CardContent class="p-4">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle :size="15" :stroke-width="1.75" />
            频繁重启
          </h3>
          <div v-if="!stats.restart_top || stats.restart_top.filter(p => p.restarts > 5).length === 0" class="text-sm text-muted-foreground py-4 text-center">
            无
          </div>
          <ol v-else class="space-y-1.5">
            <li
              v-for="(p, i) in stats.restart_top.filter(p => p.restarts > 5).slice(0, 5)"
              :key="p.pod"
              class="flex items-center gap-2 text-sm py-0.5"
            >
              <span class="shrink-0 text-2xs text-muted-foreground tabular-nums w-4 text-right">{{ i + 1 }}</span>
              <router-link :to="{ name: 'pod-detail', params: { namespace: p.pod.split('/')[0], name: p.pod.split('/')[1] } }" class="flex-1 min-w-0 truncate font-mono text-xs hover:text-foreground hover:underline">
                {{ p.pod.split('/')[1] }}
              </router-link>
              <span class="shrink-0 text-sm font-semibold tabular-nums" :class="p.restarts > 100 ? 'text-error' : 'text-warning'">
                ×{{ p.restarts }}
              </span>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>

  </div>
</template>