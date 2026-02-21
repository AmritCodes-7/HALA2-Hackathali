import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './AppLayout.module.css'
import { useAuth } from '../../context/AuthContext'
import { useHeartbeat } from '../../hooks/useHeartbeat'

export default function AppLayout() {
  const { isAuthenticated } = useAuth()
  // FIX: wire up heartbeat here so it runs on every authenticated page,
  // not just MapPage — prevents sessions going stale after 3 minutes
  useHeartbeat(isAuthenticated)

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
