import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RiSaveLine } from 'react-icons/ri'

import {
  analyzePassword,
  savePassword,
  getPasswordHistory,
  clearHistory,
} from '../services/api'

import PasswordInput from '../components/PasswordInput'
import StrengthMeter from '../components/StrengthMeter'
import PasswordChecklist from '../components/PasswordChecklist'
import SuggestionsPanel from '../components/SuggestionsPanel'
import PasswordHistory from '../components/PasswordHistory'
import { DotsLoader } from '../components/Loader'

const TOAST_TIMEOUT_MS = 3800

const STRENGTH_COLORS = {
  Weak: '#ff2d55',
  Medium: '#ffd60a',
  Strong: '#00b4ff',
  'Very Strong': '#00ffa3',
}

const TOAST_STYLES = {
  success: {
    background: 'rgba(0,255,163,0.12)',
    border: 'rgba(0,255,163,0.35)',
    color: '#00ffa3',
    icon: '✓',
  },
  error: {
    background: 'rgba(255,45,85,0.12)',
    border: 'rgba(255,45,85,0.35)',
    color: '#ff2d55',
    icon: '✗',
  },
  warn: {
    background: 'rgba(255,214,10,0.12)',
    border: 'rgba(255,214,10,0.35)',
    color: '#ffd60a',
    icon: '⚠',
  },
  info: {
    background: 'rgba(0,180,255,0.12)',
    border: 'rgba(0,180,255,0.35)',
    color: '#00b4ff',
    icon: 'ℹ',
  },
}

let nextToastId = 0

function useToastNotifications() {
  const [notifications, setNotifications] = useState([])

  const pushToast = useCallback((message, type = 'info') => {
    const id = ++nextToastId

    setNotifications((current) => [
      ...current,
      { id, message, type },
    ])

    window.setTimeout(() => {
      setNotifications((current) =>
        current.filter((toast) => toast.id !== id)
      )
    }, TOAST_TIMEOUT_MS)
  }, [])

  return {
    notifications,
    pushToast,
  }
}

