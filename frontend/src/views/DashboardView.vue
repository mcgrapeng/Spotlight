<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { AlertTriangle, CircleCheck, AlertCircle } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { podsApi, eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { DashboardStats, EventInfo } from '@/domain/types'

const router = useRouter()
const cluster = useClusterStore()
const stats = ref<DashboardStats | null>(null)
const warns = ref<EventInfo[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)
const lastRefreshed = ref<Date | null>(null)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  errorMsg.value = null
  try {
    const [s, ev] = await Promise.all([
      podsApi.stats(cluster.activeCluster),
      eventsApi.list({ cluster: cluster.activeCluster, namespace: cluster.activeNamespace, limit: 50 }),
    ])
    stats.value = s
    warns.value = ev.filter((e) => e.type === 'Warning').slice(0, 8)
    lastRefreshed.value = new Date()
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally { loading.value = false }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const phaseBars = [
  { key: 'running',   label: 'Running',   color: '#22c55e' },
  { key: 'pending',   label: 'Pending',   color: '#f59e0b' },
  { key: 'failed',    label: 'Failed',    color: '#f43f5e' },
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

const hasCriticalAlert = computed(() =>
  stats.value?.restart_top?.[0]?.restarts ? stats.value.restart_top[0].restarts >= 100 : false,
)

const topRestart = computed(() => stats.value?.restart_top?.[0])

const refreshedAgo = computed(() => {
  if (!lastRefreshed.value) return ''
  const sec = Math.floor((Date.now() - lastRefreshed.value.getTime()) / 1000)
  if (sec < 5) return '刚刚'
  if (sec < 60) return `${sec} 秒前`
  return `${Math.floor(sec / 60)} 分钟前`
})

function goRestartTop() {
  if (!topRestart.value) return
  const [ns, name] = topRestart.value.pod.split('/')
  router.push({ name: 'pod-detail', params: { namespace: ns, name } })
}
</script>

<template>
  <div class="page space-y-5">
    <PageHeader title="总览" :subtitle="cluster.currentCluster?.name ?? '—'">
      <template #actions>
        <span v-if="refreshedAgo" class="text-[11px] text-zinc-500 tabular-nums mr-1">{{ refreshedAgo }}</span>
        <button class="btn-secondary" @click="load" :disabled="loading" aria-label="刷新总览">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="loading ? 'animate-spin' : ''" aria-hidden="true">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          刷新
        </button>
      </template>
    </PageHeader>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />

    <!-- CRITICAL ALERT (when restart count is insane) -->
    <button
      v-if="!loading && hasCriticalAlert && topRestart"
      class="alert-critical w-full text-left transition-transform hover:translate-x-0.5"
      @click="goRestartTop"
    >
      <div class="flex items-center justify-center w-10 h-10 rounded-md bg-red-500/15 border border-red-500/30 shrink-0">
        <NIcon :component="AlertCircle" :size="18" color="#fb7185" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[11.5px] uppercase tracking-wider text-red-300 font-semibold">需要立即处理</p>
        <p class="text-[14px] text-zinc-100 font-medium mt-0.5 truncate">
          <code class="font-mono text-red-300">{{ topRestart.pod }}</code>
          累计重启 <span class="font-mono text-red-300 font-semibold">{{ topRestart.restarts.toLocaleString() }}</span> 次
        </p>
      </div>
      <span class="chip chip--err shrink-0">CRITICAL</span>
    </button>

    <!-- Health hero -->
    <section class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
        <div class="px-6 py-5">
          <p class="section-title">集群健康度</p>
          <div class="flex items-baseline gap-3 mt-2">
            <p
              :class="[
                'text-[36px] font-semibold leading-none tabular-nums tracking-tight',
                healthScore >= 90 ? 'text-emerald-400' :
                healthScore >= 70 ? 'text-amber-400' : 'text-red-400'
              ]"
              aria-live="polite"
            >{{ loading ? '—' : `${healthScore}%` }}</p>
            <span class="text-[12px] text-zinc-500">运行中 Pod 比例</span>
          </div>
          <div class="mt-3 h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              class="h-full transition-all duration-300 ease-out"
              :class="healthScore >= 90 ? 'bg-emerald-500' : healthScore >= 70 ? 'bg-amber-500' : 'bg-red-500'"
              :style="{ width: `${healthScore}%` }"
              role="progressbar"
              :aria-valuenow="healthScore" aria-valuemin="0" aria-valuemax="100"
            />
          </div>
        </div>
        <div class="px-6 py-5">
          <p class="section-title">工作负载</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-[36px] font-semibold leading-none tabular-nums tracking-tight text-zinc-100">
              {{ loading ? '—' : stats?.total_pods }}
            </p>
            <span class="text-[12px] text-zinc-500">Pods 总数</span>
          </div>
          <p class="mt-3 text-[12px] text-zinc-400">
            <span class="text-zinc-500">Node Ready </span>
            <span class="font-mono text-zinc-200 tabular-nums">{{ stats?.nodes_ready ?? '—' }}</span>
            <span class="text-zinc-600"> / </span>
            <span class="font-mono text-zinc-200 tabular-nums">{{ stats?.nodes_total ?? '—' }}</span>
          </p>
        </div>
        <div class="px-6 py-5">
          <p class="section-title">最近告警</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p
              :class="[
                'text-[36px] font-semibold leading-none tabular-nums tracking-tight',
                (stats?.warning_events ?? 0) > 0 ? 'text-amber-400' : 'text-zinc-500'
              ]"
              aria-live="polite"
            >{{ loading ? '—' : stats?.warning_events ?? 0 }}</p>
            <span class="text-[12px] text-zinc-500">Warning Events</span>
          </div>
          <p class="mt-3 text-[12px] text-zinc-400">
            <span class="text-zinc-500">Namespace </span>
            <code class="font-mono text-zinc-200">{{ cluster.activeNamespace }}</code>
          </p>
        </div>
      </div>
    </section>

    <!-- KPI grid (2 rows × 4 cols, semantic tones) -->
    <section class="card">
      <div class="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between">
        <p class="section-title">Pod 状态</p>
        <p class="text-[11px] text-zinc-500 tabular-nums">{{ stats?.total_pods ?? '—' }} 总数</p>
      </div>
      <div class="grid grid-cols-4 divide-x divide-zinc-800/60">
        <div class="px-5 py-4">
          <div class="flex items-center gap-2">
            <span class="status-dot status-dot--running" aria-hidden="true" />
            <p class="section-title">Running</p>
          </div>
          <p class="mt-1.5 text-[24px] font-semibold leading-none tabular-nums text-emerald-400">
            {{ loading ? '—' : stats?.running ?? 0 }}
          </p>
        </div>
        <div class="px-5 py-4">
          <div class="flex items-center gap-2">
            <span class="status-dot status-dot--failed" aria-hidden="true" />
            <p class="section-title">Failed</p>
          </div>
          <p :class="['mt-1.5 text-[24px] font-semibold leading-none tabular-nums', (stats?.failed ?? 0) > 0 ? 'text-red-400' : 'text-zinc-500']">
            {{ loading ? '—' : stats?.failed ?? 0 }}
          </p>
        </div>
        <div class="px-5 py-4">
          <div class="flex items-center gap-2">
            <span class="status-dot status-dot--pending" aria-hidden="true" />
            <p class="section-title">Pending</p>
          </div>
          <p :class="['mt-1.5 text-[24px] font-semibold leading-none tabular-nums', (stats?.pending ?? 0) > 0 ? 'text-amber-400' : 'text-zinc-500']">
            {{ loading ? '—' : stats?.pending ?? 0 }}
          </p>
        </div>
        <div class="px-5 py-4">
          <div class="flex items-center gap-2">
            <span class="status-dot status-dot--succeeded" aria-hidden="true" />
            <p class="section-title">Succeeded</p>
          </div>
          <p class="mt-1.5 text-[24px] font-semibold leading-none tabular-nums text-sky-400">
            {{ loading ? '—' : stats?.succeeded ?? 0 }}
          </p>
        </div>
      </div>
      <div class="px-5 py-3 border-t border-zinc-800/60 space-y-2">
        <div v-for="p in phaseBars" :key="p.key">
          <div class="flex items-center justify-between text-[12px] mb-1">
            <span class="flex items-center gap-2">
              <span class="status-dot" :style="{ background: p.color }" aria-hidden="true" />
              <span class="text-zinc-300">{{ p.label }}</span>
            </span>
            <span class="text-zinc-500 tabular-nums">{{ stats?.[p.key as keyof DashboardStats] ?? 0 }}</span>
          </div>
          <div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden" role="progressbar"
               :aria-valuenow="ratio(p.key) * 100" aria-valuemin="0" aria-valuemax="100"
               :aria-label="`${p.label} ${Math.round(ratio(p.key) * 100)}%`">
            <div class="h-full transition-all duration-300 ease-out" :style="{ width: `${ratio(p.key) * 100}%`, background: p.color }" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom row: alerts + restart leaderboard -->
    <section class="responsive-2 grid grid-cols-2 gap-4">
      <SectionCard title="最近告警事件" :count="warns.length" flush>
        <LoadingState v-if="loading" variant="skeleton" :rows="5" height="240px" />
        <EmptyState
          v-else-if="!warns.length"
          :icon="CircleCheck"
          tone="success"
          title="无告警 · 集群健康"
          description="最近 1h 内未产生 Warning 事件"
        />
        <ul v-else class="divide-y divide-zinc-800/60">
          <li v-for="ev in warns" :key="ev.name + ev.namespace"
              class="px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:bg-zinc-800/40 transition-colors focus-visible:bg-zinc-800/40 focus-visible:outline-none"
              tabindex="0" role="link"
              :aria-label="`查看 ${ev.involved_kind} ${ev.involved_name} 的告警事件`"
              @click="router.push({ name: 'pods', query: { search: ev.involved_name } })"
              @keydown.enter="router.push({ name: 'pods', query: { search: ev.involved_name } })">
            <span class="chip chip--warn shrink-0">{{ ev.reason }}</span>
            <span class="text-[12.5px] text-zinc-300 truncate flex-1 font-mono">
              <span class="text-zinc-500">{{ ev.involved_kind }}/</span>{{ ev.involved_name }}
            </span>
            <span class="text-[11px] text-zinc-500 tabular-nums shrink-0">{{ ev.count }}×</span>
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="重启 Top 10" flush>
        <LoadingState v-if="loading" variant="skeleton" :rows="6" height="240px" />
        <EmptyState
          v-else-if="!stats?.restart_top?.length"
          :icon="CircleCheck"
          tone="success"
          title="所有 Pod 都在稳定运行"
        />
        <ul v-else class="divide-y divide-zinc-800/60">
          <li v-for="(r, i) in stats.restart_top" :key="r.pod"
              class="px-4 py-2 flex items-center gap-3 hover:bg-zinc-800/40 cursor-pointer transition-colors"
              tabindex="0" role="link"
              :aria-label="`查看 ${r.pod} 重启 ${r.restarts} 次`"
              @click="router.push({ name: 'pod-detail', params: { namespace: r.pod.split('/')[0], name: r.pod.split('/')[1] } })"
              @keydown.enter="router.push({ name: 'pod-detail', params: { namespace: r.pod.split('/')[0], name: r.pod.split('/')[1] } })">
            <span class="text-[11px] text-zinc-600 w-5 text-right tabular-nums">{{ i + 1 }}</span>
            <code class="text-[12px] text-zinc-200 truncate flex-1 font-mono">{{ r.pod }}</code>
            <span :class="[
              'text-[12px] tabular-nums font-semibold',
              r.restarts > 100 ? 'text-red-400' : r.restarts > 5 ? 'text-amber-400' : 'text-zinc-400'
            ]">
              {{ r.restarts.toLocaleString() }}
            </span>
          </li>
        </ul>
      </SectionCard>
    </section>
  </div>
</template>
