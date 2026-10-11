export const LOCALES = ['zh-CN', 'en-US'] as const

export type Locale = (typeof LOCALES)[number]

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}