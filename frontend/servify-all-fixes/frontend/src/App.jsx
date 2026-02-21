import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
// FIX: removed useHeartbeat from here — it's already called in AppLayout
// Calling it here AND in AppLayout caused every heartbeat to fire TWICE
import AppLayout from './components/layout/AppLayout'

import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard    from './pages/Dashboard'
import MapPage      from './pages/MapPage'
import ChatPage     from './pages/ChatPage'
import ChatbotPage  from './pages/ChatbotPage'
import SkillsPage   from './pages/SkillsPage'
import ProfilePage  from './pages/ProfilePage'
import ValidatePage from './pages/ValidatePage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map"       element={<MapPage />} />
        <Route path="/chat"      element={<ChatPage />} />
        <Route path="/chatbot"   element={<ChatbotPage />} />
        <Route path="/skills"    element={<SkillsPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="/validate"  element={<ValidatePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <AppLayout /> // AppLayout already calls useHeartbeat internally
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
