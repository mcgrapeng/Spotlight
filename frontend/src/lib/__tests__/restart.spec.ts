import { describe, it, expect } from 'vitest'
import { restartSeverity, isNoisyRestarts, RESTART_ELEVATED, RESTART_HIGH, RESTART_CRITICAL } from '../restart'

/**
 * One ladder for "how many restarts is a lot", shared by the Pods table
 * and the dashboard's restart bars. The boundary values are pinned because
 * they are the numbers a reader checks the ladder against.
 */
describe('restartSeverity', () => {
  it('treats each named threshold as the first value of its tier', () => {
    expect(restartSeverity(RESTART_ELEVATED)).toBe('elevated')
    expect(restartSeverity(RESTART_HIGH)).toBe('high')
    expect(restartSeverity(RESTART_CRITICAL)).toBe('critical')
  })

  it('puts the value just below a threshold in the tier below', () => {
    expect(restartSeverity(RESTART_ELEVATED - 1)).toBe('normal')
    expect(restartSeverity(RESTART_HIGH - 1)).toBe('elevated')
    expect(restartSeverity(RESTART_CRITICAL - 1)).toBe('high')
  })

  it('puts the value just above a threshold in its tier', () => {
    expect(restartSeverity(RESTART_ELEVATED + 1)).toBe('elevated')
    expect(restartSeverity(RESTART_HIGH + 1)).toBe('high')
    expect(restartSeverity(RESTART_CRITICAL + 1)).toBe('critical')
  })

  it('leaves a quiet pod alone', () => {
    expect(restartSeverity(0)).toBe('normal')
    expect(restartSeverity(3)).toBe('normal')
    expect(isNoisyRestarts(3)).toBe(false)
  })

  it('flags the 21,320 case', () => {
    expect(restartSeverity(21_320)).toBe('critical')
    expect(isNoisyRestarts(21_320)).toBe(true)
  })
})
