<script setup lang="ts">
import { computed } from 'vue'
import { NSelect, NIcon, NTooltip, NButton } from 'naive-ui'
import { Refresh, Server } from '@vicons/tabler'
import { useClusterStore } from '@/stores/cluster'
import { useRouter } from 'vue-router'

const router = useRouter()
const cluster = useClusterStore()

const clusterOptions = computed(() =>
  cluster.clusters.map((c) => ({
    label: c.name === cluster.currentCluster?.name ? `${c.name} · current` : c.name,
    value: c.name,
  })),
)
const nsOptions = computed(() => [
  { label: '所有 namespace', value: '_all' },
  ...cluster.namespaces.map((n) => ({ label: n.name, value: n.name })),
])

function reload() { router.go(0) }
</script>

<template>
  <div class="flex h-full items-center gap-3 px-5">
    <!-- Cluster selector (single, prominent) -->
    <div class="header-cluster-detail flex items-center gap-2 shrink-0">
      <NIcon :component="Server" :size="14" class="text-zinc-500" aria-hidden="true" />
      <NSelect
        :value="cluster.activeCluster"
        :options="clusterOptions"
        :consistent-menu-width="false"
        size="small"
        style="width: 240px"
        @update:value="(v: string) => cluster.setCluster(v)"
      />
    </div>

    <span class="text-zinc-700">/</span>

    <div class="header-cluster-detail shrink-0">
      <NSelect
        :value="cluster.activeNamespace"
        :options="nsOptions"
        size="small"
        style="width: 180px"
        :disabled="cluster.namespaces.length === 0"
        @update:value="(v: string) => cluster.setNamespace(v)"
      />
    </div>

    <div class="flex-1" />

    <!-- Right: minimal action set -->
    <div class="flex items-center gap-1 shrink-0">
      <NTooltip>
        <template #trigger>
          <NButton quaternary size="small" @click="router.push({ name: 'ai' })">
            <template #icon>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
                <circle cx="12" cy="14" r="2" />
              </svg>
            </template>
            AI
          </NButton>
        </template>
        <span>AI 模型配置</span>
      </NTooltip>

      <NTooltip>
        <template #trigger>
          <button class="btn-ghost" @click="reload" aria-label="刷新当前页面">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          </button>
        </template>
        <span>刷新</span>
      </NTooltip>
    </div>
  </div>
</template>
