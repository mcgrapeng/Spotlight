import { describe, expect, it } from 'vitest'
import { applyClientFilter, groupStackTraces, highlightMatch } from '@/utils/logFormat'
import type { LogLine } from '@/domain/types'

const mk = (severity: LogLine['severity'], content: string): LogLine => ({
  timestamp: '2024-01-01T00:00:00Z',
  content, container: 'app', severity,
})

const SAMPLE: LogLine[] = [
  mk('info', 'service starting'),
  mk('warn', 'deprecated api used'),
  mk('error', 'connection refused'),
  mk('error', 'retry failed'),
  mk('error', 'giving up'),
  mk('info', 'recovered'),
  mk('debug', 'cache hit'),
  mk('critical', 'panic: nil pointer'),
  mk('critical', 'stack frame 0'),
  mk('critical', 'stack frame 1'),
  mk('critical', 'stack frame 2'),
  mk('info', 'all good'),
]

describe('groupStackTraces', () => {
  it('collapses 3+ consecutive ERROR/CRITICAL into a group', () => {
    const out = groupStackTraces(SAMPLE)
    const groups = out.filter((e) => e.kind === 'group')
    const lines = out.filter((e) => e.kind === 'line')
    expect(groups.length).toBe(2)         // 1×warn+3×error, 4×critical
    const groupedLines = groups.reduce((n, g) => n + (g.kind === 'group' ? g.lines.length : 0), 0)
    expect(lines.length).toBe(SAMPLE.length - groupedLines)
  })

  it('does not group fewer than minGroupSize consecutive lines', () => {
    const out = groupStackTraces(SAMPLE, { minGroupSize: 5 })
    const groups = out.filter((e) => e.kind === 'group')
    // SAMPLE has a 3-error run and a 4-critical run. Neither meets minGroupSize=5.
    expect(groups.length).toBe(0)
    const total = out.reduce((n, e) => n + (e.kind === 'group' ? e.lines.length : 1), 0)
    expect(total).toBe(SAMPLE.length)
  })

  it('preserves line indexes for non-grouped entries', () => {
    const out = groupStackTraces(SAMPLE)
    const firstLine = out.find((e) => e.kind === 'line')
    expect(firstLine).toBeDefined()
    if (firstLine?.kind === 'line') {
      expect(firstLine.index).toBe(0) // service starting
      expect(firstLine.line.content).toBe('service starting')
    }
  })

  it('returns a single group when everything is error+', () => {
    const onlyErrors: LogLine[] = [
      mk('error', 'a'), mk('error', 'b'), mk('error', 'c'),
    ]
    const out = groupStackTraces(onlyErrors)
    expect(out.length).toBe(1)
    expect(out[0].kind).toBe('group')
    if (out[0].kind === 'group') {
      expect(out[0].lines.length).toBe(3)
      expect(out[0].firstIndex).toBe(0)
    }
  })

  it('handles empty input', () => {
    expect(groupStackTraces([])).toEqual([])
  })
})

describe('highlightMatch', () => {
  it('returns escaped HTML when no keyword', () => {
    expect(highlightMatch('a < b && c > d', '', true, true)).toBe('a &lt; b &amp;&amp; c &gt; d')
  })

  it('wraps literal substring matches in <mark>', () => {
    expect(highlightMatch('hello world', 'world', true, false)).toBe('hello <mark>world</mark>')
  })

  it('escapes regex special chars when not in regex mode', () => {
    expect(highlightMatch('price 1+2 = 3', '1+2', true, false))
      .toBe('price <mark>1+2</mark> = 3')
  })

  it('uses real regex when regex=true', () => {
    expect(highlightMatch('id=12 id=34', 'id=\\d+', true, true)).toBe('<mark>id=12</mark> <mark>id=34</mark>')
  })

  it('falls back gracefully on invalid regex', () => {
    expect(highlightMatch('foo bar', '[unclosed', true, true)).toBe('foo bar')
  })

  it('respects case-sensitivity flag', () => {
    expect(highlightMatch('Hello hello', 'hello', false, false)).toBe('Hello <mark>hello</mark>')
  })
})

describe('applyClientFilter', () => {
  it('filters by minSeverity', () => {
    const out = applyClientFilter(SAMPLE, {
      keyword: '', regex: false, caseInsensitive: true, minSeverity: 'error',
    })
    // SAMPLE has 3 error + 4 critical = 7 lines
    expect(out.length).toBe(7)
    expect(out.every((l) => ['error', 'critical'].includes(l.severity))).toBe(true)
  })

  it('filters by keyword (case-insensitive)', () => {
    const out = applyClientFilter(SAMPLE, {
      keyword: 'FAILED', regex: false, caseInsensitive: true, minSeverity: null,
    })
    expect(out.length).toBe(1)
    expect(out[0].content).toBe('retry failed')
  })

  it('filters by regex', () => {
    const out = applyClientFilter(SAMPLE, {
      keyword: '^connection', regex: true, caseInsensitive: true, minSeverity: null,
    })
    expect(out.length).toBe(1)
    expect(out[0].content).toBe('connection refused')
  })

  it('combines keyword + minSeverity AND-ed', () => {
    const out = applyClientFilter(SAMPLE, {
      keyword: 'retry', regex: false, caseInsensitive: true, minSeverity: 'error',
    })
    expect(out.length).toBe(1)
    expect(out[0].content).toBe('retry failed')
  })

  it('invalid regex does not crash — keyword filter is a no-op', () => {
    const out = applyClientFilter(SAMPLE, {
      keyword: '[bad', regex: true, caseInsensitive: true, minSeverity: null,
    })
    expect(out.length).toBe(SAMPLE.length)
  })

  it('empty filter passes everything through', () => {
    expect(applyClientFilter(SAMPLE, {
      keyword: '', regex: false, caseInsensitive: true, minSeverity: null,
    }).length).toBe(SAMPLE.length)
  })
})