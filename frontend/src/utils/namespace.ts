/**
 * 内部哨兵值：表示「所有 namespace」。
 *
 * 它是 API 层的值，永远不应该原样出现在界面上 —— 之前 Events 页副标题
 * 渲染成「_all · 1 / 1 个事件」、Settings 页渲染成「Namespace _all」。
 * NamespaceCombobox 早就做了友好映射，只是另外两处漏了。
 */
export const ALL_NAMESPACES = '_all'

export function isAllNamespaces(ns: string | null | undefined): boolean {
  return !ns || ns === ALL_NAMESPACES
}
