<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
</script>

<template>
  <!--
    Brand mark — Spotlight.
    Self-contained dark badge carrying the K8s heptagon wheel + eye.
    Same DNA as /public/logo.svg (the favicon), so the logo reads the
    same everywhere: dark rounded square, white heptagon + spokes,
    hollow iris (filled with badge color), K8s blue pupil.
  -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    :width="size"
    :height="size"
  >
    <rect width="24" height="24" rx="5" fill="#18181B" />
    <g
      fill="none"
      stroke="#FAFAFA"
      stroke-width="0.9"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="12,4.5 17.86,7.32 19.31,13.67 15.25,18.76 8.75,18.76 4.69,13.67 6.14,7.32" />
      <line x1="12" y1="12" x2="12" y2="4.5" />
      <line x1="12" y1="12" x2="17.86" y2="7.32" />
      <line x1="12" y1="12" x2="19.31" y2="13.67" />
      <line x1="12" y1="12" x2="15.25" y2="18.76" />
      <line x1="12" y1="12" x2="8.75" y2="18.76" />
      <line x1="12" y1="12" x2="4.69" y2="13.67" />
      <line x1="12" y1="12" x2="6.14" y2="7.32" />
      <circle cx="12" cy="12" r="2.1" fill="#18181B" stroke-width="1" />
    </g>
    <circle cx="12" cy="12" r="0.9" fill="#326CE5" />
  </svg>
</template>