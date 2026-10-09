import { describe, expect, it } from 'vitest'
import { normalizeStreamPayload } from '../usePodLogs'

// Regression: the backend batches SSE `log` events as JSON arrays (up to 100
// entries per flush). The old handler assumed a single object per event and
// crashed on `raw.content.split` for every streamed batch, silently killing
// the live tail.
describe('normalizeStreamPayload', () => {
  it('accepts the batched array shape from the backend', () => {
    const batch = [
      { timestamp: '2026-10-09T01:00:00Z', content: 'line one', container: 'c', severity: 'info' },
      { timestamp: '2026-10-09T01:00:01Z', content: 'line two', container: 'c', severity: 'warn' },
    ]
    expect(normalizeStreamPayload(batch)).toEqual(batch)
  })

  it('wraps a single object payload (older wire / test mocks)', () => {
    const one = { timestamp: 't', content: 'solo', container: 'c', severity: 'info' }
    expect(normalizeStreamPayload(one)).toEqual([one])
  })

  it('drops entries without string content instead of crashing', () => {
    const mixed = [
      { timestamp: 't', content: 'ok', container: 'c', severity: 'info' },
      { timestamp: 't', container: 'c', severity: 'info' }, // content undefined
      null,
      { timestamp: 't', content: 42, container: 'c', severity: 'info' }, // non-string
    ]
    const out = normalizeStreamPayload(mixed)
    expect(out).toHaveLength(1)
    expect(out[0].content).toBe('ok')
  })

  it('handles empty array and non-object garbage', () => {
    expect(normalizeStreamPayload([])).toEqual([])
    expect(normalizeStreamPayload('just a string' as unknown)).toEqual([])
    expect(normalizeStreamPayload(null)).toEqual([])
  })
})
