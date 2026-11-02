import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PhaseBar from '@/components/common/PhaseBar.vue'

describe('PhaseBar', () => {
  const slices = [
    { key: 'running', label: 'Running', value: 258, color: 'hsl(var(--success))' },
    { key: 'pending', label: 'Pending', value: 17, color: 'hsl(var(--muted-foreground))' },
    { key: 'failed', label: 'Failed', value: 0, color: 'hsl(var(--error))' },
    { key: 'succeeded', label: 'Succeeded', value: 12, color: 'hsl(var(--muted-foreground) / 0.45)' },
  ]

  it('renders one segment per non-zero slice', () => {
    const w = mount(PhaseBar, { props: { slices } })
    const segments = w.findAll('[style*="width"]')
    expect(segments).toHaveLength(3)
  })

  it('sizes segments as a share of the total', () => {
    const w = mount(PhaseBar, { props: { slices } })
    const widths = w.findAll('[style*="width"]').map((el) =>
      parseFloat((el.attributes('style') ?? '').replace(/[^0-9.]/g, '').slice(0, 6)),
    )
    const total = 258 + 17 + 12
    expect(widths[0]).toBeCloseTo((258 / total) * 100, 1)
    expect(widths[1]).toBeCloseTo((17 / total) * 100, 1)
    expect(widths[2]).toBeCloseTo((12 / total) * 100, 1)
  })

  it('keeps the total in the accessible name', () => {
    const w = mount(PhaseBar, { props: { slices } })
    expect(w.attributes('aria-label')).toBe('Running 258, Pending 17, Failed 0, Succeeded 12')
  })

  it('renders no segment when everything is zero', () => {
    const w = mount(PhaseBar, {
      props: { slices: [{ key: 'running', label: 'Running', value: 0, color: 'red' }] },
    })
    expect(w.findAll('[style*="width"]')).toHaveLength(0)
  })
})
