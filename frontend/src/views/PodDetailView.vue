<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, RefreshCw, Bot, PanelLeftClose, PanelLeftOpen, AlertCircle, AlertTriangle, Clock } from '@lucide/vue'
import { podsApi, eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import { usePodLogs } from '@/composables/usePodLogs'
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
import { cn } from '@/lib/utils'
import dayjs from '@/utils/dayjs'
import type { PodInfo, LogLine, EventInfo } from '@/domain/types'

function formatRel(iso: string | null) {
  if (!iso) return '—'
  return dayjs(iso).fromNow()
}

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const pod = ref<PodInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const tab = ref('logs')
const logsTabActive = ref(tab.value === 'logs')
const analyzerOpen = ref(false)
const metaCollapsed = ref(true)
const META_LS_KEY = 'spotlight:pod-meta-collapsed'

onMounted(() => {
  try {
    const stored = localStorage.getItem(META_LS_KEY)
    if (stored !== null) metaCollapsed.value = stored === 'true'
  } catch { /* ignore */ }
})

watch(metaCollapsed, (v) => {
  try { localStorage.setItem(META_LS_KEY, String(v)) } catch {}
})

function toggleMeta() {
  metaCollapsed.value = !metaCollapsed.value
}

const name = computed(() => String(route.params.name ?? ''))
const namespace = computed(() => String(route.params.namespace ?? cluster.activeNamespace))

const logStreaming = ref(true)
const logUnread = ref(0)
const { lines: logLines, unreadCount } = usePodLogs({
  cluster, namespace, name, enabled: logsTabActive,
  streaming: logStreaming,
})

const filteredLogsForAI = ref<readonly LogLine[]>([])
onMounted(() => { logUnread.value = unreadCount.value })

// Keep logUnread in sync with composable (it owns the count via SSR appends).
watch(unreadCount, (v) => { logUnread.value = v }, { immediate: true })

async function load() {
  if (!name.value) return
  loading.value = true
  error.value = null
  try {
    pod.value = await podsApi.get(cluster.activeCluster!, namespace.value, name.value)
  } catch (e: any) {
    error.value = e?.response?.data?.detail ?? e?.message ?? '加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => `${name.value}/${namespace.value}`, load)
watch(tab, (v) => {
  logsTabActive.value = v === 'logs'
  // Coming back to the Logs tab means the user is looking — reset unread pill.
  if (v === 'logs') logUnread.value = 0
  if (v === 'events') loadPodEvents()
})
function back() { router.push({ name: 'pods' }) }

const podEvents = ref<EventInfo[]>([])
const podEventsLoading = ref(false)
async function loadPodEvents() {
  if (!pod.value || !cluster.activeCluster) return
  podEventsLoading.value = true
  try {
    const all = await eventsApi.list({
      cluster: cluster.activeCluster,
      namespace: pod.value.namespace,
      limit: 200,
    })
    podEvents.value = all.filter(e =>
      e.involved_kind === 'Pod' && e.involved_name === pod.value!.name,
    )
  } catch { /* silent */ }
  finally {
    podEventsLoading.value = false
  }
}
</script>

<template>
  <LoadingState v-if="loading && !pod" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <div v-else-if="pod">
    <div class="flex items-center justify-between mb-2 -ml-2">
      <Button variant="ghost" size="sm" @click="back">
        <ArrowLeft :size="14" :stroke-width="1.75" class="mr-1" />
        返回 Pods
      </Button>
      <!-- ponytail: 触摸目标 32px+，Lucide PanelLeftClose/Open 比 PanelLeft/Right 语义更准 -->
      <Button
        variant="ghost" size="sm"
        class="min-h-[32px]"
        :title="metaCollapsed ? '展开 Pod 元数据' : '收起 Pod 元数据'"
        :aria-label="metaCollapsed ? '展开元数据' : '收起元数据'"
        @click="toggleMeta"
      >
        <PanelLeftClose v-if="metaCollapsed" :size="14" :stroke-width="1.75" class="mr-1" />
        <PanelLeftOpen v-else :size="14" :stroke-width="1.75" class="mr-1" />
        {{ metaCollapsed ? '元数据' : '收起元数据' }}
      </Button>
    </div>

    <PageHeader :title="pod.name" :subtitle="`${pod.namespace} · ${pod.node || '未调度'}`">
      <template #actions>
        <PodStatusPill :phase="pod.phase" class="mr-2" />
        <Button variant="outline" size="sm" @click="load" :disabled="loading" aria-label="刷新">
          <RefreshCw :size="14" :stroke-width="1.75" :class="loading && 'animate-spin'" />
        </Button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left: metadata -->
      <div v-if="!metaCollapsed" class="lg:col-span-1 space-y-4">
        <Card class="p-0">
          <CardContent class="p-4 space-y-3">
            <div>
              <div class="text-xs text-muted-foreground mb-1">Pod IP</div>
              <div class="font-mono text-sm">{{ pod.pod_ip || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground mb-1">Node</div>
              <div class="font-mono text-sm">{{ pod.node || '—' }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground mb-1">Restart</div>
              <div class="text-sm tabular-nums">{{ pod.restart_count }}</div>
            </div>
            <div>
              <div class="text-xs text-muted-foreground mb-1">Age</div>
              <div class="text-sm">{{ pod.age || '—' }}</div>
            </div>
            <div v-if="pod.owner_kind">
              <div class="text-xs text-muted-foreground mb-1">Owner</div>
              <div class="text-sm">{{ pod.owner_kind }} / {{ pod.owner_name }}</div>
            </div>
          </CardContent>
        </Card>

        <Card class="p-0">
          <CardContent class="p-4">
            <h3 class="text-sm font-semibold mb-3">Containers ({{ pod.containers.length }})</h3>
            <div class="space-y-2">
              <div
                v-for="c in pod.containers"
                :key="c.name"
                class="flex items-center justify-between p-2 rounded-md border border-border"
              >
                <div class="min-w-0 flex-1">
                  <div class="font-mono text-xs font-medium truncate">{{ c.name }}</div>
                  <div class="text-2xs text-muted-foreground truncate">{{ c.image }}</div>
                </div>
                <PodStatusPill :phase="c.state === 'running' ? 'Running' : (c.ready ? 'Running' : 'Pending')" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right: tabs -->
      <div :class="metaCollapsed ? 'lg:col-span-3' : 'lg:col-span-2'">
        <Tabs v-model="tab" class="w-full">
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold">容器日志</h3>
              <Button variant="outline" size="sm" @click="analyzerOpen = true">
                <Bot :size="14" :stroke-width="1.75" class="mr-1" />
                AI 分析
              </Button>
            </div>
            <!-- ponytail: 600px 在 1080p 屏会被 tabs/padding 挤压；改成 60vh 自适应。
                 min-h 保证日志行有基本可读高度，max-h 防超大屏无限拉长。 -->
            <div class="h-[60vh] min-h-[400px] max-h-[1200px]">
              <LogViewer
                :lines="logLines"
                v-model:streaming="logStreaming"
                :unread-count="logUnread"
                :containers="pod.containers.map(c => c.name)"
                @update:filtered="filteredLogsForAI = $event"
                @clear="logLines = []"
                @consume-unread="logUnread = 0"
              />
            </div>
          </TabsContent>

          <TabsContent value="events" class="mt-4">
            <LoadingState v-if="podEventsLoading && podEvents.length === 0" message="加载事件…" />
            <EmptyState
              v-else-if="!podEventsLoading && podEvents.length === 0"
              title="该 Pod 无相关事件"
              description="Kubernetes 集群里没有报告与该 Pod 相关的事件。事件保留时间有限，短暂的事件（如调度成功）可能已过期。"
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
                    <span :class="cn(
                      'inline-flex items-center rounded px-1.5 py-0.5 text-2xs font-medium border',
                      ev.type === 'Warning' ? 'bg-warning-bg text-warning border-warning-border' : 'bg-muted text-muted-foreground border-border',
                    )">{{ ev.type }}</span>
                    <span class="inline-flex items-center rounded px-1.5 py-0.5 bg-muted text-foreground font-mono text-2xs border border-border">
                      {{ ev.reason }}
                    </span>
                  </div>
                  <p class="text-sm text-muted-foreground mt-1">{{ ev.message }}</p>
                  <div class="text-2xs text-muted-foreground mt-1 flex gap-3">
                    <span :title="ev.last_seen ?? undefined">
                      <Clock :size="11" class="inline -mt-0.5" :stroke-width="1.75" />
                      {{ formatRel(ev.last_seen) }}
                    </span>
                    <span>×{{ ev.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <LogAnalyzerDrawer
      v-model:open="analyzerOpen"
      :log-content="filteredLogsForAI.map(l => l.content).join('\n')"
    />
  </div>
</template>