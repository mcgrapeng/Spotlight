/**
 * One ladder for "how many restarts is a lot".
 *
 * The Pods table and the dashboard's restart bars used different thresholds
 * (5 / 100 versus 10 / 100 / 1000), so the same pod read as amber in one
 * place and grey in another. 10 / 100 / 1000 is the shared scale.
 *
 * The scale is absolute, not relative. A relative rule ("more than ten times
 * this cluster's median") would need history the API does not carry yet, and
 * a fixed threshold is wrong in both directions at the extremes: 3 restarts
 * on a five-pod kind cluster is nothing, and 50 on a 287-pod production
 * cluster is a signal. The ladder is where that judgement lands, and it is
 * one place instead of two.
 */
export type RestartSeverity = 'normal' | 'elevated' | 'high' | 'critical'

export const RESTART_ELEVATED = 10
export const RESTART_HIGH = 100
export const RESTART_CRITICAL = 1000

export function restartSeverity(count: number): RestartSeverity {
  // `>=` so each named constant is the FIRST value of its tier: 10 is
  // elevated, 100 is high, 1000 is critical. The round numbers are exactly
  // the ones someone checks this ladder against.
  if (count >= RESTART_CRITICAL) return 'critical'
  if (count >= RESTART_HIGH) return 'high'
  if (count >= RESTART_ELEVATED) return 'elevated'
  return 'normal'
}

/**
 * The predicate form: a view says "does this pod need attention", not
 * what the thresholds are. Every surface that flags a restarting pod goes
 * through this, so a pod with 7 restarts is not amber on one page and grey
 * on another.
 */
export function isNoisyRestarts(count: number): boolean {
  return restartSeverity(count) !== 'normal'
}

/**
 * The colour of a restart count.
 *
 * A pod that restarted 21,320 times is still Running. It has not failed, it
 * has not crashed — it needs a human. The old mapping dressed the top tier
 * in the error colour, which put the same fact in two colours across the
 * app (amber in the dashboard hero, red in the restart bars, red in the
 * pod detail fact bar) and broke the one rule the design rests on:
 * red means failed, amber means "needs a look".
 *
 * So the ladder keeps its thresholds — they decide *whether* a pod is
 * worth mentioning — and gives up its hues. One hue, three weights:
 *
 *   normal    neutral grey, no icon
 *   elevated  amber, half strength
 *   high      amber, three quarters
 *   critical  amber, full strength
 */
export type RestartTone = 'neutral' | 'warning'

export function restartTone(count: number): RestartTone {
  return restartSeverity(count) === 'normal' ? 'neutral' : 'warning'
}

/** Text colour for a restart count. */
export function restartTextClass(count: number): string {
  return restartTone(count) === 'warning' ? 'text-warning' : 'text-muted-foreground'
}
