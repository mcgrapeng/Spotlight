<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTabs, NTabPane, NTag, NEmpty, NDataTable, NIcon, useMessage } from 'naive-ui'
import { ArrowLeft, Star, Wand, Refresh, AlertCircle } from '@vicons/tabler'
import PageHeader from '@/components/ui/PageHeader.vue'
import SectionCard from '@/components/ui/SectionCard.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import StatusPill from '@/components/ui/StatusPill.vue'
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
const errorMsg = ref<string | null>(null)
const tab = ref<'logs' | 'events'>('logs')
const lines = ref<LogLine[]>([])

async function load() {
  loading.value = true
  errorMsg.value = null
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
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
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

async function reload() { await load() }

// AI analyzer state — fed by either the toolbar button or a row-level "ask AI"
const analyzerOpen = ref(false)
const aiPresetLines = ref<string[]>([])
const aiPresetQuestion = ref<string>('请分析这些日志的根因、异常点和建议')

function openAnalyzer(payload?: { lines: string[]; question: string }) {
  if (payload?.lines?.length) {
    aiPresetLines.value = payload.lines
    aiPresetQuestion.value = payload.question
  }
  analyzerOpen.value = true
}
</script>

<template>
  <div class="page space-y-5">
    <PageHeader :title="name" :subtitle="`namespace · ${namespace}`" back>
      <template #actions>
        <StatusPill v-if="pod" :phase="pod.phase" />
        <NTag v-if="pod?.owner_kind" size="small" round :bordered="false" type="info" class="!font-mono">
          {{ pod.owner_kind }}/{{ pod.owner_name }}
        </NTag>
        <button class="btn-secondary" @click="openAnalyzer()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
            <circle cx="12" cy="14" r="2" />
          </svg>
          AI 分析
        </button>
        <button class="btn-secondary" @click="addFavorite">
          <NIcon :component="Star" :size="13" />
          收藏
        </button>
        <button class="btn-ghost" @click="reload" aria-label="刷新">
          <NIcon :component="Refresh" :size="14" />
        </button>
      </template>
    </PageHeader>

    <ErrorState v-if="errorMsg" :message="errorMsg" :on-retry="load" />
    <LoadingState v-else-if="loading" label="加载 Pod 元数据…" height="320px" />

    <template v-else-if="pod">
      <!-- Critical banner -->
      <div v-if="pod.message || pod.reason"
           class="alert-critical" role="alert">
        <div class="flex items-center justify-center w-10 h-10 rounded-md bg-red-500/15 border border-red-500/30 shrink-0">
          <NIcon :component="AlertCircle" :size="16" color="#fb7185" />
        </div>
        <div>
          <p class="text-[11px] uppercase tracking-wider text-red-300 font-semibold">{{ pod.reason || 'Status' }}</p>
          <p class="text-[13px] text-zinc-100 mt-0.5">{{ pod.message }}</p>
        </div>
      </div>

      <!-- Metadata strip -->
      <section class="card">
        <dl class="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800/60">
          <div class="px-5 py-4">
            <dt class="section-title">Node</dt>
            <dd class="mt-1.5 text-[13px] font-mono text-zinc-100 truncate">{{ pod.node || '—' }}</dd>
          </div>
          <div class="px-5 py-4">
            <dt class="section-title">Pod IP</dt>
            <dd class="mt-1.5 text-[13px] font-mono text-zinc-100 truncate">{{ pod.pod_ip || '—' }}</dd>
          </div>
          <div class="px-5 py-4">
            <dt class="section-title">Age</dt>
            <dd class="mt-1.5 text-[13px] text-zinc-100 tabular-nums">{{ pod.age || '—' }}</dd>
          </div>
          <div class="px-5 py-4">
            <dt class="section-title">Restarts</dt>
            <dd :class="['mt-1.5 text-[13px] tabular-nums', pod.restart_count > 100 ? 'text-red-400 font-semibold' : pod.restart_count > 0 ? 'text-amber-400' : 'text-zinc-100']">
              {{ pod.restart_count }}
            </dd>
          </div>
        </dl>
      </section>

      <!-- Containers -->
      <SectionCard title="Containers" :count="pod.containers.length">
        <div class="divide-y divide-zinc-800/60 -m-4">
          <div v-for="c in pod.containers" :key="c.name"
               class="px-4 py-2.5 flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full shrink-0"
                  :class="c.ready ? 'bg-emerald-500' : 'bg-amber-500'"
                  :aria-label="c.ready ? '就绪' : '未就绪'" />
            <span class="text-[13px] text-zinc-100 font-medium w-44 truncate">{{ c.name }}</span>
            <code class="text-[11.5px] text-zinc-500 font-mono flex-1 truncate">{{ c.image }}</code>
            <span class="chip" :class="c.state === 'running' ? 'chip--ok' : 'chip--warn'">
              {{ c.state }}{{ c.reason ? ' · ' + c.reason : '' }}
            </span>
            <span v-if="c.restart_count" class="text-[11.5px] tabular-nums w-8 text-right"
                  :class="c.restart_count > 5 ? 'text-red-400' : 'text-amber-400'">{{ c.restart_count }}×</span>
            <span v-else class="w-8" />
          </div>
        </div>
      </SectionCard>

      <!-- Labels -->
      <SectionCard v-if="Object.keys(pod.labels).length" title="Labels" :count="Object.keys(pod.labels).length">
        <div class="flex flex-wrap gap-1.5">
          <span v-for="(v, k) in pod.labels" :key="k"
                class="chip chip--neutral !font-mono !bg-zinc-900/60 !text-zinc-400 !border-zinc-800">
            <span class="text-zinc-500">{{ k }}</span><span class="text-zinc-600 mx-1">=</span><span class="text-zinc-200">{{ v }}</span>
          </span>
        </div>
      </SectionCard>

      <!-- Tabs -->
      <SectionCard flush>
        <div class="px-4 pt-3">
          <NTabs v-model:value="tab" type="line" animated size="medium">
            <NTabPane name="logs" tab="日志">
              <template #tab>
                <span class="inline-flex items-center gap-1.5 text-[12.5px]">
                  <span class="status-dot status-dot--running" aria-hidden="true" />
                  日志
                </span>
              </template>
            </NTabPane>
            <NTabPane name="events" tab="Events">
              <template #tab>
                <span class="inline-flex items-center gap-1.5 text-[12.5px]">
                  Events
                  <span v-if="events.length" class="chip chip--warn">{{ events.length }}</span>
                </span>
              </template>
            </NTabPane>
          </NTabs>
        </div>
        <div v-show="tab === 'logs'" class="border-t border-zinc-800/60">
          <LogViewer :namespace="namespace" :name="name"
                     :containers="pod.containers.map((c) => c.name)"
                     class="pod-detail-content"
                     @lines="(l: LogLine[]) => lines = l"
                     @ask-ai="openAnalyzer" />
        </div>
        <div v-show="tab === 'events'" class="border-t border-zinc-800/60">
          <EmptyState v-if="!events.length" title="无相关事件" description="此 Pod 没有产生任何事件" class="py-16" />
          <NDataTable
            v-else
            :columns="[
              { title: '类型', key: 'type', width: 90,
                render: (r: EventInfo) => h('span', { class: r.type === 'Warning' ? 'chip chip--warn' : 'chip chip--info' }, () => r.type) },
              { title: 'Reason', key: 'reason', width: 200, render: (r: EventInfo) => h('span', { class: 'text-zinc-200 text-[12.5px]' }, r.reason) },
              { title: 'Message', key: 'message' },
              { title: '次数', key: 'count', width: 70, render: (r: EventInfo) => h('span', { class: 'tabular-nums' }, String(r.count)) },
              { title: '最后出现', key: 'last_seen', width: 180, render: (r: EventInfo) => r.last_seen?.slice(11, 19) || '—' },
            ]"
            :data="events" size="small" :pagination="{ pageSize: 20 }" :bordered="false" />
        </div>
      </SectionCard>
    </template>

    <LogAnalyzerDrawer v-model:show="analyzerOpen" :namespace="namespace" :pod-name="name"
                       :log-lines="lines"
                       :preset-question="aiPresetQuestion" />
  </div>
</template>

<style scoped>
.pod-detail-content {
  /* Reserve enough vertical space; cap at 60vh so very tall screens still
     keep the rest of the page in reach. */
  min-height: 520px;
  max-height: 70vh;
}
</style>