function ToastNotification({ message, type }) {
  const style = TOAST_STYLES[type] ?? TOAST_STYLES.info

  return (
    <div
      className="toast-in flex items-start gap-3 px-4 py-3 rounded-lg max-w-sm shadow-2xl"
      style={{
        background: style.background,
        border: `1px solid ${style.border}`,
      }}
    >
      <span
        className="font-mono text-lg leading-none"
        style={{ color: style.color }}
      >
        {style.icon}
      </span>

      <p
        className="text-sm"
        style={{ color: 'var(--text-primary)' }}
      >
        {message}
      </p>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div
      className="px-4 py-3 rounded-lg"
      style={{
        background: 'rgba(0,180,255,0.04)',
        border: '1px solid rgba(0,180,255,0.1)',
      }}
    >
      <p
        className="font-mono text-xs mb-1"
        style={{ color: 'var(--text-dim)' }}
      >
        {label}
      </p>

      <p
        className="font-display text-lg font-bold"
        style={{
          color: color ?? 'var(--accent-cyan)',
          textShadow: `0 0 12px ${color ?? 'var(--accent-cyan)'}`,
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const [password, setPassword] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [history, setHistory] = useState([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  const analysisTimerRef = useRef(null)

  const {
    notifications,
    pushToast,
  } = useToastNotifications()

  const loadHistory = useCallback(async () => {
    setIsHistoryLoading(true)

    try {
      const response = await getPasswordHistory()
      setHistory(response.history ?? [])
    } catch {
      // History retrieval failures should not block page usage.
    } finally {
      setIsHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  useEffect(() => {
    if (!password) {
      setAnalysisResult(null)
      return
    }

    clearTimeout(analysisTimerRef.current)

    analysisTimerRef.current = setTimeout(async () => {
      setIsAnalyzing(true)

      try {
        const response = await analyzePassword(password)
        setAnalysisResult(response)
      } catch (error) {
        pushToast(
          error.friendlyMessage ??
            'Analysis failed — is the backend running?',
          'error'
        )
      } finally {
        setIsAnalyzing(false)
      }
    }, 380)

    return () => clearTimeout(analysisTimerRef.current)
  }, [password, pushToast])

  const handleSavePassword = useCallback(async () => {
    if (!password) {
      pushToast('Enter a password first.', 'warn')
      return
    }

    setIsSaving(true)

    try {
      await savePassword(password)

      pushToast(
        'Password saved securely.',
        'success'
      )

      await loadHistory()
    } catch (error) {
      const isDuplicate = error.response?.status === 409

      pushToast(
        isDuplicate
          ? 'This password is already saved — avoid reuse!'
          : error.friendlyMessage ?? 'Save failed.',
        isDuplicate ? 'warn' : 'error'
      )
    } finally {
      setIsSaving(false)
    }
  }, [password, loadHistory, pushToast])

  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistory()

      setHistory([])

      pushToast(
        'History cleared.',
        'info'
      )
    } catch {
      pushToast(
        'Clear failed.',
        'error'
      )
    }
  }, [pushToast])

  const checksSummary = useMemo(() => {
    if (!analysisResult?.checks) {
      return null
    }

    const checkValues = Object.values(
      analysisResult.checks
    )

    return {
      passed: checkValues.filter(Boolean).length,
      total: checkValues.length,
      allPassed: checkValues.every(Boolean),
    }
  }, [analysisResult])

  const strengthColor =
    STRENGTH_COLORS[analysisResult?.strength] ??
    'var(--accent-cyan)'

  return (
    <div className="min-h-screen grid-bg page-enter">
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {notifications.map((toast) => (
          <ToastNotification
            key={toast.id}
            message={toast.message}
            type={toast.type}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-12 space-y-3 fade-up">
          <p
            className="font-mono text-xs tracking-[0.3em]"
            style={{ color: 'var(--text-dim)' }}
          >
            $ cipher-guard --analyze
          </p>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold glow-cyan text-cyan leading-none">
            PASSWORD
            <br />
            <span className="text-txt opacity-60">
              STRENGTH
            </span>{' '}
            ANALYZER
          </h1>

          <p
            className="font-body text-base max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Real-time entropy analysis · PBKDF2-SHA256 hashing ·
            Pattern detection · History tracking
          </p>
        </div>

        {analysisResult && checksSummary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 fade-up">
            <StatCard
              label="STRENGTH"
              value={analysisResult.strength}
              color={strengthColor}
            />

            <StatCard
              label="SCORE"
              value={`${analysisResult.score}/${analysisResult.max_score}`}
              color={strengthColor}
            />

            <StatCard
              label="ENTROPY"
              value={`${analysisResult.entropy}b`}
            />

            <StatCard
              label="CHECKS"
              value={`${checksSummary.passed}/${checksSummary.total}`}
              color={
                checksSummary.allPassed
                  ? '#00ffa3'
                  : 'var(--accent-cyan)'
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-bright rounded-xl p-6 space-y-6 relative fade-up stagger-1">
              <PasswordInput
                value={password}
                onChange={setPassword}
                strength={analysisResult?.strength}
                suggestedPwd={analysisResult?.suggested_password}
                onGenerate={() => {}}
                isLoading={isAnalyzing}
              />

              {isAnalyzing && (
                <div
                  className="flex items-center gap-2 text-xs font-mono"
                  style={{ color: 'var(--text-dim)' }}
                >
                  <DotsLoader />
                  ANALYSING IN REAL-TIME…
                </div>
              )}

              <button
                onClick={handleSavePassword}
                disabled={
                  !password ||
                  isSaving ||
                  isAnalyzing
                }
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded text-xs disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <DotsLoader color="var(--accent-cyan)" />
                    SAVING…
                  </>
                ) : (
                  <>
                    <RiSaveLine className="text-base" />
                    SAVE PASSWORD (HASHED + SECURE)
                  </>
                )}
              </button>
            </div>

            <div className="fade-up stagger-2">
              <StrengthMeter result={analysisResult} />
            </div>

            {analysisResult?.checks && (
              <div className="fade-up stagger-3">
                <PasswordChecklist
                  checks={analysisResult.checks}
                />
              </div>
            )}

            {analysisResult?.suggestions && (
              <div className="fade-up stagger-4">
                <SuggestionsPanel
                  suggestions={analysisResult.suggestions}
                />
              </div>
            )}
          </div>

          <div className="fade-up stagger-3">
            <PasswordHistory
              history={history}
              isLoading={isHistoryLoading}
              onClear={handleClearHistory}
              onRefresh={loadHistory}
            />
          </div>
        </div>
      </div>
    </div>
  )
}