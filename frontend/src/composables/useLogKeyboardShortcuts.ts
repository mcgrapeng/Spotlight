import { onBeforeUnmount, onMounted } from 'vue'
import { keyboardRegionClaimed } from './useKeyboardShortcuts'

export interface LogShortcutHandlers {
  /** 'f' or '/' — focus the search input. */
  focusSearch?: () => void
  /** 'e' — toggle "Errors only" (minSeverity 3 ↔ 0). */
  toggleErrorsOnly?: () => void
  /** 'p' — toggle stream pause/resume. */
  togglePause?: () => void
  /** 'c' — emit clear. */
  clear?: () => void
  /** 'g' / 'G' — jump to next / prev error-or-warn line. */
  jumpError?: (dir: 1 | -1) => void
  /** 'j' / 'k' — vim-style next/prev line in displayedLines. */
  jumpLine?: (dir: 1 | -1) => void
  /** '?' — toggle shortcut help popover. */
  toggleHelp?: () => void
}

/**
 * LogViewer-scoped keyboard shortcuts.
 *
 * The shortcuts belong to the panel while the panel is on screen — not while
 * the mouse happens to be over it. The panel's own placeholder advertises `/`
 * ("聚焦搜索"), and with a hover gate that key did nothing until the reader
 * happened to move the pointer onto the log. A keyboard-only reader could
 * never reach any of them at all.
 *
 * The region claims the keyboard while it lives (see `keyboardRegionClaimed`),
 * so the global `g <letter>` navigation does not fire underneath it.
 */
export function useLogKeyboardShortcuts(handlers: LogShortcutHandlers) {
  const isTyping = (e: KeyboardEvent): boolean => {
    const t = e.target as HTMLElement | null
    if (!t) return false
    const tag = t.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
    if (t.isContentEditable) return true
    return false
  }

  function onKey(e: KeyboardEvent) {
    if (isTyping(e)) {
      // Escape inside the search box: clear and blur, leave to handler.
      if (e.key === 'Escape') handlers.focusSearch?.()
      return
    }
    // Mod-key combos are reserved (Cmd+F / Cmd+C copy etc. — let browser handle).
    if (e.metaKey || e.ctrlKey || e.altKey) return

    switch (e.key) {
      case 'f':
      case '/':
        e.preventDefault()
        handlers.focusSearch?.()
        return
      case 'e':
        e.preventDefault()
        handlers.toggleErrorsOnly?.()
        return
      case 'p':
        e.preventDefault()
        handlers.togglePause?.()
        return
      case 'c':
        e.preventDefault()
        handlers.clear?.()
        return
      case 'g':
        e.preventDefault()
        handlers.jumpError?.(1)
        return
      case 'G':
        e.preventDefault()
        handlers.jumpError?.(-1)
        return
      case 'j':
        e.preventDefault()
        handlers.jumpLine?.(1)
        return
      case 'k':
        e.preventDefault()
        handlers.jumpLine?.(-1)
        return
      case '?':
        e.preventDefault()
        handlers.toggleHelp?.()
        return
    }
  }

  // Claim the keyboard for the region. The global registry binds `g` as
  // a navigation prefix; inside the log viewer `g` means "jump to the
  // next error", and `g p` ("go to pods") would yank the reader off the
  // pod they are debugging.
  onMounted(() => {
    document.addEventListener('keydown', onKey)
    keyboardRegionClaimed.value = true
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKey)
    keyboardRegionClaimed.value = false
  })
}