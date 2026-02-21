import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { getSelfUser } from '../api/users'
import { useAuth } from '../context/AuthContext'
import { decodeJwt } from '../utils/helpers'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginUser(form)
      const token = res.data?.token
      if (!token) throw new Error('No token received')

      const decoded = decodeJwt(token)
      const username = decoded?.sub || form.username
      let userData = { username, role: decoded?.roles?.[0] || 'ROLE_USER' }

      // Store token first so getSelfUser() can use the interceptor
      login(token, userData)

      // Try to enrich with full profile
      try {
        const profile = await getSelfUser()
        const fullData = profile.data?.message
        if (fullData) login(token, { ...userData, ...fullData })
      } catch {}

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.bgGrid} />
        <div className={styles.bgGlow} />
      </div>

      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>S</div>
          <span className={styles.logoText}>servify</span>
        </div>

        <div className={styles.heading}>
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              name="username" type="text"
              placeholder="Enter your username"
              value={form.username} onChange={handleChange}
              required autoFocus
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              name="password" type="password"
              placeholder="Enter your password"
              value={form.password} onChange={handleChange}
              required
            />
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account?</p>
          <Link to="/register" className={styles.link}>Create account →</Link>
        </div>
      </div>
    </div>
  )
}
