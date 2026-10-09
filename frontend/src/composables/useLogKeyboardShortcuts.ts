import { onBeforeUnmount, ref, watchEffect, type Ref } from 'vue'

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
 * LogViewer-scoped keyboard shortcuts. Listens on `document` ONLY while the
 * LogViewer region is hovered (mouseenter/leave toggle), and skips the handler
 * while a typing target has focus. Other parts of the page are unaffected
 * unless the user is hovering the LogViewer.
 */
export function useLogKeyboardShortcuts(
  handlers: LogShortcutHandlers,
  opts: { active: Ref<boolean> } = { active: ref(true) },
) {
  const isTyping = (e: KeyboardEvent): boolean => {
    const t = e.target as HTMLElement | null
    if (!t) return false
    const tag = t.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
    if (t.isContentEditable) return true
    return false
  }

  function onKey(e: KeyboardEvent) {
    if (!opts.active.value) return
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

  // ponytail: only attach to document when opts.active flips true. The caller
  // (LogViewer) toggles active via mouseenter/leave on the scroll area, so
  // other views never see these key events.
  watchEffect(() => {
    if (opts.active.value) {
      document.addEventListener('keydown', onKey)
    } else {
      document.removeEventListener('keydown', onKey)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKey)
  })
}