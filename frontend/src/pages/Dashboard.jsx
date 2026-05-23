
// pages/Dashboard.jsx  –  Main analysis page


import { useState, useCallback, useEffect, useRef } from 'react'
import { RiSaveLine, RiFlashlightLine } from 'react-icons/ri'
import { analyzePassword, savePassword, getPasswordHistory, clearHistory } from '../services/api'
import PasswordInput      from '../components/PasswordInput'
import StrengthMeter      from '../components/StrengthMeter'
import PasswordChecklist  from '../components/PasswordChecklist'
import SuggestionsPanel   from '../components/SuggestionsPanel'
import PasswordHistory    from '../components/PasswordHistory'
import { DotsLoader }     from '../components/Loader'

// ── Toast notification system ────────────────────────────────────────────────
let toastId = 0
function useToasts() {
  const [toasts, setToasts] = useState([])
  const add = useCallback((message, type = 'info') => {
    const id = ++toastId
    setToasts(p => [...p, { id, message, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800)
  }, [])
  return { toasts, add }
}

function Toast({ message, type }) {
  const colors = {
    success: { bg: 'rgba(0,255,163,0.12)', border: 'rgba(0,255,163,0.35)', color: '#00ffa3' },
    error:   { bg: 'rgba(255,45,85,0.12)',  border: 'rgba(255,45,85,0.35)',  color: '#ff2d55' },
    info:    { bg: 'rgba(0,180,255,0.12)',  border: 'rgba(0,180,255,0.35)',  color: '#00b4ff' },
    warn:    { bg: 'rgba(255,214,10,0.12)', border: 'rgba(255,214,10,0.35)', color: '#ffd60a' },
  }[type] ?? colors.info

  return (
    <div className="toast-in flex items-start gap-3 px-4 py-3 rounded-lg max-w-sm shadow-2xl"
      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
      <span className="font-mono text-lg leading-none" style={{ color: colors.color }}>
        {type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warn' ? '⚠' : 'ℹ'}
      </span>
      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
    </div>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatBadge({ label, value, color }) {
  return (
    <div className="px-4 py-3 rounded-lg" style={{ background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.1)' }}>
      <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
      <p className="font-display text-lg font-bold" style={{ color: color ?? 'var(--accent-cyan)', textShadow: `0 0 12px ${color ?? 'var(--accent-cyan)'}` }}>
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [password,      setPassword]      = useState('')
  const [result,        setResult]        = useState(null)
  const [analysing,     setAnalysing]     = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [history,       setHistory]       = useState([])
  const [histLoading,   setHistLoading]   = useState(false)
  const debounceRef = useRef(null)
  const { toasts, add: addToast } = useToasts()

  // ── Debounced real-time analysis ──────────────────────────────────────────
  useEffect(() => {
    if (!password) { setResult(null); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setAnalysing(true)
      try {
        const data = await analyzePassword(password)
        setResult(data)
      } catch (err) {
        addToast(err.friendlyMessage ?? 'Analysis failed — is the backend running?', 'error')
      } finally { setAnalysing(false) }
    }, 380)
    return () => clearTimeout(debounceRef.current)
  }, [password])

  // ── Fetch history on mount ────────────────────────────────────────────────
  const fetchHistory = useCallback(async () => {
    setHistLoading(true)
    try {
      const d = await getPasswordHistory()
      setHistory(d.history ?? [])
    } catch { /* silent */ }
    finally { setHistLoading(false) }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  // ── Save password ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!password) { addToast('Enter a password first.', 'warn'); return }
    setSaving(true)
    try {
      await savePassword(password)
      addToast('Password saved securely.', 'success')
      fetchHistory()
    } catch (err) {
      const msg = err.response?.status === 409
        ? 'This password is already saved — avoid reuse!'
        : (err.friendlyMessage ?? 'Save failed.')
      addToast(msg, err.response?.status === 409 ? 'warn' : 'error')
    } finally { setSaving(false) }
  }

  // ── Clear history ──────────────────────────────────────────────────────────
  const handleClear = async () => {
    try {
      await clearHistory()
      setHistory([])
      addToast('History cleared.', 'info')
    } catch { addToast('Clear failed.', 'error') }
  }

  // ── Derive strength color ─────────────────────────────────────────────────
  const strengthColor = {
    'Weak':        '#ff2d55', 'Medium': '#ffd60a',
    'Strong':      '#00b4ff', 'Very Strong': '#00ffa3'
  }[result?.strength] ?? 'var(--accent-cyan)'

  return (
    <div className="min-h-screen grid-bg page-enter">
      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        {/* ── Page header ── */}
        <div className="mb-12 space-y-3 fade-up">
          <p className="font-mono text-xs tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
            $ cipher-guard --analyze
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold glow-cyan text-cyan leading-none">
            PASSWORD<br />
            <span className="text-txt opacity-60">STRENGTH</span> ANALYZER
          </h1>
          <p className="font-body text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time entropy analysis · PBKDF2-SHA256 hashing · Pattern detection · History tracking
          </p>
        </div>

        {/* ── Stats bar (only when we have a result) ── */}
        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up">
            <StatBadge label="STRENGTH"  value={result.strength}  color={strengthColor} />
            <StatBadge label="SCORE"     value={`${result.score}/${result.max_score}`} color={strengthColor} />
            <StatBadge label="ENTROPY"   value={`${result.entropy}b`} />
            <StatBadge label="CHECKS"    value={`${Object.values(result.checks).filter(Boolean).length}/${Object.values(result.checks).length}`}
              color={Object.values(result.checks).every(Boolean) ? '#00ffa3' : 'var(--accent-cyan)'} />
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column – input + meter */}
          <div className="lg:col-span-2 space-y-6">

            {/* Password input card */}
            <div className="glass-bright rounded-xl p-6 space-y-6 relative fade-up stagger-1">
              <PasswordInput
                value={password}
                onChange={setPassword}
                strength={result?.strength}
                suggestedPwd={result?.suggested_password}
                onGenerate={() => {}} // new suggestion arrives with next analysis
                isLoading={analysing}
              />

              {/* Analyse indicator */}
              {analysing && (
                <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                  <DotsLoader /> ANALYSING IN REAL-TIME…
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!password || saving || analysing}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded text-xs
                  disabled:opacity-30 disabled:cursor-not-allowed">
                {saving
                  ? <><DotsLoader color="var(--accent-cyan)" /> SAVING…</>
                  : <><RiSaveLine className="text-base" /> SAVE PASSWORD (HASHED + SECURE)</>}
              </button>
            </div>

            {/* Strength meter */}
            <div className="fade-up stagger-2">
              <StrengthMeter result={result} />
            </div>

            {/* Checklist */}
            {result?.checks && (
              <div className="fade-up stagger-3">
                <PasswordChecklist checks={result.checks} />
              </div>
            )}

            {/* Suggestions */}
            {result?.suggestions && (
              <div className="fade-up stagger-4">
                <SuggestionsPanel suggestions={result.suggestions} />
              </div>
            )}
          </div>

          {/* Right column – history */}
          <div className="fade-up stagger-3">
            <PasswordHistory
              history={history}
              isLoading={histLoading}
              onClear={handleClear}
              onRefresh={fetchHistory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
