<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSelect, NIcon, NText, NTooltip } from 'naive-ui'
import { Server, CircleCheck, Search } from '@vicons/tabler'
import { useClusterStore } from '@/stores/cluster'

const route = useRoute()
const router = useRouter()
const cluster = useClusterStore()

const clusterOptions = computed(() =>
  cluster.clusters.map((c) => ({
    label: c.name + (c.is_current ? '  · current' : ''),
    value: c.name,
  })),
)

const namespaceOptions = computed(() => [
  { label: '全部命名空间', value: '_all' },
  ...cluster.namespaces.map((n) => ({ label: n.name, value: n.name })),
])

const pageTitle = computed(() => (route.meta?.title as string) || '')

function goPods() {
  router.push({ name: 'pods' })
}
</script>

<template>
  <div class="flex h-full items-center gap-4 px-6">
    <div class="flex items-center gap-2.5 text-zinc-100">
      <NIcon :component="Server" :size="20" color="#6366f1" />
      <span class="font-semibold tracking-tight">K8s Viewer</span>
      <NText depth="3" class="!text-xs ml-1">via Teleport · tsh</NText>
    </div>

    <div class="h-5 w-px bg-zinc-800" />

    <div class="flex items-center gap-2 min-w-0">
      <span class="section-title">Cluster</span>
      <NSelect
        :value="cluster.activeCluster"
        :options="clusterOptions"
        :loading="cluster.clusters.length === 0"
        size="small"
        style="width: 220px"
        @update:value="(v: string) => cluster.setCluster(v)"
      />
    </div>

    <div class="flex items-center gap-2 min-w-0">
      <span class="section-title">Namespace</span>
      <NSelect
        :value="cluster.activeNamespace"
        :options="namespaceOptions"
        size="small"
        style="width: 200px"
        :disabled="cluster.namespaces.length === 0"
        @update:value="(v: string) => cluster.setNamespace(v)"
      />
    </div>

    <div class="flex-1 max-w-md mx-auto">
      <NText class="!text-zinc-300 text-sm font-medium">{{ pageTitle }}</NText>
    </div>

    <div class="ml-auto flex items-center gap-3">
      <NTooltip>
        <template #trigger>
          <NIcon :component="Search" :size="18" class="text-zinc-400 cursor-pointer hover:text-zinc-200" @click="goPods" />
        </template>
        <span>跳转到 Pod 列表</span>
      </NTooltip>

      <div class="flex items-center gap-1.5 text-xs text-emerald-400">
        <NIcon :component="CircleCheck" :size="14" />
        <span>{{ cluster.currentCluster?.name ?? '未连接' }}</span>
      </div>
    </div>
  </div>
</template>
