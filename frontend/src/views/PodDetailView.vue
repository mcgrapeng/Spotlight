<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, RefreshCw, Bot, AlertCircle, AlertTriangle, Clock } from '@lucide/vue'
import { podsApi, eventsApi, aiApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { useRelativeTime } from '@/composables/useRelativeTime'
import { usePodLogs } from '@/composables/usePodLogs'
import { useResource } from '@/composables/useResource'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import LogViewer from '@/components/log/LogViewer.vue'
import LogAnalyzerDrawer from '@/components/ai/LogAnalyzerDrawer.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import StatusChip from '@/components/common/StatusChip.vue'
import { cn } from '@/lib/utils'
import dayjs from '@/utils/dayjs'
import type { PodOut, LogLineOut, EventOut } from '@/api/types'

const { formatRel } = useRelativeTime()

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const { t } = useI18n()
const tab = ref('logs')
const logsTabActive = ref(tab.value === 'logs')
const analyzerOpen = ref(false)
/** 容器就绪数 —— 事实条上那个 n/n。 */
const readyContainers = computed(
  () => pod.value?.containers.filter((c) => c.ready).length ?? 0,
)

/** 容器状态点，和 Pods 表格里的圆点用同一套判定。 */
function containerDot(c: { ready?: boolean; state?: string; reason?: string | null }): string {
  if (c.ready) return 'bg-success'
  if (c.state === 'waiting' && c.reason === 'CrashLoopBackOff') return 'bg-error'
  if (c.state === 'terminated' && (c.reason === 'Error' || c.reason === 'OOMKilled')) return 'bg-error'
  return 'bg-warning'
}

/** Map a container's K8s state/reason to a phase pill. Never label a
 *  CrashLoopBackOff / ImagePullBackOff container as "Pending". */
function containerPhase(c: { state: string; ready?: boolean; reason?: string | null }): string {
  if (c.state === 'running') return 'Running'
  if (c.state === 'terminated') {
    return (c.reason ?? '') === 'Completed' ? 'Succeeded' : 'Failed'
  }
  if (c.state === 'waiting') {
    const r = (c.reason ?? '').toLowerCase()
    const failed = r.includes('backoff') || r.includes('imagepull') || r.includes('errimage') || r.includes('error')
    return failed ? 'Failed' : 'Pending'
  }
  return 'Unknown'
}

const name = computed(() => String(route.params.name ?? ''))
const namespace = computed(() => String(route.params.namespace ?? cluster.activeNamespace))

const logStreaming = ref(true)
const logUnread = ref(0)

// AI 分析（LogAnalyzerDrawer 的 analyze/loading/result 三件套）
const aiLoading = ref(false)
const aiResult = ref('')
const aiError = ref('')

async function runAI(content: string) {
  aiError.value = ''
  aiResult.value = ''
  aiLoading.value = true
  try {
    const providers = await aiApi.listProviders()
    const provider = providers.find(p => p.enabled) ?? providers.find(p => p.is_default)
    if (!provider?.id) {
      aiError.value = t('pod.aiNoProvider')
      return
    }
    const out = await aiApi.analyze(
      cluster.activeCluster, namespace.value, name.value,
      provider.id, content.split('\n'),
      t('pod.aiPrompt'),
    )
    aiResult.value = out.answer
  } catch (e: any) {
    aiError.value = e?.response?.data?.detail ?? e?.message ?? t('pod.aiFailed')
  } finally {
    aiLoading.value = false
  }
}

// Shared auto-follow ref: usePodLogs reads it to decide whether new SSE
// lines are prepended or held back; LogViewer reads/writes it for the pill
// toggle and scroll-to-top detection. A single ref is the source of truth.
const logAutoFollow = ref(true)

const { lines: logLines, unreadCount, error: logError, start: logStart } = usePodLogs({
  cluster, namespace, name, enabled: logsTabActive,
  streaming: logStreaming,
  autoFollow: logAutoFollow,
})

const filteredLogsForAI = ref<readonly LogLineOut[]>([])
// Keep logUnread in sync with composable (it owns the count via SSR appends).
// Module-level watch (not onMounted) so it survives HMR and the page-load
// race between component setup and log stream startup.
watch(unreadCount, (v) => { logUnread.value = v }, { immediate: true })

// Ponytail: 把 load() + onMounted + name/namespace watch 替换成 useResource。
const { data: pod, loading, error, reload: load } = useResource<PodOut>(
  () => podsApi.get(cluster.activeCluster!, namespace.value, name.value),
  {
    watch: () => [name.value, namespace.value],
    skip: () => !name.value,
  },
)

// Pod events fetched lazily on tab switch. Separate resource so switching to
// Events tab triggers a fetch (not blocked by the pod fetch).
const podNs = computed(() => pod.value?.namespace ?? namespace.value)
const {
  data: podEventsRaw,
  loading: podEventsLoading,
} = useResource<EventOut[]>(
  () => eventsApi.list({
    cluster: cluster.activeCluster, namespace: podNs.value, limit: 200,
  }).then((all) => all.filter(e =>
    e.involved_kind === 'Pod' && e.involved_name === pod.value?.name,
  )),
  { watch: () => [podNs.value, pod.value?.name], skip: () => !podNs.value || !pod.value },
)
const podEvents = computed(() => podEventsRaw.value ?? [])

watch(tab, (v) => {
  logsTabActive.value = v === 'logs'
  // Coming back to the Logs tab means the user is looking — reset unread pill.
  if (v === 'logs') logUnread.value = 0
})
function back() { router.push({ name: 'pods' }) }
</script>

<template>
  <LoadingState v-if="loading && !pod" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <!--
    ponytail: log-first 布局。
    之前这个页面是 2 栏 + 日志框 h-[60vh] min-h-[400px]：6 行日志时底下空 400px，
    5000 行时刚好，而且 AI 分析按钮被挤在日志工具栏右侧像是断开的。
    现在页面自己撑满视口高度，日志区吃掉全部剩余高度，元数据收成一条事实条。
  -->
  <div
    v-else-if="pod"
    class="flex flex-col"
    :style="{ height: 'calc(100dvh - var(--app-chrome-h))' }"
  >
    <div class="flex items-center mb-1 -ml-2 shrink-0">
      <Button variant="ghost" size="sm" @click="back">
        <ArrowLeft :size="14" :stroke-width="1.75" class="mr-1" />
        {{ t('pod.backToPods') }}
      </Button>
    </div>

    <PageHeader :title="pod.name" :subtitle="`${pod.namespace} · ${pod.node || t('pod.unscheduled')}`" class="shrink-0">
      <template #actions>
        <PodStatusPill :phase="pod.phase" class="mr-2" />
        <Button variant="outline" size="sm" @click="load" :disabled="loading" :aria-label="t('pod.refresh')">
          <RefreshCw :size="14" :stroke-width="1.75" :class="loading && 'animate-spin'" />
        </Button>
      </template>
    </PageHeader>

    <!-- 事实条：重启次数 / 存在时间 / IP 这些关键事实之前全被收在默认折叠的
         「元数据」面板里，标题区只有 namespace · node。现在常驻一行。 -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-1 py-2.5 border-y border-border shrink-0 text-xs">
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaRestarts') }}</span>
        <span
          class="font-medium tabular-nums"
          :class="pod.restart_count > 100 ? 'text-error' : pod.restart_count > 5 ? 'text-warning' : 'text-foreground'"
        >{{ pod.restart_count.toLocaleString() }}</span>
      </div>
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaAge') }}</span>
        <span class="font-medium text-foreground">{{ pod.age || '—' }}</span>
      </div>
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaIp') }}</span>
        <span class="font-mono text-foreground">{{ pod.pod_ip || '—' }}</span>
      </div>
      <div v-if="pod.owner_kind" class="flex items-baseline gap-1.5 min-w-0">
        <span class="text-muted-foreground">{{ t('pod.metaOwner') }}</span>
        <span class="font-mono text-foreground truncate">{{ pod.owner_kind }}/{{ pod.owner_name }}</span>
      </div>
      <!-- 容器降级到事实条上的一个概况（几个状态点 + n/n）。
           之前容器独占左边 280px 一栏，日志被挤得看不全；
           逐个容器的镜像 / 状态 / reason 挪到「详情」页签里。 -->
      <div class="flex items-baseline gap-1.5">
        <span class="text-muted-foreground">{{ t('pod.metaContainers') }}</span>
        <span class="flex items-center gap-1.5">
          <span class="flex items-center gap-1" aria-hidden="true">
            <span
              v-for="c in pod.containers"
              :key="c.name"
              class="block size-1.5 rounded-full"
              :class="containerDot(c)"
            />
          </span>
          <span class="font-mono tabular-nums font-medium">{{ readyContainers }}/{{ pod.containers.length }}</span>
        </span>
      </div>
    </div>

    <div class="flex-1 min-h-0 mt-4 flex flex-col">
        <Tabs v-model="tab" class="w-full flex-1 min-h-0 flex flex-col">
          <TabsList class="self-start">
            <TabsTrigger value="logs">{{ t('pod.tabLogs') }}</TabsTrigger>
            <TabsTrigger value="events">{{ t('pod.tabEvents') }}</TabsTrigger>
            <TabsTrigger value="details">{{ t('pod.tabDetails') }}</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" class="mt-2 flex-1 min-h-0 flex flex-col">
            <div class="flex items-center justify-between mb-2 shrink-0">
              <h3 class="text-sm font-semibold">{{ t('pod.containerLogs') }}</h3>
              <Button variant="outline" size="sm" @click="analyzerOpen = true">
                <Bot :size="14" :stroke-width="1.75" class="mr-1" />
                {{ t('pod.aiAnalyze') }}
              </Button>
            </div>
            <!-- 日志区吃掉全部剩余高度：6 行时下面没有空洞，5000 行时也不用滚外层。 -->
            <div class="flex-1 min-h-0">
              <LogViewer
                :lines="logLines"
                v-model:streaming="logStreaming"
                v-model:auto-follow="logAutoFollow"
                :unread-count="logUnread"
                :containers="pod.containers.map(c => c.name)"
                :pod-name="name"
                :namespace="namespace"
                :error="logError"
                @update:filtered="filteredLogsForAI = $event"
                @clear="logLines = []"
                @consume-unread="logUnread = 0"
                @retry="logStart"
              />
            </div>
          </TabsContent>

          <TabsContent value="events" class="mt-2 flex-1 min-h-0 overflow-y-auto">
            <LoadingState v-if="podEventsLoading && podEvents.length === 0" :message="t('pod.loadingEvents')" />
            <EmptyState
              v-else-if="!podEventsLoading && podEvents.length === 0"
              :title="t('pod.noEventsTitle')"
              :description="t('pod.noEventsDescription')"
            />
            <div v-else class="space-y-2">
              <div
                v-for="ev in podEvents"
                :key="ev.name"
                class="flex items-start gap-3 p-3 rounded-lg border border-border bg-card"
              >
                <component
                  :is="ev.type === 'Warning' ? AlertTriangle : AlertCircle"
                  :size="14"
                  :stroke-width="1.75"
                  :class="cn('shrink-0 mt-0.5', ev.type === 'Warning' ? 'text-warning' : 'text-muted-foreground')"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap text-sm">
                    <StatusChip
                      :tone="ev.type === 'Warning' ? 'warning' : 'neutral'"
                      :label="ev.type"
                      size="xs"
                    />
                    <span class="inline-flex items-center rounded px-1.5 py-0.5 bg-muted text-foreground font-mono text-2xs border border-border">
                      {{ ev.reason }}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">{{ ev.message }}</p>
                  <div class="text-2xs text-muted-foreground mt-1 flex gap-3">
                    <span :title="ev.last_seen ?? undefined">
                      <Clock :size="11" class="inline -mt-0.5" :stroke-width="1.75" />
                      {{ formatRel(ev.last_seen ?? null) }}
                    </span>
                    <span>×{{ ev.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- 详情：逐个容器的镜像 / 状态 / reason，以及事实条上放不下的字段。 -->
          <TabsContent value="details" class="mt-2 flex-1 min-h-0 overflow-y-auto">
            <Card class="p-0">
              <CardContent class="p-4">
                <h3 class="text-sm font-semibold mb-3">{{ t('pod.containers', { count: pod.containers.length }) }}</h3>
                <div class="space-y-2">
                  <div
                    v-for="c in pod.containers"
                    :key="c.name"
                    class="flex items-center justify-between gap-3 p-2 rounded-md border border-border"
                  >
                    <div class="min-w-0 flex-1">
                      <div class="font-mono text-xs font-medium truncate">{{ c.name }}</div>
                      <div class="text-2xs text-muted-foreground truncate">
                        {{ c.image }}<span v-if="c.reason"> · {{ c.reason }}</span>
                      </div>
                    </div>
                    <PodStatusPill :phase="containerPhase(c)" />
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaNamespace') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.namespace }}</span>
                  </div>
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaNode') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.node || '—' }}</span>
                  </div>
                  <div class="flex items-baseline gap-2 text-sm">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaIp') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.pod_ip || '—' }}</span>
                  </div>
                  <div v-if="pod.owner_kind" class="flex items-baseline gap-2 text-sm min-w-0">
                    <span class="text-muted-foreground text-xs w-20 shrink-0">{{ t('pod.metaOwner') }}</span>
                    <span class="font-mono text-foreground truncate">{{ pod.owner_kind }}/{{ pod.owner_name }}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>

    <LogAnalyzerDrawer
      v-model:open="analyzerOpen"
      :log-content="filteredLogsForAI.map(l => l.content).join('\n')"
      :loading="aiLoading"
      :result="aiResult"
      :error="aiError"
      @analyze="runAI"
    />
  </div>
</template>
