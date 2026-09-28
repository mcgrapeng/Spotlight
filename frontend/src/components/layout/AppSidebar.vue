<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
  PanelLeftClose, PanelLeftOpen,
} from '@lucide/vue'
import { cn } from '@/lib/utils'
import { eventsApi } from '@/api/endpoints'
import { useClusterStore } from '@/stores/cluster'

const props = withDefaults(defineProps<{
  collapsed?: boolean
}>(), { collapsed: false })

defineEmits<{
  navigate: []
  'toggle-sidebar': []
}>()

const route = useRoute()
const cluster = useClusterStore()
const eventBadge = ref<number>(0)
let badgeTimer: ReturnType<typeof setInterval> | null = null

async function refreshEventBadge() {
  if (!cluster.activeCluster) {
    eventBadge.value = 0
    return
  }
  const cacheKey = `cached:events-badge:${cluster.activeCluster}`
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const { value, ts } = JSON.parse(cached)
      if (Date.now() - ts < 30_000) eventBadge.value = value
    }
    const events = await eventsApi.list({
      cluster: cluster.activeCluster,
      namespace: '_all',
      limit: 500,
    })
    // ponytail: count = 告警源数量（与 /events 列表行数一致）。每条 event 的
    // count 字段（重复触发次数）只在 row 内部显示，避免 badge 与列表对不上。
    const warns = events.filter(e => e.type === 'Warning').length
    eventBadge.value = warns
    localStorage.setItem(cacheKey, JSON.stringify({ value: warns, ts: Date.now() }))
  } catch {
    /* silent — badge stays at last known value */
  }
}

onMounted(() => {
  refreshEventBadge()
  badgeTimer = setInterval(refreshEventBadge, 60_000)
})
onUnmounted(() => {
  if (badgeTimer) clearInterval(badgeTimer)
})
watch(() => cluster.activeCluster, refreshEventBadge)

const navItems = computed(() => [
  { path: '/dashboard', label: '总览',    icon: LayoutDashboard, badge: 0 },
  { path: '/pods',      label: 'Pods',    icon: Box, badge: 0 },
  { path: '/nodes',     label: 'Nodes',   icon: Server, badge: 0 },
  { path: '/events',    label: 'Events',  icon: Activity, badge: eventBadge.value },
  { path: '/favorites', label: '收藏夹',  icon: Star, badge: 0 },
  { path: '/ai',        label: 'AI 模型', icon: Sparkles, badge: 0 },
])

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + '/')
</script>

<template>
  <nav class="flex flex-col h-full py-3" aria-label="主导航">
    <div class="flex-1 px-2 flex flex-col gap-0.5">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent',
          isActive(item.path)
            ? 'bg-foreground text-background hover:bg-foreground/90'
            : 'text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <component
          :is="item.icon"
          :size="18"
          :stroke-width="1.75"
          class="shrink-0"
          aria-hidden="true"
        />
        <span v-if="!props.collapsed" class="flex-1 truncate">{{ item.label }}</span>
        <span
          v-if="!props.collapsed && item.badge"
          class="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-error text-error-foreground text-2xs font-semibold"
        >
          {{ item.badge }}
        </span>
      </router-link>
    </div>

    <div class="px-2 pt-2 border-t border-sidebar-border flex flex-col gap-0.5">
      <router-link
        to="/settings"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent',
          isActive('/settings')
            ? 'bg-foreground text-background hover:bg-foreground/90'
            : 'text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
      >
        <Settings :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">设置</span>
      </router-link>
      <!-- ponytail: 折叠按钮贴在 sidebar 自己身上 —— 视觉归属清晰，logo 不被抢位 -->
      <button
        type="button"
        :class="cn(
          'flex items-center gap-3 rounded-md text-sm font-medium transition-colors',
          'hover:bg-sidebar-accent text-sidebar-foreground',
          props.collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-9',
        )"
        :aria-label="props.collapsed ? '展开侧边栏' : '收起侧边栏'"
        :title="props.collapsed ? '展开侧边栏' : '收起侧边栏'"
        @click="$emit('toggle-sidebar')"
      >
        <PanelLeftOpen v-if="props.collapsed" :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <PanelLeftClose v-else :size="18" :stroke-width="1.75" class="shrink-0" aria-hidden="true" />
        <span v-if="!props.collapsed">收起侧边栏</span>
      </button>
    </div>
  </nav>
</template>
