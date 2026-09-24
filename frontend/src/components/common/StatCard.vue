<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

defineProps<{
  label: string
  value: string | number
  hint?: string
}>()
</script>

<template>
  <Card :class="cn('p-0', $attrs.class as string)">
    <CardContent class="p-4">
      <div class="text-xs text-muted-foreground mb-2 tracking-wide">{{ label }}</div>
      <div class="text-3xl font-bold text-foreground tracking-tight">{{ value }}</div>
      <div v-if="hint" class="text-xs text-muted-foreground mt-2">{{ hint }}</div>
    </CardContent>
  </Card>
</template>