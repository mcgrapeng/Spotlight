<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSelect, NIcon, NText, NTooltip, NButton, NTag } from 'naive-ui'
import { Server, CircleCheck, Robot, Search, Refresh } from '@vicons/tabler'
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
const nsOptions = computed(() => [
  { label: '全部命名空间', value: '_all' },
  ...cluster.namespaces.map((n) => ({ label: n.name, value: n.name })),
])
const title = computed(() => (route.meta?.title as string) || '')
const subtitle = computed(() => (route.meta?.subtitle as string) || '')

function reload() { router.go(0) }
function goAI() { router.push({ name: 'ai' }) }
</script>

<template>
  <div class="flex h-full items-center gap-3 px-6">
    <!-- Brand -->
    <RouterLink :to="{ name: 'dashboard' }" class="flex items-center gap-2.5 group">
      <div class="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_2px_8px_rgba(99,102,241,.35)] group-hover:scale-105 transition-transform">
        <NIcon :component="Server" :size="16" color="#fff" />
      </div>
      <div class="flex flex-col leading-tight">
        <span class="font-semibold text-zinc-100 text-[14.5px] tracking-tight">K8s Viewer</span>
        <span class="text-[10.5px] text-zinc-500 tracking-wide">via Teleport · tsh</span>
      </div>
    </RouterLink>

    <div class="h-6 w-px bg-zinc-800/80 mx-1" />

    <!-- Cluster selector -->
    <div class="flex items-center gap-2">
      <span class="eyebrow">Cluster</span>
      <NSelect
        :value="cluster.activeCluster"
        :options="clusterOptions"
        :loading="cluster.clusters.length === 0"
        size="small"
        style="width: 240px"
        @update:value="(v: string) => cluster.setCluster(v)"
      />
    </div>

    <!-- Namespace selector -->
    <div class="flex items-center gap-2">
      <span class="eyebrow">Namespace</span>
      <NSelect
        :value="cluster.activeNamespace"
        :options="nsOptions"
        size="small"
        style="width: 200px"
        :disabled="cluster.namespaces.length === 0"
        @update:value="(v: string) => cluster.setNamespace(v)"
      />
    </div>

    <div class="h-6 w-px bg-zinc-800/80 mx-1" />

    <!-- Page title (center) -->
    <div class="flex-1 min-w-0 flex items-baseline gap-2">
      <h1 class="text-[15px] font-semibold text-zinc-100 tracking-tight truncate">{{ title }}</h1>
      <span v-if="subtitle" class="text-[12px] text-zinc-500 truncate">{{ subtitle }}</span>
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-1.5">
      <NTooltip>
        <template #trigger>
          <NButton text size="small" @click="reload">
            <template #icon><NIcon :component="Refresh" :size="15" /></template>
          </NButton>
        </template>
        <span>刷新当前页面</span>
      </NTooltip>

      <NTooltip>
        <template #trigger>
          <NButton text size="small" @click="goAI">
            <template #icon><NIcon :component="Robot" :size="15" /></template>
          </NButton>
        </template>
        <span>AI 模型配置</span>
      </NTooltip>

      <div class="h-6 w-px bg-zinc-800/80 mx-1" />

      <NTag size="small" round :type="cluster.currentCluster ? 'success' : 'default'" class="!font-mono">
        <template #icon>
          <NIcon :component="CircleCheck" :size="12" />
        </template>
        {{ cluster.currentCluster?.name ?? '未连接' }}
      </NTag>
    </div>
  </div>
</template>
