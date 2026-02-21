import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { logoutSession } from '../../api/users'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/map',       icon: '◎', label: 'Find Staff' },
  { to: '/chat',      icon: '◈', label: 'Messages' },
  { to: '/chatbot',   icon: '✦', label: 'AI Assistant' },
  { to: '/skills',    icon: '◇', label: 'Skills' },
  { to: '/profile',   icon: '◉', label: 'Profile' },
]

const STAFF_NAV = [
  { to: '/validate', icon: '✓', label: 'Get Validated' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logoutSession() } catch {}
    logout()
    navigate('/login')
  }

  const role    = user?.role || ''
  const isStaff = role.includes('STAFF')
  const isAdmin = role.includes('ADMIN')

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>S</span>
        <span className={styles.logoText}>servify</span>
      </div>

      <nav className={styles.nav}>
        <p className={styles.navSection}>Main</p>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [styles.navItem, isActive ? styles.active : ''].join(' ')
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {(isStaff || isAdmin) && (
          <>
            <p className={styles.navSection}>Staff</p>
            {STAFF_NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [styles.navItem, isActive ? styles.active : ''].join(' ')
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className={styles.bottom}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>
            {user?.username?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.username || 'User'}</p>
            <p className={styles.userRole}>{role.replace('ROLE_', '')}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ⎋ Logout
        </button>
      </div>
    </aside>
  )
}
