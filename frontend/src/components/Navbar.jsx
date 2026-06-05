import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  RiCloseLine,
  RiDashboardLine,
  RiHistoryLine,
  RiInformationLine,
  RiMenuLine,
  RiShieldKeyholeLine,
} from 'react-icons/ri'

import { healthCheck } from '../services/api'

const NAVIGATION_ITEMS = [
  {
    to: '/',
    label: 'DASHBOARD',
    Icon: RiDashboardLine,
  },
  {
    to: '/history',
    label: 'HISTORY',
    Icon: RiHistoryLine,
  },
  {
    to: '/about',
    label: 'ABOUT',
    Icon: RiInformationLine,
  },
]

const API_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  CHECKING: 'checking',
}

const STATUS_INDICATOR_CLASSES = {
  [API_STATUS.ONLINE]: 'bg-green-neo shadow-neon-green',
  [API_STATUS.OFFLINE]: 'bg-red-neo shadow-neon-red',
  [API_STATUS.CHECKING]: 'bg-yellow-neo animate-pulse',
}

const STATUS_LABELS = {
  [API_STATUS.ONLINE]: 'API ONLINE',
  [API_STATUS.OFFLINE]: 'API OFFLINE',
  [API_STATUS.CHECKING]: 'CHECKING',
}

const NAVBAR_STYLES = {
  background: 'rgba(2,6,15,0.92)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0,180,255,0.12)',
}

const MOBILE_MENU_STYLES = {
  background: 'rgba(2,6,15,0.98)',
  borderBottom: '1px solid rgba(0,180,255,0.1)',
}

const STATUS_BADGE_STYLES = {
  background: 'rgba(0,180,255,0.05)',
  border: '1px solid rgba(0,180,255,0.1)',
}

const ACTIVE_LINK_STYLES = {
  background: 'rgba(0,180,255,0.07)',
  border: '1px solid rgba(0,180,255,0.2)',
}

const ACTIVE_LINK_UNDERLINE_STYLES = {
  background: 'var(--accent-cyan)',
  boxShadow: '0 0 8px var(--accent-cyan)',
}

function getStatusTextColor(status) {
  switch (status) {
    case API_STATUS.ONLINE:
      return 'var(--green-bright)'

    case API_STATUS.OFFLINE:
      return 'var(--red-bright)'

    default:
      return 'var(--yellow-bright)'
  }
}

export default function Navbar() {
  const location = useLocation()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [apiStatus, setApiStatus] = useState(API_STATUS.CHECKING)

  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        await healthCheck()
        setApiStatus(API_STATUS.ONLINE)
      } catch {
        setApiStatus(API_STATUS.OFFLINE)
      }
    }

    checkApiAvailability()

    const intervalId = setInterval(
      checkApiAvailability,
      30000,
    )

    return () => clearInterval(intervalId)
  }, [])

  const statusIndicatorClass =
    STATUS_INDICATOR_CLASSES[apiStatus]

  const statusLabel =
    STATUS_LABELS[apiStatus]

  const statusTextColor =
    getStatusTextColor(apiStatus)

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50"
      style={NAVBAR_STYLES}
    >
      <div
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg,transparent,var(--accent-cyan),transparent)',
        }}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-sm border border-cyan/40 transition-colors duration-300 group-hover:border-cyan group-hover:shadow-neon" />

            <RiShieldKeyholeLine
              className="text-xl text-cyan transition-transform duration-300 group-hover:scale-110"
              style={{
                filter:
                  'drop-shadow(0 0 8px var(--accent-cyan))',
              }}
            />
          </div>

          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display glow-cyan text-xs font-bold tracking-[0.3em] text-cyan">
              CIPHER
            </span>

            <span
              className="font-display text-xs font-bold tracking-[0.3em]"
              style={{
                color: 'var(--text-secondary)',
              }}
            >
              GUARD
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAVIGATION_ITEMS.map(
            ({ to, label, Icon }) => {
              const isActive =
                location.pathname === to

              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    relative flex items-center gap-2 px-4 py-2
                    text-xs font-display tracking-widest
                    transition-all duration-300
                    ${
                      isActive
                        ? 'text-cyan'
                        : 'text-txt-dim hover:text-txt'
                    }
                  `}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded"
                      style={ACTIVE_LINK_STYLES}
                    />
                  )}

                  <Icon className="relative z-10 text-base" />

                  <span className="relative z-10">
                    {label}
                  </span>

                  {isActive && (
                    <span
                      className="absolute bottom-0 inset-x-4 h-px"
                      style={
                        ACTIVE_LINK_UNDERLINE_STYLES
                      }
                    />
                  )}
                </Link>
              )
            },
          )}
        </div>

        <div className="flex items-center gap-4">
          <div
            className="hidden items-center gap-2 rounded px-3 py-1.5 font-mono text-xs sm:flex"
            style={STATUS_BADGE_STYLES}
          >
            <span
              className={`pulse-dot h-1.5 w-1.5 rounded-full ${statusIndicatorClass}`}
            />

            <span style={{ color: statusTextColor }}>
              {statusLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen(
                (previous) => !previous,
              )
            }
            className="text-txt-dim transition-colors hover:text-cyan md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="text-2xl" />
            ) : (
              <RiMenuLine className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="space-y-1 px-4 pb-4 pt-2 md:hidden"
          style={MOBILE_MENU_STYLES}
        >
          {NAVIGATION_ITEMS.map(
            ({ to, label, Icon }) => {
              const isActive =
                location.pathname === to

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={`
                    flex items-center gap-3 rounded px-4 py-3
                    text-xs font-display tracking-widest
                    transition-colors duration-200
                    ${
                      isActive
                        ? 'text-cyan bg-cyan/5 border border-cyan/20'
                        : 'text-txt-dim hover:text-txt'
                    }
                  `}
                >
                  <Icon className="text-base" />
                  {label}
                </Link>
              )
            },
          )}

          <div
            className="flex items-center gap-2 px-4 py-2 font-mono text-xs"
            style={{
              color: 'var(--text-dim)',
            }}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusIndicatorClass}`}
            />
            {statusLabel}
          </div>
        </div>
      )}
    </nav>
  )
}