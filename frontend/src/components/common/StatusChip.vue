<script setup lang="ts">
import { cn } from '@/lib/utils'
import { chipClasses, chipDotClass, type ChipTone } from '@/lib/chip'

/**
 * One chip for every status, severity and phase in the app.
 *
 * The appearance lives in `@/lib/chip` so LogViewer can resolve it to a class
 * string without paying for a component instance on every log row.
 */
const props = withDefaults(
  defineProps<{
    tone: ChipTone
    label: string
    /** sm = text-xs, xs = text-2xs (log rows, inline metadata) */
    size?: 'sm' | 'xs'
    /** soft = tinted surface, solid = filled, bare = text only */
    variant?: 'soft' | 'solid' | 'bare'
    /** status dot, for object state (Ready / Running) */
    dot?: boolean
    class?: string
  }>(),
  { size: 'sm', variant: 'soft', dot: false },
)
</script>

<template>
  <span :class="cn(chipClasses(props), props.class)">
    <span
      v-if="props.dot"
      :class="cn('h-1 w-1 rounded-full shrink-0', chipDotClass(props.tone))"
      aria-hidden="true"
    />
    {{ props.label }}
  </span>
</template>
