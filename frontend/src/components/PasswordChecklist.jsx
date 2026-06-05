import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
} from 'react-icons/ri'

const CHECK_DEFINITIONS = {
  length: {
    label: 'Minimum 8 characters',
    code: 'LEN',
  },
  uppercase: {
    label: 'Uppercase letter (A–Z)',
    code: 'UPR',
  },
  lowercase: {
    label: 'Lowercase letter (a–z)',
    code: 'LWR',
  },
  numbers: {
    label: 'Numeric digit (0–9)',
    code: 'NUM',
  },
  special_characters: {
    label: 'Special character (!@#$…)',
    code: 'SPC',
  },
  not_common: {
    label: 'Not a common password',
    code: 'SEC',
  },
}

const HEADER_STYLES = {
  borderBottom: '1px solid rgba(0,180,255,0.08)',
}

const SUCCESS_BANNER_STYLES = {
  background: 'rgba(0,255,163,0.06)',
  border: '1px solid rgba(0,255,163,0.2)',
  color: 'var(--green-bright)',
}

function ChecklistItem({
  checkId,
  passed,
  animationDelay,
}) {
  const definition = CHECK_DEFINITIONS[checkId]

  if (!definition) {
    return null
  }

  const rowStyles = {
    animationDelay: `${animationDelay}ms`,
    background: passed
      ? 'rgba(0,255,163,0.03)'
      : 'transparent',
  }

  const statusColor = passed
    ? 'var(--green-bright)'
    : 'var(--text-dim)'

  return (
    <div
      className={`
        fade-up check-row flex items-center gap-3
        rounded px-3 py-2.5 transition-all duration-400
        ${passed ? 'pass' : 'fail'}
      `}
      style={rowStyles}
    >
      <span
        className="w-8 shrink-0 font-mono text-xs"
        style={{ color: statusColor }}
      >
        [{definition.code}]
      </span>

      <span
        style={{
          filter: passed
            ? 'drop-shadow(0 0 6px var(--green-glow))'
            : 'none',
        }}
      >
        {passed ? (
          <RiCheckboxCircleFill
            className="shrink-0 text-lg"
            style={{
              color: 'var(--green-bright)',
            }}
          />
        ) : (
          <RiCloseCircleFill className="shrink-0 text-lg text-txt-void" />
        )}
      </span>

      <span
        className="font-body text-sm"
        style={{
          color: passed
            ? 'var(--text-primary)'
            : 'var(--text-dim)',
        }}
      >
        {definition.label}
      </span>

      <span
        className="ml-auto shrink-0 font-mono text-xs"
        style={{ color: statusColor }}
      >
        {passed ? '✓ PASS' : '✗ FAIL'}
      </span>
    </div>
  )
}

export default function PasswordChecklist({
  checks,
}) {
  if (!checks) {
    return null
  }

  const totalChecks = Object.keys(checks).length

  const passedChecks = Object.values(checks)
    .filter(Boolean)
    .length

  const allChecksPassed =
    passedChecks === totalChecks

  const scoreBadgeStyles = {
    color: allChecksPassed
      ? 'var(--green-bright)'
      : 'var(--accent-cyan)',

    background: allChecksPassed
      ? 'rgba(0,255,163,0.08)'
      : 'rgba(0,180,255,0.08)',

    border: `1px solid ${
      allChecksPassed
        ? 'rgba(0,255,163,0.25)'
        : 'rgba(0,180,255,0.2)'
    }`,
  }

  return (
    <div className="glass rounded-lg p-4 space-y-1">
      <div
        className="flex items-center justify-between px-1 pb-2"
        style={HEADER_STYLES}
      >
        <span
          className="font-display text-xs tracking-widest"
          style={{
            color: 'var(--text-secondary)',
          }}
        >
          // SECURITY CHECKS
        </span>

        <span
          className="rounded-sm px-2.5 py-0.5 font-mono text-xs"
          style={scoreBadgeStyles}
        >
          {passedChecks}/{totalChecks}
        </span>
      </div>

      <div className="space-y-0.5">
        {Object.entries(checks).map(
          ([checkId, passed], index) => (
            <ChecklistItem
              key={checkId}
              checkId={checkId}
              passed={passed}
              animationDelay={index * 40}
            />
          ),
        )}
      </div>

      {allChecksPassed && (
        <div
          className="fade-up mt-3 rounded py-2.5 text-center font-display text-xs tracking-widest"
          style={SUCCESS_BANNER_STYLES}
        >
          ✓ ALL CHECKS PASSED
        </div>
      )}
    </div>
  )
}