import { computed, type Ref } from 'vue'
import type { LogLineOut } from '@/api/types'
import { isUnknownSeverity } from '@/composables/useLogSeverityCounts'

export const SEVERITY_RANK: Record<string, number> = {
  trace: 0, debug: 0, info: 1, notice: 1,
  warn: 2, warning: 2, error: 3, err: 3,
  critical: 4, fatal: 4, alert: 4, emergency: 4,
  // ponytail: unknown 归 0（不是 1）。它在「INFO+」这一档里以前算 INFO，
  // 于是芯片写着「INFO+ 513」，而真相是 513 行都没被认出来。归 0 之后
  // 它只在「全部」里出现，芯片自己会说实话。
  unknown: 0,
}

const TRACE_ID_RE = /\b([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\b/i

// ponytail: WeakMap keyed by LogLineOut — entries GC'd when the line drops out
// of the buffer. Avoids re-running the UUID regex per line per filter pass.
const traceIdCache = new WeakMap<LogLineOut, string | null>()
export function cachedTraceId(line: LogLineOut): string | null {
  let v = traceIdCache.get(line)
  if (v === undefined) {
    const m = line.content.match(TRACE_ID_RE)
    v = m?.[1] ?? null
    traceIdCache.set(line, v)
  }
  return v
}

/** Parse `trace:<uuid>` out of a search string. Returns null if no prefix. */
export function parseTraceQuery(q: string): string | null {
  const trimmed = q.trim().toLowerCase()
  if (!trimmed.startsWith('trace:')) return null
  const rest = trimmed.slice('trace:'.length).trim()
  if (!/^[0-9a-f-]{8,}$/.test(rest)) return null
  return rest
}

export interface UseLogFiltersOpts {
  lines: Ref<readonly LogLineOut[]>
  search: Ref<string>
  minSeverity: Ref<number>
  max?: Ref<number>
  /** Show ONLY the lines nobody could classify (a filter, not a rank). */
  unknownOnly?: Ref<boolean>
}

export function useLogFilters(opts: UseLogFiltersOpts) {
  // The lines the SEARCH kept, before the level filter is applied.
  //
  // The two chip rows are two dimensions of ONE filter, and each row's
  // counts have to answer "how many lines would I get if I clicked this
  // chip" — with the OTHER row's filter already applied. The level chips
  // count within the current container; the container chips count within
  // the current level. That needs the search-only set on its own.
  const searchMatched = computed(() => {
    const q = opts.search.value.trim().toLowerCase()
    const traceQ = q.startsWith('trace:') ? q.slice('trace:'.length).trim() : null

    const out: LogLineOut[] = []
    for (const l of opts.lines.value) {
      if (traceQ !== null) {
        // Trace filter path: must match trace_id, content match is skipped
        // so a UUID-string typed in plain search doesn't pull unrelated lines.
        if (cachedTraceId(l) !== traceQ) continue
      } else if (q) {
        // The level is no longer IN the content: the backend strips the
        // app's own "<timestamp> <LEVEL>" prefix, because the panel shows
        // both in its own columns. So the severity is part of what a search
        // can match — typing "error" finds the error lines.
        if (
          !l.content.toLowerCase().includes(q)
          && !l.container.toLowerCase().includes(q)
          && !(l.severity ?? '').toLowerCase().includes(q)
        ) continue
      }
      out.push(l)
    }
    return out
  })

  const filtered = computed(() => {
    const minSev = opts.minSeverity.value
    const max = opts.max?.value ?? 50000

    const out: LogLineOut[] = []
    for (const l of searchMatched.value) {
      if (opts.unknownOnly?.value) {
        if (!isUnknownSeverity(l.severity)) continue
      } else if (minSev > 0 && (SEVERITY_RANK[l.severity.toLowerCase()] ?? 0) < minSev) {
        continue
      }
      out.push(l)
      if (out.length >= max) break
    }
    return out
  })

  const traceFilterActive = computed(() => {
    const q = opts.search.value.trim().toLowerCase()
    return q.startsWith('trace:')
  })

  return { filtered, searchMatched, traceFilterActive }
}
