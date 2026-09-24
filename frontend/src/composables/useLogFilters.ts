import { computed, type Ref } from 'vue'
import type { LogLine } from '@/domain/types'

export const SEVERITY_RANK: Record<string, number> = {
  trace: 0, debug: 0, info: 1, notice: 1,
  warn: 2, warning: 2, error: 3, err: 3,
  critical: 4, fatal: 4, alert: 4, emergency: 4,
  unknown: 1,
}

export function useLogFilters(opts: {
  lines: Ref<readonly LogLine[]>
  search: Ref<string>
  minSeverity: Ref<number>
  max?: Ref<number>
}) {
  const filtered = computed(() => {
    const q = opts.search.value.trim().toLowerCase()
    const minSev = opts.minSeverity.value
    const max = opts.max?.value ?? 50000
    const out: LogLine[] = []
    for (const l of opts.lines.value) {
      if (minSev > 0 && (SEVERITY_RANK[l.severity.toLowerCase()] ?? 1) < minSev) continue
      if (q && !l.content.toLowerCase().includes(q) && !l.container.toLowerCase().includes(q)) continue
      out.push(l)
      if (out.length >= max) break
    }
    return out
  })
  return { filtered }
}
