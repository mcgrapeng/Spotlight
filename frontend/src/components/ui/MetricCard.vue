<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: string | number | undefined | null
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  loading?: boolean
}>()

const valueColor = computed(() => ({
  neutral: 'text-zinc-100',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger:  'text-red-400',
  info:    'text-sky-400',
}[props.tone || 'neutral']))
</script>

<template>
  <div class="px-5 py-3.5" role="group" :aria-label="`${label}: ${value ?? '加载中'}`">
    <p class="section-title">{{ label }}</p>
    <p
      v-if="!loading"
      :class="['mt-2 text-[22px] font-semibold leading-none tabular-nums tracking-tight', valueColor]"
      aria-live="polite"
    >{{ value ?? '—' }}</p>
    <div v-else class="mt-2 h-[22px] w-12 rounded bg-zinc-800 animate-pulse" aria-hidden="true" />
  </div>
</template>
