<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NDataTable, NSelect, NSpin, NTag, NEmpty, NInput } from 'naive-ui'
import { eventsApi } from '@/api'
import { useClusterStore } from '@/stores/cluster'
import type { EventInfo } from '@/types'
import { h } from 'vue'

const router = useRouter()
const cluster = useClusterStore()
const events = ref<EventInfo[]>([])
const loading = ref(true)
const typeFilter = ref<string>('all')
const search = ref('')

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Normal', value: 'Normal' },
]

async function load() {
  if (!cluster.activeCluster) return
  loading.value = true
  try {
    events.value = await eventsApi.list({
      cluster: cluster.activeCluster,
      namespace: cluster.activeNamespace,
      limit: 500,
    })
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => cluster.activeCluster, load)
watch(() => cluster.activeNamespace, load)

const visible = () => {
  let l = events.value
  if (typeFilter.value !== 'all') l = l.filter((e) => e.type === typeFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    l = l.filter(
      (e) =>
        e.reason.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q) ||
        e.involved_name.toLowerCase().includes(q),
    )
  }
  return l
}
</script>

<template>
  <div class="p-8 space-y-6 max-w-[1440px] mx-auto">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight text-zinc-50">Events</h1>
      <p class="text-sm text-zinc-500 mt-1">按最近发生时间倒序 · K8s event 存储于 etcd，TTL 默认 1h</p>
    </header>

    <NCard :bordered="false">
      <div class="flex items-center gap-3 mb-4">
        <NSelect v-model:value="typeFilter" :options="typeOptions" size="small" style="width: 140px" />
        <NInput v-model:value="search" size="small" placeholder="按 reason / message / 资源搜索" style="max-width: 360px" clearable />
      </div>
      <div v-if="loading" class="py-12 flex justify-center"><NSpin /></div>
      <NEmpty v-else-if="!visible().length" description="无事件" class="py-8" />
      <NDataTable
        v-else
        :columns="[
          {
            title: 'Type',
            key: 'type',
            width: 90,
            render: (r: EventInfo) =>
              h(NTag, { type: r.type === 'Warning' ? 'warning' : 'info', size: 'small', round: true }, () => r.type),
          },
          {
            title: 'Reason',
            key: 'reason',
            width: 180,
            render: (r: EventInfo) => h('span', { class: 'text-zinc-200' }, r.reason),
          },
          {
            title: 'Object',
            key: 'involved',
            width: 280,
            render: (r: EventInfo) =>
              h(
                'a',
                {
                  class: 'text-indigo-400 hover:underline cursor-pointer font-mono text-xs',
                  onClick: () =>
                    router.push({
                      name: 'pod-detail',
                      params: { namespace: r.namespace, name: r.involved_name },
                    }),
                },
                `${r.involved_kind}/${r.involved_name}`,
              ),
          },
          { title: 'Namespace', key: 'namespace', width: 140, render: (r: EventInfo) => h('span', { class: 'text-zinc-500 font-mono text-xs' }, r.namespace) },
          { title: 'Message', key: 'message' },
          { title: 'Count', key: 'count', width: 70 },
          { title: 'Last Seen', key: 'last_seen', width: 180, render: (r: EventInfo) => r.last_seen || '—' },
        ]"
        :data="visible()"
        size="small"
        :bordered="false"
        :pagination="{ pageSize: 50 }"
      />
    </NCard>
  </div>
</template>
