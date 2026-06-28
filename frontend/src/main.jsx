import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './styles/animations.css'
import './index.css'

const root = document.getElementById('root')

if (!root) throw new Error('Root element #root not found — check index.html.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)