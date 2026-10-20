import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { normalizeStreamPayload, usePodLogs } from '../usePodLogs'
import { getI18n } from '@/i18n'
import { podsApi, logsApi } from '@/api/endpoints'

// A stand-in EventSource that records its handlers so a test can push an
// event. The real one opens a socket; the composable only cares about the
// listener protocol.
class FakeES {
  static instances: FakeES[] = []
  readyState = 1
  closed = false
  handlers: Record<string, Array<(e: any) => void>> = {}
 constructor(public url: string) { FakeES.instances.push(this) }
  addEventListener(k: string, fn: (e: any) => void) { (this.handlers[k] ??= []).push(fn) }
  // A real EventSource stops delivering once closed.
  close() { this.closed = true; this.handlers = {} }
  emit(k: string, data: unknown) { if (this.closed) return; for (const fn of this.handlers[k] ?? []) fn({ data: JSON.stringify(data) }) }
  /** Deliver to a handler captured earlier — a message the browser had
   *  already dispatched when close() ran. close() cannot recall it. */
  deliverTo(fn: (e: any) => void, data: unknown) { fn({ data: JSON.stringify(data) }) }
}

function lines(n: number, tag = 'A') {
  return { total: n, items: Array.from({ length: n }, (_, i) => ({
    timestamp: `2026-01-01T00:00:${String(i % 60).padStart(2, '0')}Z`,
    content: `${tag}-${i}`, container: 'c', severity: 'INFO',
  })) }
}

/** Mount the composable against refs the test keeps hold of, so mutating them
 *  is what drives the watchers. `cluster` is read through a getter because the
 *  composable's option is a plain object with an `activeCluster` property. */
function mountLogs(clusterRef: Ref<string | null>, namespace: Ref<string>, name: Ref<string>) {
  let api!: ReturnType<typeof usePodLogs>
  const cluster = { get activeCluster() { return clusterRef.value } }
  const enabled = ref(true)
  // Realistic: the viewer defaults to following the tail, so flushed batches
  // are written straight into `lines`. Both paths matter — `deferred` is
  // shared across sessions too, so a stale batch would surface later under a
  // different pod via commitDeferred().
  const autoFollow = ref(true)
  const C = defineComponent({
    setup() {
      api = usePodLogs({ cluster, namespace, name, enabled, autoFollow, tailLines: 500 })
      return () => h('div')
    },
  })
  mount(C, { global: { plugins: [getI18n()] } })
  // `autoFollow` is returned so a test can simulate the user scrolling into
  // history and back — the switch that decides prepend-vs-defer in flush().
  return { api, enabled, autoFollow }
}

