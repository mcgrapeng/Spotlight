import { describe, expect, it } from 'vitest'
import { parseCPU, parseMemory, formatMiB, formatMillicores } from '../utils'

describe('parseCPU', () => {
  it('parses millicore strings', () => {
    expect(parseCPU('100m')).toBe(100)
    expect(parseCPU('500m')).toBe(500)
    expect(parseCPU('1500m')).toBe(1500)
  })
  it('converts whole cores to millicores', () => {
    expect(parseCPU('4')).toBe(4000)
    expect(parseCPU('0.5')).toBe(500)
    expect(parseCPU('1')).toBe(1000)
  })
  it('handles empty/invalid input', () => {
    expect(parseCPU('')).toBe(0)
    expect(parseCPU('garbage')).toBe(0)
  })
})

describe('parseMemory', () => {
  it('normalizes Ki/Mi/Gi/Ti to MiB', () => {
    expect(parseMemory('1024Ki')).toBeCloseTo(1, 6)
    expect(parseMemory('1Mi')).toBe(1)
    expect(parseMemory('1Gi')).toBe(1024)
    expect(parseMemory('1Ti')).toBe(1024 * 1024)
  })
  it('compares correctly across mixed units', () => {
    // 64322Mi vs 128Gi — the bug this fixes: pure-string comparison was misleading
    expect(parseMemory('64322Mi')).toBeCloseTo(64322, 6)
    expect(parseMemory('128Gi')).toBeCloseTo(131072, 6)
    // 64322Mi is ~49% of 128Gi, not "5x larger" as raw parseFloat would imply
    expect(parseMemory('64322Mi') / parseMemory('128Gi')).toBeCloseTo(0.49, 2)
  })
  it('handles raw bytes and SI suffixes', () => {
    expect(parseMemory('1024')).toBeCloseTo(1024 / (1024 * 1024), 6)
    expect(parseMemory('1G')).toBe(1024)
    expect(parseMemory('1M')).toBe(1)
  })
  it('handles empty/invalid input', () => {
    expect(parseMemory('')).toBe(0)
    expect(parseMemory('garbage')).toBe(0)
  })
})

describe('formatMiB / formatMillicores', () => {
  it('round-trips reasonable values', () => {
    expect(formatMiB(131072)).toBe('128Gi')
    expect(formatMiB(64322)).toBe('62.8Gi')
    expect(formatMiB(256)).toBe('256Mi')
    expect(formatMillicores(4000)).toBe('4')
    expect(formatMillicores(500)).toBe('500m')
  })
})