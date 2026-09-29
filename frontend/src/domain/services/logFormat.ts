/**
 * Pure log-format helpers. Framework-free, runnable in workers/tests/node.
 *
 * Two responsibilities only:
 * 1. strip ANSI control sequences (k8s sends colored logs)
 * 2. split a chunk into individual lines (one chunk may contain many lines)
 */

const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g

export function stripAnsi(s: string): string {
  return s.replace(ANSI_RE, '')
}

export function splitLogLines(raw: string): string[] {
  return stripAnsi(raw).split('\n').filter((l) => l.length > 0)
}