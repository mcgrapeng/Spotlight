<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const route = useRoute()
const key = computed(() => route.fullPath)
</script>

<template>
  <div class="app-shell">
    <header class="app-shell__header"><AppHeader /></header>
    <aside class="app-shell__sidebar"><AppSidebar /></aside>
    <main class="app-shell__main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="key" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
