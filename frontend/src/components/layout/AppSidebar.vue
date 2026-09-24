<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  LayoutDashboard, Box, Server, Activity, Star, Sparkles, Settings,
} from '@lucide/vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  collapsed?: boolean
}>(), { collapsed: false })

defineEmits<{
  navigate: []
}>()

const route = useRoute()

const navItems = [
  { path: '/dashboard', label: '总览',    icon: LayoutDashboard },
  { path: '/pods',      label: 'Pods',    icon: Box },
  { path: '/nodes',     label: 'Nodes',   icon: Server },
  { path: '/events',    label: 'Events',  icon: Activity, badge: 3 },
  { path: '/favorites', label: '收藏夹',  icon: Star },
  { path: '/ai',        label: 'AI 模型', icon: Sparkles },
]

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

    <div class="px-2 pt-2 border-t border-sidebar-border">
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
    </div>
  </nav>
</template>
