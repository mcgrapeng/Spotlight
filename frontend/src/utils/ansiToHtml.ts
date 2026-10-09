/**
 * ANSI SGR → HTML span converter. Preserves pod-supplied colors in display.
 *
 * Output:
 *   html  — escape-safe HTML, wraps runs of colored text in <span class="...">
 *   plain — same text with all escapes stripped, for export/copy/search
 *
 * Safety: v-html only ever sees `<span class="STATIC_NAME">…</span>` — class
 * names come from a fixed map, never from the input. User text goes through
 * escapeHtml. Non-SGR escapes (cursor moves, screen clears, etc.) are dropped
 * because they have no HTML equivalent and would just be noise in copy.
 */

// ANSI bright codes (90-97) use COLORED tiers for vivid terminal look on
// a light card bg. Hue-compensated: at the same Tailwind tier, cool hues
// render LIGHTER than warm — pushing blue/fuchsia/cyan/green down a tier
// equalises perceived weight so "debug" (blue) and "warn" (yellow) look
// equally dark. Yellow is also the only hue that must go to -700 to clear
// WCAG AA (yellow-600 #ca8a04 = 2.94:1; yellow-700 #a16207 = 4.92:1).
const FG: Record<number, string> = {
  30: 'text-gray-600', 31: 'text-red-600', 32: 'text-green-700', 33: 'text-yellow-700',
  34: 'text-blue-800', 35: 'text-fuchsia-700', 36: 'text-cyan-700', 37: 'text-gray-900',
  90: 'text-gray-600', 91: 'text-red-600', 92: 'text-green-700', 93: 'text-yellow-700',
  94: 'text-blue-800', 95: 'text-fuchsia-700', 96: 'text-cyan-700', 97: 'text-gray-900',
};

const BG: Record<number, string> = {
  40: 'bg-gray-500/30', 41: 'bg-red-500/30', 42: 'bg-green-500/30', 43: 'bg-yellow-500/30',
  44: 'bg-blue-500/30', 45: 'bg-fuchsia-500/30', 46: 'bg-cyan-500/30', 47: 'bg-white/30',
  100: 'bg-gray-400/30', 101: 'bg-red-400/30', 102: 'bg-green-400/30', 103: 'bg-yellow-400/30',
  104: 'bg-blue-400/30', 105: 'bg-fuchsia-400/30', 106: 'bg-cyan-400/30', 107: 'bg-white/30',
}

// ponytail: ESC + [ + params + final byte. Matched with `m`/anything-else branch
// downstream — non-SGR escapes are dropped (they're terminal control, not
// visual formatting, and HTML has no equivalent).
const ANSI_RE = /\x1b\[([0-9;]*)([a-zA-Z])/g

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export interface AnsiParts {
  html: string
  plain: string
}

// ponytail: module-level WeakMap cache keyed by LogLineOut. A batch of 500
// lines used to pay 500 parse passes; now the second render of the same line
// is a single WeakMap lookup. Entries auto-GC when the line drops out of the
// ring buffer — no manual eviction needed. Module-level so the cache survives
// LogViewer unmount/remount (component-instance scope would lose every entry
// on tab switch).
type LineWithContent = { content: string }
const ansiCache = new WeakMap<LineWithContent, AnsiParts>()

/**
 * Cached ANSI→HTML lookup. Use this in the render hot path instead of calling
 * `ansiToHtml(line.content)` — the WeakMap eliminates re-parsing the same line on
 * subsequent renders. Returns `{ html, plain }`.
 */
export function getAnsiFor(line: LineWithContent): AnsiParts {
  const hit = ansiCache.get(line)
  if (hit !== undefined) return hit
  const fresh = ansiToHtml(line.content)
  ansiCache.set(line, fresh)
  return fresh
}

export function ansiToHtml(input: string): AnsiParts {
  if (!input) return { html: '', plain: '' }

  let html = ''
  let plain = ''
  let bold = false
  let fg: string | null = null
  let bg: string | null = null
  let openCls: string | null = null

  const stateCls = (): string | null => {
    const parts: string[] = []
    if (bold) parts.push('font-bold')
    if (fg) parts.push(fg)
    if (bg) parts.push(bg)
    return parts.length ? parts.join(' ') : null
  }

  const setSpan = (cls: string | null) => {
    if (openCls === cls) return
    if (openCls !== null) html += '</span>'
    if (cls !== null) html += `<span class="${cls}">`
    openCls = cls
  }

  const emit = (text: string) => {
    if (!text) return
    setSpan(stateCls())
    html += escapeHtml(text)
    plain += text
  }

  let last = 0
  ANSI_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = ANSI_RE.exec(input)) !== null) {
    emit(input.slice(last, m.index))
    if (m[2] === 'm') {
      // ponytail: empty param (`\x1b[m`) is the same as `\x1b[0m` per ECMA-48
      const params = m[1] === '' ? '0' : m[1]
      for (const raw of params.split(';')) {
        const code = Number(raw)
        if (code === 0) { bold = false; fg = null; bg = null }
        else if (code === 1) bold = true
        else if (code === 22) bold = false
        else if (code === 39) fg = null
        else if (code === 49) bg = null
        else if (FG[code]) fg = FG[code]
        else if (BG[code]) bg = BG[code]
        // unknown codes (blink, underline, 256-color, truecolor, …) are ignored
      }
    }
    // non-SGR (e.g. \x1b[2J, \x1b[H) — drop; no HTML equivalent
    last = m.index + m[0].length
  }
  emit(input.slice(last))
  setSpan(null) // close any open span

  return { html, plain }
}
