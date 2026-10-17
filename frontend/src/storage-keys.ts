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
 * - `app.*`        — long-lived user preferences, written under user control
 * - `cache.*`      — short-lived fetch cache managed by useCachedFetch
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

  // ─── useCachedFetch-managed ────────────────────────────────────────
  // Format: `cache:{useCachedFetch key}` — TTL is in the useCachedFetch call,
  // not here. We just namespace them so a manual `localStorage.clear()` is
  // safe (won't wipe user prefs) and the keys can't collide with `app.*`.
  cacheClusters: 'cache:clusters:list',
  cacheClustersFor: (cluster: string) => `cache:namespaces:${cluster}`,
  cacheDashboardFor: (cluster: string) => `cache:dashboard:${cluster}`,
  cacheNodesFor: (cluster: string) => `cache:nodes:${cluster}`,
  cacheEventsBadgeFor: (cluster: string, ns: string) =>
    `cache:events-badge:${cluster}:${ns}`,
  cachePermissions: 'cache:permissions:rbac',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]