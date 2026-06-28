import { useState } from 'react'
import { RiDeleteBin2Line, RiHistoryLine, RiRefreshLine, RiTimeLine } from 'react-icons/ri'

import { HistoryCardSkeleton } from './Loader'
import emptyState from '../assets/empty-state.svg'

const STRENGTH_STYLES = {
  'Weak':        { color: '#ff2d55', background: 'rgba(255,45,85,0.06)',   border: 'rgba(255,45,85,0.2)'   },
  'Medium':      { color: '#ffd60a', background: 'rgba(255,214,10,0.06)',  border: 'rgba(255,214,10,0.2)'  },
  'Strong':      { color: '#00b4ff', background: 'rgba(0,180,255,0.06)',   border: 'rgba(0,180,255,0.2)'   },
  'Very Strong': { color: '#00ffa3', background: 'rgba(0,255,163,0.06)',   border: 'rgba(0,255,163,0.2)'   },
}

const CONFIRM_TIMEOUT_MS = 4_000
const SKELETONS = [1, 2, 3]

function formatTimestamp(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ts
  }
}

function HistoryCard({ record, index }) {
  const style    = STRENGTH_STYLES[record.strength] ?? STRENGTH_STYLES.Weak
  const scorePct = `${Math.round((record.score / 10) * 100)}%`

  return (
    <div
      className="history-card rounded-lg p-4 space-y-3"
      style={{
        animationDelay: `${index * 60}ms`,
        background: style.background,
        border:     `1px solid ${style.border}`,
      }}
    >

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className="font-display rounded-sm px-2.5 py-1 text-xs tracking-widest"
          style={{
            color:      style.color,
            background: `${style.color}18`,
            border:     `1px solid ${style.color}44`,
            textShadow: `0 0 8px ${style.color}`,
          }}
        >
          {record.strength.toUpperCase()}
        </span>

        <span className="flex items-center gap-1.5 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
          <RiTimeLine />
          {formatTimestamp(record.created_at)}
        </span>
      </div>

      <div className="space-y-1">
        <div className="str-track h-1.5 w-full overflow-hidden rounded-sm">
          <div
            className="str-fill"
            style={{
              width:      scorePct,
              background: `linear-gradient(90deg,${style.color}88,${style.color})`,
              boxShadow:  `0 0 6px ${style.color}`,
            }}
          />
        </div>

        <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>SCORE: <span style={{ color: style.color }}>{record.score}/10</span></span>
          <span>ENTROPY: <span style={{ color: style.color }}>{record.entropy}b</span></span>
        </div>
      </div>
    </div>
  )
}

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <img
        src={emptyState}
        alt="No history records"
        className="w-32 h-32 opacity-80"
        draggable={false}
      />
      <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
        NO RECORDS FOUND
      </p>
      <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
        Save a password to begin tracking.
      </p>
    </div>
  )
}

export default function PasswordHistory({ history, isLoading, onClear, onRefresh }) {
  const [confirming, setConfirming] = useState(false)

  const handleClear = () => {
    if (confirming) {
      onClear()
      setConfirming(false)
      return
    }
    setConfirming(true)
    setTimeout(() => setConfirming(false), CONFIRM_TIMEOUT_MS)
  }

  const count    = history?.length ?? 0
  const hasItems = count > 0

  return (
    <div className="glass rounded-lg p-4 space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <RiHistoryLine className="text-cyan" />
          <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-secondary)' }}>
            // SAVED HISTORY
          </span>
          {!isLoading && (
            <span className="rounded-sm border border-cyan/20 bg-cyan/10 px-2 py-0.5 font-mono text-xs text-cyan">
              {count}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="rounded p-1.5 text-txt-dim transition-all duration-200 hover:bg-cyan/5 hover:text-cyan disabled:opacity-30"
            aria-label="Refresh history"
          >
            <RiRefreshLine className={`text-base ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {hasItems && (
            <button
              type="button"
              onClick={handleClear}
              className={`btn-danger flex items-center gap-1.5 rounded px-3 py-1.5 text-xs ${
                confirming ? 'bg-red-neo/20 border-red-neo/60 shadow-neon-red' : ''
              }`}
            >
              <RiDeleteBin2Line />
              {confirming ? 'CONFIRM?' : 'CLEAR ALL'}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {SKELETONS.map((n) => <HistoryCardSkeleton key={n} />)}
        </div>
      ) : !hasItems ? (
        <EmptyHistory />
      ) : (
        <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
          {history.map((record, i) => (
            <HistoryCard key={record.id ?? i} record={record} index={i} />
          ))}
        </div>
      )}

    </div>
  )
}