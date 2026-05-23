
// PasswordHistory.jsx  –  Saved password history list


import { useState } from 'react'
import { RiHistoryLine, RiDeleteBin2Line, RiRefreshLine, RiTimeLine } from 'react-icons/ri'
import { HistoryCardSkeleton } from './Loader'

const STRENGTH_CFG = {
  'Weak':        { c: '#ff2d55', bg: 'rgba(255,45,85,0.06)',  bd: 'rgba(255,45,85,0.2)'  },
  'Medium':      { c: '#ffd60a', bg: 'rgba(255,214,10,0.06)', bd: 'rgba(255,214,10,0.2)' },
  'Strong':      { c: '#00b4ff', bg: 'rgba(0,180,255,0.06)',  bd: 'rgba(0,180,255,0.2)'  },
  'Very Strong': { c: '#00ffa3', bg: 'rgba(0,255,163,0.06)',  bd: 'rgba(0,255,163,0.2)'  },
}

function fmt(iso) {
  try { return new Date(iso).toLocaleString(undefined, { day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit' }) }
  catch { return iso }
}

function HistoryCard({ r, idx }) {
  const cfg = STRENGTH_CFG[r.strength] ?? STRENGTH_CFG['Weak']
  const pct = `${Math.round((r.score / 10) * 100)}%`
  return (
    <div className="history-card rounded-lg p-4 space-y-3" style={{ animationDelay: `${idx * 60}ms`, background: cfg.bg, border: `1px solid ${cfg.bd}` }}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-display text-xs px-2.5 py-1 rounded-sm tracking-widest" style={{
          color: cfg.c, background: `${cfg.c}18`, border: `1px solid ${cfg.c}44`, textShadow: `0 0 8px ${cfg.c}`
        }}>
          {r.strength.toUpperCase()}
        </span>
        <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: 'var(--text-dim)' }}>
          <RiTimeLine />{fmt(r.created_at)}
        </span>
      </div>

      {/* Score bar */}
      <div className="space-y-1">
        <div className="str-track h-1.5 rounded-sm w-full overflow-hidden">
          <div className="str-fill" style={{ width: pct, background: `linear-gradient(90deg,${cfg.c}88,${cfg.c})`, boxShadow: `0 0 6px ${cfg.c}` }} />
        </div>
        <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>SCORE: <span style={{ color: cfg.c }}>{r.score}/10</span></span>
          <span>ENTROPY: <span style={{ color: cfg.c }}>{r.entropy}b</span></span>
        </div>
      </div>
    </div>
  )
}

export default function PasswordHistory({ history, isLoading, onClear, onRefresh }) {
  const [confirming, setConfirming] = useState(false)

  const handleClear = () => {
    if (confirming) { onClear(); setConfirming(false) }
    else { setConfirming(true); setTimeout(() => setConfirming(false), 4000) }
  }

  return (
    <div className="glass rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <RiHistoryLine className="text-cyan" />
          <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            // SAVED HISTORY
          </span>
          {!isLoading && (
            <span className="font-mono text-xs px-2 py-0.5 rounded-sm text-cyan" style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)' }}>
              {history?.length ?? 0}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onRefresh} disabled={isLoading} className="p-1.5 rounded transition-all duration-200 text-txt-dim hover:text-cyan hover:bg-cyan/5 disabled:opacity-30">
            <RiRefreshLine className={`text-base ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {history?.length > 0 && (
            <button onClick={handleClear} className={`btn-danger flex items-center gap-1.5 px-3 py-1.5 rounded text-xs ${confirming ? 'bg-red-neo/20 border-red-neo/60 shadow-neon-red' : ''}`}>
              <RiDeleteBin2Line />{confirming ? 'CONFIRM?' : 'CLEAR ALL'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <HistoryCardSkeleton key={i} />)}</div>
      ) : !history?.length ? (
        <div className="py-12 flex flex-col items-center gap-3">
          <RiHistoryLine className="text-4xl" style={{ color: 'var(--text-dim)', opacity: 0.3 }} />
          <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>NO RECORDS FOUND</p>
          <p className="text-sm" style={{ color: 'var(--text-dim)' }}>Save a password to begin tracking.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {history.map((r, i) => <HistoryCard key={r.id ?? i} r={r} idx={i} />)}
        </div>
      )}
    </div>
  )
}
