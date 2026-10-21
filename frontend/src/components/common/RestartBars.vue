<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { cn, formatNumber } from '@/lib/utils'
import { restartBarClass, restartTextClass } from '@/lib/restart'

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

// ponytail: 同 PhaseBar —— 第一次有数据时直接画终值，不播「条从 0
// 长到满格」。数据是异步到的，每次进页面都重放一次生长动画，读者第一
// 眼看到的却是一根空条。
const animated = ref(false)
watch(() => props.items.length, (n) => {
  if (n > 0 && !animated.value) {
    nextTick(() => { animated.value = true })
  }
}, { immediate: true })

function shortName(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[parts.length - 1]! : pod
}

function namespaceOf(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[0]! : ''
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
        <span v-if="namespaceOf(item.pod)" class="text-xs text-muted-foreground shrink-0">
          {{ namespaceOf(item.pod) }}
        </span>
        <span
          class="ml-auto shrink-0 font-mono tabular-nums font-semibold text-base"
          :class="restartTextClass(item.restarts)"
        >
          {{ formatNumber(item.restarts) }}
        </span>
      </div>
      <div class="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          class="h-full rounded-full"
          :class="cn(
            restartBarClass(item.restarts),
            animated ? 'transition-[width] ease-app dur-base' : '',
          )"
          :style="{ width: `${Math.max(2, (item.restarts / max) * 100)}%` }"
        />
      </div>
    </li>
  </ol>
</template>
