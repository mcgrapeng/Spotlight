<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { PodDensity } from '@/composables/usePodSorting'

// ponytail: 密度切换。表格的默认行高是为「好看」定的，但 SRE 关心的是
// 一屏能扫多少个 Pod。三档：紧凑 / 标准 / 宽松。
const props = defineProps<{
  modelValue: PodDensity
  labels: Record<PodDensity, string>
}>()

const emit = defineEmits<{ 'update:modelValue': [PodDensity] }>()

const TIERS: Array<{ key: PodDensity; lines: number }> = [
  { key: 'compact', lines: 4 },
  { key: 'standard', lines: 3 },
  { key: 'loose', lines: 2 },
]
</script>

<template>
  <div
    role="group"
    class="inline-flex items-center rounded-md border border-border p-0.5"
  >
    <button
      v-for="tier in TIERS"
      :key="tier.key"
      type="button"
      :aria-pressed="props.modelValue === tier.key"
      :title="props.labels[tier.key]"
      :class="cn(
        'inline-flex items-center justify-center gap-[2px] size-6 rounded transition-colors ease-app',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        props.modelValue === tier.key
          ? 'bg-foreground text-background'
          : 'text-muted-foreground hover:text-foreground',
      )"
      @click="emit('update:modelValue', tier.key)"
    >
      <span class="flex flex-col gap-[2px] items-center" aria-hidden="true">
        <span v-for="n in tier.lines" :key="n" class="block h-px w-3 bg-current" />
      </span>
      <span class="sr-only">{{ props.labels[tier.key] }}</span>
    </button>
  </div>
</template>
