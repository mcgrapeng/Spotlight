<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  hint?: string
  /** 'plain' = 不格式化 (默认千分位); 'percent' = 拼 %; 'raw' = 原样输出 */
  format?: 'plain' | 'percent' | 'raw'
}>(), {
  format: 'plain',
})

// ponytail: 数字自动千分位，避免 1,234,567 这种大数字撑破布局 (Audit §12.6)
const displayValue = computed(() => {
  if (props.format === 'raw') return String(props.value)
  if (typeof props.value === 'number') {
    return new Intl.NumberFormat('zh-CN').format(props.value)
  }
  return props.value
})
</script>

<template>
  <Card :class="cn('p-0', $attrs.class as string)">
    <CardContent class="p-4">
      <div class="text-xs text-muted-foreground mb-2 tracking-wide">{{ label }}</div>
      <div class="text-3xl font-bold text-foreground tracking-tight tabular-nums">
        {{ displayValue }}<span v-if="format === 'percent'" class="text-base text-muted-foreground ml-0.5">%</span>
      </div>
      <div v-if="hint" class="text-xs text-muted-foreground mt-2">{{ hint }}</div>
    </CardContent>
  </Card>
</template>