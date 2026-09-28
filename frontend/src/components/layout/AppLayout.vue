<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileDrawer from './MobileDrawer.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const SIDEBAR_COLLAPSED_KEY = 'fathom-sidebar-collapsed'

const route = useRoute()
const router = useRouter()
const key = computed(() => route.fullPath)

const collapsed = ref(false)
const mobileOpen = ref(false)
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
  { combo: 'g d', handler: () => router.push({ name: 'dashboard' }) },
  { combo: 'g p', handler: () => router.push({ name: 'pods' }) },
  { combo: 'g n', handler: () => router.push({ name: 'nodes' }) },
  { combo: 'g e', handler: () => router.push({ name: 'events' }) },
  { combo: 'g f', handler: () => router.push({ name: 'favorites' }) },
  { combo: 'g a', handler: () => router.push({ name: 'ai' }) },
])

function onGlobalKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
  const routes: Record<string, string> = {
    d: 'dashboard', p: 'pods', n: 'nodes', e: 'events', f: 'favorites', a: 'ai',
  }
  const name = routes[e.key.toLowerCase()]
  if (name) { e.preventDefault(); router.push({ name }) }
}

onMounted(() => document.addEventListener('keydown', onGlobalKey))
onUnmounted(() => document.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到主内容</a>

  <div class="min-h-screen bg-background flex flex-col">
    <header class="shrink-0 border-b border-sidebar-border">
      <AppHeader
          :sidebar-collapsed="collapsed"
          @open-mobile-menu="mobileOpen = true"
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
        <AppSidebar :collapsed="collapsed" />
      </aside>

      <main
        id="main-content"
        class="flex-1 min-w-0 overflow-x-auto"
        tabindex="-1"
      >
        <div class="container py-6 md:py-8">
          <RouterView v-slot="{ Component }">
            <component :is="Component" :key="key" />
          </RouterView>
        </div>
      </main>
    </div>
  </div>

  <MobileDrawer :open="mobileOpen" @close="mobileOpen = false" />
</template>