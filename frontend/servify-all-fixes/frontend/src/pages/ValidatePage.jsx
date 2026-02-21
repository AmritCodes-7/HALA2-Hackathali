import { useState } from 'react'
import { validateStaff } from '../api/users'
import styles from './ValidatePage.module.css'

export default function ValidatePage() {
  const [status, setStatus]   = useState(null) // null | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const handleValidate = async () => {
    setStatus('loading')
    try {
      const res = await validateStaff()
      setMessage(res.data?.message || 'Validation complete!')
      setStatus('success')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Validation failed.')
      setStatus('error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Staff Validation</h1>
        <p className={styles.desc}>
          Click below to trigger AI-powered certificate validation for your account.
          Our system will analyze your uploaded certificate and update your status.
        </p>

        {status === 'success' && (
          <div className={styles.successBox}>
            <span>✓</span> {message}
          </div>
        )}
        {status === 'error' && (
          <div className={styles.errorBox}>
            <span>⚠</span> {message}
          </div>
        )}

        <button
          className={styles.btn}
          onClick={handleValidate}
          disabled={status === 'loading' || status === 'success'}
        >
          {status === 'loading' ? (
            <><span className={styles.spinner} /> Validating…</>
          ) : status === 'success' ? (
            '✓ Validated!'
          ) : (
            'Validate My Certificate'
          )}
        </button>

        <div className={styles.steps}>
          <p className={styles.stepsTitle}>How it works</p>
          {[
            'Your certificate is fetched from our servers',
            'AI analyzes and verifies the document',
            'Your account status is updated automatically',
          ].map((s, i) => (
            <div key={i} className={styles.step}>
              <div className={styles.stepNum}>{i + 1}</div>
              <p>{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
