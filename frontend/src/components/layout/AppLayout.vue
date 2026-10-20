<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaQuery } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import MobileDrawer from './MobileDrawer.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { STORAGE_KEYS } from '@/storage-keys'

const { t } = useI18n()
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
</script>

<template>
  <!-- ponytail: skip-link 在 AppLayout 唯一渲染一次，App.vue 旧副本删除
       (Audit §2.1)。两个目的地：#main-content 给主内容，#sidebar-nav 给导航。 -->
  <a class="skip-link" href="#main-content">{{ t('nav.skipToContent') }}</a>
  <!-- sidebar-nav 只在桌面侧栏渲染（移动端是抽屉），别留死锚点 -->
  <a v-if="!isMobile" class="skip-link" href="#sidebar-nav">{{ t('nav.skipToNav') }}</a>

  <div class="min-h-screen bg-background flex flex-col">
    <!-- ponytail: 边框从 <header> 挪进 AppHeader 自己的 sticky 根节点 ——
         否则两层 border-b 叠出 2px 分隔线，而且外层那条会随页面滚走，
         顶栏固定后底部就没有线了。 -->
    <header class="shrink-0">
      <AppHeader
          @open-mobile-menu="mobileOpen = true"
      />
    </header>

    <div class="flex-1 flex min-h-0">
      <aside
        v-if="!isMobile"
        class="shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 overflow-hidden"
        :class="collapsed ? 'w-16' : 'w-[200px]'"
        :aria-label="t('nav.main')"
      >
        <nav
          v-if="!isMobile"
          id="sidebar-nav"
          tabindex="-1"
          class="h-full focus:outline-none"
          :aria-label="t('nav.main')"
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
