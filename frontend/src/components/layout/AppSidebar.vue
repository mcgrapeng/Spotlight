<script setup lang="ts">
import { NIcon, NBadge } from 'naive-ui'
import {
  Dashboard,
  Box,
  Server,
  AlertTriangle,
  Star,
} from '@vicons/tabler'

const items = [
  { name: 'dashboard', label: '总览', icon: Dashboard },
  { name: 'pods', label: 'Pods', icon: Box },
  { name: 'nodes', label: 'Nodes', icon: Server },
  { name: 'events', label: 'Events', icon: AlertTriangle, badge: true },
  { name: 'favorites', label: '收藏夹', icon: Star },
]
</script>

<template>
  <nav class="py-4">
    <div class="px-5 pb-3 mb-2 border-b border-zinc-800/60">
      <p class="section-title">导航</p>
    </div>
    <ul class="space-y-0.5">
      <li v-for="item in items" :key="item.name">
        <RouterLink
          :to="{ name: item.name }"
          class="group flex items-center gap-3 px-5 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-surface-2 transition-colors"
          active-class="!text-zinc-50 !bg-surface-2 border-l-2 !border-indigo-500 -ml-px"
        >
          <NIcon :component="item.icon" :size="18" />
          <span class="flex-1">{{ item.label }}</span>
          <NBadge v-if="item.badge" :value="3" :max="9" size="small" />
        </RouterLink>
      </li>
    </ul>

    <div class="px-5 mt-8">
      <p class="section-title mb-3">资源</p>
      <div class="rounded-md border border-zinc-800 bg-surface-1 p-3 text-xs text-zinc-400 leading-relaxed">
        通过 Teleport (<span class="kbd">tsh</span>) 注入 kubeconfig，所有调用经 tsh 代理转发到 K8s API Server。
      </div>
    </div>
  </nav>
</template>
