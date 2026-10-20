<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/components/layout/AppLayout.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import { useClusterStore } from '@/stores/cluster'
import { useTheme } from '@/composables/useTheme'

const cluster = useClusterStore()
const route = useRoute()
const { resolved: theme } = useTheme()

// ponytail: 登录页不该渲染在应用外壳里。
// 之前 App.vue 无条件用 AppLayout 包 router-view，于是未认证用户看到的是
// 侧栏 + 集群/namespace 选择器 + 语言切换器 —— 一个他还进不去的应用的导航。
// 功能上也不对：未登录时能浏览集群上下文。
const isBareRoute = computed(() => route.name === 'login')

onMounted(async () => {
  // restore() now runs in the store body, so a consumer reading activeCluster
  // during its own setup already sees the restored value.
  await cluster.loadClusters()
  await cluster.loadNamespaces()
})
</script>

<template>
  <router-view v-if="isBareRoute" />
  <AppLayout v-else>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppLayout>

  <CommandPalette v-if="!isBareRoute" />

  <Toaster position="bottom-right" :theme="theme" />
</template>
