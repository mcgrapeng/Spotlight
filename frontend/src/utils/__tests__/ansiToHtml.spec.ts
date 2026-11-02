import { describe, expect, it } from 'vitest'
import { ansiToHtml, getAnsiFor } from '../ansiToHtml'

describe('ansiToHtml', () => {
  it('returns empty parts for empty input', () => {
    expect(ansiToHtml('')).toEqual({ html: '', plain: '' })
  })

  it('returns plain HTML-escaped text for unescaped input', () => {
    expect(ansiToHtml('hello <world>')).toEqual({
      html: 'hello &lt;world&gt;',
      plain: 'hello <world>',
    })
  })

  it('wraps basic foreground color in a span', () => {
    const { html, plain } = ansiToHtml('\x1b[31mERROR\x1b[0m')
    expect(html).toBe('<span class="text-red-600">ERROR</span>')
    expect(plain).toBe('ERROR')
  })

  it('combines bold + color codes', () => {
    const { html } = ansiToHtml('\x1b[1;34mbold blue\x1b[0m')
    expect(html).toBe('<span class="font-bold text-blue-800">bold blue</span>')
  })

  it('handles 256-style bright color (90-97) with bold override', () => {
    const { html } = ansiToHtml('\x1b[1;93mwarn\x1b[0m')
    expect(html).toBe('<span class="font-bold text-yellow-700">warn</span>')
  })

  it('closes the span on reset (\x1b[0m) so trailing text is unwrapped', () => {
    const { html } = ansiToHtml('\x1b[31mred\x1b[0m plain')
    expect(html).toBe('<span class="text-red-600">red</span> plain')
  })

  it('keeps the bold toggle off after explicit \x1b[22m (bold off)', () => {
    const { html } = ansiToHtml('\x1b[1mbold\x1b[22m normal')
    expect(html).toBe('<span class="font-bold">bold</span> normal')
  })

  it('handles adjacent color change without reset (\x1b[31m red then \x1b[34m blue)', () => {
    const { html } = ansiToHtml('\x1b[31mred\x1b[34mblue\x1b[0m')
    expect(html).toBe('<span class="text-red-600">red</span><span class="text-blue-800">blue</span>')
  })

  it('drops non-SGR escape sequences without swallowing surrounding text', () => {
    const { html, plain } = ansiToHtml('before\x1b[2Jafter')
    expect(html).toBe('beforeafter')
    expect(plain).toBe('beforeafter')
  })

  it('keeps text around non-SGR escape while processing a later SGR', () => {
    const { html } = ansiToHtml('a\x1b[Hhome\x1b[31mb\x1b[0m')
    expect(html).toBe('ahome<span class="text-red-600">b</span>')
  })

  it('treats empty SGR param (\x1b[m) as reset', () => {
    const { html } = ansiToHtml('\x1b[31mr\x1b[mg')
    expect(html).toBe('<span class="text-red-600">r</span>g')
  })

  // The two workloads below assert a wall-clock ceiling as a blowup tripwire
  // (~20-40x the original 50ms/200ms budgets), not as a benchmark: a
  // saturated parallel run swings 4-16x and tight budgets flake. Tight perf
  // budgets belong in a bench on idle hardware.
  it('processes 1000 SGR sequences with no work blowup (tripwire)', () => {
    const seqs: string[] = []
    for (let i = 0; i < 1000; i++) seqs.push(`\x1b[31mline${i}\x1b[0m`)
    const big = seqs.join('\n')
    const start = performance.now()
    const { html, plain } = ansiToHtml(big)
    const ms = performance.now() - start
    expect(ms).toBeLessThan(2_000)
    // Sanity: 1000 red spans emitted, plain matches without escapes
    expect((html.match(/<span class="text-red-600">/g) ?? []).length).toBe(1000)
    expect(plain).not.toContain('\x1b[')
    expect(plain.split('\n').length).toBe(1000)
  })

  it('processes the 10MB cold-path workload with no work blowup (tripwire)', () => {
    // 10 lines × 10_000 chars each, each line a fresh ANSI-colored blob — the
    // aggregate workload that a busy pod produces on first paint.
    const oneLine = '\x1b[31m' + 'x'.repeat(1000) + '\x1b[0m'
    const big = (oneLine + '\n').repeat(10_000)
    const start = performance.now()
    const { plain } = ansiToHtml(big)
    const ms = performance.now() - start
    expect(ms).toBeLessThan(8_000)
    expect(plain.length).toBeGreaterThan(10_000_000)
  })

  it('getAnsiFor returns the same cached object for a repeated line', () => {
    const line = { content: '\x1b[1;33mwarn hello world\x1b[0m' }
    // Warm the cache.
    const first = getAnsiFor(line)
    expect(first.plain).toBe('warn hello world')
    // Object identity is the deterministic proof of the WeakMap cache; a
    // millisecond budget here would only add load-sensitive flake.
    let last: { html: string; plain: string } | undefined
    for (let i = 0; i < 1000; i++) last = getAnsiFor(line)
    expect(last).toBe(first)
  })

  it('strips a lone escape char that starts no sequence', () => {
    // Regression: bare ESC (no `[`) used to leak into both outputs.
    const { html, plain } = ansiToHtml('a\x1bmb\x1b')
    expect(plain).toBe('amb')
    expect(html).toBe('amb')
  })

  it('keeps the escaping invariants over arbitrary seeded input (fuzz)', () => {
    // Log content is untrusted: raw user text must never leak into the
    // markup, and every escape must be stripped from the plain rendering.
    // Seeded so failures reproduce exactly.
    let seed = 20261102
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }
    const chunks = ['<', '>', '&', '"', "'", '\x1b', '[', 'm', ';', '31', '0', 'a', ' ', '\n', '\t', '中', 'span', '/']
    for (let i = 0; i < 500; i++) {
      let s = ''
      const len = Math.floor(rand() * 24)
      for (let j = 0; j < len; j++) s += chunks[Math.floor(rand() * chunks.length)]
      const { html, plain } = ansiToHtml(s)
      expect(plain).not.toContain('\x1b')
      // Strip only the span markup ansiToHtml emits itself; what remains
      // must contain no angle bracket originating from the input.
      const withoutMarkup = html.replace(/<\/?span[^>]*>/g, '')
      expect(withoutMarkup).not.toMatch(/[<>]/)
    }
  })
})
