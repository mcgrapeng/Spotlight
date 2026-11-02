import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { usePodSorting, parseAgeToMinutes } from '../usePodSorting'
import type { PodOut } from '@/api/types'

function pod(name: string, over: Partial<PodOut> = {}): PodOut {
  return {
    name,
    namespace: 'default',
    node: 'node-a',
    pod_ip: '10.0.0.1',
    phase: 'Running',
    reason: null,
    message: null,
    restart_count: 0,
    age: '5d',
    created_at: null,
    labels: {},
    containers: [
      { name: 'c', image: 'img', ready: true, state: 'running', restart_count: 0, reason: null, message: null, started_at: null },
    ],
    owner_kind: null,
    owner_name: null,
    ...over,
  } as PodOut
}

describe('parseAgeToMinutes', () => {
  it('parses the Kubernetes age formats', () => {
    expect(parseAgeToMinutes('5d')).toBe(7200)
    expect(parseAgeToMinutes('12h')).toBe(720)
    expect(parseAgeToMinutes('3m')).toBe(3)
    expect(parseAgeToMinutes('45s')).toBeCloseTo(0.75)
    expect(parseAgeToMinutes('2m30s')).toBeCloseTo(2.5)
  })

  it('sorts an unknown age to the end rather than the front', () => {
    expect(parseAgeToMinutes(null)).toBe(Infinity)
    expect(parseAgeToMinutes('')).toBe(Infinity)
    expect(parseAgeToMinutes('nonsense')).toBe(Infinity)
  })
})

describe('usePodSorting', () => {
  it('sorts by name ascending by default', () => {
    const source = ref([pod('b'), pod('a'), pod('c')])
    const { sorted, sortKey, sortDir } = usePodSorting(source)
    expect(sortKey.value).toBe('name')
    expect(sortDir.value).toBe('asc')
    expect(sorted.value.map((p) => p.name)).toEqual(['a', 'b', 'c'])
  })

  it('puts the largest restart count first on the first click of that column', () => {
    // The whole point of the column for an on-call engineer: sort by
    // restarts, see the worst pod first.
    const source = ref([
      pod('calm', { restart_count: 0 }),
      pod('worst', { restart_count: 21320 }),
      pod('middling', { restart_count: 1409 }),
    ])
    const { sorted, toggle } = usePodSorting(source)
    toggle('restarts')
    expect(sorted.value.map((p) => p.name)).toEqual(['worst', 'middling', 'calm'])
  })

  it('toggles direction on a second click of the same column', () => {
    const source = ref([pod('a', { restart_count: 1 }), pod('b', { restart_count: 9 })])
    const { sorted, toggle, sortDir } = usePodSorting(source)
    toggle('restarts')
    expect(sortDir.value).toBe('desc')
    toggle('restarts')
    expect(sortDir.value).toBe('asc')
    expect(sorted.value.map((p) => p.name)).toEqual(['a', 'b'])
  })

  it('sorts by age, oldest first', () => {
    const source = ref([
      pod('new', { age: '2h' }),
      pod('old', { age: '30d' }),
      pod('mid', { age: '12h' }),
    ])
    const { sorted, toggle } = usePodSorting(source)
    toggle('age')
    expect(sorted.value.map((p) => p.name)).toEqual(['old', 'mid', 'new'])
  })

  it('does not mutate the source array', () => {
    const source = ref([pod('b'), pod('a')])
    const { toggle } = usePodSorting(source)
    toggle('name')
    expect(source.value.map((p) => p.name)).toEqual(['b', 'a'])
  })

  it('exposes aria-sort for the active column only', () => {
    const source = ref([pod('a')])
    const { toggle, ariaSortFor } = usePodSorting(source)
    expect(ariaSortFor('name')).toBe('ascending')
    expect(ariaSortFor('restarts')).toBe('none')
    toggle('restarts')
    expect(ariaSortFor('restarts')).toBe('descending')
    expect(ariaSortFor('name')).toBe('none')
  })
})
