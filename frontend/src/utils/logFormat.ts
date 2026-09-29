import type { LogLineOut, LogSeverity } from '@/api/types'

/**
 * Stack-trace grouping: consecutive lines at ERROR-or-higher collapse into a
 * single collapsible entry. Behavior matches Grafana Explore / Datadog Logs —
 * the user can expand to see all lines, or copy/AI the whole trace at once.
 *
 * Threshold is intentionally a separate parameter so callers can tune
 * (e.g. backend noise vs a real stack trace).
 */
export type LineEntry =
  | { kind: 'line'; line: LogLineOut; index: number }
  | { kind: 'group'; lines: LogLineOut[]; firstIndex: number }

const STACK_DELIMS: ReadonlySet<LogSeverity> = new Set<LogSeverity>([
  'warn', 'error', 'critical', 'fatal',
])

export interface GroupOptions {
  /** Minimum consecutive lines to form a group. Default 3. */
  minGroupSize?: number
}

export function groupStackTraces(lines: LogLineOut[], opts: GroupOptions = {}): LineEntry[] {
  const minGroup = Math.max(2, opts.minGroupSize ?? 3)
  const out: LineEntry[] = []
  let buf: LogLineOut[] = []
  let bufStart = 0
  const flush = () => {
    if (buf.length >= minGroup) {
      out.push({ kind: 'group', lines: buf, firstIndex: bufStart })
    } else {
      buf.forEach((l, i) => out.push({ kind: 'line', line: l, index: bufStart + i }))
    }
    buf = []
  }
  lines.forEach((l, i) => {
    if (STACK_DELIMS.has(l.severity)) {
      if (!buf.length) bufStart = i
      buf.push(l)
    } else {
      if (buf.length) flush()
      out.push({ kind: 'line', line: l, index: i })
    }
  })
  if (buf.length) flush()
  return out
}

/**
 * Highlight the first matching substring by wrapping it in <mark>. Caller must
 * pre-escape HTML; this function does NOT re-escape (avoids double-encoding
 * the existing safe content).
 */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

export function highlightMatch(content: string, keyword: string, ci: boolean, regex: boolean): string {
  const escaped = escapeHtml(content)
  if (!keyword) return escaped
  if (regex) {
    try {
      return escaped.replace(new RegExp(`(${keyword})`, ci ? 'gi' : 'g'), '<mark>$1</mark>')
    } catch {
      return escaped
    }
  }
  const q = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return escaped.replace(new RegExp(`(${q})`, ci ? 'gi' : 'g'), '<mark>$1</mark>')
}

/**
 * Pure filter — same rules as the backend's `apply_filter` but on the
 * already-classified client shape.
 */
export interface ClientFilter {
  keyword: string
  regex: boolean
  caseInsensitive: boolean
  minSeverity: LogSeverity | null
}

export function applyClientFilter(lines: LogLineOut[], f: ClientFilter): LogLineOut[] {
  let l = lines
  if (f.minSeverity) {
    const minRank = (sev: LogSeverity) =>
      ['trace', 'debug', 'info', 'notice', 'warn', 'error', 'critical', 'fatal'].indexOf(sev)
    l = l.filter((x) => minRank(x.severity) >= minRank(f.minSeverity!))
  }
  if (f.keyword) {
    if (f.regex) {
      try {
        const re = new RegExp(f.keyword, f.caseInsensitive ? 'i' : '')
        l = l.filter((x) => re.test(x.content))
      } catch { /* invalid regex — passthrough */ }
    } else {
      const needle = f.caseInsensitive ? f.keyword.toLowerCase() : f.keyword
      l = l.filter((x) => {
        const c = f.caseInsensitive ? x.content.toLowerCase() : x.content
        return c.includes(needle)
      })
    }
  }
  return l
}