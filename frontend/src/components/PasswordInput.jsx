import { useCallback, useRef, useState } from 'react'
import {
  RiCheckLine,
  RiDeleteBackLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiRefreshLine,
} from 'react-icons/ri'

const INPUT_BORDER_COLORS = {
  Weak: 'rgba(255,45,85,0.6)',
  Medium: 'rgba(255,214,10,0.6)',
  Strong: 'rgba(0,180,255,0.6)',
  'Very Strong': 'rgba(0,255,163,0.6)',
}

const INPUT_SHADOWS = {
  Weak: '0 0 20px rgba(255,45,85,0.1)',
  Medium: '0 0 20px rgba(255,214,10,0.1)',
  Strong: '0 0 20px rgba(0,180,255,0.1)',
  'Very Strong': '0 0 20px rgba(0,255,163,0.15)',
}

const DEFAULT_BORDER_COLOR = 'rgba(0,180,255,0.18)'
const COPY_FEEDBACK_DURATION_MS = 2000

export default function PasswordInput({
  value,
  onChange,
  strength,
  suggestedPwd,
  onGenerate,
  isLoading,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  const passwordInputRef = useRef(null)

  const borderColor =
    INPUT_BORDER_COLORS[strength] ?? DEFAULT_BORDER_COLOR

  const boxShadow =
    strength && INPUT_SHADOWS[strength]
      ? INPUT_SHADOWS[strength]
      : 'none'

  const characterCountColor =
    value.length >= 16
      ? 'var(--green-bright)'
      : value.length >= 8
        ? 'var(--accent-cyan)'
        : 'var(--text-dim)'

  const handleCopyToClipboard = useCallback(async () => {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard access may be unavailable in some browsers/contexts.
    }

    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, COPY_FEEDBACK_DURATION_MS)
  }, [value])

  const handleGeneratePassword = () => {
    if (suggestedPwd) {
      onChange(suggestedPwd)
    }

    onGenerate?.()
  }

  const handleClearInput = () => {
    onChange('')
    passwordInputRef.current?.focus()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="font-display text-xs uppercase tracking-[0.2em] text-txt-dim">
          // PASSWORD INPUT
        </label>

        <span
          className="font-mono text-xs"
          style={{ color: characterCountColor }}
        >
          {value.length.toString().padStart(3, '0')} CHARS
        </span>
      </div>

      <div className="relative">
        <span className="corner-tl" />
        <span className="corner-tr" />
        <span className="corner-bl" />
        <span className="corner-br" />

        <div
          className="flex items-center rounded"
          style={{
            border: `1px solid ${borderColor}`,
            boxShadow,
            transition: 'border-color 0.4s, box-shadow 0.4s',
            background: 'rgba(2,6,15,0.8)',
          }}
        >
          <input
            ref={passwordInputRef}
            type={isPasswordVisible ? 'text' : 'password'}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="enter passphrase or generate..."
            autoComplete="new-password"
            spellCheck={false}
            className="cyber-input flex-1 rounded border-none px-4 py-4 text-sm"
          />

          <div
            className="flex items-center gap-1 border-l px-2"
            style={{
              borderColor: 'rgba(0,180,255,0.1)',
            }}
          >
            <button
              type="button"
              onClick={() =>
                setIsPasswordVisible((current) => !current)
              }
              title={isPasswordVisible ? 'Hide' : 'Show'}
              aria-label={
                isPasswordVisible
                  ? 'Hide password'
                  : 'Show password'
              }
              className="rounded p-2 text-txt-dim transition-all duration-200 hover:bg-cyan/5 hover:text-cyan"
            >
              {isPasswordVisible ? (
                <RiEyeOffLine className="text-base" />
              ) : (
                <RiEyeLine className="text-base" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyToClipboard}
              disabled={!value}
              title="Copy"
              aria-label="Copy password"
              className="rounded p-2 transition-all duration-200 disabled:opacity-20"
              style={{
                color: hasCopied
                  ? 'var(--green-bright)'
                  : 'var(--text-secondary)',
              }}
            >
              {hasCopied ? (
                <RiCheckLine className="text-base" />
              ) : (
                <RiFileCopyLine className="text-base" />
              )}
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClearInput}
                title="Clear"
                aria-label="Clear password"
                className="rounded p-2 text-txt-dim transition-all duration-200 hover:bg-red-neo/5 hover:text-red-neo"
              >
                <RiDeleteBackLine className="text-base" />
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGeneratePassword}
        disabled={isLoading}
        className="
          btn-primary flex w-full items-center justify-center
          gap-3 rounded py-3.5 text-xs
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <RiRefreshLine
          className={`text-base ${
            isLoading ? 'animate-spin' : ''
          }`}
        />

        {isLoading
          ? 'GENERATING SECURE PASSWORD...'
          : 'GENERATE STRONG PASSWORD'}
      </button>

      {hasCopied && (
        <p
          className="glow-green text-center font-mono text-xs"
          style={{ color: 'var(--green-bright)' }}
        >
          ✓ COPIED TO CLIPBOARD
        </p>
      )}
    </div>
  )
}