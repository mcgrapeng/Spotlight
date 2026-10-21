<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

/**
 * Pod phase distribution as one stacked bar.
 *
 * Hand-drawn rather than a chart library: the whole thing is a handful of
 * rectangles, the colors come from the same semantic tokens as the rest of
 * the app, and it costs no dependency. A chart library would bring its own
 * visual language and fight the token system over one bar.
 *
 * ponytail: 之前是 SVG + `preserveAspectRatio="none"`，靠 1000 单位的
 * viewBox 映射宽度 —— 画得准，但宽度一变就是硬切，CSS 没法过渡
 * （SVG 的 width 作为 CSS 属性虽然可以过渡，跨浏览器不稳）。
 * 换成 flex 子元素 + 百分比宽度，同一根条就和 RestartBars 一样能
 * 动，口径统一。
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

/** Widths as a percentage of the bar; zero-value slices are dropped. */
const segments = computed(() =>
  props.slices
    .filter((s) => s.value > 0)
    .map((s) => ({
      ...s,
      pct: total.value > 0 ? (s.value / total.value) * 100 : 0,
    })),
)

// ponytail: 第一次有数据时不播「条从 0 长到 90%」。
//
// 数据是异步到的，所以条形图第一次出现就已经是终值 —— 但宽度过渡的类
// 一直在，于是每次进页面都重放一次生长动画。读数字的人第一眼看到的是
// 一根空条，等它长完才知道有多长；那个动画跟「数据变了」没关系，它
// 只是「我进场了」。
//
// 所以过渡只从「第二次」开始：先画终值，再把过渡打开。
const animated = ref(false)
watch(segments, (s) => {
  if (s.length > 0 && !animated.value) {
    nextTick(() => { animated.value = true })
  }
}, { immediate: true })

const ariaLabel = computed(() => props.slices.map((s) => `${s.label} ${s.value}`).join(', '))
</script>

<template>
  <div
    class="flex w-full overflow-hidden rounded-full bg-muted"
    :style="{ height }"
    role="img"
    :aria-label="ariaLabel"
  >
    <div
      v-for="seg in segments"
      :key="seg.key"
      class="h-full shrink-0"
      :class="animated ? 'transition-[width] ease-app dur-base' : ''"
      :style="{ width: seg.pct + '%', background: seg.color }"
    />
  </div>
</template>
