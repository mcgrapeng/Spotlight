<script setup lang="ts">
import { Inbox } from '@lucide/vue'

withDefaults(defineProps<{
  title?: string
  description?: string
  iconSize?: number
}>(), {
  title: '暂无数据',
  description: '',
  iconSize: 40,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="rounded-full bg-muted p-4 mb-4">
      <slot name="icon">
        <Inbox :size="iconSize" class="text-muted-foreground" :stroke-width="1.5" />
      </slot>
    </div>
    <h3 class="text-base font-semibold text-foreground mb-1">{{ title }}</h3>
    <p v-if="description" class="text-sm text-muted-foreground max-w-md">{{ description }}</p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
