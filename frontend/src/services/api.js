
// services/api.js  –  Axios API service layer

// All HTTP communication with the Flask backend lives here.


import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

// Log outgoing requests in dev
api.interceptors.request.use((cfg) => {
  if (import.meta.env.DEV) console.debug(`[API] ${cfg.method?.toUpperCase()} ${cfg.url}`)
  return cfg
})

// Normalise errors into a friendlyMessage field
api.interceptors.response.use(
  (r) => r,
  (err) => {
    err.friendlyMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'An unexpected error occurred.'
    return Promise.reject(err)
  },
)

//  API functions 

/** POST /analyze-password  –  analyse without saving */
export const analyzePassword = (password) =>
  api.post('/analyze-password', { password }).then((r) => r.data)

/** POST /save-password  –  analyse + persist (409 on reuse) */
export const savePassword = (password) =>
  api.post('/save-password', { password }).then((r) => r.data)

/** GET /password-history  –  fetch all saved records */
export const getPasswordHistory = () =>
  api.get('/password-history').then((r) => r.data)

/** DELETE /clear-history  –  wipe all records */
export const clearHistory = () =>
  api.delete('/clear-history').then((r) => r.data)

/** GET /health  –  liveness probe */
export const healthCheck = () =>
  api.get('/health').then((r) => r.data)

export default api
