
// StrengthMeter.jsx  –  Animated strength bar + entropy SVG ring


const LEVEL = {
  'Weak':        { n: 1, color: '#ff2d55', label: 'WEAK',        glow: 'rgba(255,45,85,0.4)',    track: 'rgba(255,45,85,0.08)' },
  'Medium':      { n: 2, color: '#ffd60a', label: 'MEDIUM',      glow: 'rgba(255,214,10,0.4)',   track: 'rgba(255,214,10,0.08)' },
  'Strong':      { n: 3, color: '#00b4ff', label: 'STRONG',      glow: 'rgba(0,180,255,0.4)',    track: 'rgba(0,180,255,0.08)' },
  'Very Strong': { n: 4, color: '#00ffa3', label: 'VERY STRONG', glow: 'rgba(0,255,163,0.4)',   track: 'rgba(0,255,163,0.08)' },
}

// SVG circular entropy gauge
function EntropyRing({ entropy, color }) {
  const R = 44, SW = 6
  const circumference = 2 * Math.PI * R
  const pct = Math.min(entropy / 128, 1)
  const offset = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: 110, height: 110 }}>
        <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track */}
          <circle cx="55" cy="55" r={R} fill="none" stroke="rgba(0,180,255,0.08)" strokeWidth={SW} />
          {/* Animated fill */}
          <circle cx="55" cy="55" r={R} fill="none"
            stroke={color} strokeWidth={SW} strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="entropy-ring fill"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        {/* Centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold" style={{ color, textShadow: `0 0 15px ${color}` }}>
            {Math.round(entropy)}
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>BITS</span>
        </div>
      </div>
      <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>ENTROPY</span>
    </div>
  )
}

// 4-segment bar
function SegmentBar({ n, color }) {
  return (
    <div className="flex gap-1.5 w-full">
      {[1,2,3,4].map(seg => {
        const filled = seg <= n
        return (
          <div key={seg} className="flex-1 h-2 rounded-sm str-track overflow-hidden">
            <div className="str-fill h-full" style={{
              width: filled ? '100%' : '0%',
              background: filled ? `linear-gradient(90deg, ${color}99, ${color})` : 'transparent',
              boxShadow: filled ? `0 0 8px ${color}88` : 'none',
            }} />
          </div>
        )
      })}
    </div>
  )
}

export default function StrengthMeter({ result }) {
  if (!result) {
    return (
      <div className="rounded-lg p-5 space-y-4" style={{ background: 'rgba(12,30,56,0.4)', border: '1px solid rgba(0,180,255,0.06)' }}>
        <div className="h-4 skeleton rounded w-24" />
        <div className="flex gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="flex-1 h-2 skeleton rounded-sm" />)}
        </div>
        <div className="w-28 h-28 skeleton rounded-full mx-auto" />
      </div>
    )
  }

  const { strength, score, max_score, entropy } = result
  const lv = LEVEL[strength] ?? LEVEL['Weak']

  return (
    <div className="rounded-lg p-5 space-y-5 transition-all duration-500 border-flicker" style={{
      background: lv.track,
      border: `1px solid ${lv.glow.replace('0.4','0.25')}`,
      boxShadow: `0 0 40px ${lv.glow.replace('0.4','0.08')}`,
    }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          // STRENGTH
        </span>
        <span className="font-display text-xs px-3 py-1 rounded-sm tracking-widest font-bold" style={{
          color: lv.color,
          background: `${lv.color}14`,
          border: `1px solid ${lv.color}44`,
          textShadow: `0 0 10px ${lv.color}`,
        }}>
          {lv.label}
        </span>
      </div>

      {/* Segment bar */}
      <SegmentBar n={lv.n} color={lv.color} />

      {/* Score text */}
      <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
        <span>SCORE</span>
        <span style={{ color: lv.color }}>{score} / {max_score}</span>
      </div>

      {/* Entropy ring */}
      <div className="flex justify-center pt-1">
        <EntropyRing entropy={entropy} color={lv.color} />
      </div>
    </div>
  )
}
