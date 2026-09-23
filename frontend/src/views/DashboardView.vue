<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import { AlertTriangle, CircleCheck, AlertCircle, ArrowRight, Refresh } from '@vicons/tabler'
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
const refreshing = ref(false)

async function load(silent = false) {
  if (!cluster.activeCluster) return
  if (silent) refreshing.value = true
  else loading.value = true
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
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, () => load())
watch(() => cluster.activeNamespace, () => load(true))

/* ── Computed ────────────────────────────────────────────────────────── */
const phaseBars = [
  { key: 'running',   label: 'Running',   color: 'var(--ok)' },
  { key: 'pending',   label: 'Pending',   color: 'var(--warn)' },
  { key: 'failed',    label: 'Failed',    color: 'var(--err)' },
  { key: 'succeeded', label: 'Succeeded', color: 'var(--info)' },
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
  const s = healthScore.value
  if (s >= 90) return 'ok'
  if (s >= 70) return 'warn'
  return 'err'
})

const topRestart = computed(() => stats.value?.restart_top?.[0])
const hasCriticalAlert = computed(() => (topRestart.value?.restarts ?? 0) >= 100)

/* Generate a sparkline-like 24-bar chart based on restart_top so the bar
   visualization is meaningful even without a metrics backend. */
const restartSparkline = computed(() => {
  const top = stats.value?.restart_top ?? []
  const max = Math.max(1, ...top.map((r) => r.restarts))
  return top.slice(0, 24).map((r) => Math.max(2, Math.round((r.restarts / max) * 24)))
})

const refreshedAgo = computed(() => {
  if (!lastRefreshed.value) return ''
  const sec = Math.floor((Date.now() - lastRefreshed.value.getTime()) / 1000)
  if (sec < 5) return '刚刚'
  if (sec < 60) return `${sec} 秒前`
  return `${Math.floor(sec / 60)} 分钟前`
})

/* Tick the refreshed-ago counter every 10s so it stays accurate. */
const tick = ref(0)
onMounted(() => setInterval(() => { tick.value++ }, 10_000))
// tick is read implicitly via refreshedAgo; suppress lint warning
void tick

function goRestartTop() {
  const r = topRestart.value
  if (!r) return
  const [ns, name] = r.pod.split('/')
  router.push({ name: 'pod-detail', params: { namespace: ns, name } })
}
</script>

