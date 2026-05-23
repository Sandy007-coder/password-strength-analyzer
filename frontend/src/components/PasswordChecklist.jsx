
// PasswordChecklist.jsx  –  Animated pass/fail security checklist


import { RiCheckboxCircleFill, RiCloseCircleFill } from 'react-icons/ri'

const META = {
  length:              { label: 'Minimum 8 characters',         code: 'LEN' },
  uppercase:           { label: 'Uppercase letter  (A–Z)',       code: 'UPR' },
  lowercase:           { label: 'Lowercase letter  (a–z)',       code: 'LWR' },
  numbers:             { label: 'Numeric digit  (0–9)',           code: 'NUM' },
  special_characters:  { label: 'Special character (!@#$…)',     code: 'SPC' },
  not_common:          { label: 'Not a common password',          code: 'SEC' },
}

function CheckRow({ id, passed, delay }) {
  const meta = META[id]
  if (!meta) return null
  return (
    <div className={`fade-up flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-400 check-row ${passed ? 'pass' : 'fail'}`}
      style={{ animationDelay: `${delay}ms`, background: passed ? 'rgba(0,255,163,0.03)' : 'transparent' }}>
      {/* Code badge */}
      <span className="font-mono text-xs w-8 shrink-0" style={{ color: passed ? 'var(--green-bright)' : 'var(--text-dim)' }}>
        [{meta.code}]
      </span>
      {/* Icon */}
      <span style={{ filter: passed ? 'drop-shadow(0 0 6px var(--green-glow))' : 'none' }}>
        {passed
          ? <RiCheckboxCircleFill className="text-lg shrink-0" style={{ color: 'var(--green-bright)' }} />
          : <RiCloseCircleFill    className="text-lg shrink-0 text-txt-void" />}
      </span>
      {/* Label */}
      <span className="font-body text-sm" style={{ color: passed ? 'var(--text-primary)' : 'var(--text-dim)' }}>
        {meta.label}
      </span>
      {/* Status */}
      <span className="ml-auto font-mono text-xs shrink-0" style={{
        color: passed ? 'var(--green-bright)' : 'var(--text-dim)',
      }}>
        {passed ? '✓ PASS' : '✗ FAIL'}
      </span>
    </div>
  )
}

export default function PasswordChecklist({ checks }) {
  if (!checks) return null
  const passed = Object.values(checks).filter(Boolean).length
  const total  = Object.keys(checks).length

  return (
    <div className="glass rounded-lg p-4 space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between px-1 pb-2" style={{ borderBottom: '1px solid rgba(0,180,255,0.08)' }}>
        <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
          // SECURITY CHECKS
        </span>
        <span className="font-mono text-xs px-2.5 py-0.5 rounded-sm" style={{
          color: passed === total ? 'var(--green-bright)' : 'var(--accent-cyan)',
          background: passed === total ? 'rgba(0,255,163,0.08)' : 'rgba(0,180,255,0.08)',
          border: `1px solid ${passed === total ? 'rgba(0,255,163,0.25)' : 'rgba(0,180,255,0.2)'}`,
        }}>
          {passed}/{total}
        </span>
      </div>

      {/* Rows */}
      <div className="space-y-0.5">
        {Object.entries(checks).map(([k, v], i) => (
          <CheckRow key={k} id={k} passed={v} delay={i * 40} />
        ))}
      </div>

      {/* All passed banner */}
      {passed === total && (
        <div className="fade-up mt-3 py-2.5 text-center text-xs font-display tracking-widest rounded"
          style={{ background: 'rgba(0,255,163,0.06)', border: '1px solid rgba(0,255,163,0.2)', color: 'var(--green-bright)' }}>
          ✓ ALL CHECKS PASSED
        </div>
      )}
    </div>
  )
}
