<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/components/layout/AppLayout.vue'
import CommandPalette from '@/components/layout/CommandPalette.vue'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()

onMounted(async () => {
  cluster.restore()
  await cluster.loadClusters()
  await cluster.loadNamespaces()
})
</script>

<template>
  <a href="#main-content" class="skip-link">跳到主内容</a>

  <AppLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppLayout>

  <CommandPalette />

  <Toaster position="bottom-right" theme="light" />
</template>