import { describe, it, expect } from 'vitest'
import { chipClasses, chipDotClass } from '../chip'

/**
 * The chip is the single source of truth for status display across the pod
 * table, the nodes page, the events list, the pod detail page and the log
 * severity badges. A change to these strings changes five views at once, so
 * the contract is pinned here.
 */
describe('chipClasses', () => {
  it('a soft chip carries the tone surface, text and border', () => {
    const cls = chipClasses({ tone: 'error' })
    expect(cls).toContain('bg-error-bg')
    expect(cls).toContain('text-error')
    expect(cls).toContain('border-error-border')
  })

  it('a solid chip fills with the tone and inverts its text', () => {
    const cls = chipClasses({ tone: 'warning', variant: 'solid' })
    expect(cls).toContain('bg-warning')
    expect(cls).toContain('text-warning-foreground')
  })

  it('a bare chip drops the surface but KEEPS the tone', () => {
    // A bare error chip that rendered grey text with a red dot would be
    // self-contradictory: the dot says error, the word says nothing.
    const cls = chipClasses({ tone: 'error', variant: 'bare' })
    expect(cls).toContain('bg-transparent')
    expect(cls).toContain('border-transparent')
    expect(cls).toContain('text-error')
    expect(cls).not.toContain('text-muted-foreground')
  })

  it('the size step changes the padding and the radius', () => {
    const sm = chipClasses({ tone: 'success', size: 'sm' })
    const xs = chipClasses({ tone: 'success', size: 'xs' })
    expect(sm).toContain('rounded-md')
    expect(sm).toContain('px-2')
    expect(xs).toContain('px-1.5')
    expect(xs).not.toContain('rounded-md')
  })

  it('a dot adds the gap that separates it from the label', () => {
    expect(chipClasses({ tone: 'success' })).not.toContain('gap-1.5')
    expect(chipClasses({ tone: 'success', dot: true })).toContain('gap-1.5')
  })
})

describe('chipDotClass', () => {
  it('picks the dot colour from the tone', () => {
    expect(chipDotClass('success')).toBe('bg-success')
    expect(chipDotClass('warning')).toBe('bg-warning')
    expect(chipDotClass('error')).toBe('bg-error')
    expect(chipDotClass('neutral')).toBe('bg-muted-foreground')
  })
})
