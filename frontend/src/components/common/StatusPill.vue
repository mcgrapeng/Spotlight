<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type Variant = 'running' | 'pending' | 'failed' | 'succeeded' | 'unknown'

const props = withDefaults(defineProps<{
  variant?: Variant
  label?: string
  class?: string
}>(), {
  variant: 'unknown',
})

const config = computed(() => {
  const configs: Record<Variant, { label: string; dotClass: string; textClass: string }> = {
    running:   { label: 'Running',   dotClass: 'bg-success',           textClass: 'text-foreground' },
    pending:   { label: 'Pending',   dotClass: 'bg-warning',           textClass: 'text-foreground' },
    failed:    { label: 'Failed',    dotClass: 'bg-error',             textClass: 'text-error' },
    succeeded: { label: 'Succeeded', dotClass: 'bg-muted-foreground',  textClass: 'text-muted-foreground' },
    unknown:   { label: 'Unknown',   dotClass: 'bg-muted-foreground',  textClass: 'text-muted-foreground' },
  }
  return configs[props.variant]
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium',
      'bg-muted',
      config.textClass,
      props.class
    )"
    role="status"
    :aria-label="`Status: ${props.label ?? config.label}`"
  >
    <span
      :class="cn('h-1 w-1 rounded-full', config.dotClass)"
      aria-hidden="true"
    />
    {{ label ?? config.label }}
  </span>
</template>
