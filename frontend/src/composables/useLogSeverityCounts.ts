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

/**
 * The filter chips actually rendered above the log stream.
 *
 * `SEVERITY_CHIP_THRESHOLDS.debug` is 0 — the same rank as the "all" chip — so
 * rendering all four buckets put "all" and "DEBUG" in the active state at the
 * same time: two black pills in a row, one of them a lie. And because the
 * filter is "severity >= rank", a DEBUG chip at rank 0 means exactly "all", so
 * it was a redundant control as well as a contradictory one.
 *
 * The chip row therefore starts at INFO. Debug lines are still in "all" and
 * their count stays available in the tooltip of the neighbouring chips.
 */
export type SeverityFilterBucket = 'info' | 'warn' | 'error'

export const SEVERITY_FILTER_CHIPS: Array<{ bucket: SeverityFilterBucket; rank: number }> = [
  { bucket: 'info', rank: 1 },
  { bucket: 'warn', rank: 2 },
  { bucket: 'error', rank: 3 },
]

/**
 * Counts of the lines each threshold would actually show.
 *
 * The chips filter by "severity >= threshold", so the "≥ INFO" chip shows
 * info + warn + error lines — but it used to display the info bucket's own
 * count. Clicking a chip that says "2" and getting 5 lines is a lie about
 * what the control does.
 */
export function cumulativeSeverityCounts(counts: SeverityCounts): Record<SeverityFilterBucket, number> {
  return {
    info: counts.info + counts.warn + counts.error,
    warn: counts.warn + counts.error,
    error: counts.error,
  }
}
