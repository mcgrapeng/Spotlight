<script setup lang="ts">
import { cn } from '@/lib/utils'

defineProps<{
  title: string
  subtitle?: string
  /**
   * 标题的额外 class。有些标题是身份串（Pod 名），要等宽 + 限行；有些
   * 是普通标题（总览、节点），用默认的 sans 就好。
   */
  titleClass?: string
}>()
</script>

<template>
  <header class="border-b border-border pb-4">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <!--
          break-words：Pod 名可能很长。它得能折行，而不是把标题块顶到
          0 宽（flex-1 + min-w-0 允许标题被挤没，那屏幕上就只剩一个
          被截断的字母）。加上标题区的动作本身要放得下 390px。
        -->
        <h1 :class="cn('text-2xl font-bold tracking-tight break-words', titleClass)">{{ title }}</h1>
        <p v-if="subtitle" class="mt-1 text-sm text-muted-foreground break-words">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-2 shrink-0">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="$slots.extra" class="mt-4">
      <slot name="extra" />
    </div>
  </header>
</template>