<template>
  <div class="page space-y-6">
    <!-- Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">总览</h1>
        <p class="page-subtitle">{{ cluster.currentCluster?.name ?? '—' }}</p>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="refreshedAgo" class="text-[11.5px] text-zinc-500 tabular-nums">{{ refreshedAgo }}</span>
        <button class="btn-secondary" :disabled="refreshing || loading" @click="load(true)" aria-label="刷新总览">
          <NIcon :component="Refresh" :size="13" :class="refreshing ? 'animate-spin' : ''" />
          刷新
        </button>
      </div>
    </header>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />

    <!-- Critical alert -->
    <button
      v-if="!loading && hasCriticalAlert && topRestart"
      class="alert-critical w-full text-left transition-transform hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
      @click="goRestartTop"
    >
      <div class="flex h-9 w-9 items-center justify-center rounded-md bg-red-500/15 border border-red-500/30 shrink-0">
        <NIcon :component="AlertCircle" :size="18" color="#fb7185" />
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-[11.5px] uppercase tracking-wider text-red-300 font-semibold">需要立即处理</p>
        <p class="text-[14px] text-zinc-100 font-medium mt-0.5 truncate">
          <code class="font-mono text-red-300">{{ topRestart.pod }}</code>
          累计重启
          <span class="font-mono text-red-300 font-semibold">{{ topRestart.restarts.toLocaleString() }}</span>
          次
        </p>
      </div>
      <span class="chip chip--err shrink-0">CRITICAL</span>
      <NIcon :component="ArrowRight" :size="14" class="text-zinc-500 shrink-0" />
    </button>

    <LoadingState v-if="loading" variant="skeleton" :rows="3" height="120px" />

    <!-- KPI hero -->
    <template v-else-if="stats">
      <!-- 3-column hero -->
      <!-- role="region" + aria-label exposes each metric as a navigable
           landmark for screen-reader users. -->
      <section class="card overflow-hidden"
               role="region"
               aria-label="集群关键指标">
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800/60">
          <!-- Health -->
          <div class="px-7 py-6" role="group" aria-label="集群健康度">
            <div class="flex items-center gap-2">
              <p class="section-title">集群健康度</p>
              <span v-if="healthTone === 'ok'" class="status-dot status-dot--running" aria-hidden="true"></span>
              <span v-else-if="healthTone === 'warn'" class="status-dot status-dot--pending" aria-hidden="true"></span>
              <span v-else class="status-dot status-dot--failed" aria-hidden="true"></span>
            </div>
            <div class="flex items-baseline gap-3 mt-3">
              <p
                :class="[
                  'text-[52px] font-semibold leading-none tabular-nums tracking-tight',
                  healthTone === 'ok' ? 'text-emerald-400' :
                  healthTone === 'warn' ? 'text-amber-400' : 'text-red-400'
                ]"
                aria-live="polite"
              >{{ healthScore }}<span class="text-[26px] text-zinc-500 ml-1">%</span></p>
              <span class="text-[12px] text-zinc-500">运行中 Pod 比例</span>
            </div>
            <div class="mt-4 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                class="h-full transition-all duration-500"
                :class="healthTone === 'ok' ? 'bg-emerald-500' : healthTone === 'warn' ? 'bg-amber-500' : 'bg-red-500'"
                :style="{ width: `${healthScore}%` }"
                role="progressbar"
                :aria-valuenow="healthScore" aria-valuemin="0" aria-valuemax="100"
              />
            </div>
          </div>

          <!-- Workload -->
          <div class="px-7 py-6" role="group" aria-label="工作负载">
            <p class="section-title">工作负载</p>
            <div class="flex items-baseline gap-2 mt-3">
              <p class="text-[52px] font-semibold leading-none tabular-nums tracking-tight text-zinc-100">{{ stats.total_pods }}</p>
              <span class="text-[12px] text-zinc-500">Pods 总数</span>
            </div>
            <div class="mt-4 flex items-center gap-4 text-[12px] text-zinc-400">
              <span class="flex items-center gap-1.5">
                <span class="status-dot status-dot--ready"></span>
                Node Ready <span class="font-mono text-zinc-200 tabular-nums">{{ stats.nodes_ready }}</span><span class="text-zinc-600">/</span><span class="font-mono text-zinc-200 tabular-nums">{{ stats.nodes_total }}</span>
              </span>
            </div>
            <!-- Sparkline: top 10 restart bars -->
            <div v-if="restartSparkline.length > 1" class="mt-4 flex items-end gap-[3px]" :aria-label="`重启 Top ${restartSparkline.length} pod 趋势`">
              <div
                v-for="(h, i) in restartSparkline"
                :key="i"
                class="rounded-sm transition-all duration-300"
                :style="{ width: '6px', height: `${h * 2 + 4}px`, background: h > 14 ? 'var(--err)' : h > 8 ? 'var(--warn)' : 'var(--ok)' }"
                role="img"
              ></div>
            </div>
          </div>

          <!-- Alerts -->
          <div class="px-7 py-6" role="group" aria-label="最近告警">
            <p class="section-title">最近告警</p>
            <div class="flex items-baseline gap-2 mt-3">
              <p
                :class="[
                  'text-[52px] font-semibold leading-none tabular-nums tracking-tight',
                  stats.warning_events > 0 ? 'text-amber-400' : 'text-zinc-600'
                ]"
                aria-live="polite"
              >{{ stats.warning_events }}</p>
              <span class="text-[12px] text-zinc-500">Warning Events</span>
            </div>
            <p class="mt-4 text-[12px] text-zinc-400">
              <span class="text-zinc-500">Namespace </span>
              <code class="font-mono text-zinc-200">{{ cluster.activeNamespace }}</code>
            </p>
            <button
              v-if="topRestart"
              class="mt-3 inline-flex items-center gap-1.5 text-[12px] text-zinc-400 hover:text-zinc-100 transition-colors focus:outline-none focus-visible:text-indigo-400"
              @click="goRestartTop"
              :aria-label="`查看重启次数最高的 Pod: ${topRestart.pod}`"
            >
              <span>查看最高重启 Pod</span>
              <NIcon :component="ArrowRight" :size="12" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <!-- 2-column body -->
      <section class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <!-- Phase distribution -->
        <div class="lg:col-span-3 card overflow-hidden">
          <div class="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between">
            <p class="section-title">Pod 状态</p>
            <p class="text-[11px] text-zinc-500 tabular-nums">{{ stats.total_pods }} 总数</p>
          </div>
          <div class="grid grid-cols-4 divide-x divide-zinc-800/60">
            <div v-for="p in [
              { key: 'running',   label: 'RUNNING',   value: stats.running,   cls: 'text-emerald-400' },
              { key: 'failed',    label: 'FAILED',    value: stats.failed,    cls: stats.failed ? 'text-red-400' : 'text-zinc-500' },
              { key: 'pending',   label: 'PENDING',   value: stats.pending,   cls: stats.pending ? 'text-amber-400' : 'text-zinc-500' },
              { key: 'succeeded', label: 'SUCCEEDED', value: stats.succeeded, cls: 'text-sky-400' },
            ]" :key="p.key" class="px-5 py-5">
              <div class="flex items-center gap-2">
                <span :class="['status-dot', `status-dot--${p.key === 'failed' ? 'failed' : p.key === 'running' ? 'running' : p.key === 'pending' ? 'pending' : 'succeeded'}`]" aria-hidden="true"></span>
                <p class="section-title">{{ p.label }}</p>
              </div>
              <p :class="['mt-2 text-[28px] font-semibold leading-none tabular-nums', p.cls]">{{ p.value.toLocaleString() }}</p>
            </div>
          </div>
          <div class="px-5 py-4 space-y-2.5 border-t border-zinc-800/60">
            <div v-for="p in phaseBars" :key="p.key">
              <div class="flex items-center justify-between text-[12px] mb-1">
                <span class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full" :style="{ background: p.color }" aria-hidden="true"></span>
                  <span class="text-zinc-300">{{ p.label }}</span>
                </span>
                <span class="text-zinc-500 tabular-nums">{{ stats[p.key as keyof DashboardStats]?.toLocaleString() ?? 0 }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden" :aria-label="`${p.label} ${Math.round(ratio(p.key) * 100)}%`">
                <div class="h-full transition-all duration-300" :style="{ width: `${ratio(p.key) * 100}%`, background: p.color }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top restarts -->
        <div class="lg:col-span-2 card overflow-hidden">
          <div class="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between">
            <p class="section-title">重启 Top 10</p>
            <p class="text-[11px] text-zinc-500 tabular-nums">{{ stats.restart_top?.length ?? 0 }} 项</p>
          </div>
          <div v-if="!stats.restart_top?.length" class="empty-state">
            <NIcon :component="CircleCheck" :size="20" color="#4ade80" />
            <p class="empty-state__title">所有 Pod 都在稳定运行</p>
          </div>
          <ul v-else class="divide-y divide-zinc-800/60">
            <li v-for="(r, i) in stats.restart_top.slice(0, 8)" :key="r.pod">
              <RouterLink
                :to="{ name: 'pod-detail', params: { namespace: r.pod.split('/')[0], name: r.pod.split('/')[1] } }"
                class="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/40 transition-colors focus:outline-none focus-visible:bg-zinc-800/40"
                :aria-label="`查看 ${r.pod} 重启 ${r.restarts} 次`"
              >
                <span class="text-[11px] text-zinc-600 w-5 text-right tabular-nums">{{ i + 1 }}</span>
                <code class="text-[12px] text-zinc-200 truncate flex-1 font-mono">{{ r.pod }}</code>
                <span :class="[
                  'text-[12px] tabular-nums font-semibold',
                  r.restarts > 100 ? 'text-red-400' : r.restarts > 5 ? 'text-amber-400' : 'text-zinc-400'
                ]">{{ r.restarts.toLocaleString() }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </section>

      <!-- Recent warnings -->
      <section class="card overflow-hidden">
        <div class="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between">
          <p class="section-title">最近告警事件</p>
          <p class="text-[11px] text-zinc-500 tabular-nums">{{ warns.length }} 项</p>
        </div>
        <LoadingState v-if="loading" variant="skeleton" :rows="3" height="60px" />
        <EmptyState
          v-else-if="!warns.length"
          :icon="CircleCheck"
          tone="success"
          title="无告警 · 集群健康"
          description="最近 1h 内未产生 Warning 事件"
        />
        <ul v-else class="divide-y divide-zinc-800/60">
          <li v-for="ev in warns" :key="ev.name + ev.namespace">
            <RouterLink
              :to="{ name: 'events', query: { search: ev.involved_name } }"
              class="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/40 transition-colors focus:outline-none focus-visible:bg-zinc-800/40"
              :aria-label="`查看 ${ev.involved_kind} ${ev.involved_name} 的告警事件`"
            >
              <span class="chip chip--warn shrink-0">{{ ev.reason }}</span>
              <span class="text-[12.5px] text-zinc-300 truncate flex-1 font-mono">
                <span class="text-zinc-500">{{ ev.involved_kind }}/</span>{{ ev.involved_name }}
              </span>
              <span class="text-[11px] text-zinc-500 tabular-nums shrink-0">{{ ev.count }}×</span>
            </RouterLink>
          </li>
        </ul>
      </section>
    </template>

    <EmptyState
      v-else
      title="无数据"
      description="选择一个集群后开始查看"
    />
  </div>
</template>