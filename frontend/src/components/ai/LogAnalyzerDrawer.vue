<script setup lang="ts">
import { ref, watch } from 'vue'
import { Bot, Send, X } from '@lucide/vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<{
  open: boolean
  logContent: string
  loading?: boolean
  result?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  analyze: [content: string]
}>()

function close() { emit('update:open', false) }
</script>

<template>
  <Sheet :open="open" @update:open="(v) => emit('update:open', v)">
    <SheetContent side="right" class="w-[480px] sm:max-w-[480px] p-0 gap-0">
      <SheetHeader class="px-4 py-3 border-b border-border">
        <SheetTitle class="flex items-center gap-2">
          <Bot :size="18" :stroke-width="1.75" />
          AI 日志分析
        </SheetTitle>
        <SheetDescription>把日志片段发给 AI 模型分析根因</SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-auto p-4 space-y-4">
        <div>
          <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
            日志片段（{{ logContent.length }} 字符）
          </h4>
          <pre class="text-xs font-mono bg-muted p-3 rounded-md overflow-auto max-h-[200px] whitespace-pre-wrap">{{ logContent }}</pre>
        </div>

        <div v-if="result">
          <h4 class="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">AI 分析</h4>
          <div class="text-sm prose prose-sm max-w-none" v-html="result" />
        </div>

        <div v-if="loading" class="flex items-center justify-center py-8 text-muted-foreground">
          <Bot :size="16" :stroke-width="1.75" class="mr-2 animate-pulse" />
          AI 正在分析…
        </div>
      </div>

      <div class="border-t border-border p-3 flex gap-2">
        <Button class="flex-1" :disabled="!logContent || loading" @click="emit('analyze', logContent)">
          <Send :size="14" :stroke-width="1.75" class="mr-1" />
          分析
        </Button>
        <Button variant="outline" @click="close">
          <X :size="14" :stroke-width="1.75" />
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>