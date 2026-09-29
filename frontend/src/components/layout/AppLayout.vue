<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileDrawer from './MobileDrawer.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const SIDEBAR_COLLAPSED_KEY = 'spotlight-sidebar-collapsed'

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
  <!-- ponytail: skip-link 在 AppLayout 唯一渲染一次，App.vue 旧副本删除
       (Audit §2.1)。两个目的地：#main-content 给主内容，#sidebar-nav 给导航。 -->
  <a class="skip-link" href="#main-content">跳到主内容</a>
  <a class="skip-link" href="#sidebar-nav">跳到导航</a>

  <div class="min-h-screen bg-background flex flex-col">
    <header class="shrink-0 border-b border-sidebar-border">
      <AppHeader
          @open-mobile-menu="mobileOpen = true"
      />
    </header>

    <div class="flex-1 flex min-h-0">
      <aside
        v-if="!isMobile"
        class="shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 overflow-hidden"
        :class="collapsed ? 'w-16' : 'w-[200px]'"
        aria-label="主导航"
      >
        <nav
          v-if="!isMobile"
          id="sidebar-nav"
          tabindex="-1"
          class="h-full focus:outline-none"
          aria-label="主导航"
        >
          <AppSidebar :collapsed="collapsed" @toggle-sidebar="toggleCollapsed" />
        </nav>
      </aside>

      <main
        id="main-content"
        class="flex-1 min-w-0 overflow-x-auto focus:outline-none"
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