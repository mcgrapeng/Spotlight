<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Loader2 } from '@lucide/vue'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  message?: string
  fullscreen?: boolean
}>(), {
  fullscreen: false,
})

// ponytail: 同 EmptyState —— computed 而非 withDefaults default，切语言时不会留旧文案。
const text = computed(() => props.message ?? t('state.loading'))
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
    <p class="text-sm text-muted-foreground">{{ text }}</p>
  </div>
</template>
