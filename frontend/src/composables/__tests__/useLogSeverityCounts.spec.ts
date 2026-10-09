import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import type { LogLineOut } from '@/api/types'
import { useLogSeverityCounts } from '../useLogSeverityCounts'

function line(severity: string, content = ''): LogLineOut {
  return {
    timestamp: '2026-01-01T00:00:00Z',
    severity,
    container: 'c',
    content,
  }
}

describe('useLogSeverityCounts', () => {
  it('counts a mixed batch into 4 buckets', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('error'),
      line('err'),
      line('critical'),
      line('fatal'),
      line('warn'),
      line('warning'),
      line('info'),
      line('notice'),
      line('debug'),
      line('trace'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 4, warn: 2, info: 2, debug: 2 })
  })

  it('returns zeros for empty input', () => {
    const counts = useLogSeverityCounts(ref<readonly LogLineOut[]>([]))
    expect(counts.value).toEqual({ error: 0, warn: 0, info: 0, debug: 0 })
  })

  it('treats alert / emergency as error and unknown as info', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('alert'),
      line('emergency'),
      line('unknown'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 2, warn: 0, info: 1, debug: 0 })
  })

  it('is case-insensitive on severity', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('ERROR'),
      line('Warn'),
      line('INFO'),
      line('Trace'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 1, warn: 1, info: 1, debug: 1 })
  })

  it('updates reactively when lines change', () => {
    const lines = ref<readonly LogLineOut[]>([line('info')])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value.info).toBe(1)
    lines.value = [line('info'), line('error'), line('warn')]
    expect(counts.value).toEqual({ error: 1, warn: 1, info: 1, debug: 0 })
  })
})
