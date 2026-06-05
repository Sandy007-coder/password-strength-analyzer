import { Link } from 'react-router-dom'
import {
  RiShieldKeyholeLine,
  RiCodeLine,
  RiDatabase2Line,
  RiLockPasswordLine,
  RiSpeedLine,
  RiGithubLine,
} from 'react-icons/ri'

const API_ENDPOINTS = [
  {
    method: 'POST',
    path: '/analyze-password',
    description:
      'Analyse a password — returns strength, score, entropy, checks, suggestions.',
  },
  {
    method: 'POST',
    path: '/save-password',
    description:
      'Hash with PBKDF2-SHA256 and persist. Returns 409 on reuse detection.',
  },
  {
    method: 'GET',
    path: '/password-history',
    description:
      'Return saved records metadata (no plain-text, no hashes).',
  },
  {
    method: 'DELETE',
    path: '/clear-history',
    description: 'Delete all stored records.',
  },
  {
    method: 'GET',
    path: '/health',
    description: 'Liveness probe for deployment environments.',
  },
]

const HTTP_METHOD_STYLES = {
  GET: {
    background: 'rgba(0,255,163,0.08)',
    border: 'rgba(0,255,163,0.3)',
    color: '#00ffa3',
  },
  POST: {
    background: 'rgba(0,180,255,0.08)',
    border: 'rgba(0,180,255,0.3)',
    color: '#00b4ff',
  },
  DELETE: {
    background: 'rgba(255,45,85,0.08)',
    border: 'rgba(255,45,85,0.3)',
    color: '#ff2d55',
  },
}

const TECHNOLOGY_STACK = [
  {
    icon: RiCodeLine,
    title: 'Frontend',
    items: [
      'React 18 + Vite',
      'Tailwind CSS 3',
      'Axios HTTP',
      'React Router v6',
      'React Icons',
    ],
  },
  {
    icon: RiDatabase2Line,
    title: 'Backend',
    items: [
      'Python 3 + Flask',
      'SQLite database',
      'PBKDF2-HMAC-SHA256',
      'SHA-256 fingerprints',
      'RESTful JSON API',
    ],
  },
  {
    icon: RiLockPasswordLine,
    title: 'Security',
    items: [
      '600k PBKDF2 iterations',
      'NIST SP 800-132 compliant',
      'Constant-time comparison',
      'Reuse prevention',
      'Input validation',
    ],
  },
  {
    icon: RiSpeedLine,
    title: 'Analysis',
    items: [
      'Shannon entropy calc',
      '10-point scoring',
      'Common password list',
      'Real-time debounced',
      'CSPRNG generation',
    ],
  },
]

const WORKFLOW_STEPS = [
  {
    id: '01',
    title: 'You type',
    description:
      'Your password is sent to the Flask backend via a debounced POST request — never logged or stored at this stage.',
  },
  {
    id: '02',
    title: 'Analysis engine',
    description:
      'The backend runs 10 security checks: length, character classes, entropy calculation, and common-password detection.',
  },
  {
    id: '03',
    title: 'Scoring',
    description:
      'Each passed check adds 1 point to a 0–10 scale. Shannon entropy (H = L × log₂N) is calculated from the character pool size.',
  },
  {
    id: '04',
    title: 'Hashing',
    description:
      'When you click Save, the password is hashed with PBKDF2-HMAC-SHA256 at 600,000 iterations with a 256-bit random salt.',
  },
  {
    id: '05',
    title: 'Reuse detection',
    description:
      'A SHA-256 fingerprint is stored alongside the bcrypt hash for fast O(n) reuse checks without slow KDF re-computation.',
  },
  {
    id: '06',
    title: 'History',
    description:
      'Only metadata (strength, score, entropy, timestamp) is returned to the frontend — plain text and hashes never leave the server.',
  },
]

