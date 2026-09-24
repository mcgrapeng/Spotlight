<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, Trash2, Pause, Play, Copy, ArrowDown } from '@lucide/vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface LogLine {
  timestamp: string; content: string; container: string; severity: string
}

const props = defineProps<{
  lines: ReadonlyArray<LogLine>
  streaming?: boolean
}>()

const emit = defineEmits<{
  clear: []
  'update:streaming': [value: boolean]
}>()

const search = ref('')
const autoScroll = ref(true)
const containerRef = ref<HTMLElement | null>(null)

const filtered = computed(() => {
  if (!search.value) return props.lines
  const q = search.value.toLowerCase()
  return props.lines.filter(l => l.content.toLowerCase().includes(q))
})

const severityClass = (s: string) => ({
  trace: 'text-muted-foreground',
  info: 'text-foreground',
  warn: 'text-warning',
  error: 'text-error',
  critical: 'text-error font-semibold',
  fatal: 'text-error font-bold',
  debug: 'text-muted-foreground',
  notice: 'text-foreground',
  unknown: 'text-foreground',
}[s] ?? 'text-foreground')

function scrollToBottom() {
  if (!autoScroll.value || !containerRef.value) return
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

watch(() => props.lines.length, scrollToBottom)
onMounted(scrollToBottom)

function togglePause() {
  emit('update:streaming', !props.streaming)
}
</script>

<template>
  <div class="flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden">
    <div class="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted">
      <div class="relative flex-1">
        <Search :size="14" class="absolute left-2.5 top-2.5 text-muted-foreground" :stroke-width="1.75" />
        <Input
          v-model="search"
          placeholder="过滤日志…"
          class="pl-8 h-8 text-sm"
          aria-label="过滤日志"
        />
      </div>
      <Button variant="outline" size="sm" @click="emit('clear')" aria-label="清空">
        <Trash2 :size="14" :stroke-width="1.75" />
      </Button>
      <Button variant="outline" size="sm" @click="togglePause" :aria-label="streaming ? '暂停' : '继续'">
        <Pause v-if="streaming" :size="14" :stroke-width="1.75" />
        <Play v-else :size="14" :stroke-width="1.75" />
      </Button>
      <Button variant="outline" size="sm" @click="scrollToBottom" aria-label="跳到底部">
        <ArrowDown :size="14" :stroke-width="1.75" />
      </Button>
    </div>
    <div
      ref="containerRef"
      class="flex-1 overflow-auto font-mono text-xs leading-relaxed"
      role="log"
      aria-live="polite"
      aria-label="日志输出"
    >
      <div v-if="filtered.length === 0" class="p-8 text-center text-muted-foreground">
        {{ search ? '没有匹配的行' : '等待日志…' }}
      </div>
      <div
        v-for="(line, i) in filtered"
        :key="i"
        :class="cn('px-3 py-0.5 hover:bg-muted/50 border-b border-border/30', severityClass(line.severity))"
      >
        <span class="text-muted-foreground select-none mr-3">{{ line.timestamp }}</span>
        <span class="text-muted-foreground/70 select-none mr-2">[{{ line.container }}]</span>
        <span>{{ line.content }}</span>
      </div>
    </div>
    <div class="px-3 py-1.5 border-t border-border bg-muted text-2xs text-muted-foreground flex justify-between">
      <span>{{ filtered.length }} / {{ lines.length }} 行</span>
      <span v-if="!autoScroll" class="text-warning">已暂停自动滚动</span>
    </div>
  </div>
</template>
