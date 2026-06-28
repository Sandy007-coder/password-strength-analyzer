const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
const TIMEOUT  = 12_000

async function request(method, path, body) {
  const url  = `${API_BASE}${path}`
  const init = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT),
    ...(body !== undefined && { body: JSON.stringify(body) }),
  }

  if (import.meta.env.DEV) {
    console.debug(`[API] ${method} ${path}`)
  }

  const res = await fetch(url, init)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const err = new Error(data.error || data.message || `HTTP ${res.status}`)
    err.status  = res.status
    err.data    = data
    err.friendlyMessage = err.message
    throw err
  }

  return data
}

export const analyzePassword  = (password) => request('POST',   '/analyze-password', { password })
export const savePassword     = (password) => request('POST',   '/save-password',    { password })
export const getPasswordHistory = ()       => request('GET',    '/password-history')
export const clearHistory     = ()         => request('DELETE', '/clear-history')
export const healthCheck      = ()         => request('GET',    '/health')