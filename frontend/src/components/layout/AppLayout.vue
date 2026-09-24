<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const SIDEBAR_COLLAPSED_KEY = 'k8s-viewer-sidebar-collapsed'

const route = useRoute()
const router = useRouter()
const palette = ref<InstanceType<typeof CommandPalette> | null>(null)
const key = computed(() => route.fullPath)

const collapsed = ref(false)
const isMobile = useMediaQuery('(max-width: 767px)')

onMounted(() => {
  const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
  if (stored !== null) collapsed.value = stored === 'true'
})

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed.value))
}

useKeyboardShortcuts(() => [
  { combo: 'mod+k', label: 'Command Palette', handler: () => palette.value?.open() },
  { combo: '?', handler: () => palette.value?.open() },
  { combo: 'g d', handler: () => router.push({ name: 'dashboard' }) },
  { combo: 'g p', handler: () => router.push({ name: 'pods' }) },
  { combo: 'g n', handler: () => router.push({ name: 'nodes' }) },
  { combo: 'g e', handler: () => router.push({ name: 'events' }) },
  { combo: 'g f', handler: () => router.push({ name: 'favorites' }) },
  { combo: 'g a', handler: () => router.push({ name: 'ai' }) },
])
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到主内容</a>

  <div class="min-h-screen bg-background flex flex-col">
    <header class="shrink-0 border-b border-sidebar-border">
      <AppHeader
          :sidebar-collapsed="collapsed"
          @open-palette="palette?.open()"
          @toggle-sidebar="toggleCollapsed"
      />
    </header>

    <div class="flex-1 flex min-h-0">
      <aside
        v-if="!isMobile"
        class="shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 overflow-hidden"
        :class="collapsed ? 'w-16' : 'w-[200px]'"
        aria-label="主导航"
      >
        <AppSidebar />
      </aside>

      <main
        id="main-content"
        class="flex-1 min-w-0 overflow-x-auto"
        tabindex="-1"
      >
        <div class="container py-6 md:py-8">
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" :key="key" />
            </Transition>
          </RouterView>
        </div>
      </main>
    </div>
  </div>

  <CommandPalette ref="palette" />
</template>