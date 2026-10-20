<script setup lang="ts">
import { onMounted } from 'vue'
import { Toaster } from '@/components/ui/sonner'
import AppLayout from '@/components/layout/AppLayout.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import { useClusterStore } from '@/stores/cluster'

const cluster = useClusterStore()

onMounted(async () => {
  // restore() now runs in the store body, so a consumer reading activeCluster
  // during its own setup already sees the restored value.
  await cluster.loadClusters()
  await cluster.loadNamespaces()
})
</script>

<template>
  <AppLayout>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppLayout>

  <CommandPalette />

  <Toaster position="bottom-right" theme="light" />
</template>
