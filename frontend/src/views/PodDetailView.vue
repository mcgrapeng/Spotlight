<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NTabs,
  NTabPane,
  NTag,
  NSpace,
  NSpin,
  NDataTable,
  NEmpty,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  useMessage,
} from 'naive-ui'
import PodStatusBadge from '@/components/common/PodStatusBadge.vue'
import LogViewer from '@/components/log/LogViewer.vue'
import { podsApi, eventsApi, favoritesApi } from '@/api'
import { useClusterStore } from '@/stores/cluster'
import type { PodInfo, EventInfo } from '@/types'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const cluster = useClusterStore()

const namespace = ref(route.params.namespace as string)
const name = ref(route.params.name as string)
const pod = ref<PodInfo | null>(null)
const events = ref<EventInfo[]>([])
const loading = ref(true)
const tab = ref('logs')

async function load() {
  loading.value = true
  try {
    const [p, ev] = await Promise.all([
      podsApi.get(cluster.activeCluster, namespace.value, name.value),
      eventsApi.list({
        cluster: cluster.activeCluster,
        namespace: namespace.value,
        involved: name.value,
        limit: 100,
      }),
    ])
    pod.value = p
    events.value = ev
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.fullPath, load)

async function addFavorite() {
  if (!pod.value) return
  try {
    await favoritesApi.add({
      resource_type: 'pod',
      name: pod.value.name,
      namespace: pod.value.namespace,
      cluster: cluster.activeCluster || '',
      note: '',
    })
    message.success('已加入收藏')
  } catch (e) {
    message.error('收藏失败')
  }
}

function eventRowType(t: string) {
  return t === 'Warning' ? 'warning' : 'info'
}
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <NButton quaternary size="small" @click="router.back()">← 返回</NButton>
        <div class="min-w-0">
          <h1 class="text-xl font-semibold text-zinc-50 font-mono truncate">{{ name }}</h1>
          <p class="text-xs text-zinc-500 mt-0.5">
            namespace <code class="kbd">{{ namespace }}</code>
            <template v-if="pod?.owner_kind">
              · owner <code class="kbd">{{ pod.owner_kind }}/{{ pod.owner_name }}</code>
            </template>
          </p>
        </div>
      </div>
      <NSpace v-if="pod">
        <PodStatusBadge :phase="pod.phase" />
        <NButton size="small" quaternary @click="addFavorite">☆ 收藏</NButton>
      </NSpace>
    </header>

    <div v-if="loading" class="py-20 flex justify-center"><NSpin size="large" /></div>
    <template v-else-if="pod">
      <!-- 元信息卡 -->
      <NCard :bordered="false">
        <div class="grid grid-cols-4 gap-6">
          <div>
            <p class="section-title mb-1">Node</p>
            <p class="text-sm font-mono text-zinc-200">{{ pod.node || '—' }}</p>
          </div>
          <div>
            <p class="section-title mb-1">Pod IP</p>
            <p class="text-sm font-mono text-zinc-200">{{ pod.pod_ip || '—' }}</p>
          </div>
          <div>
            <p class="section-title mb-1">Age</p>
            <p class="text-sm text-zinc-200">{{ pod.age }}</p>
          </div>
          <div>
            <p class="section-title mb-1">Restarts</p>
            <p class="text-sm" :class="pod.restart_count > 0 ? 'text-amber-400' : 'text-zinc-300'">
              {{ pod.restart_count }}
            </p>
          </div>
        </div>

        <div v-if="pod.message || pod.reason" class="mt-5 p-3 rounded-md bg-red-500/5 border border-red-500/20">
          <p class="text-xs text-red-400 font-medium mb-1">{{ pod.reason || 'Status' }}</p>
          <p class="text-xs text-zinc-300">{{ pod.message }}</p>
        </div>

        <div class="mt-5">
          <p class="section-title mb-2">Containers</p>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="c in pod.containers"
              :key="c.name"
              class="rounded-md border border-zinc-800 bg-surface-2 px-3 py-2 flex items-center gap-3"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="c.ready ? 'bg-emerald-500' : 'bg-amber-500'"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-zinc-100 truncate">{{ c.name }}</p>
                <p class="text-xs text-zinc-500 font-mono truncate">{{ c.image }}</p>
              </div>
              <NTag size="tiny" round :type="c.state === 'running' ? 'success' : 'warning'">
                {{ c.state }}{{ c.reason ? ' · ' + c.reason : '' }}
              </NTag>
              <span v-if="c.restart_count" class="text-xs text-amber-400">{{ c.restart_count }}×</span>
            </div>
          </div>
        </div>

        <div v-if="Object.keys(pod.labels).length" class="mt-5">
          <p class="section-title mb-2">Labels</p>
          <NSpace size="small">
            <NTag
              v-for="(v, k) in pod.labels"
              :key="k"
              size="small"
              round
              :bordered="false"
              class="!bg-surface-2"
            >
              <span class="text-zinc-400">{{ k }}=</span><span class="text-zinc-100">{{ v }}</span>
            </NTag>
          </NSpace>
        </div>
      </NCard>

      <!-- Tabs: Logs / Events -->
      <NCard :bordered="false" content-style="padding: 0;">
        <NTabs v-model:value="tab" type="line" animated size="medium">
          <NTabPane name="logs" tab="Logs">
            <LogViewer
              :namespace="namespace"
              :name="name"
              :containers="pod.containers.map((c) => c.name)"
              style="height: calc(100vh - 460px); min-height: 420px;"
            />
          </NTabPane>
          <NTabPane name="events" tab="Events">
            <div class="p-5">
              <NEmpty v-if="!events.length" description="无相关事件" />
              <NDataTable
                v-else
                :columns="[
                  { title: '类型', key: 'type', width: 90, render: (r: EventInfo) => h(NTag, { type: eventRowType(r.type), size: 'small', round: true }, () => r.type) },
                  { title: 'Reason', key: 'reason', width: 200 },
                  { title: 'Message', key: 'message' },
                  { title: '次数', key: 'count', width: 70 },
                  { title: '最后出现', key: 'last_seen', width: 180, render: (r: EventInfo) => r.last_seen?.slice(11, 19) || '—' },
                ]"
                :data="events"
                size="small"
                :pagination="{ pageSize: 20 }"
              />
            </div>
          </NTabPane>
        </NTabs>
      </NCard>
    </template>
  </div>
</template>
