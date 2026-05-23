
// PasswordInput.jsx  –  Main password entry widget


import { useState, useRef, useCallback } from 'react'
import { RiEyeLine, RiEyeOffLine, RiFileCopyLine, RiCheckLine, RiRefreshLine, RiDeleteBackLine } from 'react-icons/ri'

// Input border color depends on strength
const BORDER_BY_STRENGTH = {
  'Weak':        'rgba(255,45,85,0.6)',
  'Medium':      'rgba(255,214,10,0.6)',
  'Strong':      'rgba(0,180,255,0.6)',
  'Very Strong': 'rgba(0,255,163,0.6)',
}
const SHADOW_BY_STRENGTH = {
  'Weak':        '0 0 20px rgba(255,45,85,0.1)',
  'Medium':      '0 0 20px rgba(255,214,10,0.1)',
  'Strong':      '0 0 20px rgba(0,180,255,0.1)',
  'Very Strong': '0 0 20px rgba(0,255,163,0.15)',
}

export default function PasswordInput({ value, onChange, strength, suggestedPwd, onGenerate, isLoading }) {
  const [visible, setVisible] = useState(false)
  const [copied,  setCopied]  = useState(false)
  const inputRef = useRef(null)

  const borderColor = strength ? (BORDER_BY_STRENGTH[strength] ?? 'rgba(0,180,255,0.18)') : 'rgba(0,180,255,0.18)'
  const shadowColor = strength ? (SHADOW_BY_STRENGTH[strength] ?? 'none') : 'none'

  const handleCopy = useCallback(async () => {
    if (!value) return
    try { await navigator.clipboard.writeText(value) } catch { /* fallback */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [value])

  const handleGenerate = () => {
    if (suggestedPwd) onChange(suggestedPwd)
    onGenerate?.()
  }

  return (
    <div className="space-y-4">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label className="font-display text-xs tracking-[0.2em] text-txt-dim uppercase">
          // PASSWORD INPUT
        </label>
        <span className="font-mono text-xs" style={{
          color: value.length >= 16 ? 'var(--green-bright)' : value.length >= 8 ? 'var(--accent-cyan)' : 'var(--text-dim)'
        }}>
          {value.length.toString().padStart(3,'0')} CHARS
        </span>
      </div>

      {/* Input container with corner decorations */}
      <div className="relative">
        {/* Corner decorations */}
        <span className="corner-tl" /><span className="corner-tr" />
        <span className="corner-bl" /><span className="corner-br" />

        {/* The input + action buttons */}
        <div className="flex items-center rounded" style={{
          border: `1px solid ${borderColor}`,
          boxShadow: shadowColor,
          transition: 'border-color 0.4s, box-shadow 0.4s',
          background: 'rgba(2,6,15,0.8)',
        }}>
          <input
            ref={inputRef}
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="enter passphrase or generate..."
            className="cyber-input rounded px-4 py-4 flex-1 text-sm border-none"
            autoComplete="new-password"
            spellCheck={false}
          />

          {/* Action strip */}
          <div className="flex items-center gap-1 px-2 border-l" style={{ borderColor: 'rgba(0,180,255,0.1)' }}>
            {/* Toggle visibility */}
            <button onClick={() => setVisible(v => !v)} title={visible ? 'Hide' : 'Show'}
              className="p-2 rounded transition-all duration-200 text-txt-dim hover:text-cyan hover:bg-cyan/5">
              {visible ? <RiEyeOffLine className="text-base" /> : <RiEyeLine className="text-base" />}
            </button>

            {/* Copy */}
            <button onClick={handleCopy} disabled={!value} title="Copy"
              className="p-2 rounded transition-all duration-200 disabled:opacity-20"
              style={{ color: copied ? 'var(--green-bright)' : 'var(--text-secondary)' }}>
              {copied ? <RiCheckLine className="text-base" /> : <RiFileCopyLine className="text-base" />}
            </button>

            {/* Clear */}
            {value && (
              <button onClick={() => { onChange(''); inputRef.current?.focus() }} title="Clear"
                className="p-2 rounded transition-all duration-200 text-txt-dim hover:text-red-neo hover:bg-red-neo/5">
                <RiDeleteBackLine className="text-base" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generate button */}
      <button onClick={handleGenerate} disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-3 py-3.5 rounded text-xs
          disabled:opacity-40 disabled:cursor-not-allowed">
        <RiRefreshLine className={`text-base ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'GENERATING SECURE PASSWORD...' : 'GENERATE STRONG PASSWORD'}
      </button>

      {/* Copy confirmation */}
      {copied && (
        <p className="text-center font-mono text-xs glow-green" style={{ color: 'var(--green-bright)' }}>
          ✓ COPIED TO CLIPBOARD
        </p>
      )}
    </div>
  )
}
