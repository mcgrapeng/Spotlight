import { computed, type Ref } from 'vue'
import type { LogLineOut } from '@/api/types'
import { stripAnsi } from '@/domain/services/logFormat'

export const SEVERITY_RANK: Record<string, number> = {
  trace: 0, debug: 0, info: 1, notice: 1,
  warn: 2, warning: 2, error: 3, err: 3,
  critical: 4, fatal: 4, alert: 4, emergency: 4,
  unknown: 1,
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
}

export function useLogFilters(opts: UseLogFiltersOpts) {
  const filtered = computed(() => {
    const qRaw = opts.search.value.trim()
    const q = qRaw.toLowerCase()
    const minSev = opts.minSeverity.value
    const max = opts.max?.value ?? 50000
    const traceQ = q.startsWith('trace:') ? q.slice('trace:'.length).trim() : null

    const out: LogLineOut[] = []
    for (const l of opts.lines.value) {
      if (minSev > 0 && (SEVERITY_RANK[l.severity.toLowerCase()] ?? 1) < minSev) continue
      if (traceQ !== null) {
        // Trace filter path: must match trace_id, content match is skipped
        // so a UUID-string typed in plain search doesn't pull unrelated lines.
        if (cachedTraceId(l) !== traceQ) continue
      } else if (q) {
        if (!l.content.toLowerCase().includes(q) && !l.container.toLowerCase().includes(q)) continue
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

  return { filtered, traceFilterActive }
}