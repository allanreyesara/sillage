import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Discover from './pages/Discover'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute>
          <Discover />
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App