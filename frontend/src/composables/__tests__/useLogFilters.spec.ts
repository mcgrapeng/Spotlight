import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useLogFilters, parseTraceQuery } from '../useLogFilters'
import type { LogLineOut } from '@/api/types'

function line(content: string, severity: LogLineOut['severity'] = 'info', container = 'main'): LogLineOut {
  return { timestamp: '2026-01-01T00:00:00Z', severity, container, content }
}

describe('useLogFilters — trace filter', () => {
  it('parseTraceQuery extracts a uuid from "trace:<uuid>"', () => {
    expect(parseTraceQuery('trace:11111111-2222-3333-4444-555555555555'))
      .toBe('11111111-2222-3333-4444-555555555555')
  })

  it('parseTraceQuery returns null when prefix missing', () => {
    expect(parseTraceQuery('hello world')).toBeNull()
  })

  it('parseTraceQuery returns null when payload too short', () => {
    expect(parseTraceQuery('trace:abc')).toBeNull()
  })

  it('filters by trace_id when search starts with trace:', () => {
    const tid = '11111111-2222-3333-4444-555555555555'
    const lines = ref<readonly LogLineOut[]>([
      line(`started ${tid}`),
      line(`continuation ${tid}`),
      line('unrelated noise'),
    ])
    const search = ref(`trace:${tid}`)
    const minSeverity = ref(0)
    const { filtered, traceFilterActive } = useLogFilters({ lines, search, minSeverity })
    expect(traceFilterActive.value).toBe(true)
    expect(filtered.value.length).toBe(2)
    expect(filtered.value.every((l) => l.content.includes(tid))).toBe(true)
  })

  it('trace filter does NOT match plain substring search (mutually exclusive)', () => {
    const tid = '11111111-2222-3333-4444-555555555555'
    const lines = ref<readonly LogLineOut[]>([
      // plain text that mentions the search string but does NOT embed a UUID
      line('this is a random log line that mentions the word elsewhere'),
    ])
    const search = ref(`trace:${tid}`)
    const minSeverity = ref(0)
    const { filtered, traceFilterActive } = useLogFilters({ lines, search, minSeverity })
    expect(traceFilterActive.value).toBe(true)
    expect(filtered.value.length).toBe(0)
  })

  it('plain text search keeps working when no trace: prefix', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('first'),
      line('second hello world'),
      line('third'),
    ])
    const search = ref('hello world')
    const minSeverity = ref(0)
    const { filtered, traceFilterActive } = useLogFilters({ lines, search, minSeverity })
    expect(traceFilterActive.value).toBe(false)
    expect(filtered.value.length).toBe(1)
  })
})