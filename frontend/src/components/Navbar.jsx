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

const NAV_ITEMS = [
  { to: '/',        label: 'DASHBOARD', Icon: RiDashboardLine   },
  { to: '/history', label: 'HISTORY',   Icon: RiHistoryLine     },
  { to: '/about',   label: 'ABOUT',     Icon: RiInformationLine },
]

const STATUS = {
  ONLINE:   'online',
  OFFLINE:  'offline',
  CHECKING: 'checking',
}

const STATUS_DOT = {
  [STATUS.ONLINE]:   'bg-green-neo shadow-neon-green',
  [STATUS.OFFLINE]:  'bg-red-neo shadow-neon-red',
  [STATUS.CHECKING]: 'bg-yellow-neo animate-pulse',
}

const STATUS_LABEL = {
  [STATUS.ONLINE]:   'API ONLINE',
  [STATUS.OFFLINE]:  'API OFFLINE',
  [STATUS.CHECKING]: 'CHECKING',
}

const STATUS_COLOR = {
  [STATUS.ONLINE]:   'var(--green-bright)',
  [STATUS.OFFLINE]:  'var(--red-bright)',
  [STATUS.CHECKING]: 'var(--yellow-bright)',
}

const CHECK_INTERVAL_MS = 30_000

export default function Navbar() {
  const location                        = useLocation()
  const [menuOpen, setMenuOpen]         = useState(false)
  const [apiStatus, setApiStatus]       = useState(STATUS.CHECKING)

  useEffect(() => {
    const check = async () => {
      try {
        await healthCheck()
        setApiStatus(STATUS.ONLINE)
      } catch {
        setApiStatus(STATUS.OFFLINE)
      }
    }

    check()
    const timer = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const dotClass   = STATUS_DOT[apiStatus]
  const label      = STATUS_LABEL[apiStatus]
  const labelColor = STATUS_COLOR[apiStatus]

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: 'rgba(2,6,15,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,180,255,0.12)',
      }}
    >
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg,transparent,var(--accent-cyan),transparent)' }}
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link to="/" onClick={() => setMenuOpen(false)} className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div className="absolute inset-0 rounded-sm border border-cyan/40 transition-colors duration-300 group-hover:border-cyan group-hover:shadow-neon" />
            <RiShieldKeyholeLine
              className="text-xl text-cyan transition-transform duration-300 group-hover:scale-110"
              style={{ filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }}
            />
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <span className="font-display glow-cyan text-xs font-bold tracking-[0.3em] text-cyan">CIPHER</span>
            <span className="font-display text-xs font-bold tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>GUARD</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ to, label: navLabel, Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`
                  relative flex items-center gap-2 px-4 py-2
                  font-display text-xs tracking-widest
                  transition-all duration-300
                  ${active ? 'text-cyan' : 'text-txt-dim hover:text-txt'}
                `}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded"
                    style={{
                      background: 'rgba(0,180,255,0.07)',
                      border: '1px solid rgba(0,180,255,0.2)',
                    }}
                  />
                )}
                <Icon className="relative z-10 text-base" />
                <span className="relative z-10">{navLabel}</span>
                {active && (
                  <span
                    className="absolute bottom-0 inset-x-4 h-px"
                    style={{
                      background: 'var(--accent-cyan)',
                      boxShadow: '0 0 8px var(--accent-cyan)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <div
            className="hidden items-center gap-2 rounded px-3 py-1.5 font-mono text-xs sm:flex"
            style={{
              background: 'rgba(0,180,255,0.05)',
              border: '1px solid rgba(0,180,255,0.1)',
            }}
          >
            <span className={`pulse-dot h-1.5 w-1.5 rounded-full ${dotClass}`} />
            <span style={{ color: labelColor }}>{label}</span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-txt-dim transition-colors hover:text-cyan md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="space-y-1 px-4 pb-4 pt-2 md:hidden"
          style={{
            background: 'rgba(2,6,15,0.98)',
            borderBottom: '1px solid rgba(0,180,255,0.1)',
          }}
        >
          {NAV_ITEMS.map(({ to, label: navLabel, Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`
                  flex items-center gap-3 rounded px-4 py-3
                  font-display text-xs tracking-widest
                  transition-colors duration-200
                  ${active ? 'text-cyan bg-cyan/5 border border-cyan/20' : 'text-txt-dim hover:text-txt'}
                `}
              >
                <Icon className="text-base" />
                {navLabel}
              </Link>
            )
          })}

          <div className="flex items-center gap-2 px-4 py-2 font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
            {label}
          </div>
        </div>
      )}
    </nav>
  )
}