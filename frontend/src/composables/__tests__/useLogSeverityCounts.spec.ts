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
  it('counts a mixed batch into 5 buckets', () => {
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
    expect(counts.value).toEqual({ error: 4, warn: 2, info: 2, debug: 2, unknown: 0 })
  })

  it('returns zeros for empty input', () => {
    const counts = useLogSeverityCounts(ref<readonly LogLineOut[]>([]))
    expect(counts.value).toEqual({ error: 0, warn: 0, info: 0, debug: 0, unknown: 0 })
  })

  it('treats alert / emergency as error', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('alert'),
      line('emergency'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 2, warn: 0, info: 0, debug: 0, unknown: 0 })
  })

  it('gives unrecognised lines their own bucket instead of calling them info', () => {
    // The bug this pins: unrecognised lines were counted as info, so a pod
    // whose every line was unlabelled showed "INFO+ 513" — 513 lines nobody
    // had read, presented as 513 lines at INFO or above. A reader who
    // filtered by ERROR got nothing and was told there were no errors.
    const lines = ref<readonly LogLineOut[]>([
      line('unknown'),
      line('unknown'),
      line('info'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 0, warn: 0, info: 1, debug: 0, unknown: 2 })
  })

  it('treats a missing severity as unrecognised', () => {
    const counts = useLogSeverityCounts(ref<readonly LogLineOut[]>([line('')]))
    expect(counts.value.unknown).toBe(1)
  })

  it('is case-insensitive on severity', () => {
    const lines = ref<readonly LogLineOut[]>([
      line('ERROR'),
      line('Warn'),
      line('INFO'),
      line('Trace'),
    ])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value).toEqual({ error: 1, warn: 1, info: 1, debug: 1, unknown: 0 })
  })

  it('updates reactively when lines change', () => {
    const lines = ref<readonly LogLineOut[]>([line('info')])
    const counts = useLogSeverityCounts(lines)
    expect(counts.value.info).toBe(1)
    lines.value = [line('info'), line('error'), line('warn')]
    expect(counts.value).toEqual({ error: 1, warn: 1, info: 1, debug: 0, unknown: 0 })
  })
})
