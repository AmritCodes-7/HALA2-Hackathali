import styles from './Badge.module.css'

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={[styles.badge, styles[variant]].join(' ')}>
      {children}
    </span>
  )
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div className={[styles.card, className].join(' ')} style={style}>
      {children}
    </div>
  )
}

export function Spinner({ size = 24 }) {
  return (
    <span className={styles.spinner} style={{ width: size, height: size }} />
  )
}

export function EmptyState({ icon, title, message }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      {message && <p className={styles.emptyMsg}>{message}</p>}
    </div>
  )
}
