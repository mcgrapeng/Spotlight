/**
 * 折叠规则：哪些行并成一组。
 *
 * 从 LogViewer.vue 里抽出来的纯函数。它决定「506 行日志在面板上是几行」，
 * 是这个面板最容易出错、也最容易测的一块。
 */
import { describe, expect, it } from 'vitest'
import { foldRuns, normalize } from '../logFold'

describe('normalize', () => {
  it('folds away the numbers that are noise', () => {
    // 端口、版本号、IP 分段、带单位的量：同一条消息里的噪声。
    expect(normalize('INFO: 10.0.0.192:54566 - "GET /api/health HTTP/1.1" 200 OK'))
      .toBe(normalize('INFO: 10.0.0.250:49612 - "GET /api/health HTTP/1.1" 200 OK'))
  })

  it('keeps the numbers that are the event', () => {
    // 裸数字是事件本身。
    expect(normalize('user 123 logged in')).not.toBe(normalize('user 456 logged in'))
    expect(normalize('GET /api/health 200 OK')).not.toBe(normalize('GET /api/health 500 OK'))
  })

  it('normalises UUIDs and hex regardless of position', () => {
    expect(normalize('trace 11111111-2222-3333-4444-555555555555 done'))
      .toBe(normalize('trace aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee done'))
    expect(normalize('ptr 0x7f00')).toBe(normalize('ptr 0x7f11'))
  })
})

describe('foldRuns', () => {
  const lines = (n: number, text: string) =>
    Array.from({ length: n }, (_, i) => ({ raw: { content: `${text}-${i}` }, id: `id-${text}-${i}` }))
  const never = () => false

  it('collapses a run of three or more identical signatures into one group', () => {
    const same = Array.from({ length: 5 }, (_, i) => ({ raw: { content: 'tick' }, id: `id-${i}` }))
    const groups = foldRuns(same, () => 'same', (l) => l.id, never)
    expect(groups).toHaveLength(1)
    expect(groups[0]!.kind).toBe('run')
    expect(groups[0]!.lines).toHaveLength(5)
  })

  it('leaves a run of two alone', () => {
    const two = lines(2, 'tick')
    const groups = foldRuns(two, () => 'same', (l) => l.id, never)
    expect(groups).toHaveLength(2)
    expect(groups.every((g) => g.kind === 'single')).toBe(true)
  })

  it('keeps different signatures apart', () => {
    const mixed = [...lines(3, 'a'), ...lines(3, 'b')]
    const groups = foldRuns(mixed, (l) => String(l.raw.content).slice(0, 1), (l) => l.id, never)
    expect(groups).toHaveLength(2)
    expect(groups[0]!.lines).toHaveLength(3)
    expect(groups[1]!.lines).toHaveLength(3)
  })

  it('marks a group expanded when the caller says so', () => {
    const same = Array.from({ length: 3 }, (_, i) => ({ raw: { content: 'tick' }, id: `id-${i}` }))
    const groups = foldRuns(same, () => 'same', (l) => l.id, () => true)
    expect(groups[0]!.expanded).toBe(true)
  })
})
