/**
 * The colour of a container's status dot.
 *
 * Two places draw it — the Pods table and the pod detail page — and they
 * disagreed about what "not ready" means. One of them painted every
 * waiting container amber, which quietly made amber mean "normal, still
 * starting" as well as "needs attention" — the same thing the amber
 * action card means, one column over.
 *
 * Two states carry meaning and one does not:
 *   ready    green  — it is running
 *   broken   red    — CrashLoopBackOff, Error, OOMKilled
 *   other    grey   — still being scheduled or pulled. Normal, not a signal.
 */
export type ContainerTone = 'success' | 'error' | 'neutral'

const TONE_CLASS: Record<ContainerTone, string> = {
  success: 'bg-success',
  error: 'bg-error',
  neutral: 'bg-muted-foreground/50',
}

export function containerTone(c: {
  ready?: boolean
  state?: string
  reason?: string | null
}): ContainerTone {
  if (c.ready) return 'success'
  const reason = (c.reason ?? '').toLowerCase()
  if (c.state === 'waiting' && reason === 'crashloopbackoff') return 'error'
  if (c.state === 'terminated' && (reason === 'error' || reason === 'oomkilled')) return 'error'
  // A container that cannot be pulled or configured is broken, not "still
  // starting". It was amber before amber was reserved for "needs
  // attention" — but a failed image pull IS something to act on, so it
  // joins the error tier rather than the neutral one.
  if (
    reason === 'imagepullbackoff' ||
    reason === 'errimagepull' ||
    reason === 'createcontainerconfigerror' ||
    reason === 'createcontainererror'
  ) return 'error'
  return 'neutral'
}

export function containerDotClass(c: {
  ready?: boolean
  state?: string
  reason?: string | null
}): string {
  return TONE_CLASS[containerTone(c)]
}
