<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { NIcon, NBadge } from 'naive-ui'
import {
  Dashboard, Box, Server, AlertTriangle, Star, Robot, Keyboard,
  CircleCheck, Search,
} from '@vicons/tabler'
import { useClusterStore } from '@/stores/cluster'

const route = useRoute()
const cluster = useClusterStore()

const items = [
  { name: 'dashboard', label: '总览', icon: Dashboard, shortcut: 'g d' },
  { name: 'pods', label: 'Pods', icon: Box, shortcut: 'g p' },
  { name: 'nodes', label: 'Nodes', icon: Server, shortcut: 'g n' },
  { name: 'events', label: 'Events', icon: AlertTriangle, badge: 3, shortcut: 'g e' },
  { name: 'favorites', label: '收藏夹', icon: Star, shortcut: 'g f' },
  { name: 'ai', label: 'AI 模型', icon: Robot, shortcut: 'g a' },
]

const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items
  return items.filter((i) => i.label.toLowerCase().includes(q) || i.name.includes(q))
})

const stats = computed(() => ({
  cluster: cluster.currentCluster?.name ?? '未连接',
  ns: cluster.activeNamespace,
}))
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Search -->
    <div class="px-4 pt-4 pb-3">
      <div class="flex items-center gap-2 px-2.5 h-8 rounded-md bg-zinc-900 border border-zinc-800 focus-within:border-indigo-500/60 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,.15)] transition-all">
        <NIcon :component="Search" :size="14" class="text-zinc-500" />
        <input v-model="search" type="text" placeholder="搜索..."
               class="flex-1 bg-transparent border-0 outline-none text-[12.5px] text-zinc-200 placeholder-zinc-500" />
        <span class="kbd">⌘K</span>
      </div>
    </div>

    <!-- Section: 导航 -->
    <div class="px-3 pb-1.5 pt-1">
      <p class="section-title px-3">导航</p>
    </div>
    <nav class="px-2">
      <RouterLink v-for="item in filtered" :key="item.name" :to="{ name: item.name }"
        class="group flex items-center gap-2.5 px-3 py-1.5 mx-1 rounded-md text-[13px] text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors relative"
        active-class="!text-zinc-50 !bg-indigo-500/12 hover:!bg-indigo-500/16">
        <!-- Active accent bar -->
        <span class="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-indigo-500 -translate-x-1 group-[.router-link-active]:translate-x-0 transition-transform" />
        <NIcon :component="item.icon" :size="16" />
        <span class="flex-1">{{ item.label }}</span>
        <span class="kbd opacity-0 group-hover:opacity-100 transition-opacity !text-[10px]">{{ item.shortcut }}</span>
        <NBadge v-if="item.badge" :value="item.badge" :max="9" size="small" />
      </RouterLink>
    </nav>

    <!-- Section: 资源 -->
    <div class="px-3 pb-1.5 pt-6">
      <p class="section-title px-3">资源</p>
    </div>
    <div class="px-4">
      <div class="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-[11.5px] text-zinc-400 leading-relaxed">
        <div class="flex items-center gap-1.5 text-zinc-300 mb-1.5">
          <NIcon :component="CircleCheck" :size="12" color="#10b981" />
          <span class="font-medium text-zinc-300 truncate">{{ stats.cluster }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <NIcon :component="Keyboard" :size="12" class="text-zinc-500" />
          <span class="text-zinc-500">通过 <span class="kbd">tsh</span> 注入 kubeconfig</span>
        </div>
      </div>
    </div>

    <!-- Bottom: keyboard hints -->
    <div class="mt-auto px-4 py-3 border-t border-zinc-800/60">
      <div class="flex items-center justify-between text-[10.5px] text-zinc-500">
        <span class="flex items-center gap-1">
          <span class="kbd">⌘K</span>
          <span>命令面板</span>
        </span>
        <span>v2.0</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active { /* sentinel — see active-class above */ }
</style>
