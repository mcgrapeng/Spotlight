/**
 * A small markdown parser for the AI answer.
 *
 * Why not a library: the answer is untrusted text, and the safe way to
 * render untrusted text is to never hand a string to the HTML parser.
 * `v-html` + a sanitiser is the usual answer, and it is the wrong one for
 * this codebase: the panel deliberately says "never v-html" in a comment
 * right where the answer is rendered, and a sanitiser is a second thing
 * that has to be trusted forever.
 *
 * So this parser produces a tree, and the renderer turns that tree into
 * Vue elements. There is no HTML string anywhere in the path, which makes
 * injection structurally impossible rather than "probably fine".
 *
 * The subset is what a model actually emits:
 *   paragraphs, ATX headings, bullet and ordered lists, fenced code,
 *   block quotes, horizontal rules, and inline strong / emphasis / code /
 *   links.
 *
 * Deliberately absent: raw HTML (it is shown as text), images (a model
 * answering a cluster question does not need to fetch anything), tables
 * (rare in an answer, and a table is a lot of layout for a side panel).
 */

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: InlineNode[] }

export type Block =
  | { type: 'p'; children: InlineNode[] }
  | { type: 'heading'; level: number; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'code'; lang: string; code: string }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'rule' }

const HEADING_RE = /^(#{1,6})\s+(.*)$/
const BULLET_RE = /^[-*+]\s+(.*)$/
const ORDERED_RE = /^\d+[.)]\s+(.*)$/
const RULE_RE = /^([-*_])\s*(\1\s*){2,}$/
const QUOTE_RE = /^>\s?(.*)$/
const FENCE_RE = /^\s*```(\w*)\s*$/

/** Only http(s) links become links. Everything else stays plain text. */
function safeHref(url: string): string | null {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return null
}

/**
 * Inline parsing.
 *
 * A tiny scanner rather than a regex soup: the patterns overlap (a
 * `**` inside a code span, an underscore inside a word), and a scanner
 * makes the precedence explicit — code spans win, then links, then
 * strong, then emphasis.
 */
export function parseInline(input: string): InlineNode[] {
  const out: InlineNode[] = []
  let text = ''
  const flush = () => {
    if (text) {
      out.push({ type: 'text', value: text })
      text = ''
    }
  }

  let i = 0
  while (i < input.length) {
    const ch = input[i]!

    // Code span: `code`
    if (ch === '`') {
      const end = input.indexOf('`', i + 1)
      if (end > i + 1) {
        flush()
        out.push({ type: 'code', value: input.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    // Link: [text](href)
    if (ch === '[') {
      const close = input.indexOf(']', i + 1)
      if (close > i && input[close + 1] === '(') {
        const paren = input.indexOf(')', close + 2)
        if (paren > close) {
          const href = safeHref(input.slice(close + 2, paren))
          const label = input.slice(i + 1, close)
          flush()
          if (href) {
            out.push({ type: 'link', href, children: parseInline(label) })
          } else {
            // A javascript: URL is text, not a link.
            out.push({ type: 'text', value: label })
          }
          i = paren + 1
          continue
        }
      }
    }

    // Strong: **text** or __text__
    if ((ch === '*' && input[i + 1] === '*') || (ch === '_' && input[i + 1] === '_')) {
      const marker = ch + ch
      const end = input.indexOf(marker, i + 2)
      if (end > i + 2) {
        flush()
        out.push({ type: 'strong', children: parseInline(input.slice(i + 2, end)) })
        i = end + 2
        continue
      }
    }

    // Emphasis: *text* or _text_ (single marker, not part of a word)
    if (ch === '*' || ch === '_') {
      const next = input[i + 1]
      const prev = i > 0 ? input[i - 1] : ''
      const wordChar = /[A-Za-z0-9]/
      const intraword = wordChar.test(prev) && wordChar.test(next ?? '')
      if (!intraword && next && next !== ' ') {
        const end = input.indexOf(ch, i + 1)
        if (end > i + 1) {
          flush()
          out.push({ type: 'em', children: parseInline(input.slice(i + 1, end)) })
          i = end + 1
          continue
        }
      }
    }

    text += ch
    i += 1
  }
  flush()
  return out
}

/** Block parsing. */
export function parseMarkdown(input: string): Block[] {
  const lines = input.replace(/\r\n/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0

  const isBlank = (l: string) => l.trim() === ''

  while (i < lines.length) {
    const line = lines[i]!

    if (isBlank(line)) {
      i += 1
      continue
    }

    // Fenced code
    const fence = line.match(FENCE_RE)
    if (fence) {
      const lang = fence[1] ?? ''
      const body: string[] = []
      i += 1
      while (i < lines.length && !/^\s*```/.test(lines[i]!)) {
        body.push(lines[i]!)
        i += 1
      }
      i += 1 // closing fence
      blocks.push({ type: 'code', lang, code: body.join('\n') })
      continue
    }

    // Horizontal rule
    if (RULE_RE.test(line.trim())) {
      blocks.push({ type: 'rule' })
      i += 1
      continue
    }

    // Heading
    const heading = line.match(HEADING_RE)
    if (heading) {
      blocks.push({
        type: 'heading',
        level: Math.min(6, Math.max(2, heading[1]!.length)),
        children: parseInline(heading[2]!.trim()),
      })
      i += 1
      continue
    }

    // Block quote
    if (QUOTE_RE.test(line)) {
      const body: string[] = []
      while (i < lines.length && QUOTE_RE.test(lines[i]!)) {
        body.push(lines[i]!.match(QUOTE_RE)![1] ?? '')
        i += 1
      }
      blocks.push({ type: 'quote', children: parseInline(body.join('\n')) })
      continue
    }

    // List
    if (BULLET_RE.test(line) || ORDERED_RE.test(line)) {
      const ordered = ORDERED_RE.test(line)
      const items: InlineNode[][] = []
      while (i < lines.length) {
        const l = lines[i]!
        const m = ordered ? l.match(ORDERED_RE) : l.match(BULLET_RE)
        if (!m) {
          // A plain line right under a list item continues it.
          if (!isBlank(l) && items.length > 0 && !BULLET_RE.test(l) && !ORDERED_RE.test(l)) {
            items[items.length - 1]!.push(...parseInline(' ' + l.trim()))
            i += 1
            continue
          }
          break
        }
        items.push(parseInline(m[1]!.trim()))
        i += 1
      }
      blocks.push({ type: 'list', ordered, items })
      continue
    }

    // Paragraph: every line until a blank line or a block starter.
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i]!
      if (
        isBlank(l)
        || HEADING_RE.test(l)
        || BULLET_RE.test(l)
        || ORDERED_RE.test(l)
        || QUOTE_RE.test(l)
        || FENCE_RE.test(l)
        || RULE_RE.test(l.trim())
      ) break
      para.push(l.trim())
      i += 1
    }
    if (para.length) {
      // Lines are kept, not joined with a space: a model that wraps a
      // Chinese sentence across two lines would otherwise gain a space in
      // the middle of a word.
      blocks.push({ type: 'p', children: parseInline(para.join('\n')) })
    }
  }

  return blocks
}
