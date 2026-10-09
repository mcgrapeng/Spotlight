<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileDrawer from './MobileDrawer.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { STORAGE_KEYS } from '@/storage-keys'

const route = useRoute()
const router = useRouter()
// ponytail: key on path (not fullPath) — query changes (e.g. ?search=foo → ?search=bar)
// would force a full RouterView remount, destroying Pinia-less state and
// re-fetching everything. Path-only key preserves child state across
// query-only nav (filter changes, pagination).
const key = computed(() => route.path)

const collapsed = ref(false)
const mobileOpen = ref(false)
const isMobile = useMediaQuery('(max-width: 767px)')
const SIDEBAR_COLLAPSED_KEY = STORAGE_KEYS.appSidebarCollapsed

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
  const el = e.target as HTMLElement | null
  if (!el) return
  // Skip if user is typing in any text-input surface. isContentEditable also
  // catches rich-text editors (cmdk, contenteditable divs) that aren't
  // INPUT/TEXTAREA/SELECT — without this, typing 'd' inside cmdk would
  // trigger navigation to /dashboard.
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return
  if (el.isContentEditable) return
  // Ponytail: 按钮获得焦点时按字母键不该触发跳转 —— 容易跟按钮本身
  // 的快捷键(以及 aria-label 暗示的行为)冲突。Role="button" 覆盖 SVG-only
  // 图标按钮(<svg><rect transparent /></svg> 这种),用 closest 兼容两种。
  if (el.tagName === 'BUTTON' || el.closest('button, [role="button"]')) return
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
  <!-- sidebar-nav 只在桌面侧栏渲染（移动端是抽屉），别留死锚点 -->
  <a v-if="!isMobile" class="skip-link" href="#sidebar-nav">跳到导航</a>

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