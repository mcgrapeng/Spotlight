import { describe, expect, it } from 'vitest'
import { ansiToHtml } from '../ansiToHtml'

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
    expect(html).toBe('<span class="text-red-500">ERROR</span>')
    expect(plain).toBe('ERROR')
  })

  it('combines bold + color codes', () => {
    const { html } = ansiToHtml('\x1b[1;34mbold blue\x1b[0m')
    expect(html).toBe('<span class="font-bold text-blue-500">bold blue</span>')
  })

  it('handles 256-style bright color (90-97) with bold override', () => {
    const { html } = ansiToHtml('\x1b[1;93mwarn\x1b[0m')
    expect(html).toBe('<span class="font-bold text-yellow-400">warn</span>')
  })

  it('closes the span on reset (\x1b[0m) so trailing text is unwrapped', () => {
    const { html } = ansiToHtml('\x1b[31mred\x1b[0m plain')
    expect(html).toBe('<span class="text-red-500">red</span> plain')
  })

  it('keeps the bold toggle off after explicit \x1b[22m (bold off)', () => {
    const { html } = ansiToHtml('\x1b[1mbold\x1b[22m normal')
    expect(html).toBe('<span class="font-bold">bold</span> normal')
  })

  it('handles adjacent color change without reset (\x1b[31m red then \x1b[34m blue)', () => {
    const { html } = ansiToHtml('\x1b[31mred\x1b[34mblue\x1b[0m')
    expect(html).toBe('<span class="text-red-500">red</span><span class="text-blue-500">blue</span>')
  })

  it('drops non-SGR escape sequences without swallowing surrounding text', () => {
    const { html, plain } = ansiToHtml('before\x1b[2Jafter')
    expect(html).toBe('beforeafter')
    expect(plain).toBe('beforeafter')
  })

  it('keeps text around non-SGR escape while processing a later SGR', () => {
    const { html } = ansiToHtml('a\x1b[Hhome\x1b[31mb\x1b[0m')
    expect(html).toBe('ahome<span class="text-red-500">b</span>')
  })

  it('treats empty SGR param (\x1b[m) as reset', () => {
    const { html } = ansiToHtml('\x1b[31mr\x1b[mg')
    expect(html).toBe('<span class="text-red-500">r</span>g')
  })

  it('processes 1000 SGR sequences under 50ms', () => {
    const seqs: string[] = []
    for (let i = 0; i < 1000; i++) seqs.push(`\x1b[31mline${i}\x1b[0m`)
    const big = seqs.join('\n')
    const start = performance.now()
    const { html, plain } = ansiToHtml(big)
    const ms = performance.now() - start
    expect(ms).toBeLessThan(50)
    // Sanity: 1000 red spans emitted, plain matches without escapes
    expect((html.match(/<span class="text-red-500">/g) ?? []).length).toBe(1000)
    expect(plain).not.toContain('\x1b[')
    expect(plain.split('\n').length).toBe(1000)
  })
})
