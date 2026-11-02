import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  // ponytail: 之前写死 'zh-CN'，英文界面里 21,320 还是千分位逗号 ——
  // en-US 应该是 21,320 也用逗号，但 4 位以上用不同分组符。跟随当前语言。
  return new Intl.NumberFormat(currentLocale()).format(n)
}

/**
 * The active locale, read from the global i18n composer.
 *
 * Resolved lazily through a getter registered by the i18n module, so
 * `lib/utils` stays free of an import cycle (i18n → utils → i18n) and can
 * still be unit-tested without mounting the app.
 */
let localeGetter: () => string = () => 'zh-CN'

export function setLocaleGetter(getter: () => string): void {
  localeGetter = getter
}

function currentLocale(): string {
  return localeGetter()
}

export function formatPercent(value: number, total: number, decimals = 1): string {
  if (total === 0) return '0%'
  return `${((value / total) * 100).toFixed(decimals)}%`
}

/**
 * Normalize Kubernetes CPU quantity string to millicores.
 * "100m" → 100; "4" → 4000; "0.5" → 500.
 */
export function parseCPU(s: string): number {
  if (!s) return 0
  const trimmed = s.trim()
  if (trimmed.endsWith('m')) return parseFloat(trimmed) || 0
  return (parseFloat(trimmed) || 0) * 1000
}

/**
 * Normalize Kubernetes memory quantity string to MiB.
 * "64322Mi" → 64322; "128Gi" → 131072; "1024Ki" → 1; raw bytes (no suffix) → bytes/1048576.
 */
export function parseMemory(s: string): number {
  if (!s) return 0
  const trimmed = s.trim()
  const num = parseFloat(trimmed) || 0
  if (trimmed.endsWith('Ki')) return num / 1024
  if (trimmed.endsWith('Mi')) return num
  if (trimmed.endsWith('Gi')) return num * 1024
  if (trimmed.endsWith('Ti')) return num * 1024 * 1024
  if (trimmed.endsWith('K') || trimmed.endsWith('k')) return num / 1024
  if (trimmed.endsWith('M')) return num
  if (trimmed.endsWith('G')) return num * 1024
  if (trimmed.endsWith('T')) return num * 1024 * 1024
  // Assume bytes
  return num / (1024 * 1024)
}

/**
 * Format MiB value back to a compact human-readable string.
 * 131072 → "128Gi"; 64322 → "62.8Gi"; 256 → "256Mi". Trims trailing ".0".
 */
export function formatMiB(mib: number): string {
  let s: string
  if (mib >= 1024 * 1024) s = `${(mib / (1024 * 1024)).toFixed(1)}Ti`
  else if (mib >= 1024) s = `${(mib / 1024).toFixed(1)}Gi`
  else s = `${Math.round(mib)}Mi`
  return s.replace(/\.0([KMGT]i?)$/, '$1')
}

/**
 * Format millicores back to a compact human-readable string.
 * 4000 → "4"; 500 → "500m"; 1500 → "1500m".
 */
export function formatMillicores(mc: number): string {
  if (mc >= 1000 && mc % 1000 === 0) return `${mc / 1000}`
  return `${Math.round(mc)}m`
}
