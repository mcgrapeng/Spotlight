<script setup lang="ts">
import { cn } from '@/lib/utils'

withDefaults(defineProps<{
  rows?: number
  class?: string
}>(), { rows: 3 })
</script>

<template>
  <div :class="cn('space-y-2', $attrs.class as string)">
    <div
      v-for="i in rows"
      :key="i"
      class="h-4 rounded bg-muted animate-pulse"
      :class="i === rows ? 'w-3/4' : 'w-full'"
    />
  </div>
</template>
