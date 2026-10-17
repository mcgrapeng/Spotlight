<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RefreshCw, AlertCircle, Activity, AlertTriangle, ChevronRight } from '@lucide/vue'
import { podsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { usePermissionsStore } from '@/stores/permissions'
import { useCachedFetch } from '@/composables/useCachedFetch'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import type { DashboardOut } from '@/api/types'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import dayjs from '@/utils/dayjs'
import { useI18n } from 'vue-i18n'

// ponytail: formatRel memoized per 60s bucket — events page renders 500 rows
// each parsing dayjs. Bucket keeps the string identical between rows on the
// same minute so 500 calls in 1s = 1 dayjs() + 500 Map hits. Locale is part of
// the key so a language switch invalidates cached strings; reading `locale.value`
// inside formatRel is also what makes the computeds that call it depend on it,
// so they re-render on switch.
const { locale, t } = useI18n()

const _relCache = new Map<string, string>()
function formatRel(iso: string | null) {
  if (!iso) return '—'
  const bucket = Math.floor(Date.now() / 60_000)
  const key = `${locale.value}:${bucket}:${iso}`
  let v = _relCache.get(key)
  if (v === undefined) {
    v = dayjs(iso).fromNow()
    _relCache.set(key, v)
    if (_relCache.size > 1000) _relCache.clear()
  }
  return v
}

const cluster = useClusterStore()
const stats = ref<DashboardOut | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const refreshing = ref(false)
const lastRefreshed = ref<Date | null>(null)

const perms = usePermissionsStore()
const nodesBlocked = computed(() => perms.isBlocked('nodes') === true)

const statsCacheKey = computed(() => `dashboard:${cluster.activeCluster || 'none'}`)
const statsFetch = useCachedFetch<DashboardOut>({
  key: statsCacheKey.value,
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

async function probePerms() {
  await perms.refresh()
}

onMounted(() => { load(); probePerms() })
watch(() => cluster.activeCluster, () => { load(); probePerms() })
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
    items.push({
      severity: 'warning',
      label: t('dashboard.actionFrequentRestarts', { count: noisy.length }),
      detail: noisy.map(p => `${p.pod.split('/').pop()} ×${p.restarts}`).join(', '),
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
        icon: '⚠',
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
            class="flex items-start gap-3 p-2.5 rounded-md border transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

    <!-- Section 2: Compact stats row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{{ t('dashboard.statHealth') }}</div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold tabular-nums" :class="healthIsCritical && 'text-error'">{{ healthScore }}</span>
            <span class="text-xs text-muted-foreground">%</span>
            <span class="ml-auto h-1.5 w-12 rounded-full bg-muted overflow-hidden">
              <span
                class="block h-full transition-all"
                :class="healthIsCritical ? 'bg-error' : healthScore >= 90 ? 'bg-success' : 'bg-warning'"
                :style="{ width: `${healthScore}%` }"
              />
            </span>
          </div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{{ t('dashboard.statPods') }}</div>
          <div class="text-2xl font-bold tabular-nums">{{ formatNumber(stats.total_pods) }}</div>
          <div class="text-2xs text-muted-foreground mt-1">{{ t('dashboard.statPodsRunning', { count: formatNumber(stats.running) }) }}</div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{{ t('dashboard.statAlerts') }}</div>
          <div class="text-2xl font-bold tabular-nums" :class="stats.warning_events > 0 ? 'text-warning' : 'text-muted-foreground/70'">
            {{ formatNumber(stats.warning_events) }}
          </div>
          <div class="text-2xs text-muted-foreground mt-1">{{ t('dashboard.statAlertsHint') }}</div>
        </CardContent>
      </Card>
      <Card class="p-0">
        <CardContent class="p-4">
          <div class="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{{ t('dashboard.statNodes') }}</div>
          <div class="text-2xl font-bold tabular-nums" :class="stats.nodes_ready < stats.nodes_total ? 'text-error' : ''">
            {{ stats.nodes_ready }}<span class="text-xs text-muted-foreground">/{{ stats.nodes_total }}</span>
          </div>
          <div class="text-2xs text-muted-foreground mt-1">
            <template v-if="nodesBlocked">{{ t('dashboard.nodesBlocked') }}</template>
            <template v-else>{{ t('dashboard.nodesReady') }}</template>
          </div>
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
            {{ t('dashboard.recentActivity') }}
            <span class="text-2xs text-muted-foreground ml-auto">{{ t('dashboard.recentActivityWindow') }}</span>
          </h3>
          <div v-if="recentActivity.length === 0" class="text-sm text-muted-foreground py-4 text-center">
            {{ t('dashboard.recentActivityEmpty') }}
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
            {{ t('dashboard.frequentRestarts') }}
          </h3>
          <div v-if="noisyRestarts.length === 0" class="text-sm text-muted-foreground py-4 text-center">
            {{ t('dashboard.frequentRestartsEmpty') }}
          </div>
          <ol v-else class="space-y-1.5">
            <li
              v-for="(p, i) in noisyRestarts"
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