<script setup lang="ts">
/**
 * LoadingState — full-area loading placeholder.
 * - Two variants: spinner (overlay) | skeleton (table-like rows)
 * - role="status" + aria-live for screen readers
 */
defineProps<{
  variant?: 'spinner' | 'skeleton'
  /** Number of skeleton rows to render */
  rows?: number
  /** Fixed height for skeleton (CSS value) */
  height?: string
  /** Localized label */
  label?: string
}>()
</script>

<template>
  <div
    class="flex items-center justify-center"
    :style="{ minHeight: height ?? '320px' }"
    role="status"
    aria-live="polite"
    :aria-label="label ?? '加载中'"
  >
    <!-- Spinner variant -->
    <div v-if="!variant || variant === 'spinner'" class="flex flex-col items-center gap-3">
      <span class="loading-spinner" aria-hidden="true" />
      <span class="text-zinc-500 text-[12.5px]">{{ label ?? '加载中…' }}</span>
    </div>

    <!-- Skeleton variant -->
    <div v-else class="w-full space-y-2 px-1">
      <div v-for="i in rows ?? 6" :key="i" class="skel" :style="{ width: `${100 - i * 4}%` }" />
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 2.5px solid rgba(255, 255, 255, 0.08);
  border-top-color: #6366f1;
  animation: spin 0.8s linear infinite;
}
.skel {
  height: 14px;
  border-radius: 6px;
  background: linear-gradient(90deg, #1c2027 0%, #262a32 50%, #1c2027 100%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .loading-spinner, .skel { animation: none; }
}
</style>
