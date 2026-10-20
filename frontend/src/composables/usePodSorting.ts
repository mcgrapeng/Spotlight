import { computed, ref, type Ref } from 'vue'
import type { PodOut } from '@/api/types'

export type PodSortKey = 'name' | 'namespace' | 'phase' | 'containers' | 'restarts' | 'node' | 'age'
export type SortDir = 'asc' | 'desc'

/**
 * Kubernetes age string -> minutes.
 * "5d" -> 7200, "12h" -> 720, "2m30s" -> 2.5, "45s" -> 0.75.
 *
 * A pod with no age sorts to the end in ascending order (Infinity) rather
 * than to the front - an unknown age is not "the oldest pod".
 */
export function parseAgeToMinutes(age: string | null | undefined): number {
  if (!age) return Infinity
  const parts = age.match(/(\d+)([smhd])/g)
  if (!parts || parts.length === 0) return Infinity
  let total = 0
  for (const part of parts) {
    const n = Number(part.slice(0, -1))
    const unit = part.slice(-1)
    if (unit === 's') total += n / 60
    else if (unit === 'm') total += n
    else if (unit === 'h') total += n * 60
    else if (unit === 'd') total += n * 1440
  }
  return total
}

function readyCount(p: PodOut): number {
  return p.containers.filter((c) => c.ready).length
}

function compare(a: PodOut, b: PodOut, key: PodSortKey): number {
  switch (key) {
    case 'restarts':
      return a.restart_count - b.restart_count
    case 'containers':
      return readyCount(a) - readyCount(b)
    case 'age':
      return parseAgeToMinutes(a.age) - parseAgeToMinutes(b.age)
    case 'phase':
      return a.phase.localeCompare(b.phase)
    case 'node':
      return (a.node ?? '').localeCompare(b.node ?? '')
    case 'namespace':
      return a.namespace.localeCompare(b.namespace)
    case 'name':
    default:
      return a.name.localeCompare(b.name)
  }
}

/**
 * Column sorting for the pod table.
 *
 * The table used to have static headers and no sort at all. For an on-call
 * engineer the first thing they do on this page is "sort by restarts, show
 * me the worst one" - that was impossible.
 */
export function usePodSorting(source: Ref<PodOut[]>) {
  const sortKey = ref<PodSortKey>('name')
  const sortDir = ref<SortDir>('asc')

  function toggle(key: PodSortKey) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      // Numbers and ages are most useful largest-first; names read best A-Z.
      sortDir.value = key === 'name' || key === 'namespace' || key === 'phase' || key === 'node' ? 'asc' : 'desc'
    }
  }

  const sorted = computed(() => {
    const dir = sortDir.value === 'asc' ? 1 : -1
    return [...source.value].sort((a, b) => compare(a, b, sortKey.value) * dir)
  })

  /** aria-sort value for a column header. */
  function ariaSortFor(key: PodSortKey): 'ascending' | 'descending' | 'none' {
    if (sortKey.value !== key) return 'none'
    return sortDir.value === 'asc' ? 'ascending' : 'descending'
  }

  return { sortKey, sortDir, sorted, toggle, ariaSortFor }
}

export type PodDensity = 'compact' | 'standard' | 'loose'

/** Row padding + type size per density tier. `intrinsic` feeds contain-intrinsic-size. */
export const DENSITY_CLASSES: Record<PodDensity, { cell: string; head: string; text: string; intrinsic: string }> = {
  compact:  { cell: 'px-3 py-1',   head: 'px-3 py-1.5', text: 'text-xs', intrinsic: '30px' },
  standard: { cell: 'px-4 py-2.5', head: 'px-4 py-2.5', text: 'text-sm', intrinsic: '44px' },
  loose:    { cell: 'px-4 py-3.5', head: 'px-4 py-3',   text: 'text-sm', intrinsic: '58px' },
}
