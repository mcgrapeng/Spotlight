/**
 * Pure log-format helpers. Framework-free, runnable in workers/tests/node.
 *
 * Responsibilities:
 *   stripAnsi     — drop ANSI escapes (used by copy/export/download)
 *   splitLogLines — split a chunk into lines, KEEPING ANSI escapes intact so
 *                   the display layer (ansiToHtml) can render pod-supplied
 *                   colors. Search filters still operate on the raw content
 *                   which now contains escape bytes — "error" still matches
 *                   the body of "\x1b[31mERROR\x1b[0m" because substring
 *                   matching ignores the embedded escapes.
 */

const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g

export function stripAnsi(s: string): string {
  return s.replace(ANSI_RE, '')
}

export function splitLogLines(raw: string): string[] {
  return raw.split('\n').filter((l) => l.length > 0)
}
