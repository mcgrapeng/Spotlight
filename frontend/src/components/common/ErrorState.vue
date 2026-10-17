<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const { t } = useI18n()
const props = withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  message: '',
})

// ponytail: 同 EmptyState —— computed 而非 withDefaults default，切语言时不会留旧文案。
const heading = computed(() => props.title ?? t('state.error'))

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-error-bg p-4 mb-4">
      <AlertCircle :size="32" class="text-error" :stroke-width="1.5" />
    </div>
    <h3 class="text-base font-semibold text-foreground mb-1">{{ heading }}</h3>
    <p v-if="message" class="text-sm text-muted-foreground max-w-md mb-4">{{ message }}</p>
    <Button @click="$emit('retry')">{{ t('state.retry') }}</Button>
  </div>
</template>
