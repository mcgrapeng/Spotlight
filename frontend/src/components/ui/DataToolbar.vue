<script setup lang="ts">
/**
 * DataToolbar — filter / search row that wraps any data table.
 * - role="toolbar" + aria-label for assistive tech
 * - Responsive: wraps to multi-line on small screens
 */
defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="toolbar" role="toolbar" :aria-label="label ?? '筛选工具栏'">
    <slot />
  </div>
</template>
