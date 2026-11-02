import { describe, expect, it } from 'vitest'
import { parseInline, parseMarkdown } from '../markdown'

describe('parseInline', () => {
  it('reads plain text as text', () => {
    expect(parseInline('hello')).toEqual([{ type: 'text', value: 'hello' }])
  })

  it('reads strong, emphasis and code spans', () => {
    expect(parseInline('**bold**')).toEqual([
      { type: 'strong', children: [{ type: 'text', value: 'bold' }] },
    ])
    expect(parseInline('*soft*')).toEqual([
      { type: 'em', children: [{ type: 'text', value: 'soft' }] },
    ])
    expect(parseInline('\`x = 1\`')).toEqual([{ type: 'code', value: 'x = 1' }])
  })

  it('reads a link', () => {
    expect(parseInline('[docs](https://example.com/a)')).toEqual([
      {
        type: 'link',
        href: 'https://example.com/a',
        children: [{ type: 'text', value: 'docs' }],
      },
    ])
  })

  it('refuses a javascript: link and keeps it as text', () => {
    const out = parseInline('[click](javascript:alert(1))')
    expect(out.some((n) => n.type === 'link')).toBe(false)
    expect(JSON.stringify(out)).not.toContain('javascript:')
  })

  it('keeps a code span’s contents literal', () => {
    const out = parseInline('\`**not bold**\`')
    expect(out).toEqual([{ type: 'code', value: '**not bold**' }])
  })
})

describe('parseMarkdown', () => {
  it('reads paragraphs, headings and rules', () => {
    const blocks = parseMarkdown('# Title\n\nA paragraph.\n\n---')
    expect(blocks.map((b) => b.type)).toEqual(['heading', 'p', 'rule'])
  })

  it('reads bullet and ordered lists', () => {
    const blocks = parseMarkdown('- one\n- two\n\n1. first\n2. second')
    expect(blocks[0]).toMatchObject({ type: 'list', ordered: false })
    expect(blocks[0]!.type === 'list' && blocks[0]!.items.length).toBe(2)
    expect(blocks[1]).toMatchObject({ type: 'list', ordered: true })
  })

  it('reads a fenced code block and leaves its contents alone', () => {
    const blocks = parseMarkdown('\`\`\`bash\nkubectl get pods\n**not bold**\n\`\`\`')
    expect(blocks[0]).toMatchObject({ type: 'code', lang: 'bash' })
    expect(blocks[0]!.type === 'code' && blocks[0]!.code).toBe('kubectl get pods\n**not bold**')
  })

  it('keeps the line breaks of a wrapped paragraph', () => {
    // A model that wraps a Chinese sentence across two lines would gain a
    // space in the middle of a word if the lines were joined with one.
    const blocks = parseMarkdown('第一行\n第二行')
    expect(blocks[0]!.type === 'p' && blocks[0]!.children[0]).toEqual({
      type: 'text',
      value: '第一行\n第二行',
    })
  })

  it('reads a block quote', () => {
    const blocks = parseMarkdown('> quoted')
    expect(blocks[0]).toMatchObject({ type: 'quote' })
  })

  it('never produces html — a tag is just text', () => {
    const blocks = parseMarkdown('<img src=x onerror=alert(1)>')
    expect(blocks[0]!.type === 'p' && blocks[0]!.children[0]).toEqual({
      type: 'text',
      value: '<img src=x onerror=alert(1)>',
    })
  })
})
