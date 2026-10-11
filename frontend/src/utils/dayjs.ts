/**
 * Single source of dayjs config (relative time + active UI locale).
 * Importing dayjs from here avoids duplicate `extend()` and `locale()` calls.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Locale } from '@/i18n/types'

/**
 * zh-CN is the product default and every view renders `fromNow()` synchronously
 * on first paint. `setDayjsLocale` registers asynchronously, so relying on it
 * alone would render that first paint in dayjs's built-in English. Registering
 * zh-cn statically keeps the guarantee; it was in the first chunk before this
 * change too, so it costs no extra bundle weight.
 */
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const LOADED = new Set<string>()

/**
 * Our locale -> its dayjs tag plus an on-demand loader, so the language you
 * are not using stays out of the first chunk.
 *
 * Each loader must be its own static `import()` literal: Vite cannot code-split
 * a specifier built from a `${…}` placeholder, so that form ships un-resolved
 * and 404s in the browser. Tests still pass in that shape because they go
 * through Vite's SSR transform — verify with `vite build`, not vitest.
 *
 * zh-CN has no loader because the static import above already registered it;
 * re-importing it dynamically is the no-op Vite warns about. English is `en`,
 * not `en-us` — dayjs ships no `en-us` file. As a `Record<Locale, …>` this
 * fails to compile if a third locale is ever added.
 */
const DAYJS_LOCALES: Record<
  Locale,
  { tag: string; load: (() => Promise<unknown>) | null }
> = {
  'zh-CN': { tag: 'zh-cn', load: null },
  'en-US': { tag: 'en', load: () => import('dayjs/locale/en') },
}

/** Load a dayjs locale on demand and make it the active global. */
export async function setDayjsLocale(l: Locale): Promise<void> {
  const { tag, load } = DAYJS_LOCALES[l]
  if (!LOADED.has(tag)) {
    await load?.()
    LOADED.add(tag)
  }
  // Registering a locale resets the global, so assert after every call —
  // including the cached path, where the caller may have switched since.
  dayjs.locale(tag)
}

setDayjsLocale('zh-CN')

export default dayjs