import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiSaveLine } from 'react-icons/ri'

import { analyzePassword, savePassword, getPasswordHistory, clearHistory } from '../services/api'
import PasswordInput     from '../components/PasswordInput'
import StrengthMeter     from '../components/StrengthMeter'
import PasswordChecklist from '../components/PasswordChecklist'
import SuggestionsPanel  from '../components/SuggestionsPanel'
import PasswordHistory   from '../components/PasswordHistory'
import { DotsLoader }    from '../components/Loader'
import heroBg            from '../assets/hero-bg.svg'

const TOAST_TTL_MS = 3_800
const DEBOUNCE_MS  = 380

const STRENGTH_COLOR = {
  'Weak':        '#ff2d55',
  'Medium':      '#ffd60a',
  'Strong':      '#00b4ff',
  'Very Strong': '#00ffa3',
}

const TOAST_STYLE = {
  success: { background: 'rgba(0,255,163,0.12)',  border: 'rgba(0,255,163,0.35)',  color: '#00ffa3', icon: '✓' },
  error:   { background: 'rgba(255,45,85,0.12)',  border: 'rgba(255,45,85,0.35)',  color: '#ff2d55', icon: '✗' },
  warn:    { background: 'rgba(255,214,10,0.12)', border: 'rgba(255,214,10,0.35)', color: '#ffd60a', icon: '⚠' },
  info:    { background: 'rgba(0,180,255,0.12)',  border: 'rgba(0,180,255,0.35)',  color: '#00b4ff', icon: 'ℹ' },
}

let _toastSeq = 0

function useToasts() {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'info') => {
    const id = ++_toastSeq
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_TTL_MS)
  }, [])

  return { toasts, push }
}

function Toast({ message, type }) {
  const s = TOAST_STYLE[type] ?? TOAST_STYLE.info
  return (
    <div
      className="toast-in flex items-start gap-3 px-4 py-3 rounded-lg max-w-sm shadow-2xl"
      style={{ background: s.background, border: `1px solid ${s.border}` }}
    >
      <span className="font-mono text-lg leading-none" style={{ color: s.color }}>{s.icon}</span>
      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{message}</p>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const c = color ?? 'var(--accent-cyan)'
  return (
    <div
      className="px-4 py-3 rounded-lg"
      style={{ background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.1)' }}
    >
      <p className="font-mono text-xs mb-1" style={{ color: 'var(--text-dim)' }}>{label}</p>
      <p className="font-display text-lg font-bold" style={{ color: c, textShadow: `0 0 12px ${c}` }}>
        {value}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const [password,       setPassword]       = useState('')
  const [result,         setResult]         = useState(null)
  const [analyzing,      setAnalyzing]      = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [history,        setHistory]        = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const debounceRef     = useRef(null)
  const { toasts, push } = useToasts()

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true)
    try {
      const res = await getPasswordHistory()
      setHistory(res.history ?? [])
    } catch {
      push('Failed to load history', 'error')
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  useEffect(() => {
    if (!password) { setResult(null); return }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setAnalyzing(true)
      try {
        setResult(await analyzePassword(password))
      } catch (err) {
        push(err.friendlyMessage ?? 'Analysis failed — is the backend running?', 'error')
      } finally {
        setAnalyzing(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(debounceRef.current)
  }, [password, push])

  const handleSave = useCallback(async () => {
    if (!password) { push('Enter a password first.', 'warn'); return }

    setSaving(true)
    try {
      await savePassword(password)
      push('Password saved securely.', 'success')
      await loadHistory()
    } catch (err) {
      const dupe = err.status === 409
      push(
        dupe ? 'This password is already saved — avoid reuse!' : err.friendlyMessage ?? 'Save failed.',
        dupe ? 'warn' : 'error',
      )
    } finally {
      setSaving(false)
    }
  }, [password, loadHistory, push])

  const handleClear = useCallback(async () => {
    try {
      await clearHistory()
      setHistory([])
      push('History cleared.', 'info')
    } catch {
      push('Clear failed.', 'error')
    }
  }, [push])

  const checks = useMemo(() => {
    if (!result?.checks) return null
    const vals = Object.values(result.checks)
    return { passed: vals.filter(Boolean).length, total: vals.length, allOk: vals.every(Boolean) }
  }, [result])

  const strengthColor = STRENGTH_COLOR[result?.strength] ?? 'var(--accent-cyan)'

  return (
    <div
      className="min-h-screen page-enter"
      style={{
        backgroundImage:    `url(${heroBg})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map((t) => <Toast key={t.id} message={t.message} type={t.type} />)}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">

        <div className="mb-12 space-y-3 fade-up">
          <p className="font-mono text-xs tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
            $ cipher-guard --analyze
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold glow-cyan text-cyan leading-none">
            PASSWORD<br />
            <span className="text-txt opacity-60">STRENGTH</span>{' '}ANALYZER
          </h1>
          <p className="font-body text-base max-w-xl" style={{ color: 'var(--text-secondary)' }}>
            Real-time entropy analysis · PBKDF2-SHA256 hashing · Pattern detection · History tracking
          </p>
        </div>

        {result && checks && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up">
            <StatCard label="STRENGTH" value={result.strength}                       color={strengthColor} />
            <StatCard label="SCORE"    value={`${result.score}/${result.max_score}`} color={strengthColor} />
            <StatCard label="ENTROPY"  value={`${result.entropy}b`}                                        />
            <StatCard label="CHECKS"   value={`${checks.passed}/${checks.total}`}    color={checks.allOk ? '#00ffa3' : 'var(--accent-cyan)'} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="glass-bright rounded-xl p-6 space-y-6 relative fade-up stagger-1">
              <PasswordInput
                value={password}
                onChange={setPassword}
                strength={result?.strength}
                suggestedPwd={result?.suggested_password}
                onGenerate={() => {}}
                isLoading={analyzing}
              />

              {analyzing && (
                <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                  <DotsLoader />
                  ANALYSING IN REAL-TIME…
                </div>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={!password || saving || analyzing}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <><DotsLoader color="var(--accent-cyan)" /> SAVING…</>
                ) : (
                  <><RiSaveLine className="text-base" /> SAVE PASSWORD (HASHED + SECURE)</>
                )}
              </button>
            </div>

            <div className="fade-up stagger-2">
              <StrengthMeter result={result} />
            </div>

            {result?.checks && (
              <div className="fade-up stagger-3">
                <PasswordChecklist checks={result.checks} />
              </div>
            )}

            {result?.suggestions && (
              <div className="fade-up stagger-4">
                <SuggestionsPanel suggestions={result.suggestions} />
              </div>
            )}
          </div>

          <div className="fade-up stagger-3">
            <PasswordHistory
              history={history}
              isLoading={historyLoading}
              onClear={handleClear}
              onRefresh={loadHistory}
            />
          </div>

        </div>
      </div>
    </div>
  )
}