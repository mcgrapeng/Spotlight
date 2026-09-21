<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  phase: string
  size?: 'sm' | 'md'
}>()

const klass = computed(() => {
  const p = props.phase?.toLowerCase() || 'unknown'
  if (p === 'running') return 'status-dot--running'
  if (p === 'pending') return 'status-dot--pending'
  if (p === 'failed') return 'status-dot--failed'
  if (p === 'succeeded') return 'status-dot--succeeded'
  return 'status-dot--unknown'
})

const color = computed(() => {
  const p = props.phase?.toLowerCase() || 'unknown'
  return {
    running: 'text-emerald-400',
    pending: 'text-amber-400',
    failed: 'text-red-400',
    succeeded: 'text-blue-400',
  }[p] ?? 'text-zinc-400'
})
</script>

<template>
  <span class="inline-flex items-center gap-1.5" :class="color">
    <span class="status-dot" :class="klass" />
    <span :class="size === 'sm' ? 'text-xs' : 'text-sm'">{{ phase }}</span>
  </span>
</template>
