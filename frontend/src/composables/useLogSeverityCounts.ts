import { computed, type Ref } from 'vue'
import type { LogLineOut } from '@/api/types'

export interface SeverityCounts {
  error: number
  warn: number
  info: number
  debug: number
  unknown: number
}

/**
 * Aggregate per-line severity into 4 buckets matching the top-of-log chip row.
 *
 * Buckets (so ERROR chip = "show me errors and above"):
 *   error ← error, err, critical, fatal, alert, emergency
 *   warn  ← warn, warning
 *   info  ← info, notice
 *   debug ← debug, trace
 *   unknown ← anything the classifier did not recognise
 *
 * The unknown bucket is the point of this list. Lines the classifier could
 * not label used to be counted as info, and then the "≥ INFO" chip said
 * "513" on a pod whose every line was unlabelled — the chip claimed 513
 * lines at INFO or above when the truth was "513 lines nobody read". A
 * reader who filters by ERROR gets nothing and is told there are no
 * errors. Unrecognised is its own bucket now, with its own chip.
 */
const ERROR_SEVERITIES = new Set(['error', 'err', 'critical', 'fatal', 'alert', 'emergency'])
const WARN_SEVERITIES = new Set(['warn', 'warning'])
const INFO_SEVERITIES = new Set(['info', 'notice'])
const DEBUG_SEVERITIES = new Set(['debug', 'trace'])

/** A line whose severity nobody could name. */
export function isUnknownSeverity(severity: string | null | undefined): boolean {
  const s = (severity ?? '').toLowerCase()
  return !ERROR_SEVERITIES.has(s)
    && !WARN_SEVERITIES.has(s)
    && !INFO_SEVERITIES.has(s)
    && !DEBUG_SEVERITIES.has(s)
}

export function useLogSeverityCounts(lines: Ref<readonly LogLineOut[]>) {
  return computed<SeverityCounts>(() => {
    const counts: SeverityCounts = { error: 0, warn: 0, info: 0, debug: 0, unknown: 0 }
    for (const l of lines.value) {
      const s = (l.severity ?? '').toLowerCase()
      if (ERROR_SEVERITIES.has(s)) counts.error++
      else if (WARN_SEVERITIES.has(s)) counts.warn++
      else if (INFO_SEVERITIES.has(s)) counts.info++
      else if (DEBUG_SEVERITIES.has(s)) counts.debug++
      else counts.unknown++
    }
    return counts
  })
}

/**
 * minSeverity thresholds for each chip (matches SEVERITY_RANK semantics).
 *
 * Not `keyof SeverityCounts` any more: the unknown bucket has no rank.
 * Unrecognised lines are not "below info", they are a separate question.
 */
export const SEVERITY_CHIP_THRESHOLDS: Record<'debug' | 'info' | 'warn' | 'error', number> = {
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
