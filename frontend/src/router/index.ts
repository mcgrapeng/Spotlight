import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: '登录', public: true } },
    { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { title: '总览' } },
    { path: '/pods', name: 'pods', component: () => import('@/views/PodListView.vue'), meta: { title: 'Pods' } },
    { path: '/pods/:namespace/:name', name: 'pod-detail', component: () => import('@/views/PodDetailView.vue'), meta: { title: 'Pod 详情' }, props: true },
    { path: '/nodes', name: 'nodes', component: () => import('@/views/NodesView.vue'), meta: { title: 'Nodes' } },
    { path: '/events', name: 'events', component: () => import('@/views/EventsView.vue'), meta: { title: 'Events' } },
    { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue'), meta: { title: '收藏夹' } },
    { path: '/ai-settings', redirect: '/ai' },
    { path: '/ai', name: 'ai', component: () => import('@/views/AISettingsView.vue'), meta: { title: 'AI 模型' } },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.public) return true
  const auth = useAuthStore()
  // First navigation: refresh status; otherwise we trust the cached value.
  if (auth.status === null) await auth.refreshStatus()
  if (auth.required) {
    return { name: 'login', query: { next: to.fullPath } }
  }
  return true
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? ''} · K8s Viewer`
})

export default router