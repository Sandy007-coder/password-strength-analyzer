import { RiAlertLine, RiShieldCheckLine } from 'react-icons/ri'

function SuggestionRow({ message, position }) {
  return (
    <div
      className="fade-up group flex items-start gap-3 rounded px-3 py-2.5 transition-all duration-300"
      style={{
        animationDelay: `${position * 50}ms`,
        background: 'rgba(255,107,53,0.04)',
        border:     '1px solid rgba(255,107,53,0.12)',
      }}
    >
      <span className="mt-0.5 shrink-0 font-mono text-xs" style={{ color: 'var(--orange-bright)' }}>
        [{String(position + 1).padStart(2, '0')}]
      </span>
      <p className="text-sm" style={{ color: 'var(--text-primary)', lineHeight: '1.5' }}>
        {message}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-5">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: 'rgba(0,255,163,0.06)',
          border:     '1px solid rgba(0,255,163,0.25)',
          boxShadow:  '0 0 20px rgba(0,255,163,0.1)',
        }}
      >
        <RiShieldCheckLine
          className="text-2xl"
          style={{ color: 'var(--green-bright)', filter: 'drop-shadow(0 0 8px var(--green-bright))' }}
        />
      </div>

      <div className="space-y-1 text-center">
        <p className="glow-green font-display text-xs tracking-widest" style={{ color: 'var(--green-bright)' }}>
          OPTIMAL SECURITY
        </p>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          No improvements required
        </p>
      </div>
    </div>
  )
}

export default function SuggestionsPanel({ suggestions }) {
  if (!suggestions) return null

  const count = suggestions.length
  const hasSuggestions = count > 0

  return (
    <div className="glass space-y-3 rounded-lg p-4">

      <div
        className="flex items-center justify-between pb-2"
        style={{ borderBottom: '1px solid rgba(0,180,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          {hasSuggestions
            ? <RiAlertLine      className="text-base" style={{ color: 'var(--orange-bright)' }} />
            : <RiShieldCheckLine className="text-base" style={{ color: 'var(--green-bright)' }} />
          }
          <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            // {hasSuggestions ? 'IMPROVEMENTS' : 'RECOMMENDATIONS'}
          </span>
        </div>

        {hasSuggestions && (
          <span
            className="rounded-sm px-2 py-0.5 font-mono text-xs"
            style={{
              color:      'var(--orange-bright)',
              background: 'rgba(255,107,53,0.08)',
              border:     '1px solid rgba(255,107,53,0.25)',
            }}
          >
            {count} ITEM{count > 1 ? 'S' : ''}
          </span>
        )}
      </div>

      {hasSuggestions ? (
        <div className="space-y-2">
          {suggestions.map((msg, i) => (
            <SuggestionRow key={`${i}-${msg}`} message={msg} position={i} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

    </div>
  )
}