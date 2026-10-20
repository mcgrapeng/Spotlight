<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertCircle, Activity, AlertTriangle, ChevronRight, Inbox } from '@lucide/vue'
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
    { key: 'running', label: t('phase.Running'), value: c.running, color: 'hsl(var(--success))' },
    // ponytail: 琥珀色只留给「需要处理」。Pending 是「在等调度」，集群的正常
    // 状态 —— 把它染成琥珀等于把「没出故障」说成「需要注意」。
    { key: 'pending', label: t('phase.Pending'), value: c.pending, color: 'hsl(var(--muted-foreground))' },
    { key: 'failed', label: t('phase.Failed'), value: c.failed, color: 'hsl(var(--error))' },
    // Succeeded 比 Pending 更淡一级：两级灰在同一根条上要分得开。
    { key: 'succeeded', label: t('phase.Succeeded'), value: c.succeeded, color: 'hsl(var(--muted-foreground) / 0.45)' },
  ]
})

const podTotal = computed(() =>
  phaseSlices.value.reduce((acc, s) => acc + s.value, 0),
)

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

  // ponytail: 频繁重启排在告警事件前面。两者严重级别相同（都是 warning），
  // 排序是稳定的，所以谁先入队谁排前面。「3 个 Pod 频繁重启（最高 21,320 次）」
  // 点名了要看的对象，「25 个 Warning 事件」只是一个计数 —— 而告警计数里
  // 往往就是同一个崩溃循环，换个单位说了一遍。
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

  if (stats.value?.warning_events && stats.value.warning_events > 0) {
    items.push({
      severity: 'warning',
      label: t('dashboard.actionWarningEvents', { count: stats.value.warning_events }),
      detail: t('dashboard.actionWarningEventsDetail'),
      link: { name: 'events', query: { type: 'Warning' } },
    })
  }

  return items.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'critical' ? -1 : 1
    return 0
  })
})

// ponytail: 首屏主位是「最该管的一件事」，不是一个永远不会变红的健康分。
// 重启 21,320 次的 Pod phase 仍然是 Running，健康分照旧是 94% —— 一个说不了
// 「坏」的数字会持续把注意力从故障上拿走。所以健康分降级成阶段条下面一行
// 事实说明，判定句（「一切正常」这类）整段删掉。
const heroAction = computed(() => actionItems.value[0] ?? null)
const heroTitle = computed(() => heroAction.value?.label ?? t('dashboard.heroAllClear'))
const heroDetail = computed(() => heroAction.value?.detail ?? t('dashboard.heroAllClearHint'))
const heroTone = computed(() => {
  if (!heroAction.value) return 'text-success'
  return heroAction.value.severity === 'critical' ? 'text-error' : 'text-warning'
})

// 行动卡边框跟着最严重那条走：之前恒为 amber，卡里装的是 critical 也不变。
const actionCardBorder = computed(() =>
  actionItems.value[0]?.severity === 'critical' ? 'border-error-border' : 'border-warning-border',
)

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
      之前主位是 48px 的健康度 + 一句判定「一切正常」：一个变不了红的数字
      （重启 21,320 次的 Pod phase 还是 Running）持续把注意力从故障上拿走，
      往下两行就是「3 个 Pod 频繁重启 / 最高 21,320 次重启」。
      现在主位是 actionItems[0]（已按 critical 优先排序），健康度降级成阶段
      条下面一行事实说明，判定句不再出现。
    -->
    <Card class="p-0 mb-4">
      <CardContent class="p-5">
        <div class="flex flex-col lg:flex-row lg:items-center gap-6">
          <div class="lg:flex-1 min-w-0">
            <div class="text-xs text-muted-foreground tracking-wide mb-2">{{ t('dashboard.heroEyebrow') }}</div>
            <h2 class="text-5xl font-bold tracking-tight leading-[1.1] break-words" :class="heroTone">
              {{ heroTitle }}
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">{{ heroDetail }}</p>
            <router-link
              v-if="heroAction"
              :to="heroAction.link"
              class="mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground transition-colors ease-app hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {{ t('dashboard.heroOpen') }}
              <ChevronRight :size="14" :stroke-width="2" aria-hidden="true" />
            </router-link>
          </div>

          <div class="lg:w-[420px] lg:shrink-0">
            <div class="flex items-baseline justify-between gap-3 mb-2">
              <span class="text-xs text-muted-foreground tracking-wide">{{ t('dashboard.phaseDistribution') }}</span>
              <span class="text-xs text-muted-foreground tabular-nums">{{ formatNumber(podTotal) }} Pod</span>
            </div>
            <PhaseBar :slices="phaseSlices" height="12px" />
            <p class="mt-2 text-xs text-muted-foreground">
              {{ t('dashboard.heroRunningFact', { running: formatNumber(phaseCounts.running), total: formatNumber(podTotal) }) }}
            </p>
            <div class="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
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
    <Card v-if="actionItems.length > 0" :class="['p-0 mb-4', actionCardBorder]">
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
         StatCard（12px 标签 + 34px 数字）：同一个概念两套视觉语言，差两级字号。
         数字再从 34px 收到 26px（size="sm"）：首屏 48px 的主位之外，剩下的
         数字都不该跟它抢注意力。「命名空间 44」整张删掉 —— 44 个命名空间
         不是运行信号。Nodes 页保持默认尺寸，那边的 StatCard 就是那一页的
         全部层级，收小会把它掏空。 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
      <StatCard
        size="sm"
        :label="t('dashboard.statAlerts')"
        :value="stats.warning_events"
        :hint="t('dashboard.statAlertsHint')"
        :class="stats.warning_events > 0 ? 'text-warning' : ''"
      />
      <StatCard
        size="sm"
        :label="t('dashboard.statNodes')"
        :value="`${stats.nodes_ready}/${stats.nodes_total}`"
        format="raw"
        :hint="t('dashboard.nodesReady')"
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
          <!-- ponytail: 空态收成一行。共享的 EmptyState 是 40px 图标 + py-16 的
               居中大块，在「没有事件」时占了整个下半屏的四成面积，说的却只是
               没有事件。真正的信号（重启次数）在右边的条形图里。 -->
          <div
            v-if="recentActivity.length === 0"
            class="flex items-center gap-2 py-3 text-sm text-muted-foreground"
          >
            <Inbox :size="15" :stroke-width="1.75" aria-hidden="true" />
            {{ t('dashboard.recentActivityEmpty') }}
          </div>
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
