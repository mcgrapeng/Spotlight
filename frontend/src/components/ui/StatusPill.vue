<script setup lang="ts">
const props = defineProps<{
  phase: string
  size?: 'sm' | 'md'
  srLabel?: string
}>()

function normalize(p: string): string {
  const s = (p ?? '').toLowerCase()
  if (s === 'running') return 'running'
  if (s === 'pending') return 'pending'
  if (s === 'failed' || s === 'crashloopbackoff') return 'failed'
  if (s === 'succeeded') return 'succeeded'
  return 'unknown'
}

function tone(p: string): { dot: string; fg: string; chip: string } {
  switch (normalize(p)) {
    case 'running':   return { dot: 'status-dot--running',  fg: 'text-emerald-400', chip: 'chip--ok' }
    case 'pending':   return { dot: 'status-dot--pending',  fg: 'text-amber-400',   chip: 'chip--warn' }
    case 'failed':    return { dot: 'status-dot--failed',   fg: 'text-red-400',     chip: 'chip--err' }
    case 'succeeded': return { dot: 'status-dot--succeeded', fg: 'text-sky-400',    chip: 'chip--info' }
    default:          return { dot: '', fg: 'text-zinc-500', chip: 'chip--neutral' }
  }
}
</script>

<template>
  <span :class="['inline-flex items-center gap-1.5', tone(props.phase).fg, props.size === 'sm' ? 'text-[11.5px]' : 'text-[12.5px]']">
    <span class="status-dot" :class="tone(props.phase).dot" aria-hidden="true" />
    <span class="font-mono uppercase tracking-wider text-[10.5px]">{{ props.phase }}</span>
    <span v-if="props.srLabel" class="sr-only">（{{ props.srLabel }}）</span>
  </span>
</template>
