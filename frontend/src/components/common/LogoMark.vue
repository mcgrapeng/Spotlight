<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
</script>

<template>
  <!--
    Brand mark: three concentric hexagons. The repeated hex form embodies
    "Fathom" (depth / going inward toward understanding) without resorting to
    a biological eye metaphor.
  -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    :width="size"
    :height="size"
  >
    <!-- Outer hex (cluster boundary) -->
    <path
      d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25L12 2.5Z"
      stroke="currentColor"
      stroke-width="1.9"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Middle hex (first depth layer) -->
    <path
      d="M12 7L17 9.85V14.15L12 17L7 14.15V9.85L12 7Z"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linejoin="round"
      fill="none"
    />
    <!-- Inner hex (the fathom point — filled) -->
    <path
      d="M12 10L14 11.25V13.5L12 14.75L10 13.5V11.25L12 10Z"
      fill="currentColor"
    />
  </svg>
</template>