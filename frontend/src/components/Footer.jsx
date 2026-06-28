import { Link } from 'react-router-dom'
import { RiGithubLine, RiLinkedinBoxLine, RiShieldKeyholeLine } from 'react-icons/ri'

const TECH_STACK = ['React 18', 'Vite', 'Tailwind CSS', 'Flask', 'SQLite', 'PBKDF2-HMAC']

const NAV_LINKS = [
  { to: '/',        label: 'Dashboard' },
  { to: '/history', label: 'History'   },
  { to: '/about',   label: 'About'     },
]

const SOCIAL_LINKS = [
  { href: 'https://github.com',   icon: RiGithubLine     },
  { href: 'https://linkedin.com', icon: RiLinkedinBoxLine },
]

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{
        borderTop: '1px solid rgba(0,180,255,0.08)',
        background: 'rgba(2,6,15,0.6)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <RiShieldKeyholeLine
                className="text-xl text-cyan"
                style={{ filter: 'drop-shadow(0 0 6px var(--accent-cyan))' }}
              />
              <span className="font-display text-xs tracking-[0.25em] text-cyan glow-cyan">
                CIPHERGUARD
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A professional password security analysis tool. Demonstrates PBKDF2-SHA256
              hashing, Shannon entropy calculation, and real-time security scoring.
            </p>
          </section>

          <section className="space-y-4">
            <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>
              // NAVIGATION
            </span>
            <nav className="space-y-2">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="block text-sm transition-colors duration-200 hover:text-cyan"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  → {label}
                </Link>
              ))}
            </nav>
          </section>

          <section className="space-y-4">
            <span className="font-display text-xs tracking-widest" style={{ color: 'var(--text-dim)' }}>
              // TECH STACK
            </span>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2 py-1 rounded-sm text-cyan"
                  style={{
                    background: 'rgba(0,180,255,0.06)',
                    border: '1px solid rgba(0,180,255,0.15)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{ borderTop: '1px solid rgba(0,180,255,0.06)' }}
        >
          <p className="font-mono text-xs" style={{ color: 'var(--text-dim)' }}>
            © {YEAR} CIPHERGUARD — BUILT FOR SECURITY AWARENESS
          </p>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-cyan"
                style={{ color: 'var(--text-dim)' }}
              >
                <Icon className="text-xl" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}