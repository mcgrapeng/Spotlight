import { onBeforeUnmount, onMounted } from 'vue'

export type ShortcutHandler = (e: KeyboardEvent) => void

export interface Shortcut {
  /** Sequence like "g p" or single key "?" — case-insensitive */
  combo: string
  /** Human-readable label */
  label?: string
  handler: ShortcutHandler
  /** When true, prevents the default browser action */
  preventDefault?: boolean
  /** Disable when an input/textarea/contenteditable is focused */
  ignoreInInputs?: boolean
}

export function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (el.isContentEditable) return true
  return false
}

/**
 * Global keyboard shortcut registry.
 *
 * Two-key sequences (e.g. "g d") use a 1.5s timeout between presses.
 * Single-key shortcuts (e.g. "/", "?") fire immediately.
 */
export function useKeyboardShortcuts(shortcuts: () => Shortcut[]) {
  let prefix: string | null = null
  let prefixTimer: ReturnType<typeof setTimeout> | null = null
  const PREFIX_TIMEOUT_MS = 1500

  function normalize(e: KeyboardEvent): string {
    const parts: string[] = []
    if (e.ctrlKey || e.metaKey) parts.push('mod')
    if (e.shiftKey) parts.push('shift')
    if (e.altKey) parts.push('alt')
    const k = e.key === ' ' ? 'space' : e.key.toLowerCase()
    parts.push(k)
    return parts.join('+')
  }

  function handleKeydown(e: KeyboardEvent) {
    const list = shortcuts()
    const k = normalize(e)
    const keyOnly = e.key.toLowerCase()

    // Two-key mode: if we have a pending prefix, try to match "prefix key"
    if (prefix) {
      const combined = `${prefix} ${keyOnly}`
      const match = list.find((s) => s.combo.toLowerCase() === combined)
      if (match) {
        if (isTypingTarget(e.target)) return
        if (match.preventDefault ?? true) e.preventDefault()
        match.handler(e)
      }
      prefix = null
      if (prefixTimer) clearTimeout(prefixTimer)
      return
    }

    // First char of a possible two-key sequence
    const twoKeyMatch = list.find((s) => s.combo.includes(' '))
    if (twoKeyMatch && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const first = twoKeyMatch.combo.split(' ')[0].toLowerCase()
      if (first === keyOnly) {
        if (isTypingTarget(e.target)) return
        if (twoKeyMatch.preventDefault ?? true) e.preventDefault()
        prefix = first
        prefixTimer = setTimeout(() => { prefix = null }, PREFIX_TIMEOUT_MS)
        return
      }
    }

    // Single-key match
    const match = list.find((s) => s.combo.toLowerCase() === k)
    if (!match) return
    if (match.ignoreInInputs !== false && isTypingTarget(e.target)) return
    if (match.preventDefault ?? true) e.preventDefault()
    match.handler(e)
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (prefixTimer) clearTimeout(prefixTimer)
  })
}
