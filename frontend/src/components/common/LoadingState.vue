<script setup lang="ts">
import { Loader2 } from '@lucide/vue'

withDefaults(defineProps<{
  message?: string
  fullscreen?: boolean
}>(), {
  message: '加载中…',
  fullscreen: false,
})
</script>

<template>
  <div
    :class="[
      'flex flex-col items-center justify-center gap-3',
      fullscreen ? 'fixed inset-0 bg-background/80 z-50' : 'py-16',
    ]"
    role="status"
    aria-live="polite"
  >
    <Loader2 :size="32" class="animate-spin text-muted-foreground" :stroke-width="1.5" />
    <p class="text-sm text-muted-foreground">{{ message }}</p>
  </div>
</template>
