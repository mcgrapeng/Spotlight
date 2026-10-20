<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertCircle, Activity, AlertTriangle, ChevronRight } from '@lucide/vue'
import { podsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useCachedFetch } from '@/composables/useCachedFetch'
import { useRelativeTime } from '@/composables/useRelativeTime'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import PhaseBar, { type PhaseSlice } from '@/components/common/PhaseBar.vue'
import RestartBars from '@/components/common/RestartBars.vue'
import StatCard from '@/components/common/StatCard.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { DashboardOut } from '@/api/types'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import dayjs from '@/utils/dayjs'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// ponytail: 相对时间格式化之前在这个文件里另写了一份（和 Events / PodDetail
// 重复三遍）。现在统一走 useRelativeTime。
const { formatRel } = useRelativeTime()

const cluster = useClusterStore()
const stats = ref<DashboardOut | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const refreshing = ref(false)
const lastRefreshed = ref<Date | null>(null)

const statsFetch = useCachedFetch<DashboardOut>({
  key: '',
  fetcher: () => podsApi.stats(cluster.activeCluster!),
  data: stats as unknown as import('vue').Ref<DashboardOut | null>,
  loading,
  error,
  ttlMs: 30_000,
})

// ponytail: load() now ACTUALLY USES useCachedFetch. Cache hit → 0 network,
// miss → fetch + cache. silent=true → bypass cache (user wants fresh).
async function load(silent = false) {
  if (!cluster.activeCluster) return
  // Rekey here, not at setup: a `computed(...).value` captured at store setup
  // freezes at 'none' and serves one cluster's dashboard for every other one.
  statsFetch.rekey(`dashboard:${cluster.activeCluster}`)
  error.value = null
  if (silent) {
    refreshing.value = true
    try {
      // refresh() writes the fresh snapshot straight into `stats` (it IS
      // the bound data ref) and returns void.
      await statsFetch.refresh()
      lastRefreshed.value = new Date()
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? t('state.error')
    } finally {
      refreshing.value = false
    }
  } else {
    loading.value = true
    try {
      const v = await statsFetch.loadOrHydrate()
      if (v) stats.value = v
      lastRefreshed.value = new Date()
    } catch (e: any) {
      error.value = e?.response?.data?.detail ?? e?.message ?? t('state.error')
    } finally {
      loading.value = false
    }
  }
}

onMounted(load)
watch(() => cluster.activeCluster, () => load())
watch(() => cluster.activeNamespace, () => load(true))

// ponytail: 健康度只统计"长生命周期" Pod 阶段（Succeeded 是 Job 完成态，不算健康也不算故障）。
const healthScore = computed(() => {
  if (!stats.value) return 0
  const s = stats.value
  const longLived = s.running + s.pending + s.failed
  if (longLived === 0) return 100
  return Math.round((s.running / longLived) * 100)
})
const healthIsCritical = computed(() =>
  !!stats.value && (stats.value.failed > 0 || healthScore.value < 70),
)

const phaseCounts = computed(() => {
  const s = stats.value
  if (!s) return { running: 0, pending: 0, failed: 0, succeeded: 0 }
  return {
    running: s.running, pending: s.pending, failed: s.failed, succeeded: s.succeeded
  }
})

// ponytail: 阶段分布。DashboardOut 一直带着 running/pending/failed/succeeded，
// 但之前只有 failed 被读到 —— 258 个 running 和 17 个 pending 从来没显示过，
// 一个 287 Pod 的集群在界面上就是四个平级数字。
const phaseSlices = computed<PhaseSlice[]>(() => {
  const c = phaseCounts.value
  return [
    { key: 'running', label: 'Running', value: c.running, color: 'hsl(var(--success))' },
    { key: 'pending', label: 'Pending', value: c.pending, color: 'hsl(var(--warning))' },
    { key: 'failed', label: 'Failed', value: c.failed, color: 'hsl(var(--error))' },
    { key: 'succeeded', label: 'Succeeded', value: c.succeeded, color: 'hsl(var(--muted-foreground))' },
  ]
})

const podTotal = computed(() =>
  phaseSlices.value.reduce((acc, s) => acc + s.value, 0),
)

const healthVerdict = computed(() => {
  if (!stats.value) return { key: 'ok', label: t('dashboard.heroVerdictOk'), tone: 'text-success' }
  if (healthIsCritical.value) return { key: 'bad', label: t('dashboard.heroVerdictBad'), tone: 'text-error' }
  if (healthScore.value < 90) return { key: 'warn', label: t('dashboard.heroVerdictWarn'), tone: 'text-warning' }
  return { key: 'ok', label: t('dashboard.heroVerdictOk'), tone: 'text-success' }
})

// ponytail: noisyRestarts hoisted out of template. Previous version ran
// `stats.restart_top.filter(p => p.restarts > 5).slice(0, 5)` twice per render
// (once for v-if, once for v-for) — now computed once.
const noisyRestarts = computed(() => {
  const all = stats.value?.restart_top ?? []
  return all.filter(p => p.restarts > 5).slice(0, 5)
})

