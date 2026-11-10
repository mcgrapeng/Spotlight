/**
 * 虚拟滚动的窗口计算：哪些组该被渲染。
 *
 * 从 LogViewer.vue 里抽出来的纯计算。面板对读者许诺「窗口外的像素由
 * 上下两块占位条代表」，这句话兑现得对不对就在这里。
 *
 * 两件事它必须做对：
 *   1. 跟随尾巴时，窗口一定要包含最后一组。模型不知道一组多高，直到
 *      它被渲染过；折起来的 40 行被估成 1 行，窗口停在它前面，读者就
 *      落在最新那行上方几百个像素。
 *   2. 不跟随窗口要贴着滚动位置走，并且两头都要夹在列表里。
 */

export interface VirtualWindowInput {
  /** 总组数。 */
  count: number
  /** 滚动条位置（像素）。 */
  scrollTop: number
  /** 视口高度（像素）。 */
  viewportHeight: number
  /** 读者正在跟着尾巴（自动跟随开着）。 */
  autoFollow: boolean
  /** 行高，用来把视口高度换算成行数。 */
  lineHeight: number
  /** 上下各多渲染多少组，容忍估算偏差。 */
  buffer: number
  /** 偏移表上的二分：给定 y 找出落在它的组。 */
  indexAt: (offset: number) => number
}

export function virtualWindow(input: VirtualWindowInput): { start: number; end: number } {
  const { count, scrollTop, viewportHeight, autoFollow, lineHeight, buffer, indexAt } = input
  if (count === 0) return { start: 0, end: 0 }

  if (autoFollow) {
    // 判据是「读者在跟随」这个状态，不是几何位置：跟随的读者坐在模型的
    // 末端，而末端随着尾巴被测量而移动，几何判据会在模型自我修正的瞬间
    // 失效，把读者丢在原地。
    const end = count
    const start = Math.max(0, count - Math.max(1, Math.ceil(viewportHeight / lineHeight) + buffer * 2))
    return { start, end }
  }

  // 偏移表是前缀和，边界行二分一下就有。用它能把窗口钉在真实的组边界上，
  // 而不是随着估算误差越飘越远。
  const first = indexAt(scrollTop)
  const last = indexAt(scrollTop + viewportHeight)
  return {
    start: Math.max(0, first - buffer),
    end: Math.min(count, last + buffer + 1),
  }
}
