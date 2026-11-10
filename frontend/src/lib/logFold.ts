/**
 * 折叠规则：哪些相邻的行并成一组。
 *
 * 从 LogViewer.vue 里抽出来的纯函数。它决定「506 行日志在面板上是几行」，
 * 这是这个面板最容易出错、也最容易测的一块。
 *
 * 规则只有一条：**折叠「字面重复」，不折叠「看着像」**。折叠签名把
 * 附带的数字（端口、版本号、IP 分段、带单位的量）换成 N，因为那是同
 * 一条消息里的噪声；裸数字保留，因为它是事件本身：`user 123 logged in`
 * 和 `user 456 logged in` 是两条事件，`200 OK` 和 `500 OK` 也是。
 */

export interface FoldGroup<T> {
  /** 'run' = 折起来的连续重复；'single' = 单独一行。 */
  kind: 'run' | 'single'
  /** 分组的稳定标识（取这一组最老那行的 key，它跨刷新不变）。 */
  key: string
  lines: T[]
  expanded: boolean
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/g, 'UUID')
    .replace(/\b0x[a-f0-9]+\b/g, '0xN')
    // IPv4 整体归一化（端口单独走下面那条），否则两个客户端地址
    // 会把同一条 health check 分成两组。
    .replace(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, 'ip')
    // 附带的数字：紧跟 `:` `/` `.` 的（端口、版本号、路径段），
    // 以及带单位的量（100ms、512MB、12%）。它们是同一条消息里的
    // 噪声，折叠掉是对的。
    .replace(/(?<=[:/.])\d+/g, 'N')
    .replace(/\b\d+(?:\.\d+)?(ms|s|m|h|kb|mb|gb|tb|%|px|b)\b/g, 'N$1')
    // 裸数字是事件本身。
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 把 `lines` 切成折叠组。连续 ≥3 行签名相同的并成一个 run，其余每行一组。
 *
 * `lines` 的顺序由调用方决定；run 的 key 取这一组**最后**那行（对 newest-first
 * 的输入来说就是最老的那条），因为 SSE 刷新只在前端接长，末尾是稳定锚点。
 */
export function foldRuns<T>(
  lines: T[],
  sigOf: (line: T) => string,
  keyOf: (line: T) => string,
  isExpanded: (key: string) => boolean,
): Array<FoldGroup<T>> {
  const out: Array<FoldGroup<T>> = []
  let i = 0
  while (i < lines.length) {
    const sig = sigOf(lines[i]!)
    let j = i + 1
    while (j < lines.length && sigOf(lines[j]!) === sig) j++
    if (j - i >= 3) {
      const key = keyOf(lines[j - 1]!)
      out.push({ kind: 'run', key, lines: lines.slice(i, j), expanded: isExpanded(key) })
      i = j
    } else {
      for (let k = i; k < j; k++) {
        out.push({ kind: 'single', key: keyOf(lines[k]!), lines: [lines[k]!], expanded: false })
      }
      i = j
    }
  }
  return out
}
