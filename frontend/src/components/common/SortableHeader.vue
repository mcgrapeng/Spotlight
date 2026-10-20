<script setup lang="ts">
import { ChevronDown, ChevronUp } from '@lucide/vue'
import { cn } from '@/lib/utils'

// ponytail: 表头排序按钮。之前这张表一个能排序的列都没有 ——
// on-call 的第一个动作是「按重启次数倒序找罪魁」，做不到。
// 这里把「当前排序列 + 方向」显式画出来，而不是靠颜色暗示。
defineProps<{
  label: string
  active: boolean
  dir: 'asc' | 'desc'
  align?: 'left' | 'right'
}>()

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <button
    type="button"
    class="group inline-flex items-center gap-1 rounded transition-colors ease-app hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :class="align === 'right' ? 'flex-row-reverse' : ''"
    @click="emit('toggle')"
  >
    <span>{{ label }}</span>
    <ChevronUp v-if="active && dir === 'asc'" :size="12" :stroke-width="2" class="text-foreground shrink-0" aria-hidden="true" />
    <ChevronDown v-else-if="active" :size="12" :stroke-width="2" class="text-foreground shrink-0" aria-hidden="true" />
    <ChevronUp v-else :size="12" :stroke-width="2" class="opacity-0 group-hover:opacity-40 transition-opacity ease-app shrink-0" aria-hidden="true" />
  </button>
</template>
