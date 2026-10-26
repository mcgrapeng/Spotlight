<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatNumber } from '@/lib/utils'
import { restartTextClass } from '@/lib/restart'

/**
 * Ranked restart counts.
 *
 * This used to be a bar chart. Every bar was `restarts / max`, so a real
 * cluster's top three (21,302 / 21,320 / 21,320) drew three bars of the
 * same length. The chart's whole job is comparison, and after the scaling
 * there was none left to see — three amber underlines. In dark mode those
 * three full-width amber bars were also the loudest thing on the first
 * screen, describing something that is not a failure.
 *
 * A ranking reads better as a ranking: name and count, the leader set
 * apart from the rest, and the comparison the bar chart was reaching for
 * written out as a sentence.
 *
 * The name wraps instead of truncating. On a 390px screen
 * `tempo-distributed-query-65…` twice in a row is two identical rows, and
 * the name is the only thing that identifies the pod.
 */
const props = defineProps<{
  items: Array<{ pod: string; restarts: number }>
}>()

const { t } = useI18n()

/**
 * Sorted by restarts, biggest first.
 *
 * The API already sorts, but the leader row and the dashboard's hero
 * number are computed separately (one takes items[0], the other takes
 * the max). If the two ever disagree, the screen says "21,320 次重启" in
 * the hero and puts 21,302 at the top of the list. Sorting here makes
 * the list the single source of its own order.
 */
const ranked = computed(() =>
  [...props.items].sort((a, b) => b.restarts - a.restarts),
)

function shortName(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[parts.length - 1]! : pod
}

function namespaceOf(pod: string): string {
  const parts = pod.split('/')
  return parts.length > 1 ? parts[0]! : ''
}

function podLink(pod: string) {
  return { name: 'pod-detail', params: { namespace: namespaceOf(pod), name: shortName(pod) } }
}

/**
 * How far the leader is ahead of the runner-up.
 *
 * This is the comparison the bar chart was trying to make. When the top
 * two are the same order of magnitude ("21,320" vs "21,302") the honest
 * answer is "they are the same", and the chart said it with two identical
 * full-width bars. Null means there is no runner-up to compare against.
 */
const lead = computed<number | null>(() => {
  const [first, second] = ranked.value
  if (!first || !second) return null
  return Math.max(0, first.restarts - second.restarts)
})
</script>

<template>
  <ol class="space-y-2">
    <li v-for="(item, i) in ranked" :key="item.pod">
      <!-- 第一名 -->
      <div v-if="i === 0" class="flex items-baseline gap-2">
        <router-link
          :to="podLink(item.pod)"
          class="min-w-0 font-mono text-sm text-foreground break-words hover:underline underline-offset-2"
        >
          {{ shortName(item.pod) }}
        </router-link>
        <span v-if="namespaceOf(item.pod)" class="shrink-0 text-xs text-muted-foreground">
          {{ namespaceOf(item.pod) }}
        </span>
        <span
          class="ml-auto shrink-0 font-mono tabular-nums font-semibold text-xl"
          :class="restartTextClass(item.restarts)"
        >
          {{ formatNumber(item.restarts) }}
        </span>
      </div>
      <p v-if="i === 0 && lead !== null" class="mt-0.5 text-xs text-muted-foreground">
        {{ lead > 0
          ? t('dashboard.restartLeadGap', { count: formatNumber(lead) })
          : t('dashboard.restartLeadTie') }}
      </p>

      <!-- 其余名次 -->
      <div v-else class="flex items-baseline gap-2 text-xs">
        <span class="w-4 shrink-0 tabular-nums text-muted-foreground">{{ i + 1 }}</span>
        <router-link
          :to="podLink(item.pod)"
          class="min-w-0 font-mono text-muted-foreground break-words hover:text-foreground hover:underline underline-offset-2"
        >
          {{ shortName(item.pod) }}
        </router-link>
        <span v-if="namespaceOf(item.pod)" class="shrink-0 text-muted-foreground">
          {{ namespaceOf(item.pod) }}
        </span>
        <span
          class="ml-auto shrink-0 font-mono tabular-nums font-medium"
          :class="restartTextClass(item.restarts)"
        >
          {{ formatNumber(item.restarts) }}
        </span>
      </div>
    </li>
  </ol>
</template>
