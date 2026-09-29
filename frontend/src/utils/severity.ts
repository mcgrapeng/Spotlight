import type { LogSeverity } from '@/api/types'

/**
 * Severity palette — single source of truth.
 *
 * Tokens declared as CSS variables in styles/main.css so dark/light themes
 * override them centrally. Consumers read via getSeverityToken(severity).
 *
 * Inspired by terminal color schemes (One Dark / Solarized) and k9s color
 * coding (which uses red/yellow for warnings).
 */
export const SEVERITY_TOKENS: Record<LogSeverity, {
  bg: string; fg: string; border: string; label: string; rank: number;
}> = {
  trace:    { bg: 'var(--log-trace-bg)',    fg: 'var(--log-trace-fg)',    border: 'var(--log-trace-border)',    label: 'TRACE',    rank: 0 },
  debug:    { bg: 'var(--log-debug-bg)',    fg: 'var(--log-debug-fg)',    border: 'var(--log-debug-border)',    label: 'DEBUG',    rank: 1 },
  info:     { bg: 'var(--log-info-bg)',     fg: 'var(--log-info-fg)',     border: 'var(--log-info-border)',     label: 'INFO',     rank: 2 },
  notice:   { bg: 'var(--log-notice-bg)',   fg: 'var(--log-notice-fg)',   border: 'var(--log-notice-border)',   label: 'NOTICE',   rank: 3 },
  warn:     { bg: 'var(--log-warn-bg)',     fg: 'var(--log-warn-fg)',     border: 'var(--log-warn-border)',     label: 'WARN',     rank: 4 },
  error:    { bg: 'var(--log-error-bg)',    fg: 'var(--log-error-fg)',    border: 'var(--log-error-border)',    label: 'ERROR',    rank: 5 },
  critical: { bg: 'var(--log-critical-bg)', fg: 'var(--log-critical-fg)', border: 'var(--log-critical-border)', label: 'CRITICAL', rank: 6 },
  fatal:    { bg: 'var(--log-fatal-bg)',    fg: 'var(--log-fatal-fg)',    border: 'var(--log-fatal-border)',    label: 'FATAL',    rank: 7 },
  unknown:  { bg: 'transparent',            fg: 'var(--log-unknown-fg)',  border: 'transparent',                  label: '',         rank: -1 },
}

export function getSeverityToken(severity: LogSeverity | string) {
  return SEVERITY_TOKENS[severity as LogSeverity] ?? SEVERITY_TOKENS.unknown
}

export function severityAtLeast(severity: LogSeverity | string, threshold: LogSeverity): boolean {
  return (SEVERITY_TOKENS[severity as LogSeverity]?.rank ?? -1) >= SEVERITY_TOKENS[threshold].rank
}

export const SEVERITY_OPTIONS: { label: string; value: LogSeverity }[] = [
  { label: 'TRACE', value: 'trace' },
  { label: 'DEBUG', value: 'debug' },
  { label: 'INFO', value: 'info' },
  { label: 'NOTICE', value: 'notice' },
  { label: 'WARN+', value: 'warn' },
  { label: 'ERROR+', value: 'error' },
  { label: 'CRITICAL+', value: 'critical' },
  { label: 'FATAL', value: 'fatal' },
]