type ActionLink =
  | { name: 'pods'; query?: Record<string, string> }
  | { name: 'events'; query?: Record<string, string> }
  | { name: 'nodes'; query?: Record<string, string> }

const actionItems = computed<Array<{
  severity: 'critical' | 'warning'
  label: string
  detail: string
  link: ActionLink
}>>(() => {
  const items: Array<{
    severity: 'critical' | 'warning'; label: string; detail: string; link: ActionLink
  }> = []

  if (phaseCounts.value.failed > 0) {
    items.push({
      severity: 'critical',
      label: t('dashboard.actionFailedPods', { count: phaseCounts.value.failed }),
      detail: t('dashboard.actionFailedPodsDetail'),
      link: { name: 'pods', query: { status: 'Failed' } },
    })
  }

  if (stats.value?.warning_events && stats.value.warning_events > 0) {
    items.push({
      severity: 'warning',
      label: t('dashboard.actionWarningEvents', { count: stats.value.warning_events }),
      detail: t('dashboard.actionWarningEventsDetail'),
      link: { name: 'events', query: { type: 'Warning' } },
    })
  }

  if (stats.value?.nodes_ready !== undefined && stats.value.nodes_total > 0) {
    const notReady = stats.value.nodes_total - stats.value.nodes_ready
    if (notReady > 0) {
      items.push({
        severity: 'critical',
        label: t('dashboard.actionNodesNotReady', { count: notReady }),
        detail: t('dashboard.actionNodesNotReadyDetail', {
          ready: stats.value.nodes_ready,
          total: stats.value.nodes_total,
        }),
        link: { name: 'nodes' },
      })
    }
  }

  const noisy = (stats.value?.restart_top ?? []).filter(p => p.restarts > 10).slice(0, 3)
  if (noisy.length > 0) {
    const worst = Math.max(...noisy.map(p => p.restarts))
    items.push({
      severity: 'warning',
      label: t('dashboard.actionFrequentRestarts', { count: noisy.length }),
      // 之前这里塞的是一串 pod 名 + 次数的逗号连缀，在卡片里糊成一片。
      // 详情说人话：最高多少次。具体的哪个 pod 交给下面的条形图。
      detail: t('dashboard.actionFrequentRestartsDetail', { count: formatNumber(worst) }),
      link: { name: 'pods' },
    })
  }

  return items.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'critical' ? -1 : 1
    return 0
  })
})

const compactStats = computed(() => {
  const s = stats.value
  if (!s) return ''
  return t('dashboard.compactStats', {
    total: formatNumber(s.total_pods),
    running: formatNumber(s.running),
    failed: formatNumber(s.failed),
    nodesReady: s.nodes_ready,
    nodesTotal: s.nodes_total,
    warnings: s.warning_events,
  })
})

const recentActivity = computed(() => {
  const items: Array<{ time: string; icon: string; label: string; pod: string }> = []
  // server now inlines recent_warns in /pods/stats (warning-only, cap 8) —
  // iterate directly, no extra client-side filter.
  const evs = stats.value?.recent_warns ?? []
  for (let i = 0; i < evs.length && items.length < 8; i++) {
    const ev = evs[i]
    if (ev.last_seen) {
      items.push({
        time: formatRel(ev.last_seen),
        icon: 'warn',
        label: ev.reason,
        pod: `${ev.namespace}/${ev.involved_name}`,
      })
    }
  }
  return items
})
</script>

