import { describe, expect, it } from 'vitest'
import { splitLogLines, stripAnsi } from '../logFormat'

describe('stripAnsi', () => {
  it('removes color escape codes', () => {
    expect(stripAnsi('\x1b[31mERROR\x1b[0m oops')).toBe('ERROR oops')
  })

  it('leaves plain text untouched', () => {
    expect(stripAnsi('plain log line')).toBe('plain log line')
  })

  it('handles empty string', () => {
    expect(stripAnsi('')).toBe('')
  })
})

describe('splitLogLines', () => {
  it('splits on newlines and drops empty fragments', () => {
    expect(splitLogLines('a\nb\n\nc')).toEqual(['a', 'b', 'c'])
  })

  it('strips ANSI before splitting', () => {
    expect(splitLogLines('\x1b[31mfoo\x1b[0m\n\x1b[32mbar\x1b[0m')).toEqual(['foo', 'bar'])
  })

  it('handles empty input', () => {
    expect(splitLogLines('')).toEqual([])
  })

  it('handles trailing newline', () => {
    expect(splitLogLines('only\n')).toEqual(['only'])
  })
})