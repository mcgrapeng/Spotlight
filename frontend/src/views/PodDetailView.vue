<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, RefreshCw, Bot } from '@lucide/vue'
import { podsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'
import PageHeader from '@/components/common/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import PodStatusPill from '@/components/pod/PodStatusPill.vue'
import LogViewer from '@/components/log/LogViewer.vue'
import LogAnalyzerDrawer from '@/components/ai/LogAnalyzerDrawer.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import type { PodInfo, LogLine } from '@/domain/types'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()
const pod = ref<PodInfo | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const tab = ref('info')
const logLines = ref<LogLine[]>([])
const analyzerOpen = ref(false)

const name = computed(() => String(route.params.name ?? ''))
const namespace = computed(() => String(route.params.namespace ?? cluster.activeNamespace))

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
function back() { router.push({ name: 'pods' }) }
</script>

<template>
  <LoadingState v-if="loading && !pod" />
  <ErrorState v-else-if="error" :message="error" @retry="load" />
  <div v-else-if="pod">
    <Button variant="ghost" size="sm" class="mb-2 -ml-2" @click="back">
      <ArrowLeft :size="14" :stroke-width="1.75" class="mr-1" />
      返回 Pods
    </Button>

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
      <div class="lg:col-span-1 space-y-4">
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
      <div class="lg:col-span-2">
        <Tabs v-model="tab" class="w-full">
          <TabsList>
            <TabsTrigger value="info">YAML</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="info" class="mt-4">
            <Card class="p-0">
              <CardContent class="p-0">
                <pre class="text-xs font-mono p-4 overflow-auto max-h-[600px] whitespace-pre-wrap">{{ JSON.stringify(pod.labels, null, 2) }}</pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" class="mt-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold">容器日志</h3>
              <Button variant="outline" size="sm" @click="analyzerOpen = true">
                <Bot :size="14" :stroke-width="1.75" class="mr-1" />
                AI 分析
              </Button>
            </div>
            <div class="h-[600px]">
              <LogViewer :lines="logLines" :streaming="true" @clear="logLines = []" />
            </div>
          </TabsContent>

          <TabsContent value="events" class="mt-4">
            <Card class="p-0">
              <CardContent class="p-4 text-sm text-muted-foreground text-center">
                Events 通过 EventsView 查看
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <LogAnalyzerDrawer
      v-model:open="analyzerOpen"
      :log-content="logLines.map(l => l.content).join('\n')"
    />
  </div>
</template>