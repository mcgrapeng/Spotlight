/**
 * Central registry of every localStorage key the app reads or writes.
 *
 * Why a registry?
 * - Typos get caught at compile time (vs. raw strings that only blow up at runtime).
 * - A single `git grep STORAGE_KEYS.SOMETHING` finds every reader/writer.
 * - Renaming a key here is one edit, not 20 across the codebase.
 * - TTLs live next to the key, not buried in random `.5 * 60_000` literals.
 *
 * Naming convention:
 * - `app.*`  — long-lived user preferences, written under user control
 * - `cache.*` — short-lived fetch cache. These strings are handed to
 *   useCachedFetch, which persists them under a `cached:` prefix
 *   (`cached:cache:nodes:prod`). TTL lives in the useCachedFetch call.
 */
export const STORAGE_KEYS = {
  /** AppLayout sidebar collapsed/expanded, per user */
  appSidebarCollapsed: 'spotlight-sidebar-collapsed',

  /** LogViewer wrap vs nowrap toggle */
  appLogWrap: 'spotlight:log-wrap',

  /** LogViewer recent search history (last 10 entries) */
  appLogSearchHistory: 'spotlight:log-search-history',

  /** PodDetailView collapsed/expanded of the metadata block */
  appPodMetaCollapsed: 'spotlight:pod-meta-collapsed',

  /** cluster store active cluster + namespace — survives reload */
  appClusterSelection: 'spotlight.selection.v2',

  /** UI locale ('zh-CN' | 'en-US') — survives reload, user-controlled */
  appLocale: 'spotlight.locale',

  // ─── useCachedFetch keys ───────────────────────────────────────
  // Passed to useCachedFetch; it prefixes them with `cached:` itself. Only
  // list a key here if some code builds it from this registry — an entry
  // nothing reads is a second place to keep in sync for no benefit.
  cacheEventsBadgeFor: (cluster: string, ns: string) =>
    `cache:events-badge:${cluster}:${ns}`,
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]