const LOADER_DOT_CLASSES = ['dot1', 'dot2', 'dot3']

const OVERLAY_STYLES = {
  background: 'rgba(2,6,15,0.9)',
  backdropFilter: 'blur(8px)',
}

const SKELETON_CARD_STYLES = {
  background: 'rgba(12,30,56,0.4)',
  border: '1px solid rgba(0,180,255,0.06)',
}

const SHIELD_ICON_STYLES = {
  filter: 'drop-shadow(0 0 10px var(--accent-cyan))',
}

export function DotsLoader({
  color = 'var(--accent-cyan)',
}) {
  return (
    <span className="inline-flex items-center gap-1">
      {LOADER_DOT_CLASSES.map((animationClass, index) => (
        <span
          key={index}
          className={`h-1.5 w-1.5 rounded-full ${animationClass}`}
          style={{ background: color }}
        />
      ))}
    </span>
  )
}

export function PageLoader({
  text = 'ANALYSING',
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={OVERLAY_STYLES}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div
            className="absolute inset-0 animate-ping rounded-full border border-cyan/20"
            style={{ animationDuration: '1.5s' }}
          />

          <div className="spin-slow absolute inset-2 rounded-full border border-cyan/40" />

          <div className="absolute inset-4 rounded-full border-2 border-cyan/60" />

          <span
            className="text-2xl"
            style={SHIELD_ICON_STYLES}
          >
            🛡
          </span>
        </div>

        <div className="font-display glow-cyan flex items-center gap-3 text-xs tracking-[0.3em] text-cyan">
          {text}
          <DotsLoader />
        </div>
      </div>
    </div>
  )
}

export function Skeleton({
  className = '',
}) {
  return (
    <div className={`skeleton ${className}`} />
  )
}

export function HistoryCardSkeleton() {
  return (
    <div
      className="space-y-3 rounded-lg p-4"
      style={SKELETON_CARD_STYLES}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="h-1.5 w-full" />

      <div className="flex gap-6">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export default DotsLoader