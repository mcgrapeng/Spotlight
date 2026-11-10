/**
 * 虚拟滚动的窗口计算：哪些组该被渲染。
 *
 * 从 LogViewer.vue 里抽出来的纯计算。它是「面板显示的像素等于它声称的
 * 内容」这个承诺的兑现处，也是最容易出「少渲染一行」这类错的地方。
 */
import { describe, expect, it } from 'vitest'
import { virtualWindow } from '../logVirtual'

const LINE_HEIGHT = 22
const BUFFER = 8

/** 一个偏移表：前缀和，indexAt 是二分。 */
function offsetsAt(heights: number[]) {
  const offsets: number[] = [0]
  for (const h of heights) offsets.push(offsets[offsets.length - 1]! + h)
  return {
    offsets,
    indexAt: (y: number) => {
      let lo = 0
      let hi = offsets.length - 1
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1
        if (offsets[mid]! <= y) lo = mid
        else hi = mid - 1
      }
      return Math.min(lo, heights.length - 1)
    },
  }
}

describe('virtualWindow', () => {
  it('renders nothing when there is nothing to render', () => {
    expect(virtualWindow({ count: 0, scrollTop: 0, viewportHeight: 400, autoFollow: false, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt: () => 0 }))
      .toEqual({ start: 0, end: 0 })
  })

  it('while following the tail, the window always includes the last group', () => {
    // 模型不知道一组到底多高，直到它被渲染过。尾巴恰恰是没见过的部分：
    // 折起来的 40 行被估成 1 行，窗口停在它前面，读者就落在最新那行上方
    // 几百个像素。
    const out = virtualWindow({ count: 50, scrollTop: 0, viewportHeight: 220, autoFollow: true, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt: () => 0 })
    expect(out.end).toBe(50)
    expect(out.start).toBeGreaterThan(0)
  })

  it('when not following, the window follows the scroll position', () => {
    const heights = Array.from({ length: 50 }, () => 22)
    const { indexAt } = offsetsAt(heights)
    const out = virtualWindow({ count: 50, scrollTop: 22 * 10, viewportHeight: 220, autoFollow: false, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt })
    expect(out.start).toBeLessThanOrEqual(10)
    expect(out.end).toBeGreaterThanOrEqual(20)
  })

  it('keeps the window inside the list', () => {
    const heights = Array.from({ length: 50 }, () => 22)
    const { indexAt } = offsetsAt(heights)
    const top = virtualWindow({ count: 50, scrollTop: -100, viewportHeight: 220, autoFollow: false, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt })
    expect(top.start).toBeGreaterThanOrEqual(0)
    const bottom = virtualWindow({ count: 50, scrollTop: 99999, viewportHeight: 220, autoFollow: false, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt })
    expect(bottom.end).toBeLessThanOrEqual(50)
    expect(bottom.start).toBeLessThan(bottom.end)
  })

  it('always renders at least one group while following, even in a tiny viewport', () => {
    const out = virtualWindow({ count: 3, scrollTop: 0, viewportHeight: 1, autoFollow: true, lineHeight: LINE_HEIGHT, buffer: BUFFER, indexAt: () => 0 })
    expect(out.end - out.start).toBeGreaterThanOrEqual(1)
  })
})
