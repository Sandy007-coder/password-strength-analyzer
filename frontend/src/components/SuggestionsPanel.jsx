
// SuggestionsPanel.jsx  –  Actionable improvement suggestions


import { RiAlertLine, RiShieldCheckLine } from 'react-icons/ri'

function SuggestionItem({ text, index }) {
  return (
    <div className="fade-up flex gap-3 items-start px-3 py-2.5 rounded transition-all duration-300 group"
      style={{
        animationDelay: `${index * 50}ms`,
        background: 'rgba(255,107,53,0.04)',
        border: '1px solid rgba(255,107,53,0.12)',
      }}>
      <span className="font-mono text-xs shrink-0 mt-0.5" style={{ color: 'var(--orange-bright)' }}>
        [{String(index + 1).padStart(2, '0')}]
      </span>
      <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>{text}</p>
    </div>
  )
}

export default function SuggestionsPanel({ suggestions }) {
  if (!suggestions) return null
  const has = suggestions.length > 0

  return (
    <div className="glass rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid rgba(0,180,255,0.08)' }}>
        <div className="flex items-center gap-2">
          {has
            ? <RiAlertLine className="text-base" style={{ color: 'var(--orange-bright)' }} />
            : <RiShieldCheckLine className="text-base" style={{ color: 'var(--green-bright)' }} />}
          <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            // {has ? 'IMPROVEMENTS' : 'RECOMMENDATIONS'}
          </span>
        </div>
        {has && (
          <span className="font-mono text-xs px-2 py-0.5 rounded-sm" style={{
            color: 'var(--orange-bright)',
            background: 'rgba(255,107,53,0.08)',
            border: '1px solid rgba(255,107,53,0.25)',
          }}>
            {suggestions.length} ITEM{suggestions.length > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      {has ? (
        <div className="space-y-2">
          {suggestions.map((s, i) => <SuggestionItem key={i} text={s} index={i} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,255,163,0.06)', border: '1px solid rgba(0,255,163,0.25)', boxShadow: '0 0 20px rgba(0,255,163,0.1)' }}>
            <RiShieldCheckLine className="text-2xl" style={{ color: 'var(--green-bright)', filter: 'drop-shadow(0 0 8px var(--green-bright))' }} />
          </div>
          <div className="text-center space-y-1">
            <p className="font-display text-xs tracking-widest glow-green" style={{ color: 'var(--green-bright)' }}>
              OPTIMAL SECURITY
            </p>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              No improvements required
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
