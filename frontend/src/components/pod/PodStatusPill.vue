<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatusChip from '@/components/common/StatusChip.vue'
import type { ChipTone } from '@/lib/chip'

const { t } = useI18n()

// ponytail: hoist map to module scope — 100-row table × 6 fields no longer
// rebuilds the map object literal on every reactive dep change.
//
// chipClass 之前不存在：所有 phase 共用 bg-muted text-foreground，Running 和
// Failed 只差一个 4px 圆点。在监控工具里最该被看见的 Failed，视觉上却最安静。
//
// The label is bilingual: phase is a K8s API field value, and kubectl
// prints Running / Pending / Failed / Succeeded. A reader looking at both
// panels should not have to translate in their head, and should still be
// able to type the term into kubectl.
//
// The COLOURS follow kubectl too — Running green, Failed red, Pending
// plain — so amber stays reserved for "needs attention".
// The label is bilingual: phase is a K8s API field value, and kubectl
// prints Running / Pending / Failed / Succeeded. A reader looking at both
// panels should not have to translate in their head; the English half is the
// term they will type into kubectl.
const PHASE_CONFIG: Record<string, { tone: ChipTone; variant: 'soft' | 'bare'; dot: boolean }> = {
  Running:   { tone: 'success', variant: 'soft', dot: true },
  Pending:   { tone: 'neutral', variant: 'soft', dot: true },
  Failed:    { tone: 'error',   variant: 'soft', dot: true },
  Succeeded: { tone: 'neutral', variant: 'bare', dot: false },
  Unknown:   { tone: 'neutral', variant: 'soft', dot: true },
}

const props = defineProps<{
  phase: string
  class?: string
}>()

/**
 * One lookup per row, with one fallback.
 *
 * `PHASE_CONFIG[props.phase]` alone also resolves inherited
 * Object.prototype members, so a phase named "toString" would return a
 * function and blow up the render. `Object.hasOwn` keeps the Unknown
 * contract the component actually promises.
 */
const phaseConfig = computed(() => {
  const key = Object.hasOwn(PHASE_CONFIG, props.phase) ? props.phase : 'Unknown'
  return { key, ...PHASE_CONFIG[key] }
})
</script>

<template>
  <StatusChip
    :tone="phaseConfig.tone"
    :variant="phaseConfig.variant"
    :dot="phaseConfig.dot"
    :label="t(`phase.${phaseConfig.key}`)"
    :class="props.class"
  />
</template>
