<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Server, Cpu, Stack } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { nodesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { NodeInfo } from '@/domain/types'

const cluster = useClusterStore()
const nodes = ref<NodeInfo[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  errorMsg.value = null
  try { nodes.value = await nodesApi.list(cluster.activeCluster) }
  catch (e: any) { errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败' }
  finally { loading.value = false }
}
onMounted(load)
watch(() => cluster.activeCluster, load)

const ready = computed(() => nodes.value.filter((n) => n.status === 'Ready').length)
const notReady = computed(() => nodes.value.length - ready.value)
const subtitle = computed(() => {
  const total = nodes.value.length
  if (total === 0) return '尚无节点'
  const pct = Math.round((ready.value / total) * 100)
  return `${total} 个节点 · ${ready.value} Ready · ${pct}% 在线`
})

function parseNum(s: string): number { return parseFloat(s) || 0 }
function parseMem(s: string): number { return parseFloat(s.replace(/[^0-9.]/g, '')) || 0 }

function cpuUsedPct(n: NodeInfo): number {
  const cap = parseNum(n.cpu_capacity)
  if (!cap) return 0
  return Math.min(100, Math.round(((cap - parseNum(n.cpu_allocatable)) / cap) * 100))
}
function memUsedPct(n: NodeInfo): number {
  const cap = parseMem(n.memory_capacity)
  if (!cap) return 0
  return Math.min(100, Math.round(((cap - parseMem(n.memory_allocatable)) / cap) * 100))
}
</script>

<template>
  <div class="page space-y-5">
    <PageHeader title="Nodes" :subtitle="subtitle" />

    <!-- Summary KPI row -->
    <section v-if="!loading && nodes.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card px-5 py-4">
        <p class="section-title">节点总数</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-zinc-100">{{ nodes.length }}</p>
      </div>
      <div class="card px-5 py-4">
        <p class="section-title flex items-center gap-1.5">
          <span class="status-dot status-dot--ready" aria-hidden="true"></span>
          Ready
        </p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-emerald-400">{{ ready }}</p>
      </div>
      <div class="card px-5 py-4">
        <p class="section-title flex items-center gap-1.5">
          <span class="status-dot status-dot--failed" aria-hidden="true"></span>
          NotReady
        </p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums" :class="notReady ? 'text-red-400' : 'text-zinc-500'">{{ notReady }}</p>
      </div>
      <div class="card px-5 py-4">
        <p class="section-title">Pod 总数</p>
        <p class="mt-2 text-[28px] font-semibold leading-none tabular-nums text-zinc-100">{{ nodes.reduce((n, x) => n + x.pod_count, 0) }}</p>
      </div>
    </section>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />

    <!-- Node cards grid -->
    <section v-else-if="!loading && nodes.length" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <article
        v-for="n in nodes"
        :key="n.name"
        class="card p-5 transition-colors hover:border-zinc-700"
        :class="n.status === 'Ready' ? '' : 'border-amber-500/40'"
        :aria-label="`Node ${n.name}`"
      >
        <header class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span
                :class="['w-2 h-2 rounded-full shrink-0',
                  n.status === 'Ready' ? 'bg-emerald-500' : 'bg-red-500']"
                aria-hidden="true"
              />
              <h3 class="text-[14px] font-semibold text-zinc-100 font-mono truncate">{{ n.name }}</h3>
            </div>
            <p class="mt-1 text-[11px] text-zinc-500 font-mono truncate">v{{ n.kubelet_version }}</p>
          </div>
          <span :class="['chip', n.status === 'Ready' ? 'chip--ok' : 'chip--err']">{{ n.status }}</span>
        </header>

        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="role in n.roles"
            :key="role"
            :class="['chip', role === 'control-plane' ? 'chip--warn' : 'chip--info']"
          >{{ role }}</span>
        </div>

        <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
          <div>
            <dt class="section-title">Pods</dt>
            <dd class="mt-1 text-[20px] font-semibold tabular-nums text-zinc-100">{{ n.pod_count }}</dd>
          </div>
          <div>
            <dt class="section-title">Age</dt>
            <dd class="mt-1 text-[14px] tabular-nums text-zinc-300">{{ n.age ?? '—' }}</dd>
          </div>
        </dl>

        <!-- CPU bar -->
        <div class="mt-4">
          <div class="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
            <span class="flex items-center gap-1.5">
              <span class="text-zinc-400">CPU</span>
              <span class="font-mono tabular-nums">{{ n.cpu_allocatable }}</span>
              <span class="text-zinc-600">/</span>
              <span class="font-mono tabular-nums">{{ n.cpu_capacity }}</span>
            </span>
            <span class="font-mono tabular-nums" :class="cpuUsedPct(n) > 80 ? 'text-amber-400' : 'text-zinc-400'">{{ cpuUsedPct(n) }}% 已用</span>
          </div>
          <div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden" :aria-label="`CPU ${cpuUsedPct(n)}%`">
            <div
              class="h-full transition-all duration-300"
              :style="{ width: `${cpuUsedPct(n)}%`, background: cpuUsedPct(n) > 80 ? 'var(--warn)' : 'var(--ok)' }"
            ></div>
          </div>
        </div>

        <!-- Memory bar -->
        <div class="mt-3">
          <div class="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
            <span class="flex items-center gap-1.5">
              <span class="text-zinc-400">内存</span>
              <span class="font-mono tabular-nums">{{ n.memory_allocatable }}</span>
              <span class="text-zinc-600">/</span>
              <span class="font-mono tabular-nums">{{ n.memory_capacity }}</span>
            </span>
            <span class="font-mono tabular-nums" :class="memUsedPct(n) > 80 ? 'text-amber-400' : 'text-zinc-400'">{{ memUsedPct(n) }}% 已用</span>
          </div>
          <div class="h-1.5 rounded-full bg-zinc-800 overflow-hidden" :aria-label="`内存 ${memUsedPct(n)}%`">
            <div
              class="h-full transition-all duration-300"
              :style="{ width: `${memUsedPct(n)}%`, background: memUsedPct(n) > 80 ? 'var(--warn)' : 'var(--info)' }"
            ></div>
          </div>
        </div>
      </article>
    </section>

    <LoadingState v-else-if="loading" variant="skeleton" :rows="3" height="160px" />
    <EmptyState v-else :icon="Server" title="没有节点" description="当前集群尚未注册任何 Node" />
  </div>
</template>