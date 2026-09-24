<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  phase: string
  class?: string
}>()

const config = computed(() => {
  const map: Record<string, { label: string; dotClass: string }> = {
    Running:   { label: 'Running',   dotClass: 'bg-success' },
    Pending:   { label: 'Pending',   dotClass: 'bg-warning' },
    Failed:    { label: 'Failed',    dotClass: 'bg-error' },
    Succeeded: { label: 'Succeeded', dotClass: 'bg-muted-foreground' },
    Unknown:   { label: 'Unknown',   dotClass: 'bg-muted-foreground' },
  }
  return map[props.phase] ?? map.Unknown
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-foreground',
      props.class
    )"
    role="status"
    :aria-label="`Pod phase: ${config.label}`"
  >
    <span :class="cn('h-1 w-1 rounded-full', config.dotClass)" aria-hidden="true" />
    {{ config.label }}
  </span>
</template>