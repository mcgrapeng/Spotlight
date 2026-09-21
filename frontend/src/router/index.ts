import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: '总览' },
    },
    {
      path: '/pods',
      name: 'pods',
      component: () => import('@/views/PodListView.vue'),
      meta: { title: 'Pods' },
    },
    {
      path: '/pods/:namespace/:name',
      name: 'pod-detail',
      component: () => import('@/views/PodDetailView.vue'),
      meta: { title: 'Pod 详情' },
      props: true,
    },
    {
      path: '/nodes',
      name: 'nodes',
      component: () => import('@/views/NodesView.vue'),
      meta: { title: 'Nodes' },
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@/views/EventsView.vue'),
      meta: { title: 'Events' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: { title: '收藏夹' },
    },
  ],
})

router.afterEach((to) => {
  document.title = `${to.meta.title ?? ''} · K8s Viewer`
})

export default router
