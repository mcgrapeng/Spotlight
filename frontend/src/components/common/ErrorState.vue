<script setup lang="ts">
import { AlertCircle } from '@lucide/vue'
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: '加载失败',
  message: '',
})

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-error-bg p-4 mb-4">
      <AlertCircle :size="32" class="text-error" :stroke-width="1.5" />
    </div>
    <h3 class="text-base font-semibold text-foreground mb-1">{{ title }}</h3>
    <p v-if="message" class="text-sm text-muted-foreground max-w-md mb-4">{{ message }}</p>
    <Button @click="$emit('retry')">重试</Button>
  </div>
</template>
