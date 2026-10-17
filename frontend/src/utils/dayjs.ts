/**
 * Single source of dayjs config (relative time + active UI locale).
 * Importing dayjs from here avoids duplicate `extend()` and `locale()` calls.
 */
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { Locale } from '@/i18n/types'

/**
 * zh-CN is the product default and every view renders `fromNow()` synchronously
 * on first paint, so it must be registered before any component renders.
 *
 * Both of our locales are registered statically and neither needs a loader:
 * English is built into dayjs core — `Object.keys(require('dayjs').Ls)` is
 * `['en']` with nothing imported — so only zh-cn is missing.
 *
 * Do not reintroduce a dynamic `import()` loader here. `main.ts` top-level-awaits
 * `setDayjsLocale`, and its `.catch()` guards a rejection, not a promise that
 * never settles. A locale chunk that hangs gates `app.mount()` forever and the
 * production build shows a permanently blank page: no error, no failed request,
 * and `vite dev` unaffected. Verify any change here with `vite build`, not
 * vitest — tests resolve the loader through Vite's SSR transform and pass
 * against code that breaks in the real bundle.
 */
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * Our locale -> its dayjs tag. English is `en`, not `en-us` — dayjs ships no
 * `en-us` file. As a `Record<Locale, …>` this fails to compile if a third
 * locale is ever added, which is the point.
 */
const DAYJS_LOCALES: Record<Locale, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
}

/** Make the active global locale match `l`. Every dayjs locale is already loaded. */
export async function setDayjsLocale(l: Locale): Promise<void> {
  dayjs.locale(DAYJS_LOCALES[l])
}

setDayjsLocale('zh-CN')

export default dayjs