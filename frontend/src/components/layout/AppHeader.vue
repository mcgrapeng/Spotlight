<script setup lang="ts">
import { Menu, PanelLeftClose, PanelLeftOpen, Command } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ClusterCombobox from '@/components/common/ClusterCombobox.vue'
import NamespaceCombobox from '@/components/common/NamespaceCombobox.vue'

withDefaults(defineProps<{
  sidebarCollapsed?: boolean
}>(), { sidebarCollapsed: false })

defineEmits<{
  'open-mobile-menu': []
  'toggle-sidebar': []
}>()
</script>

<template>
  <div
    class="sticky top-0 z-40 flex items-center gap-2 md:gap-3 h-11 md:h-14 px-3 md:px-5 border-b bg-background"
  >
    <button
      type="button"
      class="md:hidden inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="打开菜单"
      @click="$emit('open-mobile-menu')"
    >
      <Menu :size="18" :stroke-width="1.75" aria-hidden="true" />
    </button>

    <button
      type="button"
      class="hidden md:inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :aria-label="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
      @click="$emit('toggle-sidebar')"
    >
      <PanelLeftOpen v-if="sidebarCollapsed" :size="18" :stroke-width="1.75" aria-hidden="true" />
      <PanelLeftClose v-else :size="18" :stroke-width="1.75" aria-hidden="true" />
    </button>

    <router-link
      to="/dashboard"
      :class="cn(
        'flex items-center gap-2 mr-1 md:mr-2 rounded-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )"
      aria-label="K8s Viewer 首页"
    >
      <span class="inline-flex items-center justify-center size-7 md:size-8 rounded-md bg-foreground text-background text-xs font-bold tracking-tight">
        K8
      </span>
      <span class="hidden sm:inline text-sm font-semibold tracking-tight">K8s Viewer</span>
    </router-link>

    <div class="flex items-center gap-2 min-w-0">
      <ClusterCombobox />
      <NamespaceCombobox />
    </div>

    <div class="flex-1" />

    <kbd class="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted text-2xs font-mono text-muted-foreground">
      <Command :size="10" :stroke-width="2" /> K
    </kbd>
  </div>
</template>
