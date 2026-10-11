/**
 * Locale resolution + vue-i18n instance.
 *
 * Kept free of component imports so it can be unit-tested without mounting.
 */
import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import { STORAGE_KEYS } from '@/storage-keys'
import { setDayjsLocale } from '@/utils/dayjs'
import { isLocale, type Locale } from './types'
import zhCN from './locales/zh-CN'
import en from './locales/en'

export * from './types'

/**
 * Composition-mode i18n instance.
 *
 * A bare `I18n` leaves its `Legacy` type parameter as `boolean`, which widens
 * `global` to a `VueI18n | Composer` union — so `.global.locale` is
 * `string | WritableComputedRef` and neither `.value` nor `.t()` type-checks.
 * We always build composition mode (`legacy: false`), so pin that here
 * instead of casting at every call site.
 */
type SpotlightI18n = I18n<{}, {}, {}, string, false>

/**
 * Map a browser-reported BCP-47 tag onto one of the two supported locales.
 * Lenient by design: `zh-*` → `zh-CN`, **everything else** → `en-US`, so an
 * unrecognised browser never silently lands on Chinese. Null only for
 * absent/empty input. Never use this on the stored value — a persisted
 * locale must match exactly, see `resolveInitialLocale`.
 */
export function normalizeLocale(raw: string | null): Locale | null {
  if (!raw) return null
  if (isLocale(raw)) return raw
  return raw.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

export function resolveInitialLocale(): Locale {
  // Exact-match only: we always persist a canonical locale, so anything else
  // is corrupt and must be discarded rather than leniently mapped.
  const stored = localStorage.getItem(STORAGE_KEYS.appLocale)
  if (isLocale(stored)) return stored
  const fromBrowser = normalizeLocale(navigator.language)
  if (fromBrowser) return fromBrowser
  return 'zh-CN'
}

export function createSpotlightI18n(): SpotlightI18n {
  const initial = resolveInitialLocale()
  return createI18n({
    legacy: false,
    globalInjection: true,
    locale: initial,
    fallbackLocale: 'zh-CN',
    messages: { 'zh-CN': zhCN, 'en-US': en },
  })
}

let instance: SpotlightI18n | null = null

export function getI18n(): SpotlightI18n {
  if (!instance) instance = createSpotlightI18n()
  return instance
}

/** Switch locale, persist it, and hand off to dayjs. */
export async function setLocale(l: Locale): Promise<void> {
  const i18n = getI18n()
  i18n.global.locale.value = l
  localStorage.setItem(STORAGE_KEYS.appLocale, l)
  await setDayjsLocale(l)
}