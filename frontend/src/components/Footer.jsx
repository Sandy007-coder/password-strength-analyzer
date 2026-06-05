import { Link } from 'react-router-dom'
import {
  RiGithubLine,
  RiLinkedinBoxLine,
  RiShieldKeyholeLine,
} from 'react-icons/ri'

const TECHNOLOGIES = [
  'React 18',
  'Vite',
  'Tailwind CSS',
  'Flask',
  'SQLite',
  'PBKDF2-HMAC',
]

const NAVIGATION_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/history', label: 'History' },
  { to: '/about', label: 'About' },
]

const SOCIAL_LINKS = [
  {
    href: 'https://github.com',
    icon: RiGithubLine,
  },
  {
    href: 'https://linkedin.com',
    icon: RiLinkedinBoxLine,
  },
]

const footerStyles = {
  borderTop: '1px solid rgba(0,180,255,0.08)',
  background: 'rgba(2,6,15,0.6)',
}

const tagStyles = {
  background: 'rgba(0,180,255,0.06)',
  border: '1px solid rgba(0,180,255,0.15)',
}

const sectionLabelStyles = {
  color: 'var(--text-dim)',
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={footerStyles}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <RiShieldKeyholeLine
                className="text-xl text-cyan"
                style={{
                  filter: 'drop-shadow(0 0 6px var(--accent-cyan))',
                }}
              />

              <span className="font-display text-xs tracking-[0.25em] text-cyan glow-cyan">
                CIPHERGUARD
              </span>
            </div>

            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              A professional password security analysis tool. Demonstrates
              PBKDF2-SHA256 hashing, Shannon entropy calculation, and real-time
              security scoring.
            </p>
          </section>

          <section className="space-y-4">
            <span
              className="font-display text-xs tracking-widest"
              style={sectionLabelStyles}
            >
              // NAVIGATION
            </span>

            <nav className="space-y-2">
              {NAVIGATION_LINKS.map(({ to, label }) => (
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
            <span
              className="font-display text-xs tracking-widest"
              style={sectionLabelStyles}
            >
              // TECH STACK
            </span>

            <div className="flex flex-wrap gap-2">
              {TECHNOLOGIES.map((technology) => (
                <span
                  key={technology}
                  className="font-mono text-xs px-2 py-1 rounded-sm text-cyan"
                  style={tagStyles}
                >
                  {technology}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 pt-6"
          style={{
            borderTop: '1px solid rgba(0,180,255,0.06)',
          }}
        >
          <p
            className="font-mono text-xs"
            style={{ color: 'var(--text-dim)' }}
          >
            © {currentYear} CIPHERGUARD — BUILT FOR SECURITY AWARENESS
          </p>

          <div className="flex gap-4">
            {SOCIAL_LINKS.map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-txt-dim transition-colors duration-200 hover:text-cyan"
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