import { onBeforeUnmount, onMounted, ref } from 'vue'

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

/**
 * True while a dense keyboard region owns the keyboard.
 *
 * The log viewer is such a region: it binds `g` to "jump to the next
 * error", `p` to "pause the stream", `j`/`k` to line jumps. The global
 * registry binds `g` as a PREFIX for `g d` / `g p` / `g n` / `g e` /
 * `g f` (quick navigation).
 *
 * Both registries listen on the document, so before this flag existed a
 * reader who pressed `g` (jump to next error) and then `p` (pause) was
 * navigated to the Pods list — `g p` is a registered combo, and it fired.
 *
 * The region claims the keyboard, so the global registry stops arming
 * its prefixes while it holds it. Single-key globals (⌘J) keep working.
 */
export const keyboardRegionClaimed = ref(false)

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
      // A modifier chord is not a prefix continuation. `g` then ⌘J must
      // still reach the ⌘J binding, so drop the prefix and fall through to
      // the single-key match instead of returning.
      if (e.ctrlKey || e.metaKey || e.altKey) {
        prefix = null
        if (prefixTimer) clearTimeout(prefixTimer)
      } else {
        const combined = `${prefix} ${keyOnly}`
        const match = list.find((s) => s.combo.toLowerCase() === combined)
        prefix = null
        if (prefixTimer) clearTimeout(prefixTimer)
        if (match) {
          if (isTypingTarget(e.target)) return
          // The region claimed the keyboard after the prefix was armed
          // (the pointer moved into the log viewer). The sequence still
          // belongs to the global registry, but the reader is now typing
          // into a dense surface — do not navigate them out of it.
          if (keyboardRegionClaimed.value) return
          if (match.preventDefault ?? true) e.preventDefault()
          match.handler(e)
          return
        }
        // The second key matched no sequence. It must not be swallowed:
        // a single-key shortcut (or another region) may still want it.
        // Fall through to the single-key match below.
      }
    }

    // First char of a possible two-key sequence
    const twoKeyMatch = list.find((s) => s.combo.includes(' '))
    if (twoKeyMatch && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const first = twoKeyMatch.combo.split(' ')[0].toLowerCase()
      if (first === keyOnly) {
        if (isTypingTarget(e.target)) return
        // A dense region (the log viewer) owns the keyboard while it is
        // active: `g` is "jump to next error" there, and arming the global
        // prefix would turn the next letter into a navigation.
        if (keyboardRegionClaimed.value) return
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
