<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NSpin, NButton, NTag } from 'naive-ui'
import StatCard from '@/components/common/StatCard.vue'
import PodStatusBadge from '@/components/common/PodStatusBadge.vue'
import { podsApi, eventsApi } from '@/api'
import { useClusterStore } from '@/stores/cluster'
import type { DashboardStats, EventInfo } from '@/types'

const router = useRouter()
const cluster = useClusterStore()

const stats = ref<DashboardStats | null>(null)
const warningEvents = ref<EventInfo[]>([])
const loading = ref(true)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  try {
    const [s, ev] = await Promise.all([
      podsApi.stats(cluster.activeCluster),
      eventsApi.list({ cluster: cluster.activeCluster, namespace: cluster.activeNamespace, limit: 50 }),
    ])
    stats.value = s
    warningEvents.value = ev.filter((e) => e.type === 'Warning').slice(0, 8)
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const phaseDistribution = [
  { key: 'running', label: 'Running', color: '#10b981' },
  { key: 'pending', label: 'Pending', color: '#f59e0b' },
  { key: 'failed', label: 'Failed', color: '#ef4444' },
  { key: 'succeeded', label: 'Succeeded', color: '#3b82f6' },
]

function ratio(key: string): number {
  if (!stats.value || !stats.value.total_pods) return 0
  return (stats.value[key as keyof DashboardStats] as number) / stats.value.total_pods
}
</script>

<template>
  <div class="p-8 space-y-8 max-w-[1440px] mx-auto">
    <header class="flex items-end justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">集群总览</h1>
        <p class="text-sm text-zinc-500 mt-1">实时反映当前集群的健康与负载 · 数据来自 K8s API Server</p>
      </div>
      <NButton size="small" quaternary @click="load">刷新</NButton>
    </header>

    <section>
      <p class="section-title mb-3">核心指标</p>
      <div class="grid grid-cols-4 gap-4">
        <StatCard label="Pods 总数" :value="stats?.total_pods ?? '—'" hint="跨所有 namespace" />
        <StatCard label="Running" :value="stats?.running ?? '—'" tone="success" />
        <StatCard label="Failed" :value="stats?.failed ?? '—'" tone="danger" />
        <StatCard label="Pending" :value="stats?.pending ?? '—'" tone="warning" />
        <StatCard label="Nodes Ready" :value="`${stats?.nodes_ready ?? 0} / ${stats?.nodes_total ?? 0}`" />
        <StatCard label="Namespaces" :value="stats?.namespaces_count ?? '—'" />
        <StatCard label="Warning Events" :value="stats?.warning_events ?? '—'" tone="warning" />
        <StatCard
          label="重启最多"
          :value="stats?.restart_top?.[0]?.restarts ?? 0"
          :hint="stats?.restart_top?.[0]?.pod ?? ''"
        />
      </div>
    </section>

    <section class="grid grid-cols-2 gap-6">
      <NCard title="Pod 状态分布" :bordered="false">
        <div v-if="loading" class="py-12 flex justify-center"><NSpin /></div>
        <div v-else class="space-y-3">
          <div v-for="p in phaseDistribution" :key="p.key">
            <div class="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>{{ p.label }}</span>
              <span class="text-zinc-200">{{ stats?.[p.key as keyof DashboardStats] ?? 0 }}</span>
            </div>
            <div class="h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <div
                class="h-full transition-all duration-500"
                :style="{ width: `${ratio(p.key) * 100}%`, background: p.color }"
              />
            </div>
          </div>
        </div>
      </NCard>

      <NCard title="最近告警事件" :bordered="false">
        <div v-if="loading" class="py-12 flex justify-center"><NSpin /></div>
        <div v-else-if="!warningEvents.length" class="py-12 text-center text-sm text-zinc-500">无告警，集群健康</div>
        <ul v-else class="divide-y divide-zinc-800/60">
          <li
            v-for="ev in warningEvents"
            :key="ev.name + ev.namespace"
            class="py-3 flex items-start gap-3 cursor-pointer hover:bg-surface-2 -mx-3 px-3 rounded transition-colors"
            @click="router.push({ name: 'pods', query: { search: ev.involved_name } })"
          >
            <NTag size="small" type="warning" round>{{ ev.reason }}</NTag>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-zinc-100 truncate">{{ ev.involved_kind }}/{{ ev.involved_name }}</p>
              <p class="text-xs text-zinc-500 truncate">{{ ev.message }}</p>
            </div>
            <span class="text-xs text-zinc-500 whitespace-nowrap">{{ ev.count }}×</span>
          </li>
        </ul>
      </NCard>
    </section>

    <section>
      <NCard title="重启 Top 10" :bordered="false">
        <div v-if="!stats?.restart_top?.length" class="py-8 text-center text-sm text-zinc-500">所有 Pod 都在稳定运行</div>
        <ul v-else class="grid grid-cols-2 gap-x-8 gap-y-1">
          <li
            v-for="(r, i) in stats.restart_top"
            :key="r.pod"
            class="flex items-center gap-3 py-1.5 text-sm"
          >
            <span class="text-zinc-600 w-6 text-right tabular-nums">{{ i + 1 }}</span>
            <code class="text-zinc-300 truncate flex-1 font-mono text-xs">{{ r.pod }}</code>
            <NTag size="small" :type="r.restarts > 5 ? 'error' : 'warning'" round>{{ r.restarts }} 次</NTag>
          </li>
        </ul>
      </NCard>
    </section>
  </div>
</template>
