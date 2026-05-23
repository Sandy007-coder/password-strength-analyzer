
// Navbar.jsx  –  Fixed top navigation with live API status indicator


import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiShieldKeyholeLine, RiDashboardLine, RiHistoryLine, RiInformationLine, RiMenuLine, RiCloseLine, RiWifiLine, RiWifiOffLine } from 'react-icons/ri'
import { healthCheck } from '../services/api'

const LINKS = [
  { to: '/',        label: 'DASHBOARD', Icon: RiDashboardLine   },
  { to: '/history', label: 'HISTORY',   Icon: RiHistoryLine     },
  { to: '/about',   label: 'ABOUT',     Icon: RiInformationLine },
]

export default function Navbar() {
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [apiStatus, setStatus] = useState('checking') // 'online' | 'offline' | 'checking'

  useEffect(() => {
    const check = async () => {
      try { await healthCheck(); setStatus('online') }
      catch { setStatus('offline') }
    }
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [])

  const statusDot = {
    online:   'bg-green-neo shadow-neon-green',
    offline:  'bg-red-neo shadow-neon-red',
    checking: 'bg-yellow-neo animate-pulse',
  }[apiStatus]

  const statusText = { online: 'API ONLINE', offline: 'API OFFLINE', checking: 'CHECKING' }[apiStatus]

  return (
    <nav className="fixed top-0 inset-x-0 z-50" style={{
      background: 'rgba(2,6,15,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,180,255,0.12)',
    }}>
      {/* Top accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,var(--accent-cyan),transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-sm border border-cyan/40 group-hover:border-cyan transition-colors duration-300 group-hover:shadow-neon" />
            <RiShieldKeyholeLine className="text-xl text-cyan group-hover:scale-110 transition-transform duration-300" style={{ filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }} />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-xs font-bold tracking-[0.3em] text-cyan glow-cyan">CIPHER</span>
            <span className="font-display text-xs font-bold tracking-[0.3em]" style={{ color: 'var(--text-secondary)' }}>GUARD</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(({ to, label, Icon }) => {
            const active = loc.pathname === to
            return (
              <Link key={to} to={to} className={`
                flex items-center gap-2 px-4 py-2 text-xs font-display tracking-widest
                transition-all duration-300 relative
                ${active ? 'text-cyan' : 'text-txt-dim hover:text-txt'}
              `}>
                {active && (
                  <span className="absolute inset-0 rounded" style={{
                    background: 'rgba(0,180,255,0.07)',
                    border: '1px solid rgba(0,180,255,0.2)',
                  }} />
                )}
                <Icon className="text-base relative z-10" />
                <span className="relative z-10">{label}</span>
                {active && (
                  <span className="absolute bottom-0 inset-x-4 h-px" style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right: status + hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono"
            style={{ background: 'rgba(0,180,255,0.05)', border: '1px solid rgba(0,180,255,0.1)' }}>
            <span className={`w-1.5 h-1.5 rounded-full pulse-dot ${statusDot}`} />
            <span style={{ color: apiStatus === 'online' ? 'var(--green-bright)' : apiStatus === 'offline' ? 'var(--red-bright)' : 'var(--yellow-bright)' }}>
              {statusText}
            </span>
          </div>

          <button onClick={() => setOpen(o => !o)} className="md:hidden text-txt-dim hover:text-cyan transition-colors">
            {open ? <RiCloseLine className="text-2xl" /> : <RiMenuLine className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(2,6,15,0.98)', borderBottom: '1px solid rgba(0,180,255,0.1)' }}
          className="md:hidden px-4 pb-4 pt-2 space-y-1">
          {LINKS.map(({ to, label, Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-xs font-display tracking-widest transition-colors duration-200 rounded
                ${loc.pathname === to ? 'text-cyan bg-cyan/5 border border-cyan/20' : 'text-txt-dim hover:text-txt'}`}>
              <Icon className="text-base" />{label}
            </Link>
          ))}
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />{statusText}
          </div>
        </div>
      )}
    </nav>
  )
}
