<script setup lang="ts">
import { NIcon, NBadge, NInput } from 'naive-ui'
import { LayoutBoard, Box, Server, AlertTriangle, Star, Bolt, Search, CircleCheck, CircleX } from '@vicons/tabler'
import { useClusterStore } from '@/stores/cluster'

const emit = defineEmits<{ (e: 'open-palette'): void }>()
const cluster = useClusterStore()

const items = [
  { name: 'dashboard', label: '总览', icon: LayoutBoard },
  { name: 'pods', label: 'Pods', icon: Box },
  { name: 'nodes', label: 'Nodes', icon: Server },
  { name: 'events', label: 'Events', icon: AlertTriangle, badge: 3 },
  { name: 'favorites', label: '收藏夹', icon: Star },
  { name: 'ai', label: 'AI 模型', icon: Bolt },
]
</script>

<template>
  <nav class="flex flex-col h-full" aria-label="主导航">
    <!-- Workspace header -->
    <div class="px-4 pt-4 pb-3">
      <p class="section-title sidebar__label">工作区</p>
      <div class="mt-2 flex items-center gap-2 sidebar__label">
        <div class="w-7 h-7 rounded bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/30 flex items-center justify-center text-[11px] font-semibold text-indigo-300">
          K8
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[12.5px] text-zinc-100 font-medium truncate">K8s Viewer</p>
          <p class="text-[10.5px] text-zinc-500 truncate">via Teleport · tsh</p>
        </div>
      </div>
    </div>

    <!-- Cluster status -->
    <div class="sidebar__status px-3 pb-3">
      <div class="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2">
        <div class="flex items-center gap-1.5">
          <NIcon :component="cluster.currentCluster ? CircleCheck : CircleX"
                  :size="12"
                  :color="cluster.currentCluster ? '#22c55e' : '#f43f5e'"
                  aria-hidden="true" />
          <span class="text-[10.5px] text-zinc-400 truncate flex-1" :title="cluster.currentCluster?.name ?? '未连接'">
            {{ cluster.currentCluster?.name ?? '未连接' }}
          </span>
        </div>
        <p class="mt-1 text-[10px] text-zinc-500 font-mono truncate">
          ns: <span class="text-zinc-400">{{ cluster.activeNamespace }}</span>
        </p>
      </div>
    </div>

    <!-- Search trigger -->
    <div class="sidebar__search px-3 pb-3">
      <button
        class="w-full flex items-center gap-2 h-7 px-2.5 rounded-md border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 transition-colors text-zinc-500 text-[12px] focus-visible:outline-none focus-visible:border-zinc-600"
        @click="emit('open-palette')"
        aria-label="打开命令面板"
      >
        <NIcon :component="Search" :size="12" />
        <span class="flex-1 text-left">搜索…</span>
        <span class="kbd sidebar__kbd">⌘K</span>
      </button>
    </div>

    <!-- Section: Navigation -->
    <div class="px-3 pb-1.5">
      <p class="section-title sidebar__label">导航</p>
    </div>
    <ul class="px-2 space-y-0.5">
      <li v-for="item in items" :key="item.name">
        <RouterLink
          :to="{ name: item.name }"
          class="sidebar__link group flex items-center gap-2.5 px-2.5 h-8 rounded-md text-[13px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors focus-visible:outline-none focus-visible:bg-zinc-800/50"
          active-class="!text-zinc-50 !bg-zinc-800/80"
          :aria-label="item.label"
        >
          <NIcon :component="item.icon" :size="14" aria-hidden="true" />
          <span class="sidebar__label flex-1">{{ item.label }}</span>
          <NBadge v-if="item.badge" :value="item.badge" :max="9" size="small" />
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
