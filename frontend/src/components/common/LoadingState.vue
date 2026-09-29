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
  <!-- ponytail: LoadingState 视觉容器与 EmptyState/ErrorState 对齐 (Audit §12.5) -->
  <div
    :class="[
      'flex flex-col items-center justify-center gap-3',
      fullscreen ? 'fixed inset-0 bg-background/80 z-50' : 'py-16',
    ]"
    role="status"
    aria-live="polite"
  >
    <div class="rounded-full bg-muted p-4">
      <Loader2 :size="32" class="animate-spin text-muted-foreground" :stroke-width="1.5" aria-hidden="true" />
    </div>
    <p class="text-sm text-muted-foreground">{{ message }}</p>
  </div>
</template>
