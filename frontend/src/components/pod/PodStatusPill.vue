<script setup lang="ts">
import { cn } from '@/lib/utils'

// ponytail: hoist map to module scope — 100-row table × 6 fields no longer
// rebuilds the map object literal on every reactive dep change.
//
// chipClass 之前不存在：所有 phase 共用 bg-muted text-foreground，Running 和
// Failed 只差一个 4px 圆点。在监控工具里最该被看见的 Failed，视觉上却最安静。
// 现在对齐 Nodes 页的彩色胶囊语言（bg-*-bg text-*- border-*-border）。
//
// label 保持英文：phase 是 K8s API 的字段值，和 `kubectl get pods` 的 STATUS
// 列一一对应，翻译会让用户在告警和 kubectl 之间做心算对照。
const PHASE_CONFIG: Record<string, { label: string; dotClass: string; chipClass: string }> = {
  Running:   { label: 'Running',   dotClass: 'bg-success',            chipClass: 'bg-success-bg text-success border-success-border' },
  Pending:   { label: 'Pending',   dotClass: 'bg-warning',            chipClass: 'bg-warning-bg text-warning border-warning-border' },
  Failed:    { label: 'Failed',    dotClass: 'bg-error',              chipClass: 'bg-error-bg text-error border-error-border' },
  Succeeded: { label: 'Succeeded', dotClass: 'bg-muted-foreground',   chipClass: 'bg-muted text-muted-foreground border-border' },
  Unknown:   { label: 'Unknown',   dotClass: 'bg-muted-foreground',   chipClass: 'bg-muted text-muted-foreground border-border' },
}

const props = defineProps<{
  phase: string
  class?: string
}>()
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
      (PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).chipClass,
      props.class,
    )"
  >
    <span :class="cn('h-1 w-1 rounded-full', (PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).dotClass)" aria-hidden="true" />
    {{ (PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).label }}
  </span>
</template>
