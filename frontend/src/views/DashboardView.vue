<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NSpin, NButton, NTag, NEmpty } from 'naive-ui'
import {
  Box, CircleCheck, AlertTriangle, Server, Activity, AlertOctagon,
  CircleArrowUp,
} from '@vicons/tabler'
import StatCard from '@/components/common/StatCard.vue'
import PodStatusBadge from '@/components/resources/PodStatusBadge.vue'
import { podsApi, eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { DashboardStats, EventInfo } from '@/domain/types'

const router = useRouter()
const cluster = useClusterStore()
const stats = ref<DashboardStats | null>(null)
const warns = ref<EventInfo[]>([])
const loading = ref(true)
const lastRefreshed = ref<Date | null>(null)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  try {
    const [s, ev] = await Promise.all([
      podsApi.stats(cluster.activeCluster),
      eventsApi.list({ cluster: cluster.activeCluster, namespace: cluster.activeNamespace, limit: 50 }),
    ])
    stats.value = s
    warns.value = ev.filter((e) => e.type === 'Warning').slice(0, 8)
    lastRefreshed.value = new Date()
  } finally { loading.value = false }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const phaseBars = [
  { key: 'running', label: 'Running', color: '#10b981' },
  { key: 'pending', label: 'Pending', color: '#f59e0b' },
  { key: 'failed', label: 'Failed', color: '#ef4444' },
  { key: 'succeeded', label: 'Succeeded', color: '#3b82f6' },
] as const

function ratio(k: string): number {
  if (!stats.value || !stats.value.total_pods) return 0
  return (stats.value[k as keyof DashboardStats] as number) / stats.value.total_pods
}

const healthScore = computed(() => {
  if (!stats.value) return 0
  const s = stats.value
  if (s.total_pods === 0) return 100
  return Math.round(((s.running + s.succeeded) / s.total_pods) * 100)
})

const healthTone = computed(() => {
  const h = healthScore.value
  if (h >= 90) return 'success'
  if (h >= 70) return 'warning'
  return 'danger'
})

const refreshedAgo = computed(() => {
  if (!lastRefreshed.value) return ''
  const sec = Math.floor((Date.now() - lastRefreshed.value.getTime()) / 1000)
  if (sec < 5) return '刚刚'
  if (sec < 60) return `${sec} 秒前`
  return `${Math.floor(sec / 60)} 分钟前`
})
</script>

<template>
  <div class="page space-y-7">
    <!-- Page header -->
    <header class="page-header">
      <div>
        <div class="flex items-center gap-2.5">
          <h1 class="page-title">总览</h1>
          <NTag v-if="cluster.currentCluster" size="small" round :type="healthTone" class="!font-mono">
            {{ healthScore }}% 健康度
          </NTag>
        </div>
        <p class="page-subtitle">实时反映 <code class="kbd">{{ cluster.currentCluster?.name ?? '—' }}</code> 集群的健康与负载</p>
      </div>
      <div class="flex items-center gap-2 text-[12px] text-zinc-500">
        <span v-if="refreshedAgo">更新于 {{ refreshedAgo }}</span>
        <NButton size="small" tertiary @click="load">刷新</NButton>
      </div>
    </header>

    <!-- KPI row (4 cards) -->
    <section class="grid grid-cols-4 gap-4">
      <StatCard label="Pods 总数" :value="stats?.total_pods ?? '—'" hint="跨所有 namespace" :icon="Box" />
      <StatCard label="Running" :value="stats?.running ?? '—'" tone="success" :icon="CircleCheck" />
      <StatCard label="Failed" :value="stats?.failed ?? '—'" tone="danger" :icon="AlertOctagon" />
      <StatCard label="Pending" :value="stats?.pending ?? '—'" tone="warning" :icon="Activity" />
    </section>

    <!-- Secondary KPI row (4 cards) -->
    <section class="grid grid-cols-4 gap-4">
      <StatCard label="Nodes Ready" :value="`${stats?.nodes_ready ?? 0} / ${stats?.nodes_total ?? 0}`" :icon="Server" />
      <StatCard label="Namespaces" :value="stats?.namespaces_count ?? '—'" />
      <StatCard label="Warning Events" :value="stats?.warning_events ?? '—'" tone="warning" :icon="AlertTriangle" />
      <StatCard
        label="重启最多"
        :value="stats?.restart_top?.[0]?.restarts ?? 0"
        :hint="stats?.restart_top?.[0]?.pod ?? ''"
        :icon="CircleArrowUp"
      />
    </section>

    <!-- Two-column: phase distribution + alerts -->
    <section class="grid grid-cols-2 gap-5">
      <!-- Phase distribution -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">Pod 状态分布</h3>
          <span class="text-[12px] text-zinc-500 tabular-nums">{{ stats?.total_pods ?? 0 }} 总数</span>
        </div>
        <div class="card__body">
          <div v-if="loading" class="py-10 flex justify-center"><NSpin /></div>
          <div v-else class="space-y-3">
            <div v-for="p in phaseBars" :key="p.key">
              <div class="flex items-center justify-between text-[12px] text-zinc-400 mb-1.5">
                <span class="flex items-center gap-2">
                  <span class="status-dot" :style="{ background: p.color, boxShadow: `0 0 0 3px ${p.color}22` }" />
                  {{ p.label }}
                </span>
                <span class="text-zinc-100 tabular-nums">{{ stats?.[p.key as keyof DashboardStats] ?? 0 }}</span>
              </div>
              <div class="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div class="h-full transition-all duration-500 ease-out"
                     :style="{ width: `${ratio(p.key) * 100}%`, background: p.color }" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent alerts -->
      <div class="card">
        <div class="card__header">
          <h3 class="card__title">最近告警事件</h3>
          <NTag size="small" round type="warning">{{ warns.length }} 条</NTag>
        </div>
        <div class="card__body card__body--flush">
          <div v-if="loading" class="py-10 flex justify-center"><NSpin /></div>
          <div v-else-if="!warns.length" class="empty-state">
            <NIcon :component="CircleCheck" :size="36" class="empty-state__icon" color="#10b981" />
            <p class="text-zinc-300 text-[13px] font-medium">无告警 · 集群健康</p>
            <p class="text-zinc-500 text-[12px] mt-1">最近 1h 内未产生 Warning 事件</p>
          </div>
          <ul v-else class="divide-y divide-zinc-800/60">
            <li v-for="ev in warns" :key="ev.name + ev.namespace"
                class="px-5 py-3 flex items-start gap-3 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                @click="router.push({ name: 'pods', query: { search: ev.involved_name } })">
              <NTag size="small" type="warning" round>{{ ev.reason }}</NTag>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] text-zinc-100 truncate">
                  <span class="text-zinc-500">{{ ev.involved_kind }}/</span>{{ ev.involved_name }}
                </p>
                <p class="text-[12px] text-zinc-500 truncate mt-0.5">{{ ev.message }}</p>
              </div>
              <span class="text-[11px] text-zinc-500 tabular-nums shrink-0">{{ ev.count }}×</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Restart Top 10 -->
    <section class="card">
      <div class="card__header">
        <h3 class="card__title">重启 Top 10</h3>
        <span class="text-[12px] text-zinc-500">检测不稳定的容器</span>
      </div>
      <div class="card__body">
        <div v-if="!stats?.restart_top?.length" class="empty-state">
          <NIcon :component="CircleCheck" :size="36" class="empty-state__icon" color="#10b981" />
          <p class="text-zinc-300 text-[13px] font-medium">所有 Pod 都在稳定运行</p>
        </div>
        <ul v-else class="grid grid-cols-2 gap-x-10 gap-y-1">
          <li v-for="(r, i) in stats.restart_top" :key="r.pod"
              class="flex items-center gap-3 py-1.5 text-[13px] hover:bg-zinc-800/30 -mx-2 px-2 rounded transition-colors">
            <span class="text-zinc-600 w-6 text-right tabular-nums text-[12px]">{{ i + 1 }}</span>
            <code class="text-zinc-200 truncate flex-1 font-mono text-[12px]">{{ r.pod }}</code>
            <NTag size="small" round :type="r.restarts > 5 ? 'error' : 'warning'" class="!tabular-nums">
              {{ r.restarts }} 次
            </NTag>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
