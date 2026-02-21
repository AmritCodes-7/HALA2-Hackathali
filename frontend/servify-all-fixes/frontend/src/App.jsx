import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/AuthContext'
import { useHeartbeat } from './hooks/useHeartbeat'
import { logoutSession } from './api/users'
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

// Inner component so it can access AuthContext
function AppRoutes() {
  const { isAuthenticated } = useAuth()

  // Send heartbeat every 60s while logged in
  useHeartbeat(isAuthenticated)

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
  return <AppLayout />
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
