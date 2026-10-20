<script setup lang="ts">
import StatusChip from '@/components/common/StatusChip.vue'
import type { ChipTone } from '@/lib/chip'

// ponytail: hoist map to module scope — 100-row table × 6 fields no longer
// rebuilds the map object literal on every reactive dep change.
//
// chipClass 之前不存在：所有 phase 共用 bg-muted text-foreground，Running 和
// Failed 只差一个 4px 圆点。在监控工具里最该被看见的 Failed，视觉上却最安静。
//
// label 保持英文：phase 是 K8s API 的字段值，和 `kubectl get pods` 的 STATUS
// 列一一对应，翻译会让用户在告警和 kubectl 之间做心算对照。颜色也跟着
// kubectl 走 —— kubectl 把 Pending 画成无色、Running 绿、Failed 红，
// 所以 Pending 用中性灰，琥珀色（= 需要处理）留给别处。
const PHASE_CONFIG: Record<string, { label: string; tone: ChipTone; variant: 'soft' | 'bare'; dot: boolean }> = {
  Running:   { label: 'Running',   tone: 'success', variant: 'soft', dot: true },
  Pending:   { label: 'Pending',   tone: 'neutral', variant: 'soft', dot: true },
  Failed:    { label: 'Failed',    tone: 'error',   variant: 'soft', dot: true },
  Succeeded: { label: 'Succeeded', tone: 'neutral', variant: 'bare', dot: false },
  Unknown:   { label: 'Unknown',   tone: 'neutral', variant: 'soft', dot: true },
}

const props = defineProps<{
  phase: string
  class?: string
}>()
</script>

<template>
  <StatusChip
    :tone="(PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).tone"
    :variant="(PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).variant"
    :dot="(PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).dot"
    :label="(PHASE_CONFIG[props.phase] ?? PHASE_CONFIG.Unknown).label"
    :class="props.class"
  />
</template>
