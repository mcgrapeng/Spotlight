import { describe, expect, it } from 'vitest'
import { SEVERITY_TOKENS, severityAtLeast } from '@/utils/severity'

describe('severity ranking', () => {
  it('ranks in expected order (low → high)', () => {
    expect(SEVERITY_TOKENS.trace.rank).toBeLessThan(SEVERITY_TOKENS.debug.rank)
    expect(SEVERITY_TOKENS.debug.rank).toBeLessThan(SEVERITY_TOKENS.info.rank)
    expect(SEVERITY_TOKENS.info.rank).toBeLessThan(SEVERITY_TOKENS.warn.rank)
    expect(SEVERITY_TOKENS.warn.rank).toBeLessThan(SEVERITY_TOKENS.error.rank)
    expect(SEVERITY_TOKENS.error.rank).toBeLessThan(SEVERITY_TOKENS.critical.rank)
    expect(SEVERITY_TOKENS.critical.rank).toBeLessThan(SEVERITY_TOKENS.fatal.rank)
  })

  it('severityAtLeast respects ordering', () => {
    expect(severityAtLeast('error', 'warn')).toBe(true)
    expect(severityAtLeast('warn', 'error')).toBe(false)
    expect(severityAtLeast('fatal', 'fatal')).toBe(true)
  })

  it('treats unknown severity as below any threshold', () => {
    expect(severityAtLeast('unknown', 'debug')).toBe(false)
    expect(severityAtLeast('debug', 'unknown')).toBe(true)
  })
})