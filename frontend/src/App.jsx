import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Link } from 'react-router-dom'

import Navbar    from './components/Navbar'
import Footer    from './components/Footer'
import Dashboard from './pages/Dashboard'
import History   from './pages/History'
import About     from './pages/About'

function NotFound() {
  return (
    <div className="min-h-screen grid-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="font-display text-8xl font-bold text-cyan glow-cyan opacity-30">
          404
        </p>
        <p className="font-display text-sm tracking-widest text-cyan">
          PAGE NOT FOUND
        </p>
        <Link to="/" className="btn-primary inline-block px-6 py-3 rounded text-xs mt-4">
          RETURN HOME
        </Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="scanline-wrap">
        <div className="scanline" />
      </div>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"        element={<Dashboard />} />
            <Route path="/history" element={<History />}   />
            <Route path="/about"   element={<About />}     />
            <Route path="*"        element={<NotFound />}  />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}