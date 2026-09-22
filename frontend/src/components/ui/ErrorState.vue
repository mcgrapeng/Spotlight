<script setup lang="ts">
/**
 * ErrorState — friendly error UI.
 * - Shows the message, an optional cause, and a retry button
 * - role="alert" so screen readers announce it immediately
 */
defineProps<{
  title?: string
  message: string
  cause?: string
  /** Optional retry handler */
  onRetry?: () => void
}>()
</script>

<template>
  <div class="error-state" role="alert">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="text-red-400">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    <p class="text-zinc-100 text-[14px] font-medium mt-3">{{ title ?? '出错了' }}</p>
    <p class="text-zinc-400 text-[12.5px] mt-1 max-w-md leading-relaxed">{{ message }}</p>
    <pre v-if="cause" class="mt-3 px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-[11.5px] text-zinc-500 max-w-md overflow-auto whitespace-pre-wrap break-all font-mono">{{ cause }}</pre>
    <button
      v-if="onRetry"
      class="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-[12.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      @click="onRetry"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
      重试
    </button>
  </div>
</template>

<style scoped>
.error-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 24px;
  text-align: center;
  min-height: 320px;
}
</style>