<template>
  <LoadingState v-if="!stats && loading" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <div v-else-if="stats">

    <PageHeader :title="t('route.dashboard')" :subtitle="compactStats">
      <template #actions>
        <span class="text-xs text-muted-foreground tabular-nums hidden sm:inline">
          {{ lastRefreshed ? t('dashboard.updatedAt', { time: formatRel(lastRefreshed.toISOString()) }) : '' }}
        </span>
        <Button variant="outline" size="sm" :disabled="refreshing" @click="load(true)" :aria-label="t('dashboard.refresh')">
          <RefreshCw :size="14" :stroke-width="1.75" :class="refreshing && 'animate-spin'" />
          {{ t('dashboard.refresh') }}
        </Button>
      </template>
    </PageHeader>

    <!--
      Hero：整个首屏只回答一个问题 —— 现在最该管的是什么。
      之前是四张等大的白卡片（26px 数字）+ 一块琥珀色行动卡：视觉重量被平均
      分配到每一处，于是没有一处读起来重要，最该被看见的「3 个 Pod 重启了
      21,320 次」只是第三张卡里一行 12px 灰字。
      现在健康度是一个 48px 的主数字 + 一条阶段分布堆叠条，
      关键事实自己占第一屏，第二屏才是行动清单。
    -->
    <Card class="p-0 mb-4">
      <CardContent class="p-5">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
          <div class="shrink-0 lg:w-[200px]">
            <div class="text-xs text-muted-foreground tracking-wide mb-1">{{ t('dashboard.heroHealth') }}</div>
            <div class="flex items-baseline gap-1">
              <span
                class="text-5xl font-bold tabular-nums tracking-tight leading-none"
                :class="healthIsCritical ? 'text-error' : 'text-foreground'"
              >{{ healthScore }}</span>
              <span class="text-lg text-muted-foreground font-medium">%</span>
            </div>
            <div class="mt-2 text-xs font-medium" :class="healthVerdict.tone">{{ healthVerdict.label }}</div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-baseline justify-between gap-3 mb-2">
              <span class="text-xs text-muted-foreground tracking-wide">{{ t('dashboard.phaseDistribution') }}</span>
              <span class="text-xs text-muted-foreground tabular-nums">{{ formatNumber(podTotal) }} Pod</span>
            </div>
            <PhaseBar :slices="phaseSlices" height="12px" />
            <div class="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              <div v-for="s in phaseSlices" :key="s.key" class="flex items-center gap-1.5 text-xs">
                <span class="size-2 rounded-full shrink-0" :style="{ background: s.color }" aria-hidden="true" />
                <span class="text-muted-foreground">{{ s.label }}</span>
                <span class="font-mono tabular-nums font-medium">{{ formatNumber(s.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Section 1: Action Required (only if there ARE actions) -->
    <Card v-if="actionItems.length > 0" class="p-0 mb-4 border-warning">
      <CardContent class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <AlertCircle :size="16" class="text-warning" :stroke-width="2" />
            {{ t('dashboard.actionRequired', { count: actionItems.length }) }}
          </h3>
          <span class="text-xs text-muted-foreground">{{ t('dashboard.actionHint') }}</span>
        </div>
        <div class="space-y-2">
          <router-link
            v-for="(item, i) in actionItems"
            :key="i"
            :to="item.link"
            class="flex items-start gap-3 p-2.5 rounded-md border transition-colors ease-app hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :class="item.severity === 'critical' ? 'border-error-border bg-error/5' : 'border-warning-border bg-warning/5'"
          >
            <span
              :class="cn(
                'shrink-0 mt-0.5 w-1.5 self-stretch rounded-full',
                item.severity === 'critical' ? 'bg-error' : 'bg-warning'
              )"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium">{{ item.label }}</div>
              <div class="text-xs text-muted-foreground">{{ item.detail }}</div>
            </div>
            <ChevronRight class="shrink-0 text-muted-foreground" :size="14" :stroke-width="1.75" aria-hidden="true" />
          </router-link>
        </div>
      </CardContent>
    </Card>

    <!-- Section 2: 次级指标。改用通用 StatCard —— 之前 Dashboard 手搓了四个
         样式不同的卡片（text-2xs uppercase 标签 + 26px 数字），Nodes 页却用
         StatCard（12px 标签 + 34px 数字）：同一个概念两套视觉语言，差两级字号。 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      <StatCard
        :label="t('dashboard.statAlerts')"
        :value="stats.warning_events"
        :hint="t('dashboard.statAlertsHint')"
        :class="stats.warning_events > 0 ? 'text-warning' : ''"
      />
      <StatCard
        :label="t('dashboard.statNodes')"
        :value="`${stats.nodes_ready}/${stats.nodes_total}`"
        format="raw"
        :hint="t('dashboard.nodesReady')"
      />
      <StatCard
        :label="t('dashboard.statNamespaces')"
        :value="stats.namespaces_count"
      />
    </div>

    <!-- Section 3: Recent Activity + Top Noisy -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <!-- Recent activity (2/3 width on lg) -->
      <Card class="p-0 lg:col-span-2">
        <CardContent class="p-4">
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <Activity :size="15" :stroke-width="1.75" />
            {{ t('dashboard.recentActivity') }}
            <span class="text-2xs text-muted-foreground ml-auto">{{ t('dashboard.recentActivityWindow') }}</span>
          </h3>
          <EmptyState
            v-if="recentActivity.length === 0"
            :title="t('dashboard.recentActivityEmpty')"
          />
          <ol v-else class="space-y-1.5">
            <li
              v-for="(item, i) in recentActivity"
              :key="i"
              class="flex items-start gap-3 text-sm py-1"
            >
              <span
                class="shrink-0 w-5 flex justify-center pt-1.5"
                aria-hidden="true"
              >
                <span
                  class="block size-1.5 rounded-full"
                  :class="item.icon === 'warn' ? 'bg-warning' : 'bg-muted-foreground/40'"
                />
              </span>
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
            {{ t('dashboard.frequentRestarts') }}
          </h3>
          <EmptyState
            v-if="noisyRestarts.length === 0"
            :title="t('dashboard.frequentRestartsEmpty')"
          />
          <RestartBars v-else :items="noisyRestarts" />
        </CardContent>
      </Card>
    </div>

  </div>
</template>
