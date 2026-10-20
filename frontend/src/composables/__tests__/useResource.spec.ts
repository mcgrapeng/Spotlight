import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useResource } from '../useResource'
import { getI18n } from '@/i18n'

function host<T>(fetcher: () => Promise<T>, opts: Parameters<typeof useResource<T>>[1] = {}) {
  let api!: ReturnType<typeof useResource<T>>
  const C = defineComponent({
    setup() { api = useResource<T>(fetcher, opts); return () => h('div') },
  })
  mount(C, { global: { plugins: [getI18n()] } })
  return api
}

describe('useResource', () => {
  it('fetches exactly once on mount when a watch source is given', async () => {
    // Regression: this was `onMounted(load)` PLUS `watch(watch, load,
    // { immediate: true })`. The immediate watcher fires during setup and
    // onMounted fires again after mount, so every consumer issued two
    // requests per view — and because the second set loading=true after the
    // first had already filled data, the panel flashed back to its skeleton.
    const fetcher = vi.fn().mockResolvedValue('v')
    host(fetcher, { watch: () => 1, skip: () => false })
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('fetches exactly once on mount with no watch source', async () => {
    const fetcher = vi.fn().mockResolvedValue('v')
    host(fetcher)
    await new Promise((r) => setTimeout(r, 0))
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('refetches when the watch source changes', async () => {
    const dep = ref(1)
    const fetcher = vi.fn().mockResolvedValue('v')
    host(fetcher, { watch: () => dep.value })
    await new Promise((r) => setTimeout(r, 0))
    dep.value = 2
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('discards a response that a newer load has superseded', async () => {
    // usePodList and useCachedFetch both carry a monotonic seq guard; this
    // shared composable — the one every view actually uses — has none. Two
    // loads overlap whenever the watch source changes twice before the first
    // response lands (fast cluster switching, pod->pod navigation). The slow
    // reply wins and the panel shows the previous target.
    const dep = ref('a')
    let releaseA!: (v: string) => void
    const fetcher = vi.fn((d: string) =>
      d === 'a' ? new Promise<string>((r) => { releaseA = r }) : Promise.resolve('B'))
    const api = host(() => fetcher(dep.value), { watch: () => dep.value })
    dep.value = 'b'
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    expect(api.data.value).toBe('B')

    releaseA('A')
    await new Promise((r) => setTimeout(r, 0))
    expect(api.data.value).toBe('B')
  })

  it('does not surface an error from a superseded load', async () => {
    // PodDetailView is `v-else-if="error"`, so a late failure from a
    // navigation the user already moved on from replaces a perfectly good
    // page with an error screen.
    const dep = ref('a')
    let rejectA!: (e: Error) => void
    const fetcher = vi.fn((d: string) =>
      d === 'a'
        ? new Promise<string>((_, rj) => { rejectA = rj })
        : Promise.resolve('B'))
    const api = host(() => fetcher(dep.value), { watch: () => dep.value })
    dep.value = 'b'
    await nextTick()
    await new Promise((r) => setTimeout(r, 0))
    rejectA(new Error('stale boom'))
    await new Promise((r) => setTimeout(r, 0))
    expect(api.error.value).toBe(null)
    expect(api.loading.value).toBe(false)
  })

  it('never sets loading back to true once it has resolved', async () => {
    // The shape of the flash: load() #1 resolves (data filled, loading
    // false), then load() #2 starts and flips loading back to true.
    const seen: boolean[] = []
    const fetcher = vi.fn(async () => { await new Promise((r) => setTimeout(r, 5)); return 'v' })
    const api = host(fetcher, { watch: () => 1 })
    for (let i = 0; i < 12; i++) {
      seen.push(api.loading.value)
      await new Promise((r) => setTimeout(r, 2))
    }
    const settled = seen.indexOf(false)
    expect(settled).toBeGreaterThan(-1)
    expect(seen.slice(settled)).not.toContain(true)
  })

  it('a skipped load still invalidates the request already in flight', async () => {
    // `skip` used to `return` before claiming a generation, which left the
    // in-flight load as the current one. Navigating to a route where skip() is
    // true — PodDetailView's `!name.value` — therefore let the PREVIOUS pod's
    // response write into the view the user had just moved to.
    const dep = ref('a')
    let releaseA!: (v: string) => void
    const fetcher = vi.fn((d: string) =>
      d === 'a' ? new Promise<string>((r) => { releaseA = r }) : Promise.resolve('B'))
    const api = host(() => fetcher(dep.value), {
      watch: () => dep.value,
      skip: () => dep.value === '',
    })
    await nextTick()

    dep.value = ''                     // skip becomes true while A is in flight
    await nextTick()
    expect(api.loading.value).toBe(false)

    releaseA('A')
    await new Promise((r) => setTimeout(r, 0))
    expect(api.data.value).toBeNull()  // A's late reply did not land
  })

  it('skipping settles loading instead of stranding it', async () => {
    // Every view gates its spinner on `loading`; a skipped load that leaves it
    // true with nothing in flight to clear it means a permanent spinner.
    const dep = ref('a')
    const fetcher = vi.fn().mockResolvedValue('v')
    const api = host(() => fetcher(dep.value), {
      watch: () => dep.value,
      skip: () => dep.value === '',
    })
    await new Promise((r) => setTimeout(r, 0))
    expect(api.loading.value).toBe(false)
    dep.value = ''
    await nextTick()
    expect(api.loading.value).toBe(false)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })
})
