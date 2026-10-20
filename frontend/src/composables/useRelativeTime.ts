import { useI18n } from 'vue-i18n'
import dayjs from '@/utils/dayjs'

/**
 * One relative-time formatter for the whole app.
 *
 * The same `formatRel` was written three times — DashboardView (memoized),
 * EventsView and PodDetailView (not memoized) — and they drifted: the two
 * plain copies re-parse the timestamp for every row, and none of them
 * re-render on a locale switch unless the caller happens to read
 * `locale.value`.
 *
 * This version memoizes per (locale, 60s bucket, timestamp), so a 500-row
 * event list costs one dayjs parse per distinct timestamp per minute, and a
 * language switch invalidates the cache by construction.
 */
export function useRelativeTime() {
  const { locale } = useI18n()
  const cache = new Map<string, string>()

  function formatRel(iso: string | null | undefined): string {
    if (!iso) return '—'
    const bucket = Math.floor(Date.now() / 60_000)
    const key = `${locale.value}:${bucket}:${iso}`
    let v = cache.get(key)
    if (v === undefined) {
      v = dayjs(iso).fromNow()
      cache.set(key, v)
      if (cache.size > 1000) cache.clear()
    }
    return v
  }

  return { formatRel }
}
