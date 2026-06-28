import { useCallback, useEffect, useMemo, useState } from 'react'
import { RiDeleteBin2Line, RiFilterLine, RiRefreshLine } from 'react-icons/ri'

import { clearHistory, getPasswordHistory } from '../services/api'
import { HistoryCardSkeleton } from '../components/Loader'
import emptyState from '../assets/empty-state.svg'

const STRENGTH_STYLE = {
  'Weak':        { color: '#ff2d55', background: 'rgba(255,45,85,0.06)',   border: 'rgba(255,45,85,0.18)'   },
  'Medium':      { color: '#ffd60a', background: 'rgba(255,214,10,0.06)',  border: 'rgba(255,214,10,0.18)'  },
  'Strong':      { color: '#00b4ff', background: 'rgba(0,180,255,0.06)',   border: 'rgba(0,180,255,0.18)'   },
  'Very Strong': { color: '#00ffa3', background: 'rgba(0,255,163,0.06)',   border: 'rgba(0,255,163,0.18)'   },
}

const FILTERS        = ['All', 'Weak', 'Medium', 'Strong', 'Very Strong']
const TOAST_TTL_MS   = 3_000
const CONFIRM_TTL_MS = 4_000

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

function useToast() {
  const [toast, setToast] = useState(null)

  const show = useCallback((message, type = 'info') => {
    setToast({ message, type })
    const t = setTimeout(() => setToast(null), TOAST_TTL_MS)
    return () => clearTimeout(t)
  }, [])

  return { toast, show }
}

function Toast({ toast }) {
  if (!toast) return null
  const isError = toast.type === 'error'
  return (
    <div
      className="fixed bottom-6 right-6 z-50 toast-in px-5 py-3 rounded-lg font-mono text-sm shadow-2xl"
      style={{
        background: isError ? 'rgba(255,45,85,0.15)'        : 'rgba(0,180,255,0.15)',
        border:     isError ? '1px solid rgba(255,45,85,0.4)' : '1px solid rgba(0,180,255,0.4)',
        color:      isError ? '#ff2d55' : '#00b4ff',
      }}
    >
      {toast.message}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass rounded-lg p-4" style={{ border: '1px solid rgba(0,180,255,0.1)' }}>
      <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
      <p className="font-display text-2xl font-bold" style={{ color, textShadow: `0 0 12px ${color}` }}>
        {value}
      </p>
    </div>
  )
}

function RecordCard({ record, index }) {
  const s = STRENGTH_STYLE[record.strength] ?? STRENGTH_STYLE.Weak

  return (
    <div
      className="history-card rounded-xl p-5 space-y-4"
      style={{ animationDelay: `${index * 50}ms`, background: s.background, border: `1px solid ${s.border}` }}
    >
      
      <div className="flex justify-between items-start">
        <span
          className="font-display text-xs px-2.5 py-1 rounded-sm tracking-widest"
          style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}40`, textShadow: `0 0 8px ${s.color}` }}
        >
          {record.strength.toUpperCase()}
        </span>
        <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>#{record.id}</span>
      </div>

      <div className="space-y-1.5">
        <div className="str-track h-2 w-full overflow-hidden rounded-sm">
          <div
            className="str-fill"
            style={{
              width:      `${(record.score / 10) * 100}%`,
              background: `linear-gradient(90deg,${s.color}88,${s.color})`,
              boxShadow:  `0 0 6px ${s.color}`,
            }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
          <span>SCORE <span style={{ color: s.color }}>{record.score}/10</span></span>
          <span>ENTROPY <span style={{ color: s.color }}>{record.entropy}b</span></span>
        </div>
      </div>

      <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
        {formatTimestamp(record.created_at)}
      </p>
    </div>
  )
}

function EmptyHistory({ filter }) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 glass rounded-xl">
      <img
        src={emptyState}
        alt="No history records"
        className="w-40 h-40 opacity-75"
        draggable={false}
      />
      <p className="font-display text-sm tracking-widest" style={{ color: 'var(--text-dim)' }}>
        NO RECORDS
      </p>
      <p style={{ color: 'var(--text-secondary)' }}>
        {filter !== 'All'
          ? `No "${filter}" passwords saved.`
          : 'Save passwords from the dashboard.'}
      </p>
    </div>
  )
}

export default function History() {
  const [records,    setRecords]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('All')
  const [confirming, setConfirming] = useState(false)

  const { toast, show } = useToast()

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getPasswordHistory()
      setRecords(res.history ?? [])
    } catch {
      show('Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }, [show])

  useEffect(() => { loadHistory() }, [loadHistory])

  const handleClear = async () => {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), CONFIRM_TTL_MS)
      return
    }
    try {
      await clearHistory()
      setRecords([])
      show('History cleared', 'info')
    } catch {
      show('Clear failed', 'error')
    } finally {
      setConfirming(false)
    }
  }

  const filtered = useMemo(
    () => filter === 'All' ? records : records.filter((r) => r.strength === filter),
    [records, filter],
  )

  const stats = useMemo(() => {
    const total = records.length
    return {
      total,
      weak:   records.filter((r) => r.strength === 'Weak').length,
      strong: records.filter((r) => r.strength === 'Strong' || r.strength === 'Very Strong').length,
      avg:    total ? (records.reduce((sum, r) => sum + r.score, 0) / total).toFixed(1) : '—',
    }
  }, [records])

  const statCards = [
    { label: 'TOTAL SAVED', value: stats.total,  color: 'var(--accent-cyan)' },
    { label: 'WEAK',        value: stats.weak,   color: '#ff2d55'             },
    { label: 'STRONG+',     value: stats.strong, color: '#00ffa3'             },
    { label: 'AVG SCORE',   value: stats.avg,    color: 'var(--accent-cyan)' },
  ]

  return (
    <div className="min-h-screen grid-bg page-enter">
      <Toast toast={toast} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        <div className="mb-10 space-y-3 fade-up">
          <p className="font-mono text-xs tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
            $ cipher-guard --history
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cyan glow-cyan">
            PASSWORD HISTORY
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            All saved records — no plain text is ever stored.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="fade-up stagger-2 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <RiFilterLine style={{ color: 'var(--text-dim)' }} />
            {FILTERS.map((opt) => {
              const active = filter === opt
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFilter(opt)}
                  className="font-mono text-xs px-3 py-1.5 rounded-sm transition-all duration-200"
                  style={{
                    background: active ? 'rgba(0,180,255,0.12)' : 'transparent',
                    border:     active ? '1px solid rgba(0,180,255,0.4)' : '1px solid rgba(0,180,255,0.1)',
                    color:      active ? 'var(--accent-cyan)' : 'var(--text-dim)',
                  }}
                >
                  {opt.toUpperCase()}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadHistory}
              disabled={loading}
              className="p-2 rounded text-txt-dim hover:text-cyan transition-colors disabled:opacity-30"
              aria-label="Refresh history"
            >
              <RiRefreshLine className={`text-base ${loading ? 'animate-spin' : ''}`} />
            </button>

            {records.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className={`btn-danger flex items-center gap-2 px-4 py-2 rounded text-xs ${
                  confirming ? 'bg-red-neo/20 border-red-neo/50' : ''
                }`}
              >
                <RiDeleteBin2Line />
                {confirming ? 'CONFIRM DELETE?' : 'CLEAR ALL'}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((n) => <HistoryCardSkeleton key={n} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyHistory filter={filter} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((record, i) => (
              <RecordCard key={record.id ?? i} record={record} index={i} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}