<script setup lang="ts">
import { computed } from 'vue'

/**
 * Pod phase distribution as one stacked bar.
 *
 * Hand-drawn SVG rather than a chart library: the whole thing is four
 * rectangles, the colors come from the same semantic tokens as the rest of
 * the app, and it costs no dependency. A chart library would bring its own
 * visual language and fight the token system over one bar.
 */
export interface PhaseSlice {
  key: string
  label: string
  value: number
  /** A CSS color. Token references like hsl(var(--success)) work. */
  color: string
}

const props = withDefaults(defineProps<{
  slices: PhaseSlice[]
  height?: string
}>(), {
  height: '10px',
})

const total = computed(() => props.slices.reduce((acc, s) => acc + s.value, 0))

/** Layout in a 1000-unit viewBox; the SVG scales to the container width. */
const segments = computed(() => {
  let x = 0
  return props.slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const w = total.value > 0 ? (s.value / total.value) * 1000 : 0
      const seg = { ...s, x, w }
      x += w
      return seg
    })
})

const ariaLabel = computed(() => props.slices.map((s) => `${s.label} ${s.value}`).join(', '))
</script>

<template>
  <div
    class="rounded-full overflow-hidden bg-muted"
    :style="{ height }"
    role="img"
    :aria-label="ariaLabel"
  >
    <svg
      class="block w-full h-full"
      viewBox="0 0 1000 10"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        v-for="seg in segments"
        :key="seg.key"
        :x="seg.x"
        :y="0"
        :width="seg.w"
        height="10"
        :style="{ fill: seg.color }"
      />
    </svg>
  </div>
</template>
