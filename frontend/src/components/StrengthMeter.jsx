const STRENGTH_LEVELS = {
  Weak: {
    level: 1,
    color: '#ff2d55',
    label: 'WEAK',
    glow: 'rgba(255,45,85,0.4)',
    background: 'rgba(255,45,85,0.08)',
  },
  Medium: {
    level: 2,
    color: '#ffd60a',
    label: 'MEDIUM',
    glow: 'rgba(255,214,10,0.4)',
    background: 'rgba(255,214,10,0.08)',
  },
  Strong: {
    level: 3,
    color: '#00b4ff',
    label: 'STRONG',
    glow: 'rgba(0,180,255,0.4)',
    background: 'rgba(0,180,255,0.08)',
  },
  'Very Strong': {
    level: 4,
    color: '#00ffa3',
    label: 'VERY STRONG',
    glow: 'rgba(0,255,163,0.4)',
    background: 'rgba(0,255,163,0.08)',
  },
}

const ENTROPY_RING_RADIUS = 44
const ENTROPY_RING_STROKE_WIDTH = 6
const ENTROPY_RING_SIZE = 110
const ENTROPY_MAX_BITS = 128

function EntropyRing({
  entropy,
  color,
}) {
  const circumference =
    2 * Math.PI * ENTROPY_RING_RADIUS

  const completionRatio = Math.min(
    entropy / ENTROPY_MAX_BITS,
    1,
  )

  const strokeOffset =
    circumference * (1 - completionRatio)

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative"
        style={{
          width: ENTROPY_RING_SIZE,
          height: ENTROPY_RING_SIZE,
        }}
      >
        <svg
          width={ENTROPY_RING_SIZE}
          height={ENTROPY_RING_SIZE}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="55"
            cy="55"
            r={ENTROPY_RING_RADIUS}
            fill="none"
            stroke="rgba(0,180,255,0.08)"
            strokeWidth={ENTROPY_RING_STROKE_WIDTH}
          />

          <circle
            cx="55"
            cy="55"
            r={ENTROPY_RING_RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={ENTROPY_RING_STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            className="entropy-ring fill"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-display text-lg font-bold"
            style={{
              color,
              textShadow: `0 0 15px ${color}`,
            }}
          >
            {Math.round(entropy)}
          </span>

          <span
            className="font-mono text-xs"
            style={{ color: 'var(--text-dim)' }}
          >
            BITS
          </span>
        </div>
      </div>

      <span
        className="font-display text-xs tracking-widest"
        style={{ color: 'var(--text-dim)' }}
      >
        ENTROPY
      </span>
    </div>
  )
}

function StrengthSegments({
  level,
  color,
}) {
  return (
    <div className="flex w-full gap-1.5">
      {[1, 2, 3, 4].map((segmentIndex) => {
        const isActive = segmentIndex <= level

        return (
          <div
            key={segmentIndex}
            className="str-track h-2 flex-1 overflow-hidden rounded-sm"
          >
            <div
              className="str-fill h-full"
              style={{
                width: isActive ? '100%' : '0%',
                background: isActive
                  ? `linear-gradient(90deg, ${color}99, ${color})`
                  : 'transparent',
                boxShadow: isActive
                  ? `0 0 8px ${color}88`
                  : 'none',
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
      style={{
        background: 'rgba(12,30,56,0.4)',
        border: '1px solid rgba(0,180,255,0.06)',
      }}
    >
      <div className="skeleton h-4 w-24 rounded" />

      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className="skeleton h-2 flex-1 rounded-sm"
          />
        ))}
      </div>

      <div className="skeleton mx-auto h-28 w-28 rounded-full" />
    </div>
  )
}

export default function StrengthMeter({
  result,
}) {
  if (!result) {
    return <StrengthMeterSkeleton />
  }

  const {
    strength,
    score,
    max_score: maxScore,
    entropy,
  } = result

  const strengthConfig =
    STRENGTH_LEVELS[strength] ??
    STRENGTH_LEVELS.Weak

  const borderColor =
    strengthConfig.glow.replace('0.4', '0.25')

  const shadowColor =
    strengthConfig.glow.replace('0.4', '0.08')

  return (
    <div
      className="border-flicker space-y-5 rounded-lg p-5 transition-all duration-500"
      style={{
        background: strengthConfig.background,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 40px ${shadowColor}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-display text-xs tracking-widest"
          style={{ color: 'var(--text-secondary)' }}
        >
          // STRENGTH
        </span>

        <span
          className="font-display rounded-sm px-3 py-1 text-xs font-bold tracking-widest"
          style={{
            color: strengthConfig.color,
            background: `${strengthConfig.color}14`,
            border: `1px solid ${strengthConfig.color}44`,
            textShadow: `0 0 10px ${strengthConfig.color}`,
          }}
        >
          {strengthConfig.label}
        </span>
      </div>

      <StrengthSegments
        level={strengthConfig.level}
        color={strengthConfig.color}
      />

      <div
        className="flex justify-between font-mono text-xs"
        style={{ color: 'var(--text-dim)' }}
      >
        <span>SCORE</span>

        <span style={{ color: strengthConfig.color }}>
          {score} / {maxScore}
        </span>
      </div>

      <div className="flex justify-center pt-1">
        <EntropyRing
          entropy={entropy}
          color={strengthConfig.color}
        />
      </div>
    </div>
  )
}