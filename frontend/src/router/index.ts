import { watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getI18n } from '@/i18n'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { titleKey: 'route.login', public: true } },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { titleKey: 'route.dashboard' } },
    { path: '/pods', name: 'pods', component: () => import('@/views/PodListView.vue'), meta: { titleKey: 'route.pods' } },
    { path: '/pods/:namespace/:name', name: 'pod-detail', component: () => import('@/views/PodDetailView.vue'), meta: { titleKey: 'route.podDetail' }, props: true },
    { path: '/nodes', name: 'nodes', component: () => import('@/views/NodesView.vue'), meta: { titleKey: 'route.nodes' } },
    { path: '/events', name: 'events', component: () => import('@/views/EventsView.vue'), meta: { titleKey: 'route.events' } },
    { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue'), meta: { titleKey: 'route.favorites' } },
    { path: '/ai-settings', redirect: '/ai' },
    { path: '/ai', name: 'ai', component: () => import('@/views/AISettingsView.vue'), meta: { titleKey: 'route.ai' } },
    { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue'), meta: { titleKey: 'route.settings' } },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // Always resolve the server's auth posture first, including on /login.
  // LoginView renders its credential fields from `auth.status.provider`, so
  // skipping this for public routes made a direct visit to /login (bookmark,
  // hard refresh, shared sign-in link) render a form with zero fields and a
  // submit that always reports "wrong password".
  if (auth.status === null) await auth.refreshStatus()
  if (to.meta.public) return true
  // First navigation: refresh status; otherwise we trust the cached value.
  if (auth.required) {
    return { name: 'login', query: { next: to.fullPath } }
  }
  return true
})

// `useI18n()` is unavailable here: `main.ts` imports this module before it calls
// `app.use(getI18n())`, so no plugin is installed and no component instance is
// active yet. The global composer is the only thing safe at module scope.
const i18n = getI18n()
const t = (key: string) => i18n.global.t(key)
const applyTitle = (key: string | undefined) => {
  document.title = `${key ? t(key) : ''} · Spotlight`
  document.documentElement.lang = String(i18n.global.locale.value)
}

router.afterEach((to) => {
  applyTitle(to.meta.titleKey as string | undefined)
})

// Titles are locale-dependent, so a language switch must recompute them.
watch(i18n.global.locale, () => {
  applyTitle(router.currentRoute.value.meta.titleKey as string | undefined)
})

export default router