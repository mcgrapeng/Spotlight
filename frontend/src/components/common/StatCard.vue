<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  hint?: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}>()
</script>

<template>
  <div class="rounded-lg border border-zinc-800 bg-surface-1 px-5 py-4 transition-colors hover:border-zinc-700">
    <p class="section-title mb-2">{{ label }}</p>
    <div class="flex items-baseline gap-2">
      <p
        class="text-3xl font-semibold tracking-tight"
        :class="{
          'text-zinc-50': !tone || tone === 'neutral',
          'text-emerald-400': tone === 'success',
          'text-amber-400': tone === 'warning',
          'text-red-400': tone === 'danger',
          'text-blue-400': tone === 'info',
        }"
      >
        {{ value }}
      </p>
      <p v-if="hint" class="text-xs text-zinc-500">{{ hint }}</p>
    </div>
  </div>
</template>
