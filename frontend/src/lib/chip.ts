/**
 * The one place that decides what a status chip looks like.
 *
 * Five call sites used to draw their own: PodStatusPill, NodesView,
 * EventsView, PodDetailView's event list and LogViewer. They disagreed on
 * radius (4px vs 8px), padding, font weight, whether a status dot was drawn,
 * and — worst — on borders: some used the `border-*-border` token, LogViewer
 * used `border-*-alpha` (border-color at 40% opacity), so the same error badge
 * rendered in two colours.
 *
 * LogViewer resolves this to a class string instead of rendering a component:
 * a log view holds thousands of rows, and a component instance per row is a
 * cost a table of strings does not pay.
 */

export type ChipTone = 'success' | 'warning' | 'error' | 'neutral'
export type ChipVariant = 'soft' | 'solid' | 'bare'
export type ChipSize = 'sm' | 'xs'

const TONE: Record<ChipTone, { text: string; soft: string; solid: string; dot: string }> = {
  success: {
    text: 'text-success',
    soft: 'bg-success-bg text-success border-success-border',
    solid: 'bg-success text-success-foreground border-success',
    dot: 'bg-success',
  },
  warning: {
    text: 'text-warning',
    soft: 'bg-warning-bg text-warning border-warning-border',
    solid: 'bg-warning text-warning-foreground border-warning',
    dot: 'bg-warning',
  },
  error: {
    text: 'text-error',
    soft: 'bg-error-bg text-error border-error-border',
    solid: 'bg-error text-error-foreground border-error',
    dot: 'bg-error',
  },
  neutral: {
    text: 'text-muted-foreground',
    soft: 'bg-muted text-muted-foreground border-border',
    solid: 'bg-muted-foreground text-background border-muted-foreground',
    dot: 'bg-muted-foreground',
  },
}

/**
 * Radius follows size: the smaller chip is a tighter element and a 8px
 * radius on it reads as a lozenge rather than a badge.
 */
const SIZE: Record<ChipSize, string> = {
  sm: 'rounded-md px-2 py-0.5 text-xs',
  xs: 'rounded px-1.5 py-0 text-2xs',
}

export function chipClasses(opts: {
  tone: ChipTone
  variant?: ChipVariant
  size?: ChipSize
  dot?: boolean
}): string {
  const { tone, variant = 'soft', size = 'sm', dot = false } = opts
  // `bare` drops the surface but KEEPS the tone: a bare error chip is red
  // text, not grey text with a red dot.
  const toneClass =
    variant === 'solid'
      ? TONE[tone].solid
      : variant === 'bare'
        ? `bg-transparent border-transparent ${TONE[tone].text}`
        : TONE[tone].soft
  return [
    'inline-flex items-center border font-medium',
    SIZE[size],
    toneClass,
    dot ? 'gap-1.5' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function chipDotClass(tone: ChipTone): string {
  return TONE[tone].dot
}
