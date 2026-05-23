
// Loader.jsx  –  All loading indicators used throughout the app


// Inline three-dot loader
export function DotsLoader({ color = 'var(--accent-cyan)' }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[0,1,2].map(i => (
        <span key={i} className={`w-1.5 h-1.5 rounded-full ${['dot1','dot2','dot3'][i]}`}
          style={{ background: color }} />
      ))}
    </span>
  )
}

// Full-page loading overlay
export function PageLoader({ text = 'ANALYSING' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(2,6,15,0.9)', backdropFilter: 'blur(8px)' }}>
      <div className="flex flex-col items-center gap-6">
        {/* Animated shield rings */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-2 rounded-full border border-cyan/40 spin-slow" />
          <div className="absolute inset-4 rounded-full border-2 border-cyan/60" />
          <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 10px var(--accent-cyan))' }}>🛡</span>
        </div>
        <div className="flex items-center gap-3 font-display text-xs tracking-[0.3em] text-cyan glow-cyan">
          {text}<DotsLoader />
        </div>
      </div>
    </div>
  )
}

// Block skeleton placeholder
export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />
}

// Skeleton for a history card
export function HistoryCardSkeleton() {
  return (
    <div className="rounded-lg p-4 space-y-3" style={{ background: 'rgba(12,30,56,0.4)', border: '1px solid rgba(0,180,255,0.06)' }}>
      <div className="flex justify-between items-center">
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
