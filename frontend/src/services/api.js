import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    const method = config.method?.toUpperCase() || 'REQUEST'
    console.debug(`[API] ${method} ${config.url}`)
  }

  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    error.friendlyMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'

    return Promise.reject(error)
  },
)

const extractResponseData = (response) => response.data

export const analyzePassword = async (password) => {
  const response = await httpClient.post('/analyze-password', {
    password,
  })

  return extractResponseData(response)
}

export const savePassword = async (password) => {
  const response = await httpClient.post('/save-password', {
    password,
  })

  return extractResponseData(response)
}

export const getPasswordHistory = async () => {
  const response = await httpClient.get('/password-history')

  return extractResponseData(response)
}

export const clearHistory = async () => {
  const response = await httpClient.delete('/clear-history')

  return extractResponseData(response)
}

export const healthCheck = async () => {
  const response = await httpClient.get('/health')

  return extractResponseData(response)
}

export default httpClient