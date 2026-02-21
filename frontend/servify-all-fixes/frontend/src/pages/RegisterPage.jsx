import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser, registerStaff } from '../api/auth'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const [role, setRole]     = useState('user')
  const [form, setForm]     = useState({ username: '', password: '', phoneNumber: '', dateOfBirth: '' })
  const [cert, setCert]     = useState(null)
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (role === 'user') {
        await registerUser({ username: form.username, password: form.password })
        setSuccess('Account created! Redirecting to login…')
        setTimeout(() => navigate('/login'), 1400)
      } else {
        if (!cert) { setError('Please upload your certificate'); setLoading(false); return }
        const fd = new FormData()
        fd.append('username', form.username)
        fd.append('password', form.password)
        fd.append('dateOfBirth', form.dateOfBirth)
        fd.append('phoneNumber', form.phoneNumber)
        fd.append('skills', JSON.stringify([]))
        fd.append('certificate', cert)
        await registerStaff(fd)
        setSuccess('Staff account created! Awaiting validation. Redirecting…')
        setTimeout(() => navigate('/login'), 1800)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
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
          <h1>Create account</h1>
          <p>Join Servify today</p>
        </div>

        {/* Role selector */}
        <div className={styles.field} style={{ marginBottom: '8px' }}>
          <label>Account Type</label>
          <div className={styles.roleRow}>
            {['user', 'staff'].map(r => (
              <button
                key={r}
                type="button"
                className={[styles.roleBtn, role === r ? styles.roleActive : ''].join(' ')}
                onClick={() => setRole(r)}
              >
                {r === 'user' ? '👤 User' : '🔧 Staff'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input name="username" type="text" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
          </div>

          {role === 'staff' && (
            <>
              <div className={styles.field}>
                <label>Phone Number</label>
                <input name="phoneNumber" type="tel" placeholder="+977 98XXXXXXXX" value={form.phoneNumber} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Date of Birth</label>
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className={styles.field}>
                <label>Certificate / Qualification</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className={styles.fileInput}
                  onChange={e => setCert(e.target.files[0])}
                  required
                />
              </div>
            </>
          )}

          {error   && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.errorBox} style={{ borderColor: 'rgba(200,240,77,0.3)', background: 'rgba(200,240,77,0.08)', color: 'var(--accent)' }}>{success}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account?</p>
          <Link to="/login" className={styles.link}>Sign in →</Link>
        </div>
      </div>
    </div>
  )
}