const SECURITY_PRINCIPLES = [
  {
    title: 'Never store plain text',
    description:
      'Passwords are processed in memory only. Only bcrypt/PBKDF2 hashes and SHA-256 fingerprints touch the database.',
  },
  {
    title: 'Timing-safe comparison',
    description:
      'hmac.compare_digest() prevents timing attacks during password verification by ensuring constant-time equality.',
  },
  {
    title: 'NIST-compliant hashing',
    description:
      'PBKDF2-HMAC-SHA256 at 600,000 iterations meets NIST SP 800-132 guidelines for 2024 and beyond.',
  },
  {
    title: 'Input sanitisation',
    description:
      'All inputs are validated server-side. Passwords over 1,000 chars are rejected to prevent DoS via KDF computation.',
  },
]

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="h-px flex-1"
        style={{
          background:
            'linear-gradient(90deg,var(--accent-cyan),transparent)',
        }}
      />
      <span className="font-display text-xs tracking-[0.3em] text-cyan">
        {children}
      </span>
      <div
        className="h-px w-8"
        style={{
          background: 'var(--accent-cyan)',
          opacity: 0.3,
        }}
      />
    </div>
  )
}

export default function About() {
  return (
    <div className="min-h-screen grid-bg page-enter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-16">

        <section className="text-center space-y-5 fade-up">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-xl mb-4"
            style={{
              background: 'rgba(0,180,255,0.06)',
              border: '1px solid rgba(0,180,255,0.2)',
              boxShadow: '0 0 40px rgba(0,180,255,0.1)',
            }}
          >
            <RiShieldKeyholeLine className="text-4xl text-cyan glow-cyan" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-cyan glow-cyan">
            CIPHERGUARD
          </h1>

          <p
            className="font-display text-sm tracking-[0.2em]"
            style={{ color: 'var(--text-secondary)' }}
          >
            PASSWORD STRENGTH ANALYZER v1.0.0
          </p>

          <p
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            A professional cybersecurity portfolio project demonstrating
            real-time password analysis, industry-standard hashing
            (PBKDF2-HMAC-SHA256), Shannon entropy calculation, and secure
            password history management via a Flask REST API.
          </p>
        </section>

        <section className="fade-up stagger-2">
          <SectionHeader>// HOW IT WORKS</SectionHeader>

          <div className="glass rounded-xl p-6 space-y-4">
            {WORKFLOW_STEPS.map(({ id, title, description }) => (
              <div
                key={id}
                className="flex gap-4 items-start py-2 border-b"
                style={{
                  borderColor: 'rgba(0,180,255,0.06)',
                }}
              >
                <span
                  className="font-display text-xl font-bold shrink-0 w-8"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {id}
                </span>

                <div>
                  <span className="font-display text-xs tracking-widest text-cyan">
                    {title.toUpperCase()}&nbsp;
                  </span>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="fade-up stagger-3">
          <SectionHeader>// API REFERENCE</SectionHeader>

          <div className="space-y-3">
            {API_ENDPOINTS.map(({ method, path, description }) => {
              const style = HTTP_METHOD_STYLES[method]

              return (
                <div
                  key={path}
                  className="glass rounded-lg px-5 py-4 flex flex-wrap items-start gap-4"
                  style={{
                    border: '1px solid rgba(0,180,255,0.08)',
                  }}
                >
                  <span
                    className="font-mono text-xs px-2.5 py-1 rounded-sm shrink-0"
                    style={{
                      background: style.background,
                      border: `1px solid ${style.border}`,
                      color: style.color,
                    }}
                  >
                    {method}
                  </span>

                  <code className="font-mono text-sm text-cyan shrink-0">
                    {path}
                  </code>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {description}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="fade-up stagger-4">
          <SectionHeader>// TECH STACK</SectionHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECHNOLOGY_STACK.map(({ icon: Icon, title, items }) => (
              <div
                key={title}
                className="glass rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Icon className="text-lg text-cyan" />
                  <span className="font-display text-xs tracking-widest text-cyan">
                    {title.toUpperCase()}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {items.map(item => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="w-1 h-1 rounded-full bg-cyan shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="fade-up stagger-5">
          <SectionHeader>// SECURITY PRINCIPLES</SectionHeader>

          <div className="glass rounded-xl p-6 grid sm:grid-cols-2 gap-6">
            {SECURITY_PRINCIPLES.map(({ title, description }) => (
              <div key={title} className="space-y-1.5">
                <p className="font-display text-xs tracking-widest text-cyan">
                  {title.toUpperCase()}
                </p>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center space-y-4 fade-up">
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded text-xs"
          >
            <RiShieldKeyholeLine className="text-base" />
            START ANALYSING
          </Link>

          <div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-cyan"
              style={{ color: 'var(--text-dim)' }}
            >
              <RiGithubLine />
              View source on GitHub
            </a>
          </div>
        </section>

      </div>
    </div>
  )
}