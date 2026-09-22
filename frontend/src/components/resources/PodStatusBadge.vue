<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  phase: string
  size?: 'sm' | 'md'
  showDot?: boolean
}>()

const klass = computed(() => {
  const p = (props.phase ?? '').toLowerCase()
  if (p === 'running') return 'status-pill--running'
  if (p === 'pending') return 'status-pill--pending'
  if (p === 'failed' || p === 'crashloopbackoff') return 'status-pill--failed'
  if (p === 'succeeded') return 'status-pill--succeeded'
  return 'status-pill--unknown'
})
const dotKlass = computed(() => {
  const p = (props.phase ?? '').toLowerCase()
  if (p === 'running') return 'status-dot--running'
  if (p === 'pending') return 'status-dot--pending'
  if (p === 'failed' || p === 'crashloopbackoff') return 'status-dot--failed'
  if (p === 'succeeded') return 'status-dot--succeeded'
  return 'status-dot--unknown'
})
</script>

<template>
  <span :class="['status-pill', klass, size === 'sm' ? 'text-[11px] !px-2 !py-0' : '']">
    <span v-if="showDot !== false" class="status-dot" :class="dotKlass" />
    {{ phase }}
  </span>
</template>
