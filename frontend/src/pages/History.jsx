import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  RiDeleteBin2Line,
  RiFilterLine,
  RiHistoryLine,
  RiRefreshLine,
} from 'react-icons/ri'

import { clearHistory, getPasswordHistory } from '../services/api'
import { HistoryCardSkeleton } from '../components/Loader'

const STRENGTH_STYLES = {
  Weak: {
    color: '#ff2d55',
    background: 'rgba(255,45,85,0.06)',
    border: 'rgba(255,45,85,0.18)',
  },
  Medium: {
    color: '#ffd60a',
    background: 'rgba(255,214,10,0.06)',
    border: 'rgba(255,214,10,0.18)',
  },
  Strong: {
    color: '#00b4ff',
    background: 'rgba(0,180,255,0.06)',
    border: 'rgba(0,180,255,0.18)',
  },
  'Very Strong': {
    color: '#00ffa3',
    background: 'rgba(0,255,163,0.06)',
    border: 'rgba(0,255,163,0.18)',
  },
}

const FILTER_OPTIONS = [
  'All',
  'Weak',
  'Medium',
  'Strong',
  'Very Strong',
]

function formatTimestamp(timestamp) {
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return timestamp
  }
}

export default function History() {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [awaitingDeleteConfirmation, setAwaitingDeleteConfirmation] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })

    const timeoutId = setTimeout(() => {
      setToast(null)
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [])

  const loadHistory = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getPasswordHistory()
      setRecords(response.history ?? [])
    } catch {
      showToast('Failed to load history', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleClearHistory = async () => {
    if (!awaitingDeleteConfirmation) {
      setAwaitingDeleteConfirmation(true)

      setTimeout(() => {
        setAwaitingDeleteConfirmation(false)
      }, 4000)

      return
    }

    try {
      await clearHistory()
      setRecords([])
      showToast('History cleared', 'info')
    } catch {
      showToast('Clear failed', 'error')
    } finally {
      setAwaitingDeleteConfirmation(false)
    }
  }

  const filteredRecords = useMemo(() => {
    if (activeFilter === 'All') {
      return records
    }

    return records.filter(
      record => record.strength === activeFilter
    )
  }, [records, activeFilter])

  const statistics = useMemo(() => {
    const weakCount = records.filter(
      record => record.strength === 'Weak'
    ).length

    const strongCount = records.filter(
      record => ['Strong', 'Very Strong'].includes(record.strength)
    ).length

    const averageScore = records.length
      ? (
          records.reduce(
            (total, record) => total + record.score,
            0
          ) / records.length
        ).toFixed(1)
      : '—'

    return {
      total: records.length,
      weak: weakCount,
      strong: strongCount,
      averageScore,
    }
  }, [records])

  return (
    <div className="min-h-screen grid-bg page-enter">
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 toast-in px-5 py-3 rounded-lg font-mono text-sm shadow-2xl"
          style={{
            background:
              toast.type === 'error'
                ? 'rgba(255,45,85,0.15)'
                : 'rgba(0,180,255,0.15)',
            border: `1px solid ${
              toast.type === 'error'
                ? 'rgba(255,45,85,0.4)'
                : 'rgba(0,180,255,0.4)'
            }`,
            color:
              toast.type === 'error'
                ? '#ff2d55'
                : '#00b4ff',
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-10 space-y-3 fade-up">
          <p
            className="font-mono text-xs tracking-[0.3em]"
            style={{ color: 'var(--text-dim)' }}
          >
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
          {[
            {
              label: 'TOTAL SAVED',
              value: statistics.total,
              color: 'var(--accent-cyan)',
            },
            {
              label: 'WEAK',
              value: statistics.weak,
              color: '#ff2d55',
            },
            {
              label: 'STRONG+',
              value: statistics.strong,
              color: '#00ffa3',
            },
            {
              label: 'AVG SCORE',
              value: statistics.averageScore,
              color: 'var(--accent-cyan)',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="glass rounded-lg p-4"
              style={{
                border: '1px solid rgba(0,180,255,0.1)',
              }}
            >
              <p
                className="font-mono text-xs mb-1"
                style={{ color: 'var(--text-dim)' }}
              >
                {stat.label}
              </p>

              <p
                className="font-display text-2xl font-bold"
                style={{
                  color: stat.color,
                  textShadow: `0 0 12px ${stat.color}`,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="fade-up stagger-2 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <RiFilterLine style={{ color: 'var(--text-dim)' }} />

            {FILTER_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className="font-mono text-xs px-3 py-1.5 rounded-sm transition-all duration-200"
                style={{
                  background:
                    activeFilter === option
                      ? 'rgba(0,180,255,0.12)'
                      : 'transparent',
                  border: `1px solid ${
                    activeFilter === option
                      ? 'rgba(0,180,255,0.4)'
                      : 'rgba(0,180,255,0.1)'
                  }`,
                  color:
                    activeFilter === option
                      ? 'var(--accent-cyan)'
                      : 'var(--text-dim)',
                }}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadHistory}
              disabled={isLoading}
              className="p-2 rounded text-txt-dim hover:text-cyan transition-colors disabled:opacity-30"
            >
              <RiRefreshLine
                className={`text-base ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
            </button>

            {records.length > 0 && (
              <button
                onClick={handleClearHistory}
                className={`btn-danger flex items-center gap-2 px-4 py-2 rounded text-xs ${
                  awaitingDeleteConfirmation
                    ? 'bg-red-neo/20 border-red-neo/50'
                    : ''
                }`}
              >
                <RiDeleteBin2Line />
                {awaitingDeleteConfirmation
                  ? 'CONFIRM DELETE?'
                  : 'CLEAR ALL'}
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(index => (
              <HistoryCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 glass rounded-xl">
            <RiHistoryLine
              className="text-5xl"
              style={{
                color: 'var(--text-dim)',
                opacity: 0.25,
              }}
            />

            <p
              className="font-display text-sm tracking-widest"
              style={{ color: 'var(--text-dim)' }}
            >
              NO RECORDS
            </p>

            <p style={{ color: 'var(--text-secondary)' }}>
              {activeFilter !== 'All'
                ? `No "${activeFilter}" passwords saved.`
                : 'Save passwords from the dashboard.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRecords.map((record, index) => {
              const styleConfig =
                STRENGTH_STYLES[record.strength] ??
                STRENGTH_STYLES.Weak

              return (
                <div
                  key={record.id ?? index}
                  className="history-card rounded-xl p-5 space-y-4"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    background: styleConfig.background,
                    border: `1px solid ${styleConfig.border}`,
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className="font-display text-xs px-2.5 py-1 rounded-sm tracking-widest"
                      style={{
                        color: styleConfig.color,
                        background: `${styleConfig.color}15`,
                        border: `1px solid ${styleConfig.color}40`,
                        textShadow: `0 0 8px ${styleConfig.color}`,
                      }}
                    >
                      {record.strength.toUpperCase()}
                    </span>

                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      #{record.id}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="str-track h-2 w-full overflow-hidden rounded-sm">
                      <div
                        className="str-fill"
                        style={{
                          width: `${(record.score / 10) * 100}%`,
                          background: `linear-gradient(90deg,${styleConfig.color}88,${styleConfig.color})`,
                          boxShadow: `0 0 6px ${styleConfig.color}`,
                        }}
                      />
                    </div>

                    <div
                      className="flex justify-between font-mono text-xs"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <span>
                        SCORE{' '}
                        <span style={{ color: styleConfig.color }}>
                          {record.score}/10
                        </span>
                      </span>

                      <span>
                        ENTROPY{' '}
                        <span style={{ color: styleConfig.color }}>
                          {record.entropy}b
                        </span>
                      </span>
                    </div>
                  </div>

                  <p
                    className="font-mono text-xs"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {formatTimestamp(record.created_at)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

