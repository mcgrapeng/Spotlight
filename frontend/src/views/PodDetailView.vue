<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NTabs, NTabPane, NTag, NSpace, NSpin, NDataTable, NEmpty,
  NButton, NIcon, useMessage,
} from 'naive-ui'
import {
  ArrowLeft, Star, Sparkles, Clock, Cpu, Network, Box, AlertCircle,
} from '@vicons/tabler'
import PodStatusBadge from '@/components/resources/PodStatusBadge.vue'
import LogViewer from '@/components/log/LogViewer.vue'
import LogAnalyzerDrawer from '@/components/ai/LogAnalyzerDrawer.vue'
import { podsApi, eventsApi, favoritesApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import type { EventInfo, LogLine, PodInfo } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const msg = useMessage()
const cluster = useClusterStore()

const namespace = ref(route.params.namespace as string)
const name = ref(route.params.name as string)
const pod = ref<PodInfo | null>(null)
const events = ref<EventInfo[]>([])
const loading = ref(true)
const tab = ref<'logs' | 'events'>('logs')
const lines = ref<LogLine[]>([])
const analyzerOpen = ref(false)

async function load() {
  loading.value = true
  try {
    const [p, ev] = await Promise.all([
      podsApi.get(cluster.activeCluster, namespace.value, name.value),
      eventsApi.list({
        cluster: cluster.activeCluster, namespace: namespace.value,
        involved: name.value, limit: 100,
      }),
    ])
    pod.value = p
    events.value = ev
  } finally { loading.value = false }
}

onMounted(load)
watch(() => route.fullPath, load)

async function addFavorite() {
  if (!pod.value) return
  try {
    await favoritesApi.add({
      resource_type: 'pod', name: pod.value.name, namespace: pod.value.namespace,
      cluster: cluster.activeCluster || '', note: '',
    })
    msg.success('已加入收藏')
  } catch { msg.error('收藏失败') }
}
</script>

<template>
  <div class="page space-y-6">
    <!-- Page header (breadcrumb-style) -->
    <header>
      <button
        class="flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors mb-3"
        @click="router.back()"
      >
        <NIcon :component="ArrowLeft" :size="13" />
        <span>返回 Pod 列表</span>
      </button>

      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-3 flex-wrap">
            <h1 class="page-title font-mono !text-[20px] truncate max-w-[640px]">{{ name }}</h1>
            <PodStatusBadge v-if="pod" :phase="pod.phase" />
            <NTag v-if="pod?.owner_kind" size="small" round type="info" class="!font-mono">
              {{ pod.owner_kind }}/{{ pod.owner_name }}
            </NTag>
          </div>
          <p class="page-subtitle font-mono">
            namespace · {{ namespace }}
            <template v-if="pod?.created_at">· 创建于 {{ new Date(pod.created_at).toLocaleString('zh-CN') }}</template>
          </p>
        </div>
        <NSpace>
          <NButton secondary size="small" @click="analyzerOpen = true">
            <template #icon><NIcon :component="Sparkles" :size="14" /></template>
            AI 分析
          </NButton>
          <NButton secondary size="small" @click="addFavorite">
            <template #icon><NIcon :component="Star" :size="14" /></template>
            收藏
          </NButton>
        </NSpace>
      </div>
    </header>

    <div v-if="loading" class="py-24 flex justify-center"><NSpin size="large" /></div>
    <template v-else-if="pod">
      <!-- Pod metadata strip (4 KPI cards) -->
      <section class="grid grid-cols-4 gap-3">
        <div class="card !shadow-none">
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
              <NIcon :component="Network" :size="14" class="text-zinc-400" />
            </div>
            <div class="min-w-0">
              <p class="section-title">Node</p>
              <p class="text-[13px] font-mono text-zinc-100 truncate">{{ pod.node || '—' }}</p>
            </div>
          </div>
        </div>
        <div class="card !shadow-none">
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
              <NIcon :component="Box" :size="14" class="text-zinc-400" />
            </div>
            <div class="min-w-0">
              <p class="section-title">Pod IP</p>
              <p class="text-[13px] font-mono text-zinc-100 truncate">{{ pod.pod_ip || '—' }}</p>
            </div>
          </div>
        </div>
        <div class="card !shadow-none">
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center">
              <NIcon :component="Clock" :size="14" class="text-zinc-400" />
            </div>
            <div class="min-w-0">
              <p class="section-title">Age</p>
              <p class="text-[13px] text-zinc-100 tabular-nums">{{ pod.age || '—' }}</p>
            </div>
          </div>
        </div>
        <div class="card !shadow-none">
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="w-9 h-9 rounded-md bg-zinc-800/60 border border-zinc-700/40 flex items-center justify-center"
                 :class="pod.restart_count > 0 ? '!bg-amber-500/10 !border-amber-500/30' : ''">
              <NIcon :component="AlertCircle" :size="14"
                      :color="pod.restart_count > 0 ? '#fbbf24' : '#a1a1aa'" />
            </div>
            <div class="min-w-0">
              <p class="section-title">Restarts</p>
              <p class="text-[13px] tabular-nums"
                 :class="pod.restart_count > 0 ? 'text-amber-400 font-medium' : 'text-zinc-300'">
                {{ pod.restart_count }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Containers -->
      <section class="card">
        <div class="card__header">
          <h3 class="card__title">Containers</h3>
          <span class="text-[12px] text-zinc-500">{{ pod.containers.length }} 个</span>
        </div>
        <div class="card__body">
          <div class="grid grid-cols-2 gap-2.5">
            <div v-for="c in pod.containers" :key="c.name"
                 class="rounded-lg border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 transition-colors px-4 py-3 flex items-center gap-3">
              <div class="w-2 h-2 rounded-full shrink-0"
                   :class="c.ready ? 'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,.18)]' : 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,.18)]'" />
              <div class="flex-1 min-w-0">
                <p class="text-[13px] text-zinc-100 truncate">{{ c.name }}</p>
                <p class="text-[11px] text-zinc-500 font-mono truncate">{{ c.image }}</p>
              </div>
              <NTag size="small" round :type="c.state === 'running' ? 'success' : 'warning'" class="shrink-0">
                {{ c.state }}{{ c.reason ? ' · ' + c.reason : '' }}
              </NTag>
              <span v-if="c.restart_count" class="text-[11px] text-amber-400 tabular-nums shrink-0">{{ c.restart_count }}×</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Error banner if any -->
      <div v-if="pod.message || pod.reason"
           class="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 flex items-start gap-3">
        <NIcon :component="AlertCircle" :size="16" color="#fca5a5" class="shrink-0 mt-0.5" />
        <div>
          <p class="text-[12.5px] font-semibold text-red-300 mb-0.5">{{ pod.reason || 'Status' }}</p>
          <p class="text-[12.5px] text-zinc-300">{{ pod.message }}</p>
        </div>
      </div>

      <!-- Labels -->
      <section v-if="Object.keys(pod.labels).length" class="card">
        <div class="card__header">
          <h3 class="card__title">Labels</h3>
          <span class="text-[12px] text-zinc-500">{{ Object.keys(pod.labels).length }} 个</span>
        </div>
        <div class="card__body">
          <div class="flex flex-wrap gap-1.5">
            <NTag v-for="(v, k) in pod.labels" :key="k" size="small" round :bordered="false" class="!bg-zinc-800 !font-mono">
              <span class="text-zinc-500">{{ k }}</span>
              <span class="text-zinc-600 mx-1">=</span>
              <span class="text-zinc-200">{{ v }}</span>
            </NTag>
          </div>
        </div>
      </section>

      <!-- Tabs: Logs / Events -->
      <section class="card card__body--flush overflow-hidden">
        <div class="px-5 pt-3">
          <NTabs v-model:value="tab" type="line" animated size="medium">
            <NTabPane name="logs" tab="实时日志">
              <template #tab>
                <span class="flex items-center gap-1.5">
                  <span class="status-dot status-dot--running" />
                  Logs
                </span>
              </template>
            </NTabPane>
            <NTabPane name="events" tab="Events">
              <template #tab>
                <span class="flex items-center gap-1.5">Events
                  <NTag size="tiny" round type="warning" v-if="events.length">{{ events.length }}</NTag>
                </span>
              </template>
            </NTabPane>
          </NTabs>
        </div>

        <div v-show="tab === 'logs'" class="border-t border-zinc-800/60">
          <LogViewer
            :namespace="namespace"
            :name="name"
            :containers="pod.containers.map((c) => c.name)"
            style="height: calc(100vh - 580px); min-height: 460px;"
            @lines="(l: LogLine[]) => lines = l"
          />
        </div>

        <div v-show="tab === 'events'" class="p-5 border-t border-zinc-800/60">
          <NEmpty v-if="!events.length" description="无相关事件" />
          <NDataTable
            v-else
            :columns="[
              { title: '类型', key: 'type', width: 90, render: (r: EventInfo) => h(NTag, { type: r.type === 'Warning' ? 'warning' : 'info', size: 'small', round: true }, () => r.type) },
              { title: 'Reason', key: 'reason', width: 200, render: (r: EventInfo) => h('span', { class: 'text-zinc-200' }, r.reason) },
              { title: 'Message', key: 'message' },
              { title: '次数', key: 'count', width: 70, render: (r: EventInfo) => h('span', { class: 'tabular-nums' }, String(r.count)) },
              { title: '最后出现', key: 'last_seen', width: 180, render: (r: EventInfo) => r.last_seen?.slice(11, 19) || '—' },
            ]"
            :data="events"
            size="small"
            :pagination="{ pageSize: 20 }"
            :bordered="false"
          />
        </div>
      </section>
    </template>

    <LogAnalyzerDrawer
      v-model:show="analyzerOpen"
      :namespace="namespace"
      :pod-name="name"
      :log-lines="lines"
    />
  </div>
</template>
