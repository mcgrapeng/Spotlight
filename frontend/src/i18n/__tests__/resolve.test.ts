import { describe, expect, it, beforeEach, vi } from 'vitest'
import { STORAGE_KEYS } from '@/storage-keys'
import { normalizeLocale, resolveInitialLocale } from '@/i18n'

function setNav(lang: string) {
  vi.stubGlobal('navigator', { language: lang })
}

describe('normalizeLocale', () => {
  it('passes through an exact supported locale', () => {
    expect(normalizeLocale('zh-CN')).toBe('zh-CN')
    expect(normalizeLocale('en-US')).toBe('en-US')
  })

  it('maps any zh-* tag to zh-CN', () => {
    expect(normalizeLocale('zh')).toBe('zh-CN')
    expect(normalizeLocale('zh-TW')).toBe('zh-CN')
    expect(normalizeLocale('zh-Hans-CN')).toBe('zh-CN')
  })

  it('maps everything else to en-US', () => {
    expect(normalizeLocale('en')).toBe('en-US')
    expect(normalizeLocale('en-GB')).toBe('en-US')
    expect(normalizeLocale('fr-FR')).toBe('en-US')
  })

  it('returns null for absent or empty input', () => {
    expect(normalizeLocale(null)).toBeNull()
    expect(normalizeLocale('')).toBeNull()
    expect(normalizeLocale('klingon')).toBe('en-US')
  })
})

describe('resolveInitialLocale', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it('prefers a valid stored choice over the browser language', () => {
    localStorage.setItem(STORAGE_KEYS.appLocale, 'en-US')
    setNav('zh-CN')
    expect(resolveInitialLocale()).toBe('en-US')
  })

  it('falls through to the browser when the stored value is garbage', () => {
    localStorage.setItem(STORAGE_KEYS.appLocale, 'not-a-locale')
    setNav('zh-CN')
    expect(resolveInitialLocale()).toBe('zh-CN')
  })

  it('falls through to zh-CN when the browser tag is unrecognisable', () => {
    setNav('')
    expect(resolveInitialLocale()).toBe('zh-CN')
  })
})