<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { cn } from '@/lib/utils'
import LogoMark from '@/components/common/LogoMark.vue'
import ClusterCombobox from '@/components/common/ClusterCombobox.vue'
import NamespaceCombobox from '@/components/common/NamespaceCombobox.vue'

defineEmits<{
  'open-mobile-menu': []
}>()
</script>

<template>
  <div
    class="sticky top-0 z-40 flex items-center gap-2 md:gap-3 h-11 md:h-14 px-3 md:px-5 border-b bg-background"
  >
    <!-- mobile only: hamburger 触发 drawer；desktop 下让出最左给 logo -->
    <button
      type="button"
      class="md:hidden inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="打开菜单"
      @click="$emit('open-mobile-menu')"
    >
      <Menu :size="18" :stroke-width="1.75" aria-hidden="true" />
    </button>

    <router-link
      to="/dashboard"
      :class="cn(
        'group flex items-center gap-2 mr-1 md:mr-2 rounded-md py-1 pr-1',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )"
      aria-label="Fathom 首页"
    >
      <span class="inline-flex items-center justify-center size-7 md:size-8 text-foreground">
        <LogoMark :size="28" />
      </span>
      <span class="hidden sm:flex flex-col leading-none">
        <span class="text-sm font-semibold tracking-tight text-foreground">Fathom</span>
        <span class="text-[10px] font-medium tracking-wide text-muted-foreground mt-0.5">集群驾驶舱</span>
      </span>
    </router-link>

    <div class="flex items-center gap-2 min-w-0">
      <ClusterCombobox />
      <NamespaceCombobox />
    </div>

    <div class="flex-1" />
  </div>
</template>
