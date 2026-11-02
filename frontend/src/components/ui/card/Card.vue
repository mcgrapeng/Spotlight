<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    :class="
      cn(
        // ponytail: 之前是 rounded-lg (10px)，而 main.css 定义的 --radius-card
        // (12px) 全项目零引用 —— 注释里写的「卡片比控件更圆」从没成立过。
        'rounded-card border bg-card text-card-foreground shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
