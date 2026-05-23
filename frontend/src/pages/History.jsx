
// pages/History.jsx  –  Dedicated history page with filterable table


import { useState, useEffect, useCallback } from 'react'
import { RiHistoryLine, RiFilterLine, RiDeleteBin2Line, RiRefreshLine } from 'react-icons/ri'
import { getPasswordHistory, clearHistory } from '../services/api'
import { HistoryCardSkeleton } from '../components/Loader'

const STRENGTH_CFG = {
  'Weak':        { c: '#ff2d55', bg: 'rgba(255,45,85,0.06)',  bd: 'rgba(255,45,85,0.18)'  },
  'Medium':      { c: '#ffd60a', bg: 'rgba(255,214,10,0.06)', bd: 'rgba(255,214,10,0.18)' },
  'Strong':      { c: '#00b4ff', bg: 'rgba(0,180,255,0.06)',  bd: 'rgba(0,180,255,0.18)'  },
  'Very Strong': { c: '#00ffa3', bg: 'rgba(0,255,163,0.06)',  bd: 'rgba(0,255,163,0.18)'  },
}

const FILTERS = ['All', 'Weak', 'Medium', 'Strong', 'Very Strong']

function fmt(iso) {
  try { return new Date(iso).toLocaleString(undefined, { day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit' }) }
  catch { return iso }
}

export default function History() {
  const [history,    setHistory]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [filter,     setFilter]     = useState('All')
  const [confirming, setConfirming] = useState(false)
  const [toast,      setToast]      = useState(null)

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetch = useCallback(async () => {
    setLoading(true)
    try { const d = await getPasswordHistory(); setHistory(d.history ?? []) }
    catch { showToast('Failed to load history', 'error') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleClear = async () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 4000); return }
    try { await clearHistory(); setHistory([]); showToast('History cleared', 'info') }
    catch { showToast('Clear failed', 'error') }
    setConfirming(false)
  }

  const filtered = filter === 'All' ? history : history.filter(r => r.strength === filter)

  // Aggregate stats
  const stats = {
    total:     history.length,
    weak:      history.filter(r => r.strength === 'Weak').length,
    strong:    history.filter(r => ['Strong','Very Strong'].includes(r.strength)).length,
    avgScore:  history.length ? (history.reduce((s,r) => s + r.score, 0) / history.length).toFixed(1) : '—',
  }

  return (
    <div className="min-h-screen grid-bg page-enter">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast-in px-5 py-3 rounded-lg font-mono text-sm shadow-2xl"
          style={{
            background: toast.type === 'error' ? 'rgba(255,45,85,0.15)' : 'rgba(0,180,255,0.15)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,45,85,0.4)' : 'rgba(0,180,255,0.4)'}`,
            color: toast.type === 'error' ? '#ff2d55' : '#00b4ff',
          }}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* Header */}
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

        {/* Aggregate stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 fade-up stagger-1">
          {[
            { label: 'TOTAL SAVED',    value: stats.total,     color: 'var(--accent-cyan)'   },
            { label: 'WEAK',           value: stats.weak,      color: '#ff2d55'               },
            { label: 'STRONG+',        value: stats.strong,    color: '#00ffa3'               },
            { label: 'AVG SCORE',      value: stats.avgScore,  color: 'var(--accent-cyan)'   },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-lg p-4" style={{ border: '1px solid rgba(0,180,255,0.1)' }}>
              <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
              <p className="font-display text-2xl font-bold" style={{ color, textShadow: `0 0 12px ${color}` }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter bar + actions */}
        <div className="fade-up stagger-2 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <RiFilterLine style={{ color: 'var(--text-dim)' }} />
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="font-mono text-xs px-3 py-1.5 rounded-sm transition-all duration-200"
                style={{
                  background: filter === f ? 'rgba(0,180,255,0.12)' : 'transparent',
                  border: `1px solid ${filter === f ? 'rgba(0,180,255,0.4)' : 'rgba(0,180,255,0.1)'}`,
                  color: filter === f ? 'var(--accent-cyan)' : 'var(--text-dim)',
                }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={fetch} disabled={loading}
              className="p-2 rounded text-txt-dim hover:text-cyan transition-colors disabled:opacity-30">
              <RiRefreshLine className={`text-base ${loading ? 'animate-spin' : ''}`} />
            </button>
            {history.length > 0 && (
              <button onClick={handleClear}
                className={`btn-danger flex items-center gap-2 px-4 py-2 rounded text-xs ${confirming ? 'bg-red-neo/20 border-red-neo/50' : ''}`}>
                <RiDeleteBin2Line />{confirming ? 'CONFIRM DELETE?' : 'CLEAR ALL'}
              </button>
            )}
          </div>
        </div>

        {/* Records */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <HistoryCardSkeleton key={i} />)}
          </div>
        ) : !filtered.length ? (
          <div className="flex flex-col items-center gap-4 py-24 glass rounded-xl">
            <RiHistoryLine className="text-5xl" style={{ color: 'var(--text-dim)', opacity: 0.25 }} />
            <p className="font-display text-sm tracking-widest" style={{ color: 'var(--text-dim)' }}>NO RECORDS</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              {filter !== 'All' ? `No "${filter}" passwords saved.` : 'Save passwords from the dashboard.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((r, i) => {
              const cfg = STRENGTH_CFG[r.strength] ?? STRENGTH_CFG['Weak']
              return (
                <div key={r.id ?? i} className="history-card rounded-xl p-5 space-y-4"
                  style={{ animationDelay: `${i * 50}ms`, background: cfg.bg, border: `1px solid ${cfg.bd}` }}>
                  <div className="flex justify-between items-start">
                    <span className="font-display text-xs px-2.5 py-1 rounded-sm tracking-widest"
                      style={{ color: cfg.c, background: `${cfg.c}15`, border: `1px solid ${cfg.c}40`, textShadow: `0 0 8px ${cfg.c}` }}>
                      {r.strength.toUpperCase()}
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>#{r.id}</span>
                  </div>

                  {/* Score bar */}
                  <div className="space-y-1.5">
                    <div className="str-track h-2 w-full overflow-hidden rounded-sm">
                      <div className="str-fill" style={{ width: `${(r.score/10)*100}%`, background: `linear-gradient(90deg,${cfg.c}88,${cfg.c})`, boxShadow: `0 0 6px ${cfg.c}` }} />
                    </div>
                    <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
                      <span>SCORE <span style={{ color: cfg.c }}>{r.score}/10</span></span>
                      <span>ENTROPY <span style={{ color: cfg.c }}>{r.entropy}b</span></span>
                    </div>
                  </div>

                  <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>{fmt(r.created_at)}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
