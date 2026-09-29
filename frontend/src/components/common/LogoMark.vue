<script setup lang="ts">
withDefaults(defineProps<{ size?: number | string }>(), { size: 24 })
</script>

<template>
  <!--
    Brand mark — Spotlight.
    Two concentric rings with an off-axis focal dot. The rings represent the
    illumination cone (outer) and focus depth (middle); the offset dot is
    the light source. The deliberate asymmetry (rings concentric, dot not)
    carries the meaning: precise framing, lit from an angle.
    Single-color (`currentColor`) so it adapts to any theme.
  -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    :width="size"
    :height="size"
  >
    <!-- Outer ring: the cone of light -->
    <circle
      cx="12"
      cy="12"
      r="9.5"
      stroke="currentColor"
      stroke-width="1.4"
    />
    <!-- Middle ring: the focus boundary -->
    <circle
      cx="12"
      cy="12"
      r="5"
      stroke="currentColor"
      stroke-width="1.4"
    />
    <!-- Focal point: the spotlight source, offset to break the symmetry -->
    <circle
      cx="9.2"
      cy="9.2"
      r="1.6"
      fill="currentColor"
    />
  </svg>
</template>