<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { cn, formatNumber } from '@/lib/utils'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  hint?: string
  /** 'plain' = 不格式化 (默认千分位); 'percent' = 拼 %; 'raw' = 原样输出 */
  format?: 'plain' | 'percent' | 'raw'
  /** 'md' = 34px (默认); 'sm' = 26px，给有更大主位的页面用 */
  size?: 'md' | 'sm'
}>(), {
  format: 'plain',
  size: 'md',
})

// ponytail: 数字自动千分位，避免 1,234,567 这种大数字撑破布局 (Audit §12.6)
const displayValue = computed(() => {
  if (props.format === 'raw') return String(props.value)
  if (typeof props.value === 'number') {
    // ponytail: 之前写死 'zh-CN'，英文界面里数字还是中文分组格式。
    return formatNumber(props.value)
  }
  return props.value
})
</script>

<template>
  <Card :class="cn('p-0', $attrs.class as string)">
    <CardContent class="p-4">
      <div class="text-xs text-muted-foreground mb-2 tracking-wide">{{ label }}</div>
      <!-- ponytail: 数字不写死 text-foreground —— 继承卡片自己的文字色，
           调用方传 text-warning 之类才真的落得到数字上（--card-foreground
           和 --foreground 同值，默认观感不变）。 -->
      <div :class="cn('font-bold tracking-tight tabular-nums', size === 'sm' ? 'text-2xl' : 'text-3xl')">
        {{ displayValue }}<span v-if="format === 'percent'" class="text-base text-muted-foreground ml-0.5">%</span>
      </div>
      <div v-if="hint" class="text-xs text-muted-foreground mt-2">{{ hint }}</div>
    </CardContent>
  </Card>
</template>
