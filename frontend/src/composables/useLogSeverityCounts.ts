import { computed, type Ref } from 'vue'
import type { LogLineOut } from '@/api/types'

export interface SeverityCounts {
  error: number
  warn: number
  info: number
  debug: number
}

/**
 * Aggregate per-line severity into 4 buckets matching the top-of-log chip row.
 *
 * Buckets (so ERROR chip = "show me errors and above"):
 *   error ← error, err, critical, fatal, alert, emergency
 *   warn  ← warn, warning
 *   info  ← info, notice, unknown (unknown isn't an error, surface it)
 *   debug ← debug, trace
 */
export function useLogSeverityCounts(lines: Ref<readonly LogLineOut[]>) {
  return computed<SeverityCounts>(() => {
    const counts: SeverityCounts = { error: 0, warn: 0, info: 0, debug: 0 }
    for (const l of lines.value) {
      const s = (l.severity ?? '').toLowerCase()
      if (s === 'error' || s === 'err' || s === 'critical' || s === 'fatal' || s === 'alert' || s === 'emergency') counts.error++
      else if (s === 'warn' || s === 'warning') counts.warn++
      else if (s === 'info' || s === 'notice' || s === 'unknown') counts.info++
      else if (s === 'debug' || s === 'trace') counts.debug++
    }
    return counts
  })
}

/** minSeverity thresholds for each chip (matches SEVERITY_RANK semantics). */
export const SEVERITY_CHIP_THRESHOLDS: Record<keyof SeverityCounts, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}
