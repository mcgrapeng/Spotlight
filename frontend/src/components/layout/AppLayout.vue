<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const route = useRoute()
const router = useRouter()
const palette = ref<InstanceType<typeof CommandPalette> | null>(null)
const key = computed(() => route.fullPath)

useKeyboardShortcuts(() => [
  { combo: 'mod+k', label: 'Command Palette', handler: () => palette.value?.open() },
  { combo: '?', handler: () => palette.value?.open() },
  { combo: 'g d', handler: () => router.push({ name: 'dashboard' }) },
  { combo: 'g p', handler: () => router.push({ name: 'pods' }) },
  { combo: 'g n', handler: () => router.push({ name: 'nodes' }) },
  { combo: 'g e', handler: () => router.push({ name: 'events' }) },
  { combo: 'g f', handler: () => router.push({ name: 'favorites' }) },
  { combo: 'g a', handler: () => router.push({ name: 'ai' }) },
])
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到主内容</a>

  <div class="app-shell">
    <header class="app-shell__header">
      <AppHeader @open-palette="palette?.open()" />
    </header>
    <aside class="app-shell__sidebar" aria-label="主导航">
      <AppSidebar />
    </aside>
    <main class="app-shell__main" id="main-content" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="key" />
        </Transition>
      </RouterView>
    </main>
  </div>

  <CommandPalette ref="palette" />
</template>
