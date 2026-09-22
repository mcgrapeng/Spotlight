<script setup lang="ts">
/**
 * EmptyState — universal "no data" placeholder.
 * - Tone: default | error
 * - SVG illustration composed inline (zero asset deps)
 * - ARIA role="status" so screen readers announce it
 */
defineProps<{
  icon?: any  // optional NIcon component
  title: string
  description?: string
  tone?: 'default' | 'success' | 'warning'
}>()
</script>

<template>
  <div class="empty-state" role="status" :aria-live="tone === 'warning' ? 'assertive' : 'polite'">
    <div
      class="empty-state__icon"
      :class="{
        'text-zinc-500': !tone || tone === 'default',
        'text-emerald-500': tone === 'success',
        'text-amber-500': tone === 'warning',
      }"
      aria-hidden="true"
    >
      <component :is="icon" v-if="icon" :size="40" />
      <svg v-else width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 12h6M12 9v6" />
      </svg>
    </div>
    <p class="text-zinc-200 text-[14px] font-medium">{{ title }}</p>
    <p v-if="description" class="text-zinc-500 text-[12.5px] mt-1.5 max-w-md leading-relaxed">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.empty-state__icon { margin-bottom: 14px; opacity: 0.85; }
</style>
