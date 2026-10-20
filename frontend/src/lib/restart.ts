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
  if (count > RESTART_CRITICAL) return 'critical'
  if (count > RESTART_HIGH) return 'high'
  if (count > RESTART_ELEVATED) return 'elevated'
  return 'normal'
}
