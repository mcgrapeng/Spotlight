<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

/**
 * Ranked restart counts as a bar chart.
 *
 * Not a sparkline: the API returns a ranked list, not a time series, so there
 * is no history to plot. A bar per pod is the honest form — and the bar length
 * is what makes 21,320 vs 1,393 legible at a glance, which a column of
 * numbers did not do.
 */
const props = defineProps<{
  items: Array<{ pod: string; restarts: number }>
}>()

const max = computed(() => Math.max(1, ...props.items.map((i) => i.restarts)))

function shortName(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[parts.length - 1]! : pod
}

function namespaceOf(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[0]! : ''
}

/** Past 1000 restarts the bar saturates and the number carries the detail. */
function tone(count: number): string {
  if (count > 1000) return 'bg-error'
  if (count > 100) return 'bg-error/70'
  if (count > 10) return 'bg-warning'
  return 'bg-muted-foreground/50'
}
</script>

<template>
  <ol class="space-y-2.5">
    <li v-for="item in items" :key="item.pod" class="group">
      <div class="flex items-baseline gap-2 text-xs mb-1">
        <router-link
          :to="{ name: 'pod-detail', params: { namespace: namespaceOf(item.pod), name: shortName(item.pod) } }"
          class="font-mono text-muted-foreground truncate hover:text-foreground hover:underline"
          :title="item.pod"
        >
          {{ shortName(item.pod) }}
        </router-link>
        <span v-if="namespaceOf(item.pod)" class="text-2xs text-muted-foreground shrink-0">
          {{ namespaceOf(item.pod) }}
        </span>
        <span
          class="ml-auto shrink-0 font-mono tabular-nums font-medium"
          :class="item.restarts > 100 ? 'text-error' : 'text-foreground'"
        >
          ×{{ item.restarts.toLocaleString() }}
        </span>
      </div>
      <div class="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          class="h-full rounded-full transition-[width] ease-app duration-500"
          :class="cn(tone(item.restarts))"
          :style="{ width: `${Math.max(2, (item.restarts / max) * 100)}%` }"
        />
      </div>
    </li>
  </ol>
</template>
