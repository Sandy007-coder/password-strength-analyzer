const STRENGTH = {
  'Weak':        { level: 1, color: '#ff2d55', label: 'WEAK',        glow: 'rgba(255,45,85,0.4)',   background: 'rgba(255,45,85,0.08)'   },
  'Medium':      { level: 2, color: '#ffd60a', label: 'MEDIUM',      glow: 'rgba(255,214,10,0.4)',  background: 'rgba(255,214,10,0.08)'  },
  'Strong':      { level: 3, color: '#00b4ff', label: 'STRONG',      glow: 'rgba(0,180,255,0.4)',   background: 'rgba(0,180,255,0.08)'   },
  'Very Strong': { level: 4, color: '#00ffa3', label: 'VERY STRONG', glow: 'rgba(0,255,163,0.4)',   background: 'rgba(0,255,163,0.08)'   },
}

const RING_R      = 44
const RING_STROKE = 6
const RING_SIZE   = 110
const ENTROPY_MAX = 128

function EntropyRing({ entropy, color }) {
  const circumference = 2 * Math.PI * RING_R
  const offset        = circumference * (1 - Math.min(entropy / ENTROPY_MAX, 1))

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="55" cy="55" r={RING_R} fill="none" stroke="rgba(0,180,255,0.08)" strokeWidth={RING_STROKE} />
          <circle
            cx="55" cy="55" r={RING_R}
            fill="none"
            stroke={color}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="entropy-ring fill"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg font-bold" style={{ color, textShadow: `0 0 15px ${color}` }}>
            {Math.round(entropy)}
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>BITS</span>
        </div>
      </div>

      <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>
        ENTROPY
      </span>
    </div>
  )
}

function StrengthSegments({ level, color }) {
  return (
    <div className="flex w-full gap-1.5">
      {[1, 2, 3, 4].map((i) => {
        const active = i <= level
        return (
          <div key={i} className="str-track h-2 flex-1 overflow-hidden rounded-sm">
            <div
              className="str-fill h-full"
              style={{
                width:      active ? '100%' : '0%',
                background: active ? `linear-gradient(90deg, ${color}99, ${color})` : 'transparent',
                boxShadow:  active ? `0 0 8px ${color}88` : 'none',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

function StrengthMeterSkeleton() {
  return (
    <div
      className="space-y-4 rounded-lg p-5"
      style={{ background: 'rgba(12,30,56,0.4)', border: '1px solid rgba(0,180,255,0.06)' }}
    >
      <div className="skeleton h-4 w-24 rounded" />
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-2 flex-1 rounded-sm" />)}
      </div>
      <div className="skeleton mx-auto h-28 w-28 rounded-full" />
    </div>
  )
}

export default function StrengthMeter({ result }) {
  if (!result) return <StrengthMeterSkeleton />

  const { strength, score, max_score: maxScore, entropy } = result
  const cfg = STRENGTH[strength] ?? STRENGTH.Weak

  return (
    <div
      className="border-flicker space-y-5 rounded-lg p-5 transition-all duration-500"
      style={{
        background: cfg.background,
        border:     `1px solid ${cfg.glow.replace('0.4', '0.25')}`,
        boxShadow:  `0 0 40px ${cfg.glow.replace('0.4', '0.08')}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          // STRENGTH
        </span>
        <span
          className="font-display rounded-sm px-3 py-1 text-xs font-bold tracking-widest"
          style={{
            color:      cfg.color,
            background: `${cfg.color}14`,
            border:     `1px solid ${cfg.color}44`,
            textShadow: `0 0 10px ${cfg.color}`,
          }}
        >
          {cfg.label}
        </span>
      </div>

      <StrengthSegments level={cfg.level} color={cfg.color} />

      <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
        <span>SCORE</span>
        <span style={{ color: cfg.color }}>{score} / {maxScore}</span>
      </div>

      <div className="flex justify-center pt-1">
        <EntropyRing entropy={entropy} color={cfg.color} />
      </div>
    </div>
  )
}