describe('usePodLogs — no flash on the pod page', () => {
  beforeEach(() => {
    FakeES.instances = []
    vi.stubGlobal('EventSource', FakeES as unknown as typeof EventSource)
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks() })

  it('does not open a stream before the cluster selection resolves', async () => {
    // App.vue resolved the cluster in onMounted, which runs after child setup,
    // so the first setup always saw null. Starting then fetched the
    // kubeconfig's current-context and started again a tick later.
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(3))
    const cluster = ref<string | null>(null)
    const { api } = mountLogs(cluster, ref('ns'), ref('p'))
    await new Promise((r) => setTimeout(r, 5))
    expect(history).not.toHaveBeenCalled()
    expect(FakeES.instances).toHaveLength(0)

    cluster.value = 'prod'                  // App.vue finished loading
    await new Promise((r) => setTimeout(r, 5))
    expect(history).toHaveBeenCalledTimes(1)
    expect(FakeES.instances).toHaveLength(1)
    expect(api.lines.value).toHaveLength(3)
  })

  it('tears the stream down when the active cluster goes away', async () => {
    // `start()` guards on `!activeCluster` so it never opens a stream against
    // no cluster — but the guard returned BEFORE `closeStream()` and before
    // `++gen`. Clearing the selection therefore left the previous target's
    // EventSource open (holding a backend session slot) and left its handlers
    // passing the `myGen === gen` guard, so a dead cluster kept writing lines
    // into the panel. Reachable: `loadClusters()` nulls a restored selection
    // the current login cannot see, and `reset()` nulls it on logout.
    vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(3, 'A'))
    const clusterRef = ref<string | null>('prod')
    const { api } = mountLogs(clusterRef, ref('ns'), ref('a'))
    await new Promise((r) => setTimeout(r, 10))
    const first = FakeES.instances.at(-1)!
    // Captured before teardown: `close()` drops the handler map, but a real
    // EventSource cannot recall a message the browser already dispatched.
    const staleLogHandler = first.handlers['log']![0]
    expect(first.closed).toBe(false)

    clusterRef.value = null                     // selection cleared
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))

    expect(first.closed).toBe(true)
    // ...and its late batch must not land: the panel has no valid target now.
    first.deliverTo(staleLogHandler, lines(1, 'ZOMBIE').items)
    await new Promise((r) => setTimeout(r, 150))
    expect(api.lines.value.map((l) => l.content)).not.toContain('ZOMBIE-0')
  })

  it('keeps the previous lines visible when the tab is re-opened for the same pod', async () => {
    // start() used to open with `lines.value = []`, so every tab return blanked
    // the panel until the response came back. The fix keys the blank on the
    // TARGET, not on every re-trigger — a return to the same pod is not a
    // target change, so nothing is cleared and there is no flash.
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(5, 'A'))
    const name = ref('a')
    const { api, enabled } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    expect(api.lines.value).toHaveLength(5)

    enabled.value = false                       // user leaves the Logs tab
    await new Promise((r) => setTimeout(r, 5))

    // Return to the tab. Hold any response so a flash would be observable.
    history.mockReturnValueOnce(new Promise(() => {}))
    enabled.value = true
    await nextTick()
    await new Promise((r) => setTimeout(r, 5))
    expect(api.lines.value).toHaveLength(5)   // never blanked

    // ...and it is not re-fetched either. The panel already holds this exact
    // target, and the backfill window overlaps both the rendered lines and
    // the replay the stream is about to receive — refetching is what put
    // every overlapping line on screen twice. See the duplicate test below.
    expect(history).toHaveBeenCalledTimes(1)
  })

  it('does not duplicate lines when the tab is re-opened with a backlog waiting', async () => {
    // The regression this locks down. Both the history backfill and the
    // follow-stream read the same last-N window, so on a same-target re-open
    // the panel already held lines that the second fetch returned again.
    // `lines.value = flat` re-added them and `commitDeferred()` then
    // prepended the preserved backlog on top — the same content twice, with
    // the pill at 0 so nothing warned the user first.
    const history = vi.spyOn(podsApi, 'historyLogs')
    history.mockResolvedValueOnce(lines(3, 'A'))
    // The re-open's window now INCLUDES the lines the stream delivered while
    // the user was reading history — the real shape, not an artificial one.
    history.mockResolvedValueOnce(lines(5, 'MIX'))
    const name = ref('a')
    const { api, enabled, autoFollow } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 10))
    expect(api.lines.value.map((l) => l.content)).toEqual(['A-2', 'A-1', 'A-0'])

    autoFollow.value = false                    // user scrolls into history
    await nextTick()
    // Raw array: the wire format is a JSON array of entries, not the
    // `{total, items}` envelope the history endpoint returns.
    FakeES.instances.at(-1)!.emit('log', lines(2, 'LIVE').items)
    await new Promise((r) => setTimeout(r, 250))
    expect(api.unreadCount.value).toBe(2)

    enabled.value = false                       // tab away
    await nextTick()
    enabled.value = true                        // ...and back, same pod
    await new Promise((r) => setTimeout(r, 20))

    // The backlog survived the re-open, and the pill still reports it.
    expect(api.unreadCount.value).toBe(2)

    autoFollow.value = true                     // user returns to the top
    await nextTick()
    const contents = api.lines.value.map((l) => l.content)
    const dupes = contents.filter((c, i) => contents.indexOf(c) !== i)
    expect(dupes).toEqual([])
    expect(api.unreadCount.value).toBe(0)
  })

  it('blanks the panel immediately when the target pod changes', async () => {
    // The other half of the contract: a target change MUST clear, or the old
    // pod's lines sit under the new pod's heading for the whole fetch (and
    // forever, if the fetch fails — see the next test).
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(5, 'A'))
    const name = ref('a')
    const { api } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    expect(api.lines.value).toHaveLength(5)

    history.mockReturnValueOnce(new Promise(() => {}))   // never settles
    name.value = 'b'
    await nextTick()
    await new Promise((r) => setTimeout(r, 5))
    expect(api.lines.value).toHaveLength(0)
  })

  it('a stale in-flight history response cannot overwrite a newer one', async () => {
    // Start A, then switch to B while A's response is still out. Without a
    // generation guard A's slower reply lands last and the panel shows A's
    // lines while claiming to be B.
    const history = vi.spyOn(podsApi, 'historyLogs')
    let releaseA!: (v: any) => void
    history.mockReturnValueOnce(new Promise((res) => { releaseA = res }))
    history.mockResolvedValueOnce(lines(2, 'B'))
    const name = ref('a')
    const { api } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    name.value = 'b'
    await new Promise((r) => setTimeout(r, 10))
    releaseA(lines(9, 'A'))
    await new Promise((r) => setTimeout(r, 10))
    expect(api.lines.value).toHaveLength(2)
    expect(api.lines.value.every((l) => l.content.startsWith('B-'))).toBe(true)
  })

  it('does not flush a batch that was already buffered when the stream was replaced', async () => {
    // The generation guard sits in the `log` listener, but a batch that
    // arrived *while the generation was still live* has already armed
    // `setTimeout(flush, 100)`. closeStream() does not cancel that timer, so
    // it fires after the replacement and prepends the old pod's tail into the
    // new pod's panel — the exact cross-contamination the guard was added for,
    // one timer earlier.
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(1, 'A'))
    const name = ref('a')
    const { api } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    const stale = FakeES.instances[0]

    // Live generation: a batch lands and arms the 100ms flush timer.
    stale.emit('log', [{ timestamp: 't1', content: 'LIVE-A', container: 'c', severity: 'INFO' }])

    // Switch pod well inside that 100ms window.
    history.mockResolvedValueOnce(lines(2, 'B'))
    name.value = 'b'
    await new Promise((r) => setTimeout(r, 10))
    expect(stale.closed).toBe(true)

    // Past the flush timer.
    await new Promise((r) => setTimeout(r, 180))
    expect(api.lines.value.every((l) => l.content.startsWith('B-'))).toBe(true)
  })

  it('does not keep showing the previous pod when its history fetch fails', async () => {
    // start() no longer clears `lines`, so a failed history fetch leaves the
    // previous pod's lines on screen permanently — under the new pod's
    // heading, with no visual cue that they are stale. Wrong data presented as
    // current is worse than a blank panel.
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(4, 'A'))
    const name = ref('a')
    const { api } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    expect(api.lines.value).toHaveLength(4)

    history.mockRejectedValueOnce(new Error('pod not found'))
    name.value = 'b'
    await new Promise((r) => setTimeout(r, 10))
    expect(api.lines.value.some((l) => l.content.startsWith('A-'))).toBe(false)
  })

  it('discards a batch arriving from a replaced stream', async () => {
    const history = vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(3, 'A'))
    const name = ref('a')
    const { api } = mountLogs(ref('prod'), ref('ns'), name)
    await new Promise((r) => setTimeout(r, 5))
    const stale = FakeES.instances[0]
    const staleHandler = stale.handlers['log'][0]
    history.mockResolvedValueOnce(lines(1, 'B'))
    name.value = 'b'
    await new Promise((r) => setTimeout(r, 10))
    expect(stale.closed).toBe(true)
    // The old handler closes over its own buffer but shares `lines`, so a
    // batch that was already in flight when the stream was replaced would
    // otherwise land in the new session's panel.
    stale.deliverTo(staleHandler, [{ timestamp: 't', content: 'GHOST', container: 'c', severity: 'INFO' }])
    // The handler batches on a 100ms timer; wait past it or the assertion
    // passes for the wrong reason (nothing was flushed yet).
    await new Promise((r) => setTimeout(r, 180))
    expect(api.lines.value.some((l) => l.content === 'GHOST')).toBe(false)
    expect(api.unreadCount.value).toBe(0)
  })

  it('defers incoming lines while the user reads history, then commits on return', async () => {
    // The behaviour the missing emit used to defeat. LogViewer kept a local
    // mirror of autoFollow and only pushed the `false` transition out to this
    // shared ref, so flush() never saw "not following": every batch was
    // prepended above the user's cursor mid-scroll. With the ref honest, the
    // batch parks in `deferred`, counts on the pill, and lands when the user
    // scrolls back to the newest line.
    vi.spyOn(podsApi, 'historyLogs').mockResolvedValue(lines(2, 'A'))
    vi.spyOn(logsApi, 'streamUrl').mockReturnValue('/stream')
    const autoFollow = ref(true)
    let api!: ReturnType<typeof usePodLogs>
    const C = defineComponent({
      setup() {
        api = usePodLogs({
          cluster: { get activeCluster() { return 'prod' } } as any,
          namespace: ref('ns'), name: ref('pod'), enabled: ref(true), autoFollow,
        })
        return () => h('div')
      },
    })
    mount(C, { global: { plugins: [getI18n()] } })
    await new Promise((r) => setTimeout(r, 10))
    expect(api.lines.value).toHaveLength(2)

    autoFollow.value = false              // user scrolled up
    await nextTick()
    const es = FakeES.instances[0]
    es.emit('log', [{ timestamp: 't1', content: 'NEW-1', container: 'c', severity: 'INFO' }])
    await new Promise((r) => setTimeout(r, 180))

    expect(api.lines.value).toHaveLength(2)          // viewport untouched
    expect(api.lines.value.some((l) => l.content === 'NEW-1')).toBe(false)
    expect(api.unreadCount.value).toBe(1)            // pill shows it instead

    autoFollow.value = true               // user scrolled back to the top
    await nextTick()
    await new Promise((r) => setTimeout(r, 10))
    expect(api.lines.value.some((l) => l.content === 'NEW-1')).toBe(true)
    expect(api.unreadCount.value).toBe(0)
  })
})

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
