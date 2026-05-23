
// Footer.jsx  –  Site footer


import { Link } from 'react-router-dom'
import { RiShieldKeyholeLine, RiGithubLine, RiLinkedinBoxLine } from 'react-icons/ri'

const TECH = ['React 18', 'Vite', 'Tailwind CSS', 'Flask', 'SQLite', 'PBKDF2-HMAC']

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(0,180,255,0.08)', background: 'rgba(2,6,15,0.6)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiShieldKeyholeLine className="text-xl text-cyan" style={{ filter: 'drop-shadow(0 0 6px var(--accent-cyan))' }} />
              <span className="font-display text-xs tracking-[0.25em] text-cyan glow-cyan">CIPHERGUARD</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A professional password security analysis tool. Demonstrates PBKDF2-SHA256 hashing,
              Shannon entropy calculation, and real-time security scoring.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>// NAVIGATION</span>
            <div className="space-y-2">
              {[['/', 'Dashboard'], ['/history', 'History'], ['/about', 'About']].map(([to, label]) => (
                <Link key={to} to={to}
                  className="block text-sm transition-colors duration-200 hover:text-cyan"
                  style={{ color: 'var(--text-secondary)' }}>
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Stack */}
          <div className="space-y-4">
            <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>// TECH STACK</span>
            <div className="flex flex-wrap gap-2">
              {TECH.map(t => (
                <span key={t} className="font-mono text-xs px-2 py-1 rounded-sm text-cyan"
                  style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-wrap items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(0,180,255,0.06)' }}>
          <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            © {new Date().getFullYear()} CIPHERGUARD — BUILT FOR SECURITY AWARENESS
          </p>
          <div className="flex gap-4">
            {[['https://github.com', RiGithubLine], ['https://linkedin.com', RiLinkedinBoxLine]].map(([href, Icon]) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                className="text-txt-dim hover:text-cyan transition-colors duration-200">
                <Icon className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
