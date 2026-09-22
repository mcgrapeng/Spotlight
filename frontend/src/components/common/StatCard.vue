<script setup lang="ts">
import { computed } from 'vue'
import { NIcon } from 'naive-ui'

const props = defineProps<{
  label: string
  value: string | number
  hint?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  icon?: any  // component
  delta?: { value: number; tone?: 'success' | 'danger' | 'neutral' }
}>()

const accent = computed(() => {
  switch (props.tone) {
    case 'success': return 'from-emerald-500/15 to-emerald-500/0'
    case 'warning': return 'from-amber-500/15 to-amber-500/0'
    case 'danger':  return 'from-red-500/15 to-red-500/0'
    case 'info':    return 'from-sky-500/15 to-sky-500/0'
    default:        return 'from-indigo-500/10 to-indigo-500/0'
  }
})

const valueColor = computed(() => ({
  neutral: 'text-zinc-50',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  danger:  'text-red-400',
  info:    'text-sky-400',
}[props.tone || 'neutral']))
</script>

<template>
  <div class="card lift overflow-hidden relative">
    <!-- Top accent gradient strip -->
    <div :class="['absolute top-0 left-0 right-0 h-px bg-gradient-to-r', accent]" />
    <div class="px-5 py-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="section-title">{{ label }}</p>
          <p :class="['mt-2 text-[26px] font-semibold tracking-tight tabular-nums leading-none', valueColor]">
            {{ value }}
          </p>
          <p v-if="hint" class="mt-1.5 text-[11.5px] text-zinc-500 truncate">{{ hint }}</p>
        </div>
        <div v-if="icon" class="w-9 h-9 rounded-md flex items-center justify-center bg-zinc-800/60 border border-zinc-700/40 shrink-0">
          <NIcon :component="icon" :size="16" class="text-zinc-400" />
        </div>
      </div>
      <div v-if="delta" class="mt-2 flex items-center gap-1 text-[11.5px]">
        <span :class="{
          'text-emerald-400': delta.tone === 'success',
          'text-red-400': delta.tone === 'danger',
          'text-zinc-400': !delta.tone || delta.tone === 'neutral',
        }">
          {{ delta.value > 0 ? '+' : '' }}{{ delta.value }}
        </span>
        <span class="text-zinc-500">vs last hour</span>
      </div>
    </div>
  </div>
</template>
