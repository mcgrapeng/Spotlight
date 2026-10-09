<script setup lang="ts">
import { cn } from '@/lib/utils'

// ponytail: hoist map to module scope — 100-row table × 6 fields no longer
// rebuilds the map object literal on every reactive dep change.
const PHASE_CONFIG: Record<string, { label: string; dotClass: string }> = {
  Running:   { label: 'Running',   dotClass: 'bg-success' },
  Pending:   { label: 'Pending',   dotClass: 'bg-warning' },
  Failed:    { label: 'Failed',    dotClass: 'bg-error' },
  Succeeded: { label: 'Succeeded', dotClass: 'bg-muted-foreground' },
  Unknown:   { label: 'Unknown',   dotClass: 'bg-muted-foreground' },
}

const props = defineProps<{
  phase: string
  class?: string
}>()
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-foreground',
      props.class,
    )"
  >
    <span :class="cn('h-1 w-1 rounded-full', (PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).dotClass)" aria-hidden="true" />
    {{ (PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).label }}
  </span>
</